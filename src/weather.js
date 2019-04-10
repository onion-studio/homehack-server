const express = require('express');
const axios = require('axios');
const formatDate = require('date-fns/format');
const _ = require('lodash');

const envService = require('./services/env');

const router = express.Router();

const url =
  'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
const serviceKey = envService.WEATHER_SERVICE_KEY;

const locationX = envService.LOCATION_X;
const locationY = envService.LOCATION_Y;
const numOfRows = '5000';

router.get('/', async (req, res) => {
  const date = formatDate(new Date(), 'YYYYMMDD');
  const baseTime = formatDate(new Date(), 'HHmm');
  const params = new URLSearchParams();
  params.append('serviceKey', serviceKey);
  params.append('base_date', date);
  params.append('base_time', baseTime);
  params.append('nx', locationX);
  params.append('ny', locationY);
  params.append('numOfRows', numOfRows);
  params.append('_type', 'json');
  const weatherRes = await axios(url, {
    params,
  });
  const { data } = weatherRes;
  const itemArr = data.response.body.items.item;
  const result = _.chain(itemArr)
    .map(item => _.omit(item, ['nx', 'ny']))
    .map(item => ({ ...item, fcstTime: item.fcstTime.toString() }))
    .groupBy(item => item.category)
    .pick(['POP', 'TMN', 'TMX', 'SKY'])
    .value();
  res.send(result);
});

module.exports = router;
