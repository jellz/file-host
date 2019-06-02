const PORT_REGEX = /((?::))(?:[0-9]+)$/;

exports.ensureOfficialDomain = (req, res, next) => {
  let officialDomain = process.env.API_BASE.replace(PORT_REGEX, '');
  officialDomain = officialDomain.replace('https://', '');
  officialDomain = officialDomain.replace('http://', '');
  if (req.hostname !== officialDomain) return res.sendStatus(404);
  next();
}