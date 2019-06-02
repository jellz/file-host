const express = require('express');
const { r } = require('../server');
const { ensureOfficialDomain, DOMAIN_NAME_REGEX } = require('../util');

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
  const usersWithDomain = await r.table('users').filter({ customDomain });
  if (usersWithDomain.length > 0) return res.status(403).json({ error: 'A user with this domain name already exists' });
  await r.table('users').get(req.user.id).update({
    customDomain
  });
  res.sendStatus(204);
});
