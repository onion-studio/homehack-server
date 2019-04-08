/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');

const envService = require('./services/env');
const weather = require('./weather');

const { PORT } = envService;

const app = express();

app.use(cors());
app.use('/weather', weather);

app.listen(PORT, () => {
  console.log(`homehack-server listening ${PORT}...`);
});
