import { useState, useEffect } from 'react'
import axios from 'axios';

const Weather = ({ location }) => {
  const [ weather, setWeather ] = useState(null)
  useEffect(() => {
    console.log('loc', location);
    const api_key = import.meta.env.VITE_WEATHERAPI_KEY
    axios
      .get(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${location}`)
      .then(response => {
        console.log('weather responded', response.data);
        setWeather(response.data.current)
      })
  }, [])

  if (weather === null) 
    return null

  return (
    <>
      <h2>Weather in {location}</h2>
      <div>temperature {weather.temp_c} Celcius </div>
      <img src={weather.condition.icon} />
      <div>Wind {weather.wind_kph} km/h</div>
    </>
  )
}

export default Weather