exports.PORT_REGEX = /((?::))(?:[0-9]+)$/;
exports.DOMAIN_NAME_REGEX = /^(?=.{0,253}$)(([a-z0-9_][a-z0-9_-]{0,61}[a-z0-9_]|[a-z0-9_])\.)+((?=.*[^0-9])([a-z0-9][a-z0-9-]{0,61}[a-z0-9]|[a-z0-9]))$/i;

exports.ensureOfficialDomain = (req, res, next) => {
	let officialDomain = process.env.API_BASE.replace(exports.PORT_REGEX, '');
	officialDomain = officialDomain.replace('https://', '');
	officialDomain = officialDomain.replace('http://', '');
	if (req.hostname !== officialDomain) return res.sendStatus(404);
	next();
};
