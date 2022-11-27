import { useGlobalContext } from "../context";
import ReactAnimatedWeather from "react-animated-weather";

import WeatherForecast from "./WeatherForecast";
import style from "../css/weatherinfo.module.css";

function WeatherInfo() {
  const {
    cityInfo,
    weatherInfo,
    formatWeatherInfo,
    currentDateTime,
    currentHour,
  } = useGlobalContext();

  // Format date and time
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(currentDateTime).toLocaleDateString(
    undefined,
    dateOptions
  );
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  };
  const time = new Date(currentDateTime).toLocaleTimeString(
    undefined,
    timeOptions
  );

  function formatNightIcons(icon) {
    if (currentHour < 7 || currentHour > 18) {
      if (weatherInfo[0].icon === "CLEAR_DAY") {
        return "CLEAR_NIGHT";
      } else if (weatherInfo[0].icon === "PARTLY_CLOUDY_DAY") {
        return "PARTLY_CLOUDY_NIGHT";
      }
    }
    return weatherInfo[0].icon;
  }

  // Change icons for night time
  // let icon = "";
  // if (currentHour < 7 || currentHour > 18) {
  //   if (weatherInfo[0].icon === "CLEAR_DAY") {
  //     icon = "CLEAR_NIGHT";
  //     console.log(icon);
  //   } else if (weatherInfo[0].icon === "PARTLY_CLOUDY_DAY") {
  //     icon = "PARTLY_CLOUDY_NIGHT";
  //     console.log(icon);
  //   } else {
  //     icon = weatherInfo[0].icon;
  //   }
  // } else {
  //   icon = weatherInfo[0].icon;
  // }

  return (
    <div className={style.weatherContainer}>
      <div className={style.dateAndLocation}>
        {/* Local date and time */}
        <div className={style.date}>
          <span>Local date and time:</span>
          <br />
          {date} - {time}
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
            icon={formatNightIcons(weatherInfo[0].icon)}
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
      {/* Forecast next 5 days */}
      <div className={style.forecastContainer}>
        {weatherInfo.slice(1, -1).map((item, index) => {
          return <WeatherForecast key={index} info={item} />;
        })}
      </div>
    </div>
  );
}

export default WeatherInfo;
