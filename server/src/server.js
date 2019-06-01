require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const ejwt = require('express-jwt');
const fs = require('fs');

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
  db: process.env.RETHINKDB_DATABASE
}));
const jwtKey = (exports.jwtKey = fs.readFileSync('jwt.key').toString());
const port = process.env.PORT || 3000;

const app = express();

app.enable('trust proxy');
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(
  ejwt({
    secret: jwtKey,
    credentialsRequired: false,
    getToken: (req) => {
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
app.use('/:file', require('./routes/files'));

app.listen(port, () => console.log('file-host server listening on port', port));
