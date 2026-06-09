// ======================================================
// WEATHER / AQI / ECO TIP DEBUG VERSION
// ======================================================

let currentLat = null;
let currentLon = null;
let currentLocationName = "กำลังระบุตำแหน่ง...";
let locationLoaded = false;
let currentWeatherTemp = null;
let currentWeatherCode = null;
let currentAQI = null;

function weatherDebug(step, data){
  if(typeof APP_CONFIG !== "undefined" && APP_CONFIG.debugMode){
    console.log(`🌦️ [WEATHER DEBUG] ${step}`, data || "");
  }
}

function weatherError(step, error){
  console.error(`❌ [WEATHER ERROR] ${step}`, error);
}

function loadWeather(){
  console.group("🌦️ loadWeather");

  weatherDebug("1. Start loadWeather");

  const locationEl = document.getElementById("weatherLocation");

  if(locationEl){
    locationEl.innerText = "กำลังขอตำแหน่ง...";
    weatherDebug("2. weatherLocation element found");
  }else{
    weatherDebug("2. weatherLocation element NOT found");
  }

  if(!navigator.geolocation){
    weatherError("Geolocation not supported", "navigator.geolocation is missing");
    setWeatherFallback("ไม่รองรับ Location");
    console.groupEnd();
    return;
  }

  weatherDebug("3. Requesting geolocation permission");

  navigator.geolocation.getCurrentPosition(
    position=>{
      weatherDebug("4. Location allowed", position.coords);

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      currentLat = lat;
      currentLon = lon;

      weatherDebug("5. Coordinates saved", {
        currentLat,
        currentLon
      });

      if(locationEl){
        locationEl.innerText = "กำลังโหลดชื่อสถานที่...";
      }

      fetchWeather(lat, lon);
      fetchAirQuality(lat, lon);
      fetchLocationName(lat, lon);

      console.groupEnd();
    },
    error=>{
      weatherError("Location permission / location error", {
        code: error.code,
        message: error.message
      });

      if(error.code === 1){
        setWeatherFallback("Location ถูกปฏิเสธ กรุณาเปิดสิทธิ์ Location ใน Browser");
      }else if(error.code === 2){
        setWeatherFallback("หาตำแหน่งไม่พบ");
      }else if(error.code === 3){
        setWeatherFallback("ขอตำแหน่งนานเกินไป");
      }else{
        setWeatherFallback("ไม่สามารถเข้าถึง Location");
      }

      console.groupEnd();
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}

async function fetchLocationName(lat, lon){
  console.group("📍 fetchLocationName");

  const locationEl = document.getElementById("weatherLocation");

  try{
    weatherDebug("1. Start fetchLocationName", { lat, lon });

    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=th`;

    weatherDebug("2. Location API URL", url);

    const response = await fetch(url);

    weatherDebug("3. Location API response", {
      ok: response.ok,
      status: response.status
    });

    if(!response.ok){
      throw new Error(`Location API error: ${response.status}`);
    }

    const data = await response.json();

    weatherDebug("4. Location API data", data);

    const district = data.locality || data.city || "";
    const province = data.principalSubdivision || "";
    const country = data.countryName || "";

    const locationName =
      [district, province].filter(Boolean).join(", ") ||
      country ||
      `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    currentLocationName = locationName;
    locationLoaded = true;

    weatherDebug("5. Final locationName", locationName);

    if(locationEl){
      locationEl.innerText = locationName;
    }

  }catch(error){
    weatherError("fetchLocationName failed", error);

    currentLocationName = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    if(locationEl){
      locationEl.innerText = currentLocationName;
    }

  }finally{
    console.groupEnd();
  }
}

async function fetchWeather(lat, lon){
  console.group("🌤️ fetchWeather");

  try{
    weatherDebug("1. Start fetchWeather", { lat, lon });

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    weatherDebug("2. Weather API URL", url);

    const response = await fetch(url);

    weatherDebug("3. Weather API response", {
      ok: response.ok,
      status: response.status
    });

    if(!response.ok){
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    weatherDebug("4. Weather API data", data);

    if(!data.current_weather){
      throw new Error("current_weather not found");
    }

    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;

    weatherDebug("5. Parsed weather", {
      temp,
      code,
      text: getWeatherText(code),
      icon: getWeatherIcon(code)
    });

    const weatherTemp = document.getElementById("weatherTemp");
    const weatherDesc = document.getElementById("weatherDesc");

    if(weatherTemp){
      weatherTemp.innerText = `${temp}°C`;
      weatherDebug("6. Updated weatherTemp");
    }else{
      weatherDebug("6. weatherTemp element NOT found");
    }

    if(weatherDesc){
      weatherDesc.innerText = `${getWeatherIcon(code)} ${getWeatherText(code)}`;
      weatherDebug("7. Updated weatherDesc");
    }else{
      weatherDebug("7. weatherDesc element NOT found");
    }

    currentWeatherTemp = temp;
    currentWeatherCode = code;

    weatherDebug("8. Saved weather state", {
      currentWeatherTemp,
      currentWeatherCode
    });

    updateEcoTip();

  }catch(error){
    weatherError("fetchWeather failed", error);
    setWeatherFallback("โหลดสภาพอากาศไม่สำเร็จ");

  }finally{
    console.groupEnd();
  }
}

async function fetchAirQuality(lat, lon){
  console.group("🍃 fetchAirQuality");

  try{
    weatherDebug("1. Start fetchAirQuality", { lat, lon });

    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

    weatherDebug("2. AQI API URL", url);

    const response = await fetch(url);

    weatherDebug("3. AQI API response", {
      ok: response.ok,
      status: response.status
    });

    if(!response.ok){
      throw new Error(`AQI API error: ${response.status}`);
    }

    const data = await response.json();

    weatherDebug("4. AQI API data", data);

    if(!data.current || typeof data.current.us_aqi === "undefined"){
      throw new Error("us_aqi not found");
    }

    const aqi = Math.round(data.current.us_aqi);

    weatherDebug("5. Parsed AQI", {
      aqi,
      level: getAQILevel(aqi),
      text: getAQIText(aqi)
    });

    const aqiValue = document.getElementById("aqiValue");
    const aqiLevel = document.getElementById("aqiLevel");
    const aqiDesc = document.getElementById("aqiDesc");

    if(aqiValue){
      aqiValue.innerText = aqi;
      weatherDebug("6. Updated aqiValue");
    }else{
      weatherDebug("6. aqiValue element NOT found");
    }

    if(aqiLevel){
      aqiLevel.innerText = getAQILevel(aqi);
      weatherDebug("7. Updated aqiLevel");
    }else{
      weatherDebug("7. aqiLevel element NOT found");
    }

    if(aqiDesc){
      aqiDesc.innerText = getAQIText(aqi);
      weatherDebug("8. Updated aqiDesc");
    }else{
      weatherDebug("8. aqiDesc element NOT found");
    }

    updateAQIStyle(aqi);

    currentAQI = aqi;

    weatherDebug("9. Saved AQI state", {
      currentAQI
    });

    updateEcoTip();

  }catch(error){
    weatherError("fetchAirQuality failed", error);

    const aqiValue = document.getElementById("aqiValue");
    const aqiLevel = document.getElementById("aqiLevel");
    const aqiDesc = document.getElementById("aqiDesc");

    if(aqiValue) aqiValue.innerText = "--";
    if(aqiLevel) aqiLevel.innerText = "ไม่สำเร็จ";
    if(aqiDesc) aqiDesc.innerText = "โหลด AQI ไม่สำเร็จ";

  }finally{
    console.groupEnd();
  }
}

function getWeatherText(code){
  const map = {
    0:"Clear Sky",
    1:"Mostly Sunny",
    2:"Partly Cloudy",
    3:"Cloudy",
    45:"Fog",
    48:"Fog",
    51:"Light Drizzle",
    53:"Drizzle",
    55:"Heavy Drizzle",
    61:"Light Rain",
    63:"Rain",
    65:"Heavy Rain",
    80:"Rain Shower",
    81:"Rain Shower",
    82:"Heavy Shower",
    95:"Thunderstorm"
  };

  return map[code] || "Weather";
}

function getWeatherIcon(code){
  if(code === 0) return "☀️";
  if([1,2].includes(code)) return "🌤️";
  if(code === 3) return "☁️";
  if([45,48].includes(code)) return "🌫️";
  if([51,53,55,61,63,65,80,81,82].includes(code)) return "🌧️";
  if(code === 95) return "⛈️";
  return "🌤️";
}

function setWeatherFallback(message){
  weatherDebug("setWeatherFallback", message);

  const weatherTemp = document.getElementById("weatherTemp");
  const weatherDesc = document.getElementById("weatherDesc");
  const locationEl = document.getElementById("weatherLocation");

  if(weatherTemp){
    weatherTemp.innerText = "--°C";
  }

  if(weatherDesc){
    weatherDesc.innerText = message;
  }

  if(locationEl){
    locationEl.innerText = currentLocationName || "ไม่ทราบตำแหน่ง";
  }
}

function getAQILevel(aqi){
  if(aqi <= 50) return "ดี";
  if(aqi <= 100) return "ปานกลาง";
  if(aqi <= 150) return "เริ่มมีผลต่อกลุ่มเสี่ยง";
  if(aqi <= 200) return "ไม่ดี";
  if(aqi <= 300) return "แย่มาก";
  return "อันตราย";
}

function getAQIText(aqi){
  if(aqi <= 50) return "อากาศดี เหมาะกับกิจกรรมกลางแจ้ง";
  if(aqi <= 100) return "ยังทำกิจกรรมได้ตามปกติ";
  if(aqi <= 150) return "กลุ่มเสี่ยงควรลดกิจกรรมกลางแจ้ง";
  if(aqi <= 200) return "ควรลดกิจกรรมกลางแจ้ง";
  if(aqi <= 300) return "ควรเลี่ยงกิจกรรมนอกอาคาร";
  return "ควรอยู่ในอาคารและสวมหน้ากาก";
}

function updateAQIStyle(aqi){
  weatherDebug("updateAQIStyle", aqi);

  const badge = document.getElementById("aqiLevel");

  if(!badge){
    weatherDebug("aqiLevel badge NOT found");
    return;
  }

  if(aqi <= 50){
    badge.style.background = "#DFFFEA";
    badge.style.color = "#12814F";
  }else if(aqi <= 100){
    badge.style.background = "#FFE680";
    badge.style.color = "#6A4B00";
  }else if(aqi <= 150){
    badge.style.background = "#FFD6A5";
    badge.style.color = "#9A4B00";
  }else{
    badge.style.background = "#FFE1E1";
    badge.style.color = "#B32626";
  }
}

function getRandomEcoTip(temp, weatherCode, aqi){
  let group = "cloudy";

  if(aqi && aqi > 100){
    group = "badAir";
  }else if([51,53,55,61,63,65,80,81,82,95].includes(weatherCode)){
    group = "rainy";
  }else if(temp <= 24){
    group = "cool";
  }else if(temp >= 34){
    group = "hot";
  }

  weatherDebug("Eco tip group selected", {
    temp,
    weatherCode,
    aqi,
    group
  });

  const tips = ecoTips[group];

  if(!tips || tips.length === 0){
    weatherDebug("Eco tip group missing, fallback to cloudy");
    return ecoTips.cloudy[0];
  }

  const selectedTip = tips[Math.floor(Math.random() * tips.length)];

  weatherDebug("Eco tip selected", selectedTip);

  return selectedTip;
}

function updateEcoTip(){
  weatherDebug("updateEcoTip called", {
    currentWeatherTemp,
    currentWeatherCode,
    currentAQI
  });

  if(currentWeatherTemp === null || currentWeatherCode === null){
    weatherDebug("Eco tip skipped: weather data not ready");
    return;
  }

  const tip = getRandomEcoTip(
    currentWeatherTemp,
    currentWeatherCode,
    currentAQI
  );

  const ecoTip = document.getElementById("weatherEcoTip");

  if(ecoTip){
    ecoTip.innerText = tip;
    weatherDebug("Eco tip updated on UI");
  }else{
    weatherDebug("weatherEcoTip element NOT found");
  }
}

function loadWeatherDefault(){
  const defaultLat = 13.8106;
  const defaultLon = 100.5060;

  currentLat = defaultLat;
  currentLon = defaultLon;
  currentLocationName = "กฟผ. สำนักงานใหญ่ บางกรวย";

  const locationEl = document.getElementById("weatherLocation");

  if(locationEl){
    locationEl.innerText = currentLocationName;
  }

  fetchWeather(defaultLat, defaultLon);
  fetchAirQuality(defaultLat, defaultLon);
}