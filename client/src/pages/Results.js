import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, Container, Box } from '@mui/material'
import { cyan, green, black, pink, indigo } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Matches from './Matches.js'

const config = require('../config.json');

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
    palette: {
        primary: pink,
        secondary: indigo,
    },
});

export default function Results() {
    const location = useLocation();
    const responses = location.state;
    const fetchedMatches = useRef(false);
    const [isLoading, setIsLoading]= useState(true);
    const [matches, setMatches] = useState([]);

    const flexFormat = { display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', marginTop: '100px' };


    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        }
        if (responses) {
            const getResultAnswers = () => {
                fetch(`http://${config.server_host}:${config.server_port}/survey/matches`, requestOptions)
                    .then(res => res.json())
                    .then(resJson => {
                        if (resJson !== null) {
                            const updatedMatches = []
                            resJson.forEach(match => {
                                updatedMatches.push({ match })
                            });
                            console.log(resJson);
                            setMatches(updatedMatches);
                        } 
                        setIsLoading(false);
                    });
            }
            if (!fetchedMatches.current) {
                fetchedMatches.current = true;
                getResultAnswers();
            }
        }
    }, [responses]);
    console.log(matches.length);
    console.log(isLoading);
    if (!isLoading && (matches.length === 0)) {
        console.log("In here");
        return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1 style={{textAlign: 'center', marginTop: '500px'}}>No Matches Found!</h1> 
        </ThemeProvider>
        )
    }

    if (!isLoading && matches.length !== 0) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Matches m={matches} r={responses} />
            </ThemeProvider>
        )
    }
}
