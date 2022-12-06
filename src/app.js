const express = require('express');
const morgan = require('morgan');
const FileUpload = require("express-fileupload");
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

const app = express();

require('dotenv').config();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(FileUpload());
app.use(express.static("public"));

const employees = require('./routes/employees');

app.use('/api/employees', employees);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
