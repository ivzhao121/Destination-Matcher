import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { NavLink, useLocation } from 'react-router-dom';
const config = require('../config.json');



export default function Flights() {
  const location = useLocation();
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [source, setSource] = useState(location.state ? location.state.source : '');
  const [destination, setDestination] = useState(location.state ? location.state.destination : '');
  const [airline, setAirline] = useState('');
  const [multiStop, setMultiStop] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/flights/direct`)
      .then(res => res.json())
      .then(resJson => {
        const routes = resJson.map((route) => ({ id: route.Source + route.Destination + route.Airline, ...route }));
        setData(routes);
      });
  }, []);

  const search = () => {
    if (multiStop) {
      fetch(`http://${config.server_host}:${config.server_port}/flights/multiStop?source=${source}` +
        `&destination=${destination}&airline=${airline}`
      )
        .then(res => res.json())
        .then(resJson => {
          // DataGrid expects an array of objects with a unique id.
          // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
          const routes = resJson.map((route) => ({ id: route.source_id + route.target_id + route.num_stops + route.Airline + route.Path, ...route }));
          setData(routes);
        });
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/flights/direct?source=${source}` +
        `&destination=${destination}&airline=${airline}`
      )
        .then(res => res.json())
        .then(resJson => {
          // DataGrid expects an array of objects with a unique id.
          // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
          const routes = resJson.map((route) => ({ id: route.Source + route.Destination + route.Airline, ...route }));
          setData(routes);
        });
    }
  }


  const columns = [
    { field: 'Airline', headerName: 'Airline', width: 200 },
    { field: 'Source', headerName: 'Source', width: 200 },
    { field: 'Destination', headerName: 'Destination', width: 200 },
    { field: 'num_stops', headerName: 'Stops', width: 200 },
    { field: 'Path', headerName: 'Path', width: 600 },
  ]

  return (
    <Container>
      <h2> Search Flights </h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField required label='Source' value={source} onChange={(e) => setSource(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <TextField required label='Destination' value={destination} onChange={(e) => setDestination(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <TextField label='Airline' value={airline} onChange={(e) => setAirline(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            label='Multi-Stop'
            control={<Checkbox checked={multiStop} onChange={(e) => setMultiStop(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={4}>
          <NavLink to='/flights/country'>Find Flights By Country?</NavLink>
        </Grid>
      </Grid>
      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}