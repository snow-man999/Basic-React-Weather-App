import React, { useState, useEffect } from "react";
import "./Weather.css"; // Import the CSS file for styling

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("London"); // Default city
    const [error, setError] = useState(""); // State for error message
    const [isWeatherFetched, setIsWeatherFetched] = useState(false); // State to track button click
    const Api_Key = "1297286154660fa17e97b87e2f0f08a1";

    const fetchWeather = () => {
        const Api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_Key}`;
        fetch(Api)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("City not found"); // Handle non-200 responses
                }
                return response.json();
            })
            .then((data) => {
                console.log(data); // Log the API response
                setWeatherData(data);
                setError(""); // Clear error message on successful fetch
                setIsWeatherFetched(true); // Set to true when weather data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setWeatherData(null); // Clear weather data if error occurs
                setError(error.message); // Set the error message
                setIsWeatherFetched(false); // Reset if there’s an error
            });
    };

    useEffect(() => {
        fetchWeather(); // Fetch weather data on component load
    }, []);

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleFetchWeather = () => {
        fetchWeather();
    };

    // Map weather descriptions to class names
    const getWeatherClass = (description) => {
        const descriptionMap = {
            "scattered clouds": "scattered_clouds",
            "clear sky": "clear",
            "few clouds": "few_clouds",
            "broken clouds": "broken_clouds",
            "shower rain": "rain",
            haze: "haze",
            rain: "rain",
            "heavy intensity rain": "rain",
            "moderate rain": "rain",
            thunderstorm: "thunderstorm",
            snow: "snow",
            mist: "default", // Optional: Add more conditions as needed
            "overcast clouds": "overcast_clouds", // Optional
        };
        return descriptionMap[description] || "default"; // Return default if not found
    };

    // Determine the weather class for dynamic background
    const weatherDescription = weatherData
        ? weatherData.weather[0].description.toLowerCase()
        : "";
    const weatherClass = getWeatherClass(weatherDescription);

    return (
        <div className={`weather-container ${weatherClass}`}>
            <div className="card">
                {isWeatherFetched && <h2>WEATHER IN {city.toUpperCase()}</h2>}{" "}
                {/* Show heading only when button is clicked */}
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Enter city name"
                    className="input-field"
                />
                <button onClick={handleFetchWeather} className="search_btn">
                    Get Weather
                </button>
                {error && (
                    <p className="error-message" style={{ color: "red" }}>
                        {error}
                    </p>
                )}{" "}
                {/* Error message */}
                {weatherData ? (
                    <div className="weather-table">
                        <div className="weather-row">
                            <div className="weather-cell">
                                Temperature:
                                <br />
                                {(weatherData.main.temp - 273.15).toFixed(2)}°C
                            </div>
                            <div className="weather-cell">
                                Weather:
                                <br /> {weatherData.weather[0].description}
                            </div>
                        </div>
                        <div className="weather-row">
                            <div className="weather-cell">
                                Wind Speed:
                                <br />
                                {(weatherData.wind.speed * 3.6).toFixed(2)} km/h
                            </div>
                            <div className="weather-cell">
                                Humidity: <br /> {weatherData.main.humidity}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="loading">Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Weather;
