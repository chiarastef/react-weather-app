import React from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("rome");
  const [coords, setCoords] = React.useState({ lon: "", lat: "" });
  const [gotCoords, setGotCoords] = React.useState(false);
  const [cityInfo, setCityInfo] = React.useState({ city: "", country: "" });
  const [weatherInfo, setWeatherInfo] = React.useState([]);
  const [error, setError] = React.useState({ show: false, msg: "" });
  const [isCurrentPosition, setIsCurrentPosition] = React.useState(false);

  // Get coordinates from city name (Geocoding API from openweathermap.org)
  React.useEffect(() => {
    // Run effect only if it's not current position
    if (!isCurrentPosition) {
      setError({ show: false, msg: "" });

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
          if (query.length < 1) {
            setError({ show: true, msg: "Please, enter a city" });
          } else {
            setError({ show: true, msg: "No results found" });
          }
          console.log(error);
        });
    }
  }, [query]);

  // Get weather data using coordinates (.7timer.info API)
  React.useEffect(() => {
    setWeatherInfo([]);

    // Call API only once coords is not undefined
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
          setError({ show: true, msg: "No results found" });
          console.log(error);
        });
  }, [coords]);

  // Get city and country for coordinates (Geocoding API from openweathermap.org)
  function getLocation(lon, lat) {
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((response) => {
        setCityInfo({
          city: response.data[0].name,
          country: response.data[0].country,
        });
        setQuery(response.data[0].name);
        setIsCurrentPosition(true);
      })
      .catch((error) => {
        setError({ show: true, msg: "No results found" });
        console.log(error);
      });
  }

  // Format weather info
  function formatWeatherInfo(weather) {
    switch (weather) {
      case "mcloudy":
      case "pcloudy":
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
      case "ishower":
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
      case "pcloudy":
      case "cloudy":
      case "verycloudy":
        return "CLOUDY";
      case "rain":
      case "lightrain":
      case "occasionalshowers":
      case "isolatedshowers":
      case "ishower":
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
      default:
        return;
    }
  }

  // CLEAR_NIGHT;
  // PARTLY_CLOUDY_NIGHT;

  return (
    <AppContext.Provider
      value={{
        setQuery,
        setCoords,
        cityInfo,
        weatherInfo,
        formatWeatherInfo,
        error,
        getLocation,
        setIsCurrentPosition,
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
