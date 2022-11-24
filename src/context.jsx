import React from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [query, setQuery] = React.useState("rome");
  const [coords, setCoords] = React.useState({ lon: "", lat: "" });
  const [gotCoords, setGotCoords] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Get coordinates from city name (Geocoding API from openweathermap.org)
  React.useEffect(() => {
    setLoaded(false);

    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((response) =>
        setCoords({ lon: response.data[0].lon, lat: response.data[0].lat })
      )
      .then(setGotCoords(true));
  }, [query]);

  // Get weather data
  React.useEffect(() => {
    gotCoords &&
      axios
        .get(
          `http://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`
        )
        .then((response) => console.log(response.data))
        .then(setLoaded(true));
  }, [coords]);

  return (
    <AppContext.Provider value={{ setQuery }}>{children}</AppContext.Provider>
  );
}

// Custom hook to pass values
export const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { AppProvider };
