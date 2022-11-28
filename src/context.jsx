import React from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("rome");
  const [coords, setCoords] = React.useState({ lon: "", lat: "" });
  const [gotCoords, setGotCoords] = React.useState(false);
  const [cityInfo, setCityInfo] = React.useState({ city: "", country: "" });
  const [weatherInfo, setWeatherInfo] = React.useState([]);
  const [isCurrentPosition, setIsCurrentPosition] = React.useState(false);
  const [currentDateTime, setCurrentDateTime] = React.useState("");
  const [currentHour, setCurrentHour] = React.useState(null);
  const [error, setError] = React.useState({ show: false, msg: "" });

  // Get coordinates from city name (Geocoding API from openweathermap.org)
  React.useEffect(() => {
    // Run effect only if it's not current position
    if (!isCurrentPosition) {
      setError({ show: false, msg: "" });

      axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
            import.meta.env.VITE_GEOCODING_API_KEY
          }`
        )
        .then((response) => {
          // Get city info and coords
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

  // Get weather data using coordinates (7timer.info API) and timezone data (Timezone API from ipgeolocation.io)
  React.useEffect(() => {
    setWeatherInfo([]);

    const getWeather = axios.get(
      `https://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`
    );
    const getTimezone = axios.get(
      `https://api.ipgeolocation.io/timezone?apiKey=${
        import.meta.env.VITE_TIMEZONE_API_KEY
      }&lat=${coords.lat}&long=${coords.lon}`
    );

    // Call APIs only once coords is not undefined
    gotCoords &&
      axios
        .all([getTimezone, getWeather])
        .then(
          axios.spread(function (res1, res2) {
            // Get local date and time
            setCurrentDateTime(res1.data.date_time);
            // Get current hour digit to render right weather icon
            const currentTime = res1.data.time_24;
            const currentHour = parseInt(currentTime.slice(0, 2));
            setCurrentHour(currentHour);

            // Add icon name to daily weather array item
            const data = res2.data.dataseries;
            const formattedData = data.map((item) => {
              const icon = formatWeatherIcon(item.weather);
              return { ...item, icon: icon };
            });
            setWeatherInfo(formattedData);
          })
        )
        .catch((error) => {
          setError({ show: true, msg: "No results found" });
          console.log(error);
        });
  }, [coords]);

  // Get city and country from user's coordinates (Geocoding API from openweathermap.org)
  function getLocation(lon, lat) {
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${
          import.meta.env.VITE_GEOCODING_API_KEY
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
      case "tsrain":
        return "rain";
      case "occasionalshowers":
      case "oshower":
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
      case "humid":
        return "CLOUDY";
      case "rain":
      case "tsrain":
      case "lightrain":
      case "occasionalshowers":
      case "oshower":
      case "isolatedshowers":
      case "ishower":
      case "thunderstorm":
      case "thunderstormpossible":
        return "RAIN";
      case "lightsnow":
        return "SLEET";
      case "snow":
      case "mixed":
      case "rainsnow":
        return "SNOW";
      case "windy":
        return "WIND";
      case "foggy":
        return "FOG";
      default:
        return;
    }
  }

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
        currentDateTime,
        currentHour,
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
