import React from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("rome");
  const [coords, setCoords] = React.useState({ lon: "", lat: "" });
  const [gotCoords, setGotCoords] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [cityInfo, setCityInfo] = React.useState({ city: "", country: "" });
  const [weatherInfo, setWeatherInfo] = React.useState([]);

  // Get coordinates from city name (Geocoding API from openweathermap.org)
  React.useEffect(() => {
    setLoaded(false);
    setWeatherInfo([]);

    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((response) => {
        setCityInfo({
          city: response.data[0].name,
          country: response.data[0].country,
        });
        setCoords({ lon: response.data[0].lon, lat: response.data[0].lat });
      })
      .then(setGotCoords(true));
  }, [query]);

  // Get weather data
  React.useEffect(() => {
    gotCoords &&
      axios
        .get(
          `https://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`
        )
        .then((response) => setWeatherInfo(response.data.dataseries))
        .then(setLoaded(true));
  }, [coords]);

  // Format weather info
  function formatWeatherInfo(weather) {
    switch (weather) {
      case "mcloudy":
        return "cloudy";
      case "partlycloudy":
        return "party cloudy";
      case "verycloudy":
        return "very cloudy";
      case "lightrain":
        return "light rain";
      case "occasionalshowers":
        return "occasional showers";
      case "isolatedshowers":
        return "isolated showers";
      case "lightsnow":
        return "light snow";
      case "thunderstormpossible":
        return "thunderstorm possible";
      default:
        return weather;
    }
  }

  return (
    <AppContext.Provider
      value={{ loaded, setQuery, cityInfo, weatherInfo, formatWeatherInfo }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to pass values
export const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { AppProvider };
