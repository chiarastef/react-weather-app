import React from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("rome");
  const [coords, setCoords] = React.useState({ lon: "", lat: "" });
  const [gotCoords, setGotCoords] = React.useState(false);
  const [cityInfo, setCityInfo] = React.useState({ city: "", country: "" });
  const [weatherInfo, setWeatherInfo] = React.useState([]);

  const [error, setError] = React.useState(false);

  // Get coordinates from city name (Geocoding API from openweathermap.org)
  React.useEffect(() => {
    setError(false);
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
      .then(setGotCoords(true))
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }, [query]);

  // Get weather data
  React.useEffect(() => {
    gotCoords &&
      axios
        .get(
          `https://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`
        )
        .then((response) => {
          // Add weather icon to weatherInfo array
          const data = response.data.dataseries;
          const formattedData = data.map((item) => {
            const icon = formatWeatherIcon(item.weather);
            return { ...item, icon: icon };
          });
          setWeatherInfo(formattedData);
        })
        .catch((error) => {
          setError(true);
          console.log(error);
        });
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

  // Format weather icon
  function formatWeatherIcon(weather) {
    switch (weather) {
      case "clear":
        return "CLEAR_DAY";
      case "partlycloudy":
        return "PARTLY_CLOUDY_DAY";
      case "mcloudy":
      case "cloudy":
      case "verycloudy":
        return "CLOUDY";
      case "rain":
      case "lightrain":
      case "occasionalshowers":
      case "isolatedshowers":
      case "thunderstorm":
      case "thunderstormpossible":
        return "RAIN";
      case "lightsnow":
        return "SLEET";
      case "snow":
      case "mixed":
        return "SNOW";
      case "windy":
        return "WIND";
      case "foggy":
        return "FOG";
    }
  }

  // CLEAR_NIGHT;
  // PARTLY_CLOUDY_NIGHT;

  return (
    <AppContext.Provider
      value={{
        setQuery,
        cityInfo,
        weatherInfo,
        formatWeatherInfo,
        error,
      }}
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
