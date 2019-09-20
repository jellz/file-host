const express = require('express');
const fs = require('fs');
const path = require('path');
const { r } = require('../server');
const { ensureOfficialDomain, DOMAIN_NAME_REGEX } = require('../util');
const zip = require('express-easy-zip');

const router = (module.exports = express.Router());

router.get('/me', ensureOfficialDomain, async (req, res) => {
	if (!req.user)
		return res
			.status(401)
			.header({ 'WWW-Authenticate': 'JWT' })
			.json({ error: 'Not authenticated' });
	res.json({ user: req.user });
});

router.patch('/me', ensureOfficialDomain, async (req, res) => {
	if (!req.user)
		return res
			.status(401)
			.header({ 'WWW-Authenticate': 'JWT' })
			.json({ error: 'Not authenticated' });
	if (!req.body.customDomain)
		return res.status(400).json({ error: "Missing property 'customDomain'" });
	const customDomain = req.body.customDomain.trim();
	if (!DOMAIN_NAME_REGEX.test(customDomain))
		return res
			.status(400)
			.json({ error: "'customDomain' must be a valid domain name" });
	const usersWithDomain = await r
		.table('users')
		.filter({ customDomain })
		.run();
	if (usersWithDomain.length > 0)
		return res
			.status(403)
			.json({ error: 'A user with this domain name already exists' });
	await r
		.table('users')
		.get(req.user.id)
		.update({
			customDomain
		})
		.run();
	res.sendStatus(204);
});

router.use(zip());

router.post('/request_file_archive', ensureOfficialDomain, async (req, res) => {
	if (!req.user)
		return res
			.status(401)
			.header({ 'WWW-Authenticate': 'JWT' })
			.json({ error: 'Not authenticated' });
	if (Date.now() - req.user.lastArchiveRequest < 7.2e6)
		return res
			.status(429)
			.json({ error: 'Archives can only be requested once every 2 hours' });
	if (!fs.existsSync(path.resolve(`files/${req.user.id}`)))
		return res.status(403).json({ error: "You don't own any files" });
	const fileName = `archive-${req.user.id}-${Date.now()}.zip`;
	res.zip({
		files: [
			{
				path: path.resolve(`files/${req.user.id}`),
				name: req.user.id.toString()
			}
		],
		filename: fileName
	});
	await r
		.table('users')
		.get(req.user.id)
		.update({
			lastArchiveRequest: Date.now()
		})
		.run();
});
