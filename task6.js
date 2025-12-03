// 🔑 1. Your OpenWeatherMap API key
const API_KEY = "9fdec312ee3e28155ce5a13c2aa7f14d"; // <-- unga real key va inge podunga

// Correct base URL
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// 2. DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusText = document.getElementById("status");

const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const tempText = document.getElementById("tempText");
const descText = document.getElementById("descText");
const humidityText = document.getElementById("humidityText");
const windText = document.getElementById("windText");

// 3. Events
searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getWeather();
});

// 4. Fetch weather for entered city
async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    statusText.textContent = "Please enter a city name.";
    weatherCard.style.display = "none";
    return;
  }

  statusText.textContent = "Loading...";
  weatherCard.style.display = "none";

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    // API error handle (city not found, wrong key etc.)
    if (!res.ok || (data.cod && Number(data.cod) !== 200)) {
      throw new Error(data.message || "City not found");
    }

    updateUI(data);
    statusText.textContent = ""; // clear status
  } catch (err) {
    console.error(err);
    statusText.textContent = "❌ " + err.message;
    weatherCard.style.display = "none";
  }
}

// 5. Update UI with temp, humidity, wind, icon
function updateUI(data) {
  const city = `${data.name}, ${data.sys.country}`;
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  cityName.textContent = city;
  tempText.textContent = `${temp}°C`;
  descText.textContent = desc;
  humidityText.textContent = `${humidity}%`;
  windText.textContent = `${wind} m/s`;

  const main = data.weather[0].main; // "Clear", "Clouds", "Rain"...
  weatherIcon.textContent = getIcon(main);

  weatherCard.style.display = "block";
}

// 6. Simple icon selector
function getIcon(main) {
  switch (main) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
    case "Drizzle":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Fog":
    case "Haze":
      return "🌫️";
    default:
      return "🌡️";
  }
}
