import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { Button, Checkbox, FormControlLabel, Grid, Slider, TextField } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import HotelRecs from '../components/HotelRecs';

const config = require('../config.json');

export default function HotelsPage() {
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState(location.state ? location.state.city : "Tokyo");
  const [price, setPrice] = useState([0, 12000]);
  const [rating, setRating] = useState(4);
  const [wifi, setWifi] = useState(true);
  const [parking, setParking] = useState(true);
  const [pool, setPool] = useState(false);
  const [spa, setSpa] = useState(false);
  const [beach, setBeach] = useState(false);
  const [restaurant, setRestaurant] = useState(false);
  const [bar_lounge, setBar] = useState(false);
  const [room_service, setRoom] = useState(false);
  const [fitness_center, setFitness] = useState(false);

  useEffect(() => {
    // Fetch request to get the temp
    fetch(`http://${config.server_host}:${config.server_port}/hotels`)
      .then(res => res.json())
      .then(resJson => {
        const hotelssWithId = resJson.map((hotel) => ({ id: hotel.hotel_id, ...hotel }));
        setHotels(hotelssWithId);
      });

  }, []);
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/filter_hotels?city=${city}` +
      `&min_price=${price[0]}&max_price=${price[1]}&rating=${rating}&free_wifi=${wifi}&free_parking=${parking}` +
      `&pool=${pool}&spa=${spa}&beach=${beach}&restaurant=${restaurant}` +
      `&bar_longe=${bar_lounge}&fitness_center=${fitness_center}&room_service=${room_service}`
    )
      .then(res => res.json())
      .then(resJson => {
        const hotelssWithId = resJson.map((hotel) => ({ id: hotel.hotel_id, ...hotel }));
        setHotels(hotelssWithId);
      });
  }

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  console.log(hotels);
  return (
    <Container>
      <h2>Search City</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='City' value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <p>Price</p>
          <Slider
            value={price}
            min={0}
            max={12000}
            step={100}
            onChange={(e, newValue) => setPrice(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={8}>
          <TextField label='Minimum Rating' value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: "30%" }} />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Wifi'
            control={<Checkbox checked={wifi} onChange={(e) => setWifi(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Parking'
            control={<Checkbox checked={parking} onChange={(e) => setParking(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Pool'
            control={<Checkbox checked={pool} onChange={(e) => setPool(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Spa'
            control={<Checkbox checked={spa} onChange={(e) => setSpa(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Beach'
            control={<Checkbox checked={beach} onChange={(e) => setBeach(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Restaurant'
            control={<Checkbox checked={restaurant} onChange={(e) => setRestaurant(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Bar Lounge'
            control={<Checkbox checked={bar_lounge} onChange={(e) => setBar(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Room Service'
            control={<Checkbox checked={room_service} onChange={(e) => setRoom(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Fitness Center'
            control={<Checkbox checked={fitness_center} onChange={(e) => setFitness(e.target.checked)} />}
          />
        </Grid>
      </Grid>
      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <Container style={{ flexFormat }}>
        {hotels.map((hotel) =>
          <Box
            key={hotel.hotel_id}
            p={3}
            m={2}
            style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
          >
            {
              <img
                src="https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg"
                alt={hotel.name} width="100px" height="100px"
              />
            }
            <h4><NavLink to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</NavLink></h4>
            <h4>{hotel.city}</h4>
            <h4>Rating: {hotel.rating}</h4>
          </Box>
        )}
      </Container>
    </Container>
  );

};