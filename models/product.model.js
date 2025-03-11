const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    address: {
      building: String,
      coord: {
        type: [Number],
        validate: {
          validator: function(v) {
            return v.length === 2;
          },
          message: 'Coordinate array must contain exactly 2 numbers'
        }
      },
      street: String,
      zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [
      {
        date: Date,
        grade: String,
        score: Number
      }
    ],
    name: String,
    restaurant_id: String
  }
);

const Product = mongoose.model('Restaurant', productSchema,'restaurants');

module.exports = Product;