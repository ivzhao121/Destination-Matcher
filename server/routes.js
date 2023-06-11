const mysql = require('mysql')
const config = require('./config.json')


// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * ROUTES *
 ******************/

// Route: GET /map
const map = async function (req, res) {

  if (req.query.country) {
    mapByCountry(req, res);
    return;
  } else if (req.query.continent) {
    mapByContinent(req, res);
    return;
  }
  connection.query(`
  SELECT R.iata,
       R.city,
       R.country,
       avg_temp, num_flights, D.lat as dest_lat, D.lon as dest_lon, R.lat as s_lat, R.lon as s_lon, D.city as d_city, D.country as d_country, D.iata as d_iata
                 FROM Airports D
    JOIN (SELECT source_airport_id, dest_airport_id, city, country, lat, lon, iata, avg_temp, COUNT(airline_id) as num_flights
          FROM Routes R
    JOIN (SELECT airport_id, S.city, S.country, iata, lat, lon, avg_temp
          FROM Airports S
          JOIN (SELECT city, country, AVG(avg_temperature) as avg_temp
          FROM Temperatures WHERE month = ${req.query.month} AND avg_temperature > -90
          GROUP BY city, country) T
          ON S.city = T.city AND S.country = T.country) S
          ON R.source_airport_id = S.airport_id
          GROUP BY source_airport_id, dest_airport_id) R
    ON R.dest_airport_id = D.airport_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


const mapByCountry = async function (req, res) {

  connection.query(`
  SELECT R.iata,
       R.city,
       R.country,
       avg_temp, num_flights, D.lat as dest_lat, D.lon as dest_lon, R.lat as s_lat, R.lon as s_lon, D.city as d_city, D.country as d_country, D.iata as d_iata
                 FROM Airports D
    JOIN (SELECT source_airport_id, dest_airport_id, city, country, lat, lon, iata, avg_temp, COUNT(airline_id) as num_flights
          FROM Routes R
    JOIN (SELECT airport_id, S.city, S.country, iata, lat, lon, avg_temp
          FROM Airports S
          JOIN (SELECT city, country, AVG(avg_temperature) as avg_temp
          FROM Temperatures WHERE month = ${req.query.month} AND avg_temperature > -90
          GROUP BY city, country) T
          ON S.city = T.city AND S.country = T.country
          WHERE S.country = '${req.query.country}') S
          ON R.source_airport_id = S.airport_id
          GROUP BY source_airport_id, dest_airport_id) R
    ON R.dest_airport_id = D.airport_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const mapByContinent = async function (req, res) {

  connection.query(`
  SELECT R.iata,
       R.city,
       R.country,
       avg_temp, num_flights, D.lat as dest_lat, D.lon as dest_lon, R.lat as s_lat, R.lon as s_lon, D.city as d_city, D.country as d_country, D.iata as d_iata
                 FROM Airports D
    JOIN (SELECT source_airport_id, dest_airport_id, city, country, lat, lon, iata, avg_temp, COUNT(airline_id) as num_flights
          FROM Routes R
    JOIN (SELECT airport_id, S.city, S.country, iata, lat, lon, avg_temp
          FROM Airports S
          JOIN (SELECT city, country, AVG(avg_temperature) as avg_temp
          FROM Temperatures WHERE month = ${req.query.month} AND avg_temperature > -90
          GROUP BY city, country) T
          ON S.city = T.city AND S.country = T.country
          JOIN Countries C on S.country = C.country
          WHERE continent = '${req.query.continent}') S
          ON R.source_airport_id = S.airport_id
          GROUP BY source_airport_id, dest_airport_id) R
    ON R.dest_airport_id = D.airport_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route: GET /continents
const continents = async function (req, res) {

  connection.query(`
  SELECT DISTINCT continent FROM Countries;
  `, (err, data) => {
    console.log(data);
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route: GET /countries 
const countries = async function (req, res) {

  connection.query(`
  SELECT country FROM Countries;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route: GET /cities/:country
const citiesByCountry = async function (req, res) {
  connection.query(`
  SELECT DISTINCT city FROM Airports WHERE country = '${req.params.country}'
  ORDER BY city ASC`, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route: POST /survey/matches
const surveyResults = async function (req, res) {
  console.log("Inside the survey results server");
  const responses = req.body;
  const startMonth = (new Date(responses.sd).getMonth()) + 1;
  const endMonth = (new Date(responses.ed).getMonth()) + 1;
  const month = startMonth == endMonth ? endMonth : startMonth;
  const maxBudget = responses.hotelMaxBudget;
  const minTemp = responses.weather[0];
  const maxTemp = responses.weather[1];
  const sourceCity = responses.homeCity;
  const sourceCountry = responses.homeCountry;
  const distance = responses.distance;
  const preference_one = responses.preferredAmenities.amenities[0].value;
  const preference_two = responses.preferredAmenities.amenities[1].value;
  const preference_three = responses.preferredAmenities.amenities[2].value;

  // const num = 4;
  // console.log(req.body.sd);
  // console.log("Ruth");
  console.log(month, maxBudget, minTemp, maxTemp, sourceCity, sourceCountry, distance, preference_one, preference_two, preference_three);
  // console.log(num);

  if (distance === "No preference") {
    connection.query(
      `
       WITH valid_cities_hotels AS (
        SELECT hotel_name, hotel_city, hotel_country, price, month, AVG(avg_temperature) AS avg_temp
        FROM Temperatures T
        JOIN (SELECT name AS hotel_name, city AS hotel_city, country AS hotel_country, price
        FROM Hotels
        WHERE (${preference_one} OR ${preference_two} OR ${preference_three}) AND price <= ${maxBudget}) valid_hotels
        ON valid_hotels.hotel_city = T.city AND valid_hotels.hotel_country = T.country
        WHERE month = '${month}'
        GROUP BY T.city, T.country, T.month
        HAVING AVG(avg_temperature) >= ${minTemp} AND AVG(avg_temperature) <= ${maxTemp}
        ),
            valid_flights AS (
            SELECT DISTINCT source_airport, source_city, source_country, name AS dest_airport, airline, city AS dest_city, country AS dest_country
            FROM (
                    SELECT source_airport_id, city AS source_city, country AS source_country, airline_id, dest_airport_id, name AS source_airport
                    FROM Routes
                    JOIN Airports on Routes.source_airport_id = Airports.airport_id) source_airports
            JOIN Airports ON source_airports.dest_airport_id = Airports.airport_id
            JOIN (SELECT airline_id, name AS airline FROM Airlines) B ON source_airports.airline_id = B.airline_id
        )
        SELECT DISTINCT hotel_name, source_airport, dest_airport, dest_city, dest_country, price, airline, avg_temp
        FROM valid_cities_hotels
        INNER JOIN valid_flights ON valid_cities_hotels.hotel_city = valid_flights.dest_city
        WHERE valid_flights.source_country = '${sourceCountry}' AND valid_flights.source_city = '${sourceCity}'
        GROUP BY dest_city, dest_country
        ORDER BY price ASC
      `, (err, data) => {
      if (err || data.length == 0) {
        console.log("This is err", err);
        res.json([]);
      } else {
        console.log("This is the data", data);
        res.json(data);
      }
    })
  } else if (distance === 'Same continent') {
    connection.query(
      `
      WITH valid_cities_hotels AS (
        SELECT hotel_name, hotel_city, hotel_country, price, month, AVG(avg_temperature) AS avg_temp
        FROM Temperatures T
        JOIN (SELECT name AS hotel_name, H.city AS hotel_city, H.country AS hotel_country, price
        FROM Hotels H JOIN Countries C ON H.country = C.country
        WHERE (${preference_one} OR ${preference_two} OR ${preference_three}) AND price <= ${maxBudget} AND continent = (SELECT continent FROM Countries WHERE country='${sourceCountry}')
        ) valid_hotels
        ON valid_hotels.hotel_city = T.city AND valid_hotels.hotel_country = T.country
        WHERE month = '${month}'
        GROUP BY T.city, T.country, T.month
        HAVING AVG(avg_temperature) >= ${minTemp} AND AVG(avg_temperature) <= ${maxTemp}
        ),
            valid_flights AS (
            SELECT DISTINCT source_airport, source_city, source_country, name AS dest_airport, airline, city AS dest_city, country AS dest_country
            FROM (
                    SELECT source_airport_id, city AS source_city, country AS source_country, airline_id, dest_airport_id, name AS source_airport
                    FROM Routes
                    JOIN Airports on Routes.source_airport_id = Airports.airport_id) source_airports
            JOIN Airports ON source_airports.dest_airport_id = Airports.airport_id
            JOIN (SELECT airline_id, name AS airline FROM Airlines) B ON source_airports.airline_id = B.airline_id
        )
        SELECT DISTINCT hotel_name, source_airport, dest_airport, dest_city, dest_country, price, airline, avg_temp
        FROM valid_cities_hotels
        INNER JOIN valid_flights ON valid_cities_hotels.hotel_city = valid_flights.dest_city
        WHERE valid_flights.source_country = '${sourceCountry}' AND valid_flights.source_city = '${sourceCity}'
        GROUP BY dest_city, dest_country
        ORDER BY price DESC;
      `, (err, data) => {
      if (err || data.length == 0) {
        console.log(err);
        res.json([]);
      } else {
        console.log(data);
        res.json(data);
      }
    })
  } else {
    connection.query(
      `
      WITH valid_cities_hotels AS (
        SELECT hotel_name, hotel_city, hotel_country, price, month, AVG(avg_temperature) AS avg_temp
        FROM Temperatures T
        JOIN (SELECT name AS hotel_name, H.city AS hotel_city, H.country AS hotel_country, price FROM Hotels H
          WHERE (${preference_one} OR ${preference_two} OR ${preference_three}) AND price <= ${maxBudget}) valid_hotels
        ON valid_hotels.hotel_city = T.city AND valid_hotels.hotel_country = T.country
        WHERE month = '${month}'
        GROUP BY T.city, T.country, T.month
        HAVING AVG(avg_temperature) >= ${minTemp} AND AVG(avg_temperature) <= ${maxTemp}
        ),
            valid_flights AS (
            SELECT DISTINCT source_airport, source_city, source_country, name AS dest_airport, airline, city AS dest_city, country AS dest_country
            FROM (
                    SELECT source_airport_id, city AS source_city, country AS source_country, airline_id, dest_airport_id, name AS source_airport
                    FROM Routes
                    JOIN Airports on Routes.source_airport_id = Airports.airport_id) source_airports
            JOIN Airports ON source_airports.dest_airport_id = Airports.airport_id
            JOIN (SELECT airline_id, name AS airline FROM Airlines) B ON source_airports.airline_id = B.airline_id
        )
        SELECT DISTINCT hotel_name, source_airport, dest_airport, dest_city, dest_country, price, airline, avg_temp
        FROM valid_cities_hotels
        INNER JOIN valid_flights ON valid_cities_hotels.hotel_city = valid_flights.dest_city
        INNER JOIN Countries ON Countries.country = valid_cities_hotels.hotel_country
        WHERE valid_flights.source_country = '${sourceCountry}' AND valid_flights.source_city = '${sourceCity}'
        AND continent <> (SELECT continent FROM Countries WHERE country='${sourceCountry}')
        GROUP BY dest_city, dest_country
        ORDER BY price DESC;
      `, (err, data) => {
      if (err || data.length == 0) {
        console.log(err);
        res.json([]);
      } else {
        console.log(data);
        res.json(data);
      }
    })
  }
}


// GET /hotels
const hotel_cities = async function (req, res) {
  const page = req.query.page ?? 1; //default page is pg 1
  //get all the hotels in that city orderred by rating. Display with pagination of page size 10 each.
  var query = `SELECT * FROM Hotels WHERE country = 'China' ORDER BY rating DESC LIMIT 10 OFFSET ${10 * (page - 1)}`;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  })
}

// GET /hotels/:hotel_id
const hotel_info = async function (req, res) {

  const hotel_id = req.params.hotel_id ?? 0;
  var query = `SELECT * FROM Hotels WHERE hotel_id=${hotel_id}`;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  })
}

//GET /hotels/:city/filter -> will get city from the above query result,store in variable and pass to this route request
const filter_hotels = async function (req, res) {

  const city = req.query.city ?? "Tokyo";
  const rating = req.query.rating ?? 5;
  const min_price = req.query.min_price ?? 0;
  const max_price = req.query.max_price ?? 12000;
  const free_wifi = req.query.free_wifi ?? false;
  const free_parking = req.query.free_parking ?? false;
  const pool = req.query.pool ?? false;
  const spa = req.query.spa ?? false;
  const beach = req.query.beach ?? false;
  const restaurant = req.query.restaurant ?? false;
  const fitness_center = req.query.fitness_center ?? false;
  const bar_lounge = req.query.bar_lounge ?? false;
  const room_service = req.query.room_service ?? false;

  var query = `SELECT * FROM Hotels 
   WHERE city = '${city}' AND rating >= ${rating} AND price >= ${min_price} AND price <= ${max_price} 
   AND free_wifi >= ${free_wifi} AND free_parking >= ${free_parking} AND pool >= ${pool}
   AND spa >= ${spa} AND beach >= ${beach} AND restaurant >= ${restaurant}
   AND fitness_center >= ${fitness_center} AND bar_lounge >= ${bar_lounge} AND room_service >= ${room_service} ORDER BY rating DESC`
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  })


}
//GET /country_cities/:city //explore other cities in that country. Cities are ordered by average ratings of all hotels in it.
const country_cities = async function (req, res) {

  const hotel_id = req.params.city ?? 'Shanghai';
  //get all the hotels in that city orderred by rating. Display with pagination of page size 10 each.
  var query = `WITH city_ratings AS(SELECT city, AVG(rating) as city_rating, AVG(price) AS city_price FROM Hotels
  WHERE country = (SELECT DISTINCT country FROM Hotels WHERE city = '${req.params.city}')
  GROUP BY city
  ORDER BY city_rating DESC),
  flights AS ( 
  SELECT A.name,Ap.city FROM Routes
  JOIN Airlines A ON Routes.airline_id = A.airline_id
  JOIN Airports Ap ON Ap.airport_id = Routes.dest_airport_id
  WHERE source_airport_id IN (SELECT airport_id FROM Airports where city = '${req.params.city}')
    AND Ap.city IN (SELECT city FROM city_ratings)
  )
  SELECT DISTINCT H.hotel_id,H.name,H.price,H.rating,H.city,GROUP_CONCAT(FL.name) AS flights FROM Hotels H
  INNER JOIN city_ratings CR ON H.city = CR.city
  INNER JOIN flights FL ON H.city = FL.city
  WHERE H.rating >= CR.city_rating AND H.price >= CR.city_price
  GROUP BY H.hotel_id, H.name, H.price, H.rating, H.city
  ORDER BY CR.city_rating DESC, CR.city_price ASC
  LIMIT 10`;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    }
    else if (data.length === 0) {
      console.log("nothing found");
      res.json([]);
    } else {
      res.json(data);
    }
  })
}

// GET /flights/direct
const directFlights = async function (req, res) {
  const source = req.query.source ?? '';
  const destination = req.query.destination ?? '';
  const airline = req.query.airline ?? '';

  console.log(source, destination, airline);
  if (!source || !destination) {
    connection.query(`
    WITH namedRoutes as
      (
      SELECT R.airline_id, A.city as Source, B.city as Destination
      FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
              JOIN Airports B ON R.dest_airport_id = B.airport_id
      ),
      nameAirlines as
      (
          SELECT A.name as Airline, R.Source, R.Destination
          FROM namedRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
      )
    SELECT DISTINCT *, 0 as num_stops, CONCAT('Philadelphia', '-->',  'Paris') as Path
    FROM nameAirlines
    WHERE Source = 'Philadelphia' AND Destination = 'Paris'
    `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else if (!airline) {
    connection.query(`
    WITH namedRoutes as
      (
      SELECT R.airline_id, A.city as Source, B.city as Destination
      FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
              JOIN Airports B ON R.dest_airport_id = B.airport_id
      ),
      nameAirlines as
      (
          SELECT A.name as Airline, R.Source, R.Destination
          FROM namedRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
      )
    SELECT DISTINCT *, 0 as num_stops, CONCAT('${source}', '-->',  '${destination}') as Path
    FROM nameAirlines
    WHERE Source = '${source}' AND Destination = '${destination}'
    `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
    WITH namedRoutes as
      (
      SELECT R.airline_id, A.city as Source, B.city as Destination
      FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
              JOIN Airports B ON R.dest_airport_id = B.airport_id
      ),
      nameAirlines as
      (
          SELECT A.name as Airline, R.Source, R.Destination
          FROM namedRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
      )
    SELECT DISTINCT *, 0 as num_stops, CONCAT('${source}', '-->',  '${destination}') as Path
    FROM nameAirlines
    WHERE Source = '${source}' AND Destination = '${destination}' AND Airline = '${airline}'
    `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// GET /flights/country
const flightsToCountry = async function (req, res) {
  const source = req.query.source ?? '';
  const destination = req.query.destination ?? '';
  const airline = req.query.airline ?? '';

  console.log(source, destination, airline);
  if (!source || !destination) {
    connection.query(`
    WITH selectDepartingRoutes as (
          SELECT R.airline_id, A.city as Source, B.city as Destination, B.country as Country
          FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
                  JOIN Airports B ON R.dest_airport_id = B.airport_id
          WHERE A.city = 'Paris' AND B.country = 'Canada'
      )
    SELECT DISTINCT A.name as Airline, R.Source, R.Destination, R.Country, 'Direct' as num_stops
    FROM selectDepartingRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
  `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else if (!airline) {
    connection.query(`
    WITH selectDepartingRoutes as (
          SELECT R.airline_id, A.city as Source, B.city as Destination, B.country as Country
          FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
                  JOIN Airports B ON R.dest_airport_id = B.airport_id
          WHERE A.city = '${source}' AND B.country = '${destination}'
      )
    SELECT DISTINCT A.name as Airline, R.Source, R.Destination, R.Country, 'Direct' as num_stops
    FROM selectDepartingRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
`, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
    WITH selectDepartingRoutes as (
          SELECT R.airline_id, A.city as Source, B.city as Destination, B.country as Country
          FROM (Routes R JOIN Airports A ON R.source_airport_id = A.airport_id)
                  JOIN Airports B ON R.dest_airport_id = B.airport_id
          WHERE A.city = '${source}' AND B.country = '${destination}'
      )
    SELECT DISTINCT A.name as Airline, R.Source, R.Destination, R.Country, 'Direct' as num_stops
    FROM selectDepartingRoutes R JOIN Airlines A ON R.airline_id = A.airline_id
    WHERE A.name = '${airline}'
`, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// GET /flights/multiStop
const connectingFlights = async function (req, res) {
  const source = req.query.source ?? '';
  const destination = req.query.destination ?? '';
  const airline = req.query.airline ?? '';

  console.log(source, destination, airline);
  if (!source || !destination) {
    connection.query(`
    With toTarget as
    (
        SELECT R.*
        FROM Routes R JOIN Airports A on R.dest_airport_id = A.airport_id
        WHERE A.city = 'Montreal'
    ),
    Zero as
    (
    Select DISTINCT C.name as Airline, CONCAT(A.city, '-->', B.city) as Path, R.source_airport_id as source_id, 0 as num_stops, R.dest_airport_id as target_id, A.city as source_city
    FROM ((Routes R JOIN Airports A ON R.source_airport_id = A.airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
    Where A.city = 'Paris'
    ),
    One as
    (
        SELECT DISTINCT C.name as Airline, CONCAT(z.Path, '-->', B.city) as Path, z.source_id, 1 as num_stops, R.dest_airport_id as target_id, R.source_airport_id as intermediate
        FROM ((Zero z JOIN Routes R ON z.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (z.source_city <> B.city) AND z.Airline = C.name
    ), Two as
    (
        SELECT DISTINCT C.name as Airline, CONCAT(o.Path, '-->', B.city) as Path, o.source_id, 2 as num_stops, R.dest_airport_id as target_id
        FROM ((One o JOIN toTarget R ON o.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (R.dest_airport_id <> o.intermediate) AND o.Airline = C.name
    ), Stops as
    (
        Select *
        FROM
        (Select Airline, Path, source_id, num_stops, target_id From Zero
        Union ALL
        (Select Airline, Path, source_id, num_stops, target_id From One)
        Union ALL
        Select * From Two) as entire
    )
 SELECT S.*, B.city as Source, A.city as Destination
 FROM Stops S JOIN Airports A ON S.target_id = A.airport_id JOIN Airports B ON S.source_id = B.airport_id
 WHERE A.city = 'Montreal' AND S.Airline = 'Air France'
 `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else if (!airline) {
    connection.query(`    
    With
    Zero as
    (
    Select DISTINCT C.name as Airline, CONCAT(A.city, '-->', B.city) as Path, R.source_airport_id as source_id, 0 as num_stops, R.dest_airport_id as target_id, A.city as source_city
    FROM ((Routes R JOIN Airports A ON R.source_airport_id = A.airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
    Where A.city = '${source}'
    ),
    One as
    (
        SELECT DISTINCT CONCAT(Z.Airline, '-->', C.name) as Airline, CONCAT(Z.Path, '-->', B.city) as Path, Z.source_id, 1 as num_stops, R.dest_airport_id as target_id, R.source_airport_id as intermediate
        FROM ((Zero Z JOIN Routes R ON Z.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (Z.source_city <> B.city)
    ), Two as
    (
        SELECT DISTINCT CONCAT(O.Airline, '-->', C.name) as Airline, CONCAT(O.Path, '-->', B.city) as Path, O.source_id, 2 as num_stops, R.dest_airport_id as target_id
        FROM ((One O JOIN Routes R ON O.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (R.dest_airport_id <> O.intermediate) AND B.city = '${destination}'
    ), Stops as
    (
        Select *
        FROM
        (Select Airline, Path, source_id, num_stops, target_id From Zero
        Union ALL
        (Select Airline, Path, source_id, num_stops, target_id From One)
        Union ALL
        Select * From Two) as entire
    )
 SELECT S.*, B.city as Source, A.city as Destination
 FROM Stops S JOIN Airports A ON S.target_id = A.airport_id JOIN Airports B ON S.source_id = B.airport_id
 WHERE A.city = '${destination}'
`, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`    
    With
    Zero as
    (
    Select DISTINCT C.name as Airline, CONCAT(A.city, '-->', B.city) as Path, R.source_airport_id as source_id, 0 as num_stops, R.dest_airport_id as target_id, A.city as source_city
    FROM ((Routes R JOIN Airports A ON R.source_airport_id = A.airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
    Where A.city = '${source}'
    ),
    One as
    (
        SELECT DISTINCT Z.Airline as Airline, CONCAT(Z.Path, '-->', B.city) as Path, Z.source_id, 1 as num_stops, R.dest_airport_id as target_id, R.source_airport_id as intermediate
        FROM ((Zero Z JOIN Routes R ON Z.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (Z.source_city <> B.city) AND Z.Airline = C.name
    ), Two as
    (
        SELECT DISTINCT O.Airline as Airline, CONCAT(O.Path, '-->', B.city) as Path, O.source_id, 2 as num_stops, R.dest_airport_id as target_id
        FROM ((One O JOIN Routes R ON O.target_id = R.source_airport_id) JOIN Airports B ON R.dest_airport_id = B.airport_id) JOIN Airlines C ON R.airline_id = C.airline_id
        WHERE (R.dest_airport_id <> O.intermediate) AND B.city = '${destination}' AND O.Airline = C.name
    ), Stops as
    (
        Select *
        FROM
        (Select Airline, Path, source_id, num_stops, target_id From Zero
        Union ALL
        (Select Airline, Path, source_id, num_stops, target_id From One)
        Union ALL
        Select * From Two) as entire
    )
 SELECT S.*, B.city as Source, A.city as Destination
 FROM Stops S JOIN Airports A ON S.target_id = A.airport_id JOIN Airports B ON S.source_id = B.airport_id
 WHERE A.city = '${destination}' AND S.Airline = '${airline}'
 `, (err, data) => {
      console.log(data);
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

module.exports = {
  hotel_cities,
  filter_hotels,
  country_cities,
  map,
  mapByCountry,
  mapByContinent,
  continents,
  countries,
  hotel_info,
  directFlights,
  flightsToCountry,
  connectingFlights,
  citiesByCountry,
  surveyResults
};