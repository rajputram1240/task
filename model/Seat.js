const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: Number,
  number: Number,
  isReserved: { type: Boolean, default: false }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
