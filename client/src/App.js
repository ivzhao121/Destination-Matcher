import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { cyan, green, black, pink, indigo } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import Survey from './pages/Survey'
import Flights from './pages/Flights';
import FlightsByCountry from './pages/FlightsByCountry';
import NavBar from "./components/NavBar";
import MapPage from "./pages/MapPage";
import HotelsPage from "./pages/Hotels";
import HotelsInfoPage from "./pages/HotelInfoPage";
import SlideShow from './components/SlideShow';
import DestinationMatcherCover from "./pages/DestinationMatcherCover";
import Results from "./pages/Results";
import Matches from "./pages/Matches";


// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: pink,
    secondary: indigo,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page 
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<DestinationMatcherCover />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/survey"  element={<Survey />} />
          <Route path="/hotels"  element={<HotelsPage />} />
          <Route path="/hotels/:hotel_id"  element={<HotelsInfoPage />} />
          <Route path="/flights"  element={<Flights />} />
          <Route path="/flights/country"  element={<FlightsByCountry />} />
          <Route path="/survey/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}