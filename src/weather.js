const express = require('express');
const axios = require('axios');
const formatDate = require('date-fns/format');
var client = require('cheerio-httpcli');

const _ = require('lodash');

const envService = require('./services/env');

const router = express.Router();

const urlForWeather =
  'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
const serviceKey = envService.WEATHER_SERVICE_KEY;

const urlForDust = 'https://search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=%EB%B4%89%EC%B2%9C%EB%8F%99+%EB%AF%B8%EC%84%B8%EB%A8%BC%EC%A7%80'

const locationX = envService.LOCATION_X;
const locationY = envService.LOCATION_Y;
const numOfRows = '5000';

function lastBaseDate() {
  const currentTime = formatDate(new Date(), 'HHmm');
  // NOTE: API 제공 시각이 0210 정도임을 고려
  const date =
    currentTime < '0215'
      ? new Date(Date.now() - 1000 * 60 * 60 * 24)
      : new Date();
  return formatDate(date, 'YYYYMMDD');
}

router.get('/', async (req, res) => {
  let dust;
  const params = new URLSearchParams();
  params.append('serviceKey', serviceKey);
  params.append('base_date', lastBaseDate());
  // NOTE: base_time에 따라 반환되는 데이터가 달라져서 일단 0200 으로 고정
  params.append('base_time', '0200');
  params.append('nx', locationX);
  params.append('ny', locationY);
  params.append('numOfRows', numOfRows);
  params.append('_type', 'json');
  const weatherRes = await axios(urlForWeather, {
    params,
  });
  await client.fetch(urlForDust, {}, (err, $, res) => {
    if(err) {console.log('error'); return;}
      const text = $('.main_figure').text()
      dust = text
  })
  const { data } = weatherRes;
  const itemArr = data.response.body.items.item;
  const result = _.chain(itemArr)
    .map(item => _.omit(item, ['nx', 'ny']))
    .map(item => ({ ...item, fcstTime: item.fcstTime.toString() }))
    .groupBy(item => item.category)
    .pick(['POP', 'TMN', 'TMX', 'SKY'])
    .value()
    .push(dust)
  res.send(result);
});

module.exports = router;
