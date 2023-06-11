const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/map', routes.map);
app.get('/continents', routes.continents);
app.get('/countries', routes.countries);
app.get('/hotels', routes.hotel_cities);
app.get('/hotels/:hotel_id', routes.hotel_info);
app.get('/filter_hotels', routes.filter_hotels);
app.get('/country_cities/:city', routes.country_cities);
app.get('/flights/direct', routes.directFlights);
app.get('/flights/country', routes.flightsToCountry);
app.get('/flights/multiStop', routes.connectingFlights);
app.get('/cities/:country', routes.citiesByCountry);
app.post('/survey/matches', routes.surveyResults);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
