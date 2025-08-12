import './UserDashboard.css';
import React, { useState, useEffect, useRef } from 'react';

function ImageCarousel() {
    const images = [
        "/public/dbimg1.png",
        "/public/dbimg2.png",
        "/public/dbimg3.png",
        "/public/dbimg1.png",
        "/public/dbimg2.png",
        "/public/dbimg3.png",
    ];

    const [current, setCurrent] = useState(0);
    const listRef = useRef(null);

    const total = images.length;

    const getIndex = (offset) => (current + offset + total) % total;

    const next = () => {
        setCurrent((prev) => (prev + 1) % total);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + total) % total);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 4000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <div className="carousel-wrapper">
            <button className="arrow left" onClick={prev}>&#10094;</button>
            <div className="carousel-view">
                <div className="carousel-track" ref={listRef}>
                    {[...Array(5)].map((_, i) => {
                        const offset = i - 2; // center is at position 2
                        const index = getIndex(offset);
                        const isActive = offset === 0;

                        return (
                            <img
                                key={index}
                                src={images[index]}
                                alt={`img-${index}`}
                                className={`carousel-img ${isActive ? "active" : "blur"}`}
                            />
                        );
                    })}
                </div>
            </div>
            <button className="arrow right" onClick={next}>&#10095;</button>
        </div>
    );
}

export default function UserDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual OpenWeatherMap API key
  const API_KEY = '24988f54a3eb7d5e5a4b1a4240a6394e'; // Get free key from https://openweathermap.org/api

  useEffect(() => {
    document.title = 'Dashboard';

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Get user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        // Step 2: Get location from IP (using ipapi.co - free for basic use)
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoResponse.json();
        if (geoData.error) {
          throw new Error('Failed to get location from IP');
        }
        const { city, latitude: lat, longitude: lon } = geoData;
        setLocation(city || 'Unknown Location');

        // Step 3: Get weather data using OpenWeatherMap One Call API (includes current, forecast, and alerts)
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
        );
        const weatherJson = await weatherResponse.json();
        if (weatherJson.cod && weatherJson.cod !== 200) {
          throw new Error(weatherJson.message || 'Weather API error');
        }

        // Current weather
        setWeatherData({
          temp: Math.round(weatherJson.current.temp),
          description: weatherJson.current.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${weatherJson.current.weather[0].icon}@2x.png`,
          wind: weatherJson.current.wind_speed,
          humidity: weatherJson.current.humidity,
        });

        // 7-day forecast (daily)
        const forecast = weatherJson.daily.slice(1, 8).map((day) => ({
          day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(day.temp.max),
          low: Math.round(day.temp.min),
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
        }));
        setForecastData(forecast);

        // Alerts (if any)
        if (weatherJson.alerts && weatherJson.alerts.length > 0) {
          setAlert(weatherJson.alerts[0].description);
        }

        // Last updated
        setLastUpdated(new Date(weatherJson.current.dt * 1000).toLocaleTimeString());

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch weather data. Please try again later.');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      <ImageCarousel />

      <h2 className="welcome-text">Hint: Check the following 7 days weather!!</h2>
      <hr className="divider" />

      {/* Weather Forecast */}
      <div className="weather-container">
        <div className="weather-card-large">
          <div className="weather-header">
            <span className="location-icon">📍</span>
            <span className="weather-location">{location}</span>
          </div>
          <hr className="weather-header-line" />

          <div className="weather-row">
            <div className="weather-info-box">
              {loading ? (
                <p>Loading weather...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : weatherData ? (
                <div className="weather-main-info">
                  <div className="weather-left">
                    <div className="weather-today-label">Today</div>
                    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon-lg" />
                  </div>
                  <div className="weather-divider"></div>
                  <div className="weather-right">
                    <div className="temp-now">{weatherData.temp}°C</div>
                    <div className="desc">{weatherData.description}</div>
                    <div className="wind-humidity">
                      Wind: {weatherData.wind} km/h<br />
                      Humidity: {weatherData.humidity}%
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="weather-forecast-row">
            {loading ? (
              <p>Loading forecast...</p>
            ) : error ? null : (
              forecastData.map((day, idx) => (
                <div className="weather-forecast" key={idx}>
                  <div className="day">{day.day}</div>
                  <img src={day.icon} alt="forecast" />
                  <div className="temps">{day.high}° / {day.low}°</div>
                </div>
              ))
            )}
          </div>

          <div className="last-updated">Last updated: {lastUpdated}</div>
        </div>
      </div>
    </div>
  );
}