import React from "react";
import { useGlobalContext } from "./context";
import ClipLoader from "react-spinners/ClipLoader";

import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";

import style from "./css/app.module.css";

function App() {
  const { loaded } = useGlobalContext();

  return (
    <div className={style.container}>
      <WeatherSearch />
      {loaded ? (
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
