import { PlantInfo } from "../types/PlantInfo";

export const plantState = (plantInfo: PlantInfo) => {
  let waterState = "";
  let lightState = "";
  let tempState = "";
  let humState = "";

  // Water states
  if (plantInfo.hygro < 60) {
    waterState = "Dry";
  } else if (plantInfo.hygro >= 60 && plantInfo.hygro <= 80) {
    waterState = "Optimal";
  } else {
    waterState = "Wet";
  }

  // Light states
  if (plantInfo.lum < 500) {
    lightState = "Dark";
  } else if (plantInfo.lum >= 500 && plantInfo.lum <= 1500) {
    lightState = "Optimal";
  } else {
    lightState = "Light";
  }

  // Temperature states
  if (plantInfo.temp < 20) {
    tempState = "Cold";
  } else if (plantInfo.temp >= 20 && plantInfo.temp <= 28) {
    tempState = "Optimal";
  } else {
    tempState = "Hot";
  }

  // Humidity states
  if (plantInfo.hum < 40) {
    humState = "Dry";
  } else if (plantInfo.hum >= 40 && plantInfo.hum <= 60) {
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
