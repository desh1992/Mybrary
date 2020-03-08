//check
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//import router into server
const indexRouter = require('./routes/index');

//set our view engine
app.set('view engine', 'ejs');
//where our view going to be coming from
app.set('views', __dirname + '/views');
//hook up express layouts( to use common header and footer)
app.set('layout', 'layouts/layout');
//tell app need to use express layout
app.use(expressLayouts);
//tell app where our public files(HTML, CSS, JAVASCRIPT, IMAGES) going to be
app.use(express.static('public'));

//integrate mongodb to our app
const mongoose = require('mongoose');
//setup connections for database
mongoose.connect(process.env.DATABASE_URL);
//access the connection
const db = mongoose.connection;
//if we run into an error while connecting to our database
db.on('error', (error) => console.error(error));
//run once when we open our database for first time
db.once('open', () => console.log('connected to mongoose'));

//tell app to use router
app.use('/', indexRouter);

//tell app we want to listen on PORT
app.listen(process.env.PORT || 3000);
