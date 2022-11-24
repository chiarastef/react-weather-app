import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";

import style from "./css/app.module.css";

function App() {
  return (
    <div className={style.container}>
      <WeatherSearch />
      <WeatherInfo />
    </div>
  );
}

export default App;
