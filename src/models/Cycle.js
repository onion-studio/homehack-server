const mongoose = require('mongoose');

const CycleSchema = mongoose.Schema({
  // 제목
  title: String,
  // 일 단위 주기
  interval: Number,
});

const Cycle = mongoose.model('Cycle', CycleSchema);

module.exports = Cycle;
