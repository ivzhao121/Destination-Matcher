import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, Container, Box } from '@mui/material'
import { cyan, green, black, pink, indigo } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SplitPane from "react-split-pane";

const config = require('../config.json');

export default function Matches({ m, r }) {

    const flexFormat = { display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', marginTop: '100px' };
    return (
        <Container style={flexFormat}>
            <h1 style={{ marginLeft: '150px', marginTop: '-50px', marginBottom: '20px'}}>Check out your Destination Matches Below!</h1>
            {m?.map((match, idx) =>
                <div className='unique' style={{position: 'relative', marginBottom: '50px', boxShadow: '0 0 8px 8px white inset'}}>
                <img src={'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwYWVzdGhldGljfGVufDB8fDB8fA%3D%3D&w=1000&q=80'} width={1100} height={500} alt={``} />
                <div style={{position: 'absolute', left: '5%', bottom: '10%', top: '25%'}}>
                        <h4>City: {match.match.dest_city}</h4>
                        <h4>Country: {match.match.dest_country}</h4>
                        <h4>Average Temperature: {match.match.avg_temp}°F</h4>
                        <h4>Hotel Name: {match.match.hotel_name}</h4>
                        <h4>Cost per night: ${match.match.price}</h4>
                        <h4>Flight Info: To arrive at your destination, take the airline, {match.match.airline} </h4>
                        <h4>at {match.match.source_airport}. You will arrive in {match.match.dest_airport} airport.</h4>
                    </div>
                </div>
            )}
        </Container>
    )

}


