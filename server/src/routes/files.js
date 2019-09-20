const express = require('express');
const fileUpload = require('express-fileupload');
const randomString = require('randomstring');
const mime = require('mime-types');
const fs = require('fs');
const { r } = require('../server');
const path = require('path');

const router = (module.exports = express.Router({ mergeParams: true }));

// Direct file request - respond with actual file
router.get('/', async (req, res) => {
	const file = (await r
		.table('files')
		.filter({ fullName: req.params.file }))[0];
	console.log(file);
	if (!file) return res.sendStatus(404);
	const fileOwner = await r
		.table('users')
		.get(file.owner)
		.run();
	console.log(fileOwner);
	console.log(req.hostname);
	const domain = fileOwner.customDomain || process.env.DEFAULT_DOMAIN;
	if (req.hostname !== domain) return res.sendStatus(404);
	res.sendFile(path.resolve('files/' + fileOwner.id + '/' + req.params.file));
});

router.use(fileUpload({ preserveExtension: true, safeFileNames: true }));

// Upload file
router.post('/', async (req, res) => {
	if (!req.user)
		return res
			.status(401)
			.header({ 'WWW-Authenticate': 'JWT' })
			.json({ error: 'Not authenticated' });
	if (req.params.file)
		return res.status(301).json({ error: 'Use /api/files for POST requests' }); // We don't want people sending POST requests to /:file instead of /api/files
	if (!req.files) return res.status(400).json({ error: 'No files provided ' });
	const file = req.files[Object.keys(req.files)[0]];
	if (file.size > 8e6)
		return res.status(400).json({ error: 'Max. upload size is 8 MB' });
	const shortName = randomString.generate(7);
	const fileExt = mime.extension(file.mimetype);
	if (!fileExt) return res.status(400).json({ error: 'Invalid MIME type' });
	const shortNameWithExt = shortName + '.' + fileExt;
	try {
		fs.mkdirSync('files/' + req.user.id);
	} catch (err) {
		if (
			!err
				.toString()
				.toLowerCase()
				.includes('file already exists')
		)
			console.error(err);
	}
	file.mv(path.resolve('files/' + req.user.id + '/' + shortNameWithExt));
	await r
		.table('files')
		.insert({
			name: shortName,
			fullName: shortName + '.' + fileExt,
			extension: fileExt,
			createdAt: Date.now(),
			owner: req.user.id
		})
		.run();
	const domain = req.user.customDomain || process.env.DEFAULT_DOMAIN;
	res
		.status(201)
		.json({
			file: shortNameWithExt,
			url: `https://${domain}/${shortNameWithExt}`
		});
});
