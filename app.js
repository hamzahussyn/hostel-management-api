const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { handleError } = require('./helpers/errorHandler');

const authController = require('./routes/controllers/auth.controller');
const userController = require('./routes/controllers/user.controller');
const tenantController = require('./routes/controllers/tenants.controller');

const app = express();

if (app.get('env') === 'production') {
  const fs = require('fs');
  const path = require('path');
  var rfs = require('rotating-file-stream');

  const logPath = path.join(__dirname, 'log');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log'),
  });
  // log to a file
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  // log to stdout
  app.use(morgan('dev'));
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,content-type,Accept,Authorization,x-access-token',
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.static(path.join(__dirname, 'media')));
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => res.status(200).json({ Message: 'hostel-management-api' }));
app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/tenants', tenantController);

app.use((err, req, res, next) => handleError(err, res));

module.exports = app;
