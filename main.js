// Map weather conditions to your icon classes
const getWeatherIcon = (weatherMain, weatherId) => {
  // Map based on main weather type
  const iconMap = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'thunder-storm',
    'Snow': 'flurries',
    'Mist': 'cloudy',
    'Smoke': 'cloudy',
    'Haze': 'cloudy',
    'Dust': 'cloudy',
    'Fog': 'cloudy',
    'Sand': 'cloudy',
    'Ash': 'cloudy',
    'Squall': 'thunder-storm',
    'Tornado': 'thunder-storm'
  };

  // Special case: if it's rainy with sun (weather ID 500-531 during day)
  if (weatherId >= 500 && weatherId <= 531) {
    return 'sun-shower';
  }

  return iconMap[weatherMain] || 'cloudy';
};

// Function to create the icon HTML
const createWeatherIcon = (iconClass) => {
  const iconTemplates = {
    'sunny': `
      <div class="icon sunny">
        <div class="sun">
          <div class="rays"></div>
        </div>
      </div>
    `,
    'cloudy': `
      <div class="icon cloudy">
        <div class="cloud"></div>
        <div class="cloud"></div>
      </div>
    `,
    'rainy': `
      <div class="icon rainy">
        <div class="cloud"></div>
        <div class="rain"></div>
      </div>
    `,
    'sun-shower': `
      <div class="icon sun-shower">
        <div class="cloud"></div>
        <div class="sun">
          <div class="rays"></div>
        </div>
        <div class="rain"></div>
      </div>
    `,
    'thunder-storm': `
      <div class="icon thunder-storm">
        <div class="cloud"></div>
        <div class="lightning">
          <div class="bolt"></div>
          <div class="bolt"></div>
        </div>
      </div>
    `,
    'flurries': `
      <div class="icon flurries">
        <div class="cloud"></div>
        <div class="snow">
          <div class="flake"></div>
          <div class="flake"></div>
        </div>
      </div>
    `
  };

  return iconTemplates[iconClass] || iconTemplates['cloudy'];
};

const main = async () => {
  const results = document.getElementById("results");
  const city = document.getElementById("input").value.trim();

  // Check if input is empty
  if (!city) {
    results.innerHTML = '<p style="color: #ff6b6b;">Please enter a city name</p>';
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ffc74c9e41d3cd99bf6bb25a7f582a7a`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    
    // Get the appropriate icon
    const weatherMain = data.weather[0].main;
    const weatherId = data.weather[0].id;
    const iconClass = getWeatherIcon(weatherMain, weatherId);
    const iconHTML = createWeatherIcon(iconClass);

    results.innerHTML = `
      <div style="margin: 2em 0; display: flex; justify-content: center; color: #161616;">
        ${iconHTML}
      </div>
      <h2 style="margin: 0.5em 0;">${data.name}, ${data.sys.country}</h2>
      <p style="font-size: 3em; margin: 0.25em 0; font-weight: 100;">${Math.round(data.main.temp)}°C</p>
      <p style="text-transform: capitalize; font-size: 1.25em; margin: 0.5em 0;">${data.weather[0].description}</p>
      <p style="font-size: 1.1em; margin: 0.75em 0;">H: ${Math.round(data.main.temp_max)}° L: ${Math.round(data.main.temp_min)}°</p>
      <div style="display: flex; gap: 2em; justify-content: center; margin-top: 1.5em; flex-wrap: wrap;">
        <p style="margin: 0;">Feels like: ${Math.round(data.main.feels_like)}°C</p>
        <p style="margin: 0;">Humidity: ${data.main.humidity}%</p>
        <p style="margin: 0;">Wind: ${data.wind.speed} m/s</p>
      </div>
    `;

    console.log(data);

  } catch (error) {
    results.innerHTML = '<p style="color: #ff6b6b;">Could not find weather data for that city</p>';
    console.error(error);
  }
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    main();
  }
});