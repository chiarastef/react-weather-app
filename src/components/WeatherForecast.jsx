import ReactAnimatedWeather from "react-animated-weather";

import style from "../css/weatherforecast.module.css";

function WeatherForecast(props) {
  // Format date
  const date = String(props.info.date);
  const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2");

  return (
    <div className={style.forecastElement}>
      <div className={style.date}>{formattedDate}</div>
      <ReactAnimatedWeather
        icon={props.info.icon}
        color={"#9fd3c7"}
        size={60}
        animate={true}
      />
      <div className={style.temperature}>
        <span className={style.minTemp}>{props.info.temp2m.min}°</span>{" "}
        {props.info.temp2m.max}°
      </div>
    </div>
  );
}

export default WeatherForecast;
