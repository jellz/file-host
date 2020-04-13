require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const ejwt = require('express-jwt');
const fs = require('fs');

process.env.ALLOW_REGISTER = process.env.ALLOW_REGISTER || true;

try {
	fs.mkdirSync('files');
} catch (err) {
	if (
		!err
			.toString()
			.toLowerCase()
			.includes('file already exists')
	)
		console.error(err);
}

const r = (exports.r = require('rethinkdbdash')({
  db: process.env.RETHINKDB_DATABASE,
  host: process.env.RETHINKDB_HOST || undefined
}));
const jwtKey = (exports.jwtKey = fs.readFileSync('jwt.key').toString());
const port = process.env.PORT || 3000;

const app = express();

app.enable('trust proxy');
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header(
		'Access-Control-Allow-Methods',
		'PUT, POST, GET, DELETE, OPTIONS, PATCH'
	);
	next();
});

app.use(
	ejwt({
		secret: jwtKey,
		credentialsRequired: false,
		getToken: req => {
			if (
				req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'JWT'
			) {
				return req.headers.authorization.split(' ')[1];
			} else if (req.query && req.query.token) {
				return req.query.token;
			}
			return null;
		}
	}),
	async (req, res, next) => {
		if (!req.user) return next();
		const id = parseInt(req.user, 10); //ids are stored as numbers
		req.user = await r
			.table('users')
			.get(id)
			.run();
		next();
	}
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/users', require('./routes/users'));
app.use('/:file', require('./routes/files'));

app.listen(port, () => console.log('file-host server listening on port', port));
