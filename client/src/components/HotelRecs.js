import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container,Grid,Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function HotelRecs({city}) {
  const [hotel_recs, setRecs] = useState([]);

  useEffect(() => {
    // Fetch request to get the temp
    fetch(`http://${config.server_host}:${config.server_port}/country_cities/${city}`)
      .then(res => res.json())
      .then(resJson => {
        console.log("json results");
        console.log(resJson);
        setRecs(resJson)});
  }, [city]);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  console.log("recs");
  console.log(city);
  //console.log(hotel_recs);
  return (
    <Container style={{flexFormat}}>
      {hotel_recs.map((hotel) =>
        <Box
          key={hotel.hotel_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
            src="https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg"
            alt= {hotel.name} width="100px" height="100px"
          />
          }
          <h4><NavLink to={`/hotels/${hotel.hotel_id}`}>{hotel.name}, {hotel.city}</NavLink></h4>

          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>   
            <Item>Price: {hotel.price}</Item>
            </Grid>
            <Grid item xs={6}>
                <Item>Rating: {hotel.rating}</Item>
            </Grid>
            <Grid item xs={6}>
                <Item>Available Flights to {hotel.city}: {hotel.flights}</Item>
            </Grid>
            
        </Grid>

        </Box>
      )}
    </Container>
  );
};