const express = require('express');
const jwt = require('jsonwebtoken');
const { r, jwtKey } = require('../server');
const fetch = require('node-fetch');
const Octokit = require('@octokit/rest');
const queryString = require('querystring');
const { ensureOfficialDomain } = require('../util');

const router = (module.exports = express.Router());
router.use(ensureOfficialDomain);

router.get('/login', (req, res) =>
	res.redirect(
		`https://github.com/login/oauth/authorize?client_id=${
			process.env.GITHUB_CLIENT_ID
		}&redirect_uri=${process.env.API_BASE +
			'/api/auth/callback'}&scope=user:email`
	)
);

router.get('/callback', async (req, res) => {
	if (!req.query.code)
		return res.status(400).json({ error: 'Missing code querystring' });
	const tokenRes = await fetch(
		`https://github.com/login/oauth/access_token?client_id=${
			process.env.GITHUB_CLIENT_ID
		}&client_secret=${process.env.GITHUB_SECRET}&code=${encodeURIComponent(
			req.query.code
		)}`
	);
	const tokenJson = queryString.parse(await tokenRes.text());
	const token = tokenJson.access_token;
	if (!token)
		console.error(
			'Did not get token from GitHub',
			tokenJson,
			'query code',
			req.query.code
		);
	const authClient = new Octokit({ auth: `token ${token}` });
	const { data } = await authClient.users.getAuthenticated({});
	const emails = await authClient.users.listEmails({});
	const primaryEmail = emails.data.find(e => e.primary).email;
	console.log(data);
	let user = await r
		.table('users')
		.get(data.id)
		.run();
	console.log(user);
	if (user) {
		await r
			.table('users')
			.get(data.id)
			.update({
				avatarUrl: data.avatar_url,
				username: data.login,
				email: primaryEmail,
				lastLoggedIn: Date.now()
			})
			.run();
	} else {
		await r
			.table('users')
			.insert({
				id: data.id,
				avatarUrl: data.avatar_url,
				username: data.login,
				createdAt: Date.now(),
				email: primaryEmail,
				lastLoggedIn: Date.now(),
				customDomain: null,
				lastArchiveRequest: null
			})
			.run();
	}
	const jwtToken = await jwt.sign(data.id, jwtKey);
	res.send(`
        <script>opener.postMessage('${jwtToken}', '${process.env.CLIENT_BASE}'); close();</script>
    `);
});
