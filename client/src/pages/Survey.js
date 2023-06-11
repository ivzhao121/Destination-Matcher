import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Slider, Button, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Select from "react-select";


const config = require('../config.json');

export default function Survey() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [avgMaxHotelPrice, setAvgMaxHotelPrice] = useState(0);
    const [desiredWeather, setDesiredWeather] = useState([0, 100]);
    const [listOfAmenities, setListOfAmenities] = useState([]);
    const [locationPref, setLocationPref] = useState("");

    useEffect(() => {
        const getCountriesWrapper = () => {
            fetch(`http://${config.server_host}:${config.server_port}/countries`)
                .then(res => res.json())
                .then(resJson => {
                    const updatedCountries = []
                    resJson.forEach(country => {
                        updatedCountries.push({ value: country.country, label: country.country })
                    }
                    );
                    setCountries(updatedCountries);
                });
        }
        getCountriesWrapper();
    }, []);
    
    useEffect(() => {
        const getCitiesWrapper = () => {
            console.log(currentCountry);
            if (currentCountry) {
                fetch(`http://${config.server_host}:${config.server_port}/cities/${currentCountry}`)
                    .then(res => res.json())
                    .then(resJson => {
                        const updatedCities = []
                        resJson.forEach(city => {
                            updatedCities.push({ value: city.city, label: city.city })
                        }
                        );
                        setCities(updatedCities);
                    });
            }

        }
        getCitiesWrapper(currentCountry);
    }, [currentCountry]);


    const temp = [
        {
            value: 0,
            label: '0°F',
        },
        {
            value: 20,
            label: '20°F',
        },
        {
            value: 40,
            label: '40°F',
        },
        {
            value: 60,
            label: '60°F'

        },
        {
            value: 80,
            label: '80°F',
        },
        {
            value: 100,
            label: '100°F',
        },
    ];

    const amenities = [
        {
            value: "free_wifi",
            label: "Free Wifi"
        },
        {
            value: "free_parking",
            label: "Free Parking"
        },
        {
            value: "pool",
            label: "Pool"
        },
        {
            value: "spa",
            label: "Spa"
        },
        {
            value: "beach",
            label: "Beach"
        },
        {
            value: "restaurant",
            label: "Restaurant"
        },
        {
            value: "fitness_center",
            label: "Fitness center"
        },
        {
            value: "bar_lounge",
            label: "Bar lounge"
        },
        {
            value: "room_service",
            label: "Room service"
        }
    ];

    const distance = [
        {
            value: "Same continent",
            label: "Same continent"
        },
        {
            value: "No preference",
            label: "No preference"
        },
        {
            value: "Outside continent",
            label: "Outside continent"
        }
    ];

    const responses = 
        {
            sd: startDate,
            ed: endDate,
            hotelMaxBudget: avgMaxHotelPrice,
            homeCity: currentCity,
            homeCountry: currentCountry,
            distance: locationPref,
            preferredAmenities: listOfAmenities,
            weather: desiredWeather 
        }
    

    const valuetext = (value) => {
        return `${value}°F`;
    };

    const handleChange = (e) => {
        console.log("This is e", e)
        if (e.length < 4) {
            setListOfAmenities({amenities: e});
        }
    };

    const handleWeatherChange = (event, newValue) => {
        setDesiredWeather(newValue);
      };
    

    return (<div>
        <h1 style={{ marginTop: "50px", textAlign: 'center' }}> Ready to be matched to a destination? Fill out the questions below!</h1>
        <Container style={{ borderRadius: '16px', border: '2px solid #000', marginTop: "20px" }}>
            <h3 style={{ listStyle: 'none', marginTop: "20px" }}>Travel Dates </h3>
            <li style={{ display: "inline-flex", marginLeft: '40px' }}>From
                <DatePicker selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={date => setStartDate(date)} maxDate={endDate}/>
                <div style={{ display: "inline-flex", marginLeft: '300px' }}>To
                    <DatePicker selected={endDate} selectsEnd startDate={startDate} endDate={endDate} onChange={date => setEndDate(date)} minDate={startDate}/>
                </div>
            </li>
            <h3 style={{ marginTop: '50px', listStyle: 'none' }}>Hotel budget price per night</h3>
            <li style={{ marginLeft: '10px', display: "inline-flex", }}>
                <TextField
                    id="outlined-number"
                    label="Max"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 10000} }}
                    onChange={(e) => { const re = /^[0-9\b]+$/; if (re.test(e.target.value)) {setAvgMaxHotelPrice(e.target.value)} }}
                    style={{ fontSize: 10.0, height: 2.0 }} />
            </li>
            <h3 style={{ marginTop: '80px', listStyle: 'none' }}>Avg Weather Temperature</h3>
            <Slider

                aria-label="Always visible"
                defaultValue={desiredWeather}
                getAriaValueText={valuetext}
                step={10}
                marks={temp}
                valueLabelDisplay="on"
                onChange={handleWeatherChange}
                style={{ width: 800, marginLeft: 100, marginTop: 30 }}
            />
            <h3 style={{ marginTop: '50px', listStyle: 'none' }}>Hotel Amenities Preferences(Top 3)
                <div style={{ marginTop: '20px', marginLeft: '10px' }}>
                    <Select isMulti options={amenities} onChange={(e) => handleChange(e)} style={{ maxWidth: 200, maxHeight: 30 }}>
                    </Select>
                </div>
            </h3>
            <h3 style={{ marginTop: '80px', listStyle: 'none', }}>Distance
            </h3>
            <Select options={distance} onChange={(e) => setLocationPref(e.value)} style={{ minWidth: 200, maxHeight: 30 }} />
            <li style={{ marginTop: '50px', listStyle: 'none' }}></li>
            <h3 style={{ marginTop: '50px', listStyle: 'none' }}>
                Current location
            </h3>
            <li style={{ marginLeft: '20px', display: "inline-flex", marginTop: '10px' }}>
                <Select placeholder="Country" options={countries} onChange={(e) =>
                    setCurrentCountry(e.value)
                } style={{ minWidth: 800, maxHeight: 30 }}>
                    {console.log(currentCountry)}
                </Select>
                <div style={{ marginLeft: '220px', display: "inline-flex" }}>
                    <Select placeholder="City" options={cities} onChange={(e) => setCurrentCity(e.value)} style={{ maxWidth: 400, maxHeight: 30 }} />
                </div>
            </li>
            {console.log(startDate, endDate, avgMaxHotelPrice, desiredWeather, listOfAmenities, locationPref, currentCity, currentCountry)}
            {(startDate 
                && endDate
                && avgMaxHotelPrice
                && desiredWeather 
                && listOfAmenities
                && distance 
                && currentCity 
                && currentCountry) ? <NavLink className="button-shadow" to="/survey/results" state={responses}>
                <Button>
                     MatchMe
                </Button>
            </NavLink>: <NavLink className="button-shadow"><Button>MatchMe</Button></NavLink>}
        </Container>
    </div>);
}

