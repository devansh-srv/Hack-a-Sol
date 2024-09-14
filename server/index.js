require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const homeRoute = require('./routes/home');
const imageRoute = require('./routes/image');
const playerRoute = require('./routes/player');
const teamsRoute = require('./routes/teams');

const {connectMongoDB} = require('./utils/prerun');
const db = connectMongoDB();

global.db = db;

app.use(cors());
app.use(express.json());

app.use('/', homeRoute)
app.use('/image', imageRoute);
app.use('/player', playerRoute);
app.use('/teams', teamsRoute);

app.listen(port, '0.0.0.0',() => {
  console.log(`listening on port ${port}`)
})

module.exports = app;
