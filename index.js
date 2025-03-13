const express = require('express');
require('dotenv').config();
const route = require('./routes/client/index.route.js');
const routeAdmin = require('./routes/admin/index.route.js');
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views","./views");
app.set("view engine", "pug");
app.use(express.static('public'));

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Routes
route(app);
routeAdmin(app);

app.listen(port);