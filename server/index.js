require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const homeRoute = require('./routes/home');
const matchRoute = require('./routes/match');
const playerRoute = require('./routes/player');
const upcomingRoute = require('./routes/upcoming');

const {connectMongoDB} = require('./utils/prerun');
const db = connectMongoDB();

global.db = db;

app.use(cors());
app.use(express.json());

app.use('/', homeRoute)
app.use('/match', matchRoute);
app.use('/player', playerRoute);
app.use('/upcoming', upcomingRoute);

app.listen(port, '0.0.0.0',() => {
  console.log(`listening on port ${port}`)
})

module.exports = app;
