import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useParams } from 'react-router-dom';
import HotelRecs from '../components/HotelRecs';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const config = require('../config.json');

export default function HotelsInfoPage() {
  const { hotel_id } = useParams();
  const [hotelInfo, setHotelInfo] = useState({});
  //const [hotelID, setHotelId] = useState(0);


  useEffect(() => {
    // Fetch request to get the temp
    fetch(`http://${config.server_host}:${config.server_port}/hotels/${hotel_id}`)
      .then(res => res.json())
      .then(resJson => setHotelInfo(resJson));
  }, [hotel_id]);
  console.log("result");
  console.log(hotelInfo);
  
  const hotelImages = [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fGhvdGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://assets.vogue.com/photos/58a7453532a6f544ac9d9841/master/w_1000,h_1000,c_limit/00-squarel-the-peninsula-hotel-renovation-beijing-china.jpg",        
    "https://static-new.lhw.com/HotelImages/Final/LW2868/lw2868_136724675_790x490.jpg",
    "https://static-new.lhw.com/HotelImages/Final/LW2868/lw2868_136724469_960x540.jpg",
    "https://media.istockphoto.com/id/1042391774/photo/bowls-with-japanese-food.jpg?s=612x612&w=0&k=20&c=_yBLwk1AWd-X4V1DYlzMVKbo7SffWOhSGrHSswYkM4c=",
    "https://images.luxuryhotel.guru/hotelimage.php?p_id=1&code=3de23d8c720d82a8b1104fc7d6fac295&webpage=hotels-with-gym.com&link=https%3A%2F%2Fsubdomain.cloudimg.io%2Fcrop%2F512x384%2Fq70.fcontrast10.fbright0.fsharp5%2Fhttps%3A%2F%2Fq-xx.bstatic.com%2Fxdata%2Fimages%2Fhotel%2Fmax1536%2F243869830.jpg%3Fk%3D72869c1d403975f0ea4a183e757271e06ddb12c4c1c92eb118d68f13bd8de47e%26o%3D"
   
]

  //console.log(hotel_id);
  // console.log(typeof hotelInfo.free_wifi);
  return (
    <div>
    <div style={{margin:"auto", width:"50%"}}>
        <h2>{hotelInfo.name}</h2>
        <div>
            <AliceCarousel animationType="slide" infinite autoPlay autoPlayInterval="2000">
                {
                    hotelImages.map((i,index) => <img key={index} src={i} className="sliderimg" alt="" style={{width:"100%", height:"400px"}}/>)
                }
            </AliceCarousel>
        </div>
        <h3>About</h3>

        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>   
            <Item>Price: {hotelInfo.price}</Item>
            </Grid>
            <Grid item xs={6}>
                <Item>Rating: {hotelInfo.rating}</Item>
            </Grid>
            <Grid item xs={6}>
                <Item>Free Wifi:{hotelInfo.free_wifi?.data[0] ? " Yes": " No"}</Item>
            </Grid>
            <Grid item xs={6}>
            <Item>Free Parking:{hotelInfo.free_parking?.data[0] ? " Yes": " No"}</Item>
            </Grid>
            <Grid item xs={6}>
            <Item> Pool:{hotelInfo.pool?.data[0] ? " Yes": " No"}</Item>
            </Grid>
            <Grid item xs={6}>
            <Item>Room Service:{hotelInfo.room_service?.data[0] ? " Yes": " No"}</Item>
            </Grid>
            <Grid item xs={6}>
            <Item> Spa:{hotelInfo.spa?.data[0] ? " Yes": " No"}</Item>
            </Grid>
            <Grid item xs={6}>
            <Item>Fitness Center:{hotelInfo.fitness_center?.data[0] ? " Yes": " No"}</Item>
            </Grid>
        </Grid>
        <br></br>
        <h3>Other Recommendations in {hotelInfo.country}</h3>
    </div>
    <HotelRecs city = {hotelInfo.city}/>
    </div>
  );
};