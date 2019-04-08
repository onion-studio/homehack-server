require('dotenv/config');
const _ = require('lodash');

module.exports = _.pick(process.env, [
  'PORT',
  'LOCATION_X',
  'LOCATION_Y',
  'WEATHER_SERVICE_KEY',
]);
