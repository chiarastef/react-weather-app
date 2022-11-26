import { useGlobalContext } from "../context";
import ReactAnimatedWeather from "react-animated-weather";

import WeatherForecast from "./WeatherForecast";
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

  return (
    <div className={style.weatherContainer}>
      <div className={style.dateAndLocation}>
        {/* Last updated date and time */}
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
            icon={weatherInfo[0].icon}
            color={"#9fd3c7"}
            size={80}
            animate={true}
          />
        </div>
        <div className={style.currentWeatherInfo}>
          <div>{formatWeatherInfo(weatherInfo[0].weather)}</div>
          <div className={style.temperature}>
            <div>min: {weatherInfo[0].temp2m.min}°C</div>
            <div>max: {weatherInfo[0].temp2m.max}°C</div>
          </div>
        </div>
      </div>
      {/* Forecast next 6 days */}
      <div className={style.forecastContainer}>
        {weatherInfo.slice(1, -1).map((item, index) => {
          return <WeatherForecast key={index} info={item} />;
        })}
      </div>
    </div>
  );
}

export default WeatherInfo;
