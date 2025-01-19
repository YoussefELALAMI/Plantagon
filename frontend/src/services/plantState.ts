import { PlantInfo } from "../types/PlantInfo";
import { Plant } from "../types/Plant";

// Utility function to calculate plant states
const getPlantState = (plantInfo: PlantInfo, selectedPlant: Plant) => {
  let waterState = "";
  let lightState = "";
  let tempState = "";
  let humState = "";

  const min_hygro = selectedPlant?.reference_humidite - 20;
  const max_hygro = selectedPlant?.reference_humidite + 20;
  const min_lum = selectedPlant?.reference_luminosite - 500;
  const max_lum = selectedPlant?.reference_luminosite + 500;
  const min_temp = selectedPlant?.reference_temperature - 4;
  const max_temp = selectedPlant?.reference_temperature + 4;
  const min_hum = selectedPlant?.reference_humidite_sol - 10;
  const max_hum = selectedPlant?.reference_humidite_sol + 10;

  // Water states
  if (plantInfo.hygro < min_hygro) {
    waterState = "Dry";
  } else if (plantInfo.hygro >= min_hygro && plantInfo.hygro <= max_hygro) {
    waterState = "Optimal";
  } else {
    waterState = "Wet";
  }

  // Light states
  if (plantInfo.lum < min_lum) {
    lightState = "Dark";
  } else if (plantInfo.lum >= min_lum && plantInfo.lum <= max_lum) {
    lightState = "Optimal";
  } else {
    lightState = "Light";
  }

  // Temperature states
  if (plantInfo.temp < min_temp) {
    tempState = "Cold";
  } else if (plantInfo.temp >= min_temp && plantInfo.temp <= max_temp) {
    tempState = "Optimal";
  } else {
    tempState = "Hot";
  }

  // Humidity states
  if (plantInfo.hum < min_hum) {
    humState = "Dry";
  } else if (plantInfo.hum >= min_hum && plantInfo.hum <= max_hum) {
    humState = "Optimal";
  } else {
    humState = "Wet";
  }

  return {
    waterState,
    lightState,
    tempState,
    humState,
  };
};

export default getPlantState;
