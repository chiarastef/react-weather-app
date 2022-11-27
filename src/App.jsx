import React from "react";
import { useGlobalContext } from "./context";
import ClipLoader from "react-spinners/ClipLoader";

import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";

import style from "./css/app.module.css";

function App() {
  const { weatherInfo, error } = useGlobalContext();

  // Show error message if error occurs
  if (error.show) {
    return (
      <div className={style.container}>
        <WeatherSearch />
        <div className={style.error}>{error.msg}</div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <WeatherSearch />
      {/* Show component once data is not undefined */}
      {weatherInfo[0] ? (
        <WeatherInfo />
      ) : (
        <ClipLoader
          color={"#385170"}
          cssOverride={{
            display: "block",
            margin: "80px auto",
          }}
          size={80}
          speedMultiplier={0.7}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
}

export default App;
