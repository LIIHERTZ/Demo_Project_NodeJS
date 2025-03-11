const express = require('express');
require('dotenv').config();
const route = require('./routes/client/index.route.js');
const database = require("./config/database.js");

database.connect();

// const Schema = database.Schema;

// const restaurants = database.model('restaurants', restaurantSchema);


const app = express();
const port = process.env.PORT;

app.set("views","./views");
app.set("view engine", "pug");
app.use(express.static('public'));

//Routes
route(app);

app.listen(port);