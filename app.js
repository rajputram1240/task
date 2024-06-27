const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Seat = require("./model/Seat.js");
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/task").then(()=>{
    console.log("connected to db");
})

app.post("/seatsBooking",async (req,res)=>{
    
    const { seats } = req.body;
  
    if (seats > 7) {
      return res.status(400).json({ message: 'Cannot book more than 7 seats at a time' });
    }
  
    try {
      let reservedSeats = await Seat.find({ isReserved: false }).sort({ row: 1, number: 1 });
      
      if (reservedSeats.length < seats) {
        return res.status(400).json({ message: 'Not seats available' });
      }
  
      let rowSeats = {};
      for (let seat of reservedSeats) {
        if (!rowSeats[seat.row]) rowSeats[seat.row] = [];
        rowSeats[seat.row].push(seat);
      }
  
      let selectedSeats = [];
      for (let row in rowSeats) {
        if (rowSeats[row].length >= seats) {
          selectedSeats = rowSeats[row].slice(0, seats);
          break;
        }
      }
  
      if (selectedSeats.length < seats) {
        selectedSeats = reservedSeats.slice(0, seats);
      }
  
      for (let seat of selectedSeats) {
        seat.isReserved = true;
        await seat.save();
      }
  
      res.status(200).json({ message: 'Seats book successfully', seats: selectedSeats });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
    
})

app.listen(3000,(req,res)=>{
    console.log("server running at port 3000");
})