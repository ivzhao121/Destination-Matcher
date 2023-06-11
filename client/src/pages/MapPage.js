import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ArcLayer } from '@deck.gl/layers';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DeckGL from '@deck.gl/react';
import Form from 'react-bootstrap/Form';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'bootstrap/dist/css/bootstrap.css';
const config = require('../config.json');

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';
const INITIAL_VIEW_STATE = {
    longitude: -1.415727,
    latitude: 52.232395,
    zoom: 3,
    minZoom: 2.5,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27
};
export const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];

function getTooltip({ object }) {
    if (!object) {
        return null;
    }

    // Tooltip for hexagons
    if (object.colorValue) {
        const lat = object.position[1];
        const lng = object.position[0];
        const avgTemp = object.colorValue;

        return `\
      latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
      longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
      country: ${object.points[0].source.country}
      city: ${object.points[0].source.city}
      Average Temperature: ${avgTemp.toFixed(2)}`;
    }
    // Tool tip for arcs
    if (object.num_flights) {
        return `\
      ${object.city}, ${object.country} (${object.iata}) to ${object.d_city}, ${object.d_country} (${object.d_iata})`;
    }
}

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value.toLowerCase()),
                    )}
                </ul>
            </div>
        );
    },
);

export default function MapPage() {
    let navigate = useNavigate();
    const flightPage = (info) => {
        let path = `/flights`;
        navigate(path, { state: { source: info.object.city, destination: info.object.d_city } });
    }
    const hotelPage = (info) => {
        let path = `/hotels`;
        navigate(path, { state: { city: info.object.points[0].source.city } });
    }
    const countriesFetchedRef = useRef(false);
    const continentsFetchedRef = useRef(false);
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState(["Country", "United States", "Russia"]);
    const [country, setCountry] = useState("Country");
    const [continents, setContinents] = useState(["Continent", "North America", "South America"]);
    const [continent, setContinent] = useState("Continent");
    // Fetch the continents and countries list
    useEffect(() => {
        if (!continentsFetchedRef.current) {
            continentsFetchedRef.current = true;
            fetch(`http://${config.server_host}:${config.server_port}/continents`)
                .then(res => res.json())
                .then(resJson => {
                    const updatedContinents = ["Continent"];
                    resJson.forEach(element => {
                        updatedContinents.push(element.continent);
                    });
                    setContinents(updatedContinents);
                });
        }
        if (!countriesFetchedRef.current) {
            countriesFetchedRef.current = true;
            fetch(`http://${config.server_host}:${config.server_port}/countries`)
                .then(res => res.json())
                .then(resJson => {
                    const updatedCountries = ["Country"];
                    resJson.forEach(element => {
                        updatedCountries.push(element.country);
                    });
                    setCountries(updatedCountries);
                });
        }
    }, [])

    // Fetch the data for the map
    useEffect(() => {
        const currentMonth = (new Date()).getMonth() + 1;
        if (country.toLowerCase() !== 'country') {
            fetch(`http://${config.server_host}:${config.server_port}/map/?country=${country}&month=${currentMonth}`)
                .then(res => res.json())
                .then(resJson => {
                    console.log(resJson);
                    setData(resJson);
                });
        } else if (continent.toLowerCase() !== 'continent') {
            fetch(`http://${config.server_host}:${config.server_port}/map/?continent=${continent}&month=${currentMonth}`)
                .then(res => res.json())
                .then(resJson => {
                    console.log(resJson);
                    setData(resJson);
                });
        }
        else {
            fetch(`http://${config.server_host}:${config.server_port}/map/?month=${currentMonth}`)
                .then(res => res.json())
                .then(resJson => {
                    console.log(resJson);
                    setData(resJson);
                });
        }
    }, [country, continent]);
    const layers = [
        new HexagonLayer({
            id: 'heatmap',
            colorRange: colorRange,
            city: d => d.city,
            coverage: 1,
            data: data,
            extruded: true,
            getPosition: d => [Number(d.s_lon), Number(d.s_lat)],
            pickable: true,
            radius: 100000,
            upperPercentile: 100,
            getElevationValue: points => points.length,
            getColorWeight: d => d.avg_temp ? d.avg_temp : 50,
            colorAggregation: 'MEAN',
            onClick: (info) => hotelPage(info)
        }),
        new ArcLayer({
            id: 'arc',
            data: data,
            getSourcePosition: d => [Number(d.s_lon), Number(d.s_lat)],
            getTargetPosition: d => [Number(d.dest_lon), Number(d.dest_lat)],
            getSourceColor: d => [233, 30, 99],
            getTargetColor: d => [255, 255, 255],
            getWidth: d => d.num_flights,
            greatCircle: true,
            pickable: true,
            onClick: (info) => flightPage(info)
        })
    ];

    const dropdownContinentChanged = (c) => {
        setContinent(c);
        setCountry('Country');
    }

    const dropdownCountryChanged = (c) => {
        setCountry(c);
        setContinent('Continent');
    }

    return (
        <div>

            <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
                <div style={{ position: 'absolute', zIndex: 1, top: 10, left: 10 }}>
                    <DropdownButton id="dropdown-basic-button" title={continent} variant="secondary">
                        {
                            continents.map((c) => (
                                <Dropdown.Item href={c} as="button" onClick={() => dropdownContinentChanged(c)}>{c}</Dropdown.Item>
                            ))
                        }
                    </DropdownButton>
                </div>
                <div style={{ position: 'absolute', zIndex: 1, top: 10, left: 200 }}>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-custom-components" variant="secondary">
                            {country}
                        </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomMenu}>
                            {
                                countries.map((c) => (
                                    <Dropdown.Item href={c} as="button" onClick={() => dropdownCountryChanged(c)}>{c}</Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <DeckGL
                    layers={layers}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    getTooltip={getTooltip}
                >
                    <Map reuseMaps mapLib={maplibregl} mapStyle={MAP_STYLE} preventStyleDiffing={true} />
                </DeckGL>
            </div>
        </div>
    );
}