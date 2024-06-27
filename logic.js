const mongoose = require('mongoose');
const Seat = require('./model/Seat');

mongoose.connect('mongodb://127.0.0.1:27017/task').then(async () => {
  console.log('Connected to MongoDB');
  
  await Seat.deleteMany({});
  
  const seats = [];
  for (let i = 1; i <= 11; i++) {
    const rowSeats = i === 11 ? 3 : 7;
    for (let j = 1; j <= rowSeats; j++) {
      seats.push({ row: i, number: j });
    }
  }

  await Seat.insertMany(seats);
  console.log('Seats initialized');
  mongoose.disconnect();
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});
