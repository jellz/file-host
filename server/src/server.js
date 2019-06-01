require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ejwt = require('express-jwt');
const fs = require('fs');

const r = (exports.r = require('rethinkdbdash')({
  db: process.env.RETHINKDB_DATABASE
}));
const jwtKey = (exports.jwtKey = fs.readFileSync('jwt.key').toString());
const port = process.env.PORT || 3000;

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(
  ejwt({ secret: jwtKey, credentialsRequired: false }),
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

app.listen(port, () => console.log('file-host server listening on port', port));
