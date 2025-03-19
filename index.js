const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');


require('dotenv').config();
const route = require('./routes/client/index.route.js');
const routeAdmin = require('./routes/admin/index.route.js');
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views",`${__dirname}/views`);
app.set("view engine", "pug");
console.log(__dirname);
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('LIIHERTZ'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Routes
route(app);
routeAdmin(app);

app.listen(port);