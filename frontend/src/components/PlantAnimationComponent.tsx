import React from "react";
import { PlantInfo } from "../types/PlantInfo";
import getPlantState from "../services/plantState";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlantContext } from "../context/PlantContext";

interface PlantAnimationComponentProps {
  plantInfo: PlantInfo;
}

const PlantAnimationComponent: React.FC<PlantAnimationComponentProps> = ({
  plantInfo,
}) => {
  const navigate = useNavigate();
  const context = useContext(PlantContext);

  if (!context) {
    throw new Error("PlantContext must be used within a PlantProvider");
  }

  const { selectedPlant } = context;

  // Handle the case where selectedPlant might be null
  if (!selectedPlant) {
    return (
      <div>
        <p>Please select a plant to view its status.</p>
      </div>
    );
  }

  const { waterState, lightState, tempState, humState } = getPlantState(
    plantInfo,
    selectedPlant
  );

  const getAnimationUrl = (
    waterState: string,
    lightState: string,
    tempState: string,
    humState: string
  ) => {
    if (
      waterState === "Optimal" &&
      lightState === "Optimal" &&
      tempState === "Optimal" &&
      humState === "Optimal"
    ) {
      return "https://lottie.host/embed/c8ae391a-ec7c-4526-abc7-58964e47861e/bpGZ0FRslz.lottie";
    } else if (
      waterState === "Dry" ||
      lightState === "Dark" ||
      tempState === "Cold" ||
      tempState === "Hot"
    ) {
      return "https://lottie.host/embed/38a2e6de-1644-4821-b485-530f26c6fbad/yBTr2jmO91.lottie";
    } else if (waterState === "Wet") {
      return "https://lottie.host/embed/9c1b7598-b033-496f-9b59-f9a607e2ff93/9qtQYd60IJ.lottie";
    } else {
      return "https://lottie.host/embed/3188712c-c61c-41a2-8f98-9383673a04a1/dbsqz3mRVg.lottie";
    }
  };

  return (
    <iframe
      src={getAnimationUrl(waterState, lightState, tempState, humState)}
      title="Plant Animation"
      style={{ border: "none", width: "100%", height: "300px" }}
    />
  );
};

export default PlantAnimationComponent;
