import type { WeatherCondition } from "@/types/weather";

export type WeatherMood =
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "rain"
  | "drizzle"
  | "thunderstorm"
  | "snow"
  | "mist"
  | "hot"
  | "cold";

export const resolveMood = (
  condition?: WeatherCondition,
  temp?: number,
  isNight?: boolean
): WeatherMood => {
  if (!condition) return "clear-day";
  const main = condition.main.toLowerCase();
  if (main === "clear") return isNight ? "clear-night" : "clear-day";
  if (main === "clouds") return "clouds";
  if (main === "rain") return "rain";
  if (main === "drizzle") return "drizzle";
  if (main === "thunderstorm") return "thunderstorm";
  if (main === "snow") return "snow";
  if (["mist", "fog", "haze", "smoke", "dust", "sand", "ash"].includes(main))
    return "mist";
  if (temp !== undefined && temp >= 32) return "hot";
  if (temp !== undefined && temp <= 0) return "cold";
  return "clouds";
};

// Tailored gradient pairs per mood — soft, readable, and vibrant.
export const moodGradient = (mood: WeatherMood): { from: string; to: string; angle: number } => {
  switch (mood) {
    case "clear-day":
      return { from: "#4FACFE", to: "#00F2FE", angle: 135 };
    case "clear-night":
      return { from: "#0F2027", to: "#2C5364", angle: 135 };
    case "clouds":
      return { from: "#5D737E", to: "#8FA3AD", angle: 135 };
    case "rain":
      return { from: "#314755", to: "#26A0DA", angle: 135 };
    case "drizzle":
      return { from: "#3E5151", to: "#DECBA4", angle: 135 };
    case "thunderstorm":
      return { from: "#200122", to: "#6F0000", angle: 135 };
    case "snow":
      return { from: "#83A4D4", to: "#B6FBFF", angle: 135 };
    case "mist":
      return { from: "#606C88", to: "#3F4C6B", angle: 135 };
    case "hot":
      return { from: "#F09819", to: "#FF5858", angle: 135 };
    case "cold":
      return { from: "#4B79A1", to: "#283E51", angle: 135 };
  }
};

export const moodAccent = (mood: WeatherMood) => {
  switch (mood) {
    case "clear-day":
      return "cyan";
    case "clear-night":
      return "indigo";
    case "clouds":
      return "gray";
    case "rain":
      return "blue";
    case "drizzle":
      return "teal";
    case "thunderstorm":
      return "violet";
    case "snow":
      return "blue";
    case "mist":
      return "gray";
    case "hot":
      return "orange";
    case "cold":
      return "blue";
  }
};

export const iconUrl = (code: string, size: 2 | 4 = 4) =>
  `https://openweathermap.org/img/wn/${code}@${size}x.png`;

// Air Quality Index label + color
export const aqiLabel: Record<number, { label: string; color: string; description: string }> = {
  1: {
    label: "Good",
    color: "teal",
    description: "Air quality is considered satisfactory, with little to no risk."
  },
  2: {
    label: "Fair",
    color: "lime",
    description: "Air quality is acceptable; may slightly affect sensitive people."
  },
  3: {
    label: "Moderate",
    color: "yellow",
    description: "Members of sensitive groups may experience health effects."
  },
  4: {
    label: "Poor",
    color: "orange",
    description: "Everyone may begin to experience health effects."
  },
  5: {
    label: "Very Poor",
    color: "red",
    description: "Health warnings of emergency conditions; serious effects likely."
  }
};
