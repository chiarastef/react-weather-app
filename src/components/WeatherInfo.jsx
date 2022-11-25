import { useGlobalContext } from "../context";
import ReactAnimatedWeather from "react-animated-weather";

import style from "../css/weatherinfo.module.css";

function WeatherInfo() {
  const { cityInfo, weatherInfo, formatWeatherInfo } = useGlobalContext();

  // Format date and time
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date().toLocaleString(undefined, options);

  const weather = "CLEAR_DAY";

  return (
    <div className={style.weatherContainer}>
      <div className={style.dateAndLocation}>
        {/* Last updated date */}
        <div className={style.date}>
          <span>Last updated:</span>
          <br />
          {date}
        </div>
        {/* Location */}
        <h2 className={style.city}>
          {cityInfo.city}, {cityInfo.country}
        </h2>
      </div>
      {/* Current weather */}
      <div className={style.currentWeather}>
        <div className={style.icon}>
          <ReactAnimatedWeather
            icon={weather}
            color={"#9fd3c7"}
            size={90}
            animate={true}
          />
        </div>
        <div className={style.currentWeatherInfo}>
          {/* Show weather info after variable is not undefined anymore */}
          {weatherInfo[0] && (
            <>
              <div>{formatWeatherInfo(weatherInfo[0].weather)}</div>
              <div className={style.temperature}>
                <div>min: {weatherInfo[0].temp2m.min}°C</div>
                <div>max: {weatherInfo[0].temp2m.max}°C</div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Forecast next 6 days */}
    </div>
  );
}

export default WeatherInfo;
