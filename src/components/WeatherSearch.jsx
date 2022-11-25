import React from "react";
import { useGlobalContext } from "../context";

import style from "../css/weathersearch.module.css";

function WeatherSearch() {
  const { setQuery, error } = useGlobalContext();
  const [search, setSearch] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(search);
    setSearch("");
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
        <button type="button" className={`${style.btn} ${style.positionBtn}`}>
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
