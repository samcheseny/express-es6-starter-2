require('dotenv').config();
require('./main/auth/passport-configs');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/api', require('./main/routes'));

// 404 Handler
app.use((request, response, next) => next(createError(404, 'Route not found')));

module.exports = app;