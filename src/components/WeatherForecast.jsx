import ReactAnimatedWeather from "react-animated-weather";

import style from "../css/weatherforecast.module.css";

function WeatherForecast(props) {
  const date = String(props.info.date);

  const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, "$3-$2");

  return (
    <div className={style.forecastElement}>
      <div className={style.date}>{formattedDate}</div>
      <ReactAnimatedWeather
        icon={props.info.icon}
        color={"#9fd3c7"}
        size={90}
        animate={true}
      />
      <div className={style.temperature}>
        {props.info.temp2m.min}°C - {props.info.temp2m.max}°C
      </div>
    </div>
  );
}

export default WeatherForecast;
