// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');
const currentWeather = document.getElementById('current-weather');
const forecastCards = document.getElementById('forecast-cards');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const loading = document.getElementById('loading');
const currentDate = document.getElementById('current-date');
const apiKeyStatus = document.getElementById('api-key-status');
const locationBtn = document.getElementById('location-btn');

// API key
const apiKey = '88501636edc671e8a5549975209fd044';
let currentUnit = 'metric'; // Default to Celsius

// Display API key status
if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    apiKeyStatus.textContent = 'Not configured';
    apiKeyStatus.style.color = '#ff6b6b';
} else {
    apiKeyStatus.textContent = 'Configured';
    apiKeyStatus.style.color = '#28a745';
}

// Set current date
const today = new Date();
currentDate.textContent = today.toDateString();

// Set initial welcome state
setWelcomeState();

// Event listeners
locationBtn.addEventListener('click', getCurrentLocationWeather);
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') getWeather();
});

celsiusBtn.addEventListener('click', () => {
    if (currentUnit !== 'metric') {
        currentUnit = 'metric';
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        // Refresh weather with new units
        if (cityInput.value) getWeather();
    }
});

fahrenheitBtn.addEventListener('click', () => {
    if (currentUnit !== 'imperial') {
        currentUnit = 'imperial';
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
        // Refresh weather with new units
        if (cityInput.value) getWeather();
    }
});

// Set welcome state when app loads
function setWelcomeState() {
    currentWeather.querySelector('.city-name').textContent = 'Weather App';
    currentWeather.querySelector('.temperature').textContent = 'Welcome!';
    currentWeather.querySelector('.weather-description').textContent = 'Search for any city/country';
    currentWeather.querySelector('.weather-icon').innerHTML = '<i class="fas fa-cloud-sun"></i>';
    currentWeather.querySelectorAll('.detail')[0].querySelector('span').textContent = '-- km/h';
    currentWeather.querySelectorAll('.detail')[1].querySelector('span').textContent = '--%';
    
    // Clear forecast
    forecastCards.innerHTML = '';
    
    // Hide messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Get weather data from API or use mock data
// Get weather data from API or use mock data
// DOM elements
const inputError = document.getElementById('input-error');

// Get weather data from API or use mock data
function getWeather() {
    const city = cityInput.value.trim();
    
    // Reset error states
    cityInput.classList.remove('error');
    inputError.classList.remove('show');
    errorMessage.style.display = 'none';
    
    // Show error if search box is empty
    if (!city) {
        showInputError('Please enter a city name');
        return;
    }
    
    // Show loading, hide error
    loading.style.display = 'block';
    successMessage.style.display = 'none';
    
    // If using a real API key, try to fetch from API
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
        // Fetch current weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'City not found');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Check if the API returned an error in the response body
                if (data.cod && data.cod !== 200) {
                    throw new Error(data.message || 'City not found');
                }
                
                displayCurrentWeather(data);
                loading.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Fetch 5-day forecast only after current weather succeeds
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch forecast data');
                }
                return response.json();
            })
            .then(data => {
                // Check if the forecast API returned an error
                if (data.cod && data.cod !== "200") {
                    throw new Error(data.message || 'Failed to load forecast data');
                }
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error:', error);
                showInputError(error.message || 'Failed to fetch weather data');
                loading.style.display = 'none';
                clearWeatherData();
            });
    } else {
        // Use mock data if no API key is configured
        setTimeout(() => {
            loading.style.display = 'none';
            useMockData(city);
            successMessage.style.display = 'block';
        }, 800);
    }
}

// Show error in input field
function showInputError(message) {
    cityInput.classList.add('error');
    inputError.textContent = message;
    inputError.classList.add('show');
}

// Clear input error
function clearInputError() {
    cityInput.classList.remove('error');
    inputError.classList.remove('show');
}

// Add input event listener to clear error when typing
cityInput.addEventListener('input', () => {
    clearInputError();
});
// Use mock data for demonstration
function useMockData(city) {
    // Mock current weather data
    const mockCurrentData = {
        name: city,
        main: {
            temp: currentUnit === 'metric' ? 22 : 72,
            humidity: 65
        },
        weather: [{
            description: 'partly cloudy',
            icon: '02d'
        }],
        wind: {
            speed: currentUnit === 'metric' ? 12 : 7.5
        }
    };
    
    displayCurrentWeather(mockCurrentData);
    
    // Mock forecast data
    const mockForecastData = {
        list: [
            {dt: Date.now()/1000 + 86400, main: {temp: currentUnit === 'metric' ? 24 : 75}, weather: [{description: 'sunny', icon: '01d'}]},
            {dt: Date.now()/1000 + 172800, main: {temp: currentUnit === 'metric' ? 19 : 66}, weather: [{description: 'cloudy', icon: '03d'}]},
            {dt: Date.now()/1000 + 259200, main: {temp: currentUnit === 'metric' ? 21 : 70}, weather: [{description: 'light rain', icon: '10d'}]},
            {dt: Date.now()/1000 + 345600, main: {temp: currentUnit === 'metric' ? 17 : 63}, weather: [{description: 'rainy', icon: '09d'}]},
            {dt: Date.now()/1000 + 432000, main: {temp: currentUnit === 'metric' ? 23 : 73}, weather: [{description: 'clear', icon: '01d'}]}
        ]
    };
    
    displayForecast(mockForecastData);
}

// Display current weather
function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windUnit = currentUnit === 'metric' ? 'km/h' : 'mph';
    
    currentWeather.querySelector('.city-name').textContent = cityName;
    currentWeather.querySelector('.temperature').textContent = `${temperature}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    currentWeather.querySelector('.weather-description').textContent = description;
    currentWeather.querySelector('.weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`;
    currentWeather.querySelectorAll('.detail')[0].querySelector('span').textContent = `${windSpeed} ${windUnit}`;
    currentWeather.querySelectorAll('.detail')[1].querySelector('span').textContent = `${humidity}%`;
}

// Display 5-day forecast
function displayForecast(data) {
    // Clear previous forecast
    forecastCards.innerHTML = '';
    
    // Filter to get one entry per day (for real API) or use all entries (for mock data)
    const dailyForecasts = [];
    
    if (data.list && data.list.length > 5) {
        // Real API data - get one forecast per day
        const processedDays = new Set();
        
        for (const forecast of data.list) {
            const date = new Date(forecast.dt * 1000).toDateString();
            
            if (!processedDays.has(date) && processedDays.size > 0) {
                dailyForecasts.push(forecast);
                processedDays.add(date);
            }
            
            if (processedDays.size === 0) {
                dailyForecasts.push(forecast);
                processedDays.add(date);
            }
            
            if (processedDays.size === 5) break;
        }
    } else if (data.list) {
        // Mock data - use all entries
        dailyForecasts.push(...data.list);
    }
    
    // Create forecast cards
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const iconCode = forecast.weather[0].icon;
        const temperature = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <div class="forecast-date">${date.toDateString()}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
            </div>
            <div class="forecast-temp">${temperature}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
            <div class="weather-description">${description}</div>
        `;
        
        forecastCards.appendChild(forecastCard);
    });
}

// Clear weather data display
function clearWeatherData() {
    currentWeather.querySelector('.city-name').textContent = 'Weather App';
    currentWeather.querySelector('.temperature').textContent = '--°C';
    currentWeather.querySelector('.weather-description').textContent = '--';
    currentWeather.querySelector('.weather-icon').innerHTML = '<i class="fas fa-cloud-sun"></i>';
    currentWeather.querySelectorAll('.detail')[0].querySelector('span').textContent = '-- km/h';
    currentWeather.querySelectorAll('.detail')[1].querySelector('span').textContent = '--%';
    
    // Clear forecast
    forecastCards.innerHTML = '';
}
// Remove the auto-load on window load since we want welcome state initially
// window.addEventListener('load', () => {
//     cityInput.value = 'London';
//     getWeather();
// });

// Weather animation control
function setWeatherAnimation(weatherCondition) {
    // Hide all animations first
    document.querySelectorAll('.weather-animation').forEach(el => {
        el.style.display = 'none';
    });
    
    // Clear any existing elements
    document.querySelectorAll('.rain-drop, .snowflake, .cloud, .star').forEach(el => {
        el.remove();
    });
    
    const weatherAnim = document.getElementById('weather-animation');
    
    // Show appropriate animation based on weather condition
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        createRainAnimation();
        weatherAnim.className = 'weather-animation rain-animation';
    } else if (weatherCondition.includes('snow') || weatherCondition.includes('sleet')) {
        createSnowAnimation();
        weatherAnim.className = 'weather-animation snow-animation';
    } else if (weatherCondition.includes('cloud')) {
        createCloudAnimation();
        weatherAnim.className = 'weather-animation cloudy-animation';
    } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
        createFogAnimation();
        weatherAnim.className = 'weather-animation foggy-animation';
    } else if (weatherCondition.includes('clear')) {
        if (isDaytime()) {
            createSunAnimation();
            weatherAnim.className = 'weather-animation sunny-animation';
        } else {
            createStarsAnimation();
            weatherAnim.className = 'weather-animation clear-night-animation';
        }
    } else {
        // Default animation (subtle particles)
        weatherAnim.className = 'weather-animation';
    }
    
    weatherAnim.style.display = 'block';
}

// Helper function to check if it's daytime
function isDaytime() {
    const hours = new Date().getHours();
    return hours > 6 && hours < 20;
}

// Create rain animation elements
function createRainAnimation() {
    const container = document.getElementById('weather-animation');
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(drop);
    }
}

// Create snow animation elements
function createSnowAnimation() {
    const container = document.getElementById('weather-animation');
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.innerHTML = '❄';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${3 + Math.random() * 5}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.style.fontSize = `${8 + Math.random() * 12}px`;
        container.appendChild(flake);
    }
}

// Create cloud animation elements
function createCloudAnimation() {
    const container = document.getElementById('weather-animation');
    for (let i = 0; i < 10; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = `${50 + Math.random() * 100}px`;
        cloud.style.height = `${30 + Math.random() * 40}px`;
        cloud.style.top = `${Math.random() * 50}%`;
        cloud.style.animationDuration = `${20 + Math.random() * 30}s`;
        cloud.style.animationDelay = `${Math.random() * 20}s`;
        container.appendChild(cloud);
    }
}

// Create fog animation elements
function createFogAnimation() {
    const container = document.getElementById('weather-animation');
    for (let i = 0; i < 3; i++) {
        const fog = document.createElement('div');
        fog.className = 'fog-layer';
        fog.style.top = `${i * 30}%`;
        fog.style.animationDuration = `${30 + i * 10}s`;
        fog.style.animationDelay = `${i * 5}s`;
        fog.style.opacity = `${0.1 + i * 0.05}`;
        container.appendChild(fog);
    }
}

// Create sun animation elements
function createSunAnimation() {
    const container = document.getElementById('weather-animation');
    const rays = document.createElement('div');
    rays.className = 'sun-rays';
    
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        ray.style.setProperty('--rotation', `${i * 30}deg`);
        ray.style.animationDelay = `${i * 0.3}s`;
        rays.appendChild(ray);
    }
    
    container.appendChild(rays);
}

// Create stars animation elements
function createStarsAnimation() {
    const container = document.getElementById('weather-animation');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${1 + Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDuration = `${2 + Math.random() * 4}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(star);
    }
}
// Add this function to get current location weather
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showInputError('Geolocation is not supported by your browser');
        return;
    }
    
    // Show loading
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    clearInputError();
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Fetch weather by coordinates
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${apiKey}`)
                .then(response => {
                    if (!response.ok) throw new Error('Location not found');
                    return response.json();
                })
                .then(data => {
                    displayCurrentWeather(data);
                    loading.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Update input field with current city name
                    cityInput.value = data.name;
                    
                    // Fetch forecast
                    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${apiKey}`);
                })
                .then(response => {
                    if (!response.ok) throw new Error('Forecast not found');
                    return response.json();
                })
                .then(data => {
                    displayForecast(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    showInputError('Unable to get weather for your location');
                    loading.style.display = 'none';
                });
        },
        error => {
            loading.style.display = 'none';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    showInputError('Location access denied. Please enable location services.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showInputError('Location information unavailable.');
                    break;
                case error.TIMEOUT:
                    showInputError('Location request timed out.');
                    break;
                default:
                    showInputError('An unknown error occurred.');
                    break;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}