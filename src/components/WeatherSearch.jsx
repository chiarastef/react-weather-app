import React from "react";
import { useGlobalContext } from "../context";

import style from "../css/weathersearch.module.css";

function WeatherSearch() {
  const { setQuery, setCoords, getLocation, setIsCurrentPosition } =
    useGlobalContext();

  const [search, setSearch] = React.useState("");

  // Launch city search
  function handleSubmit(e) {
    e.preventDefault();
    setQuery(search);
    setSearch("");
    setIsCurrentPosition(false);
  }

  // Get user's coordinates
  function getCoords() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      getLocation(lon, lat);
      setCoords({
        lon,
        lat,
      });
    });
  }

  return (
    <form className={style.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a city"
        autoFocus
        value={search}
        className={style.searchInput}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={style.buttons}>
        <button
          type="button"
          onClick={getCoords}
          className={`${style.btn} ${style.positionBtn}`}
        >
          current position
        </button>
        <button type="submit" className={`${style.btn} ${style.searchBtn}`}>
          search
        </button>
      </div>
    </form>
  );
}

export default WeatherSearch;
