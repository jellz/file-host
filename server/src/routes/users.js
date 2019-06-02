const express = require('express');
const { r } = require('../server');
const { ensureOfficialDomain } = require('../util');

const router = (module.exports = express.Router());

router.get('/me', ensureOfficialDomain, async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .header({ 'WWW-Authenticate': 'JWT' })
      .json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});
