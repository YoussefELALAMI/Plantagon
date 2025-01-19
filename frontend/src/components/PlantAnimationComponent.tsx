import { PlantInfo } from "../types/PlantInfo";
import { plantState } from "../services/plantState";

interface PlantAnimationComponentProps {
  plantInfo: PlantInfo;
}

const getAnimationUrl = (
  waterState: string,
  lightState: string,
  tempState: string
) => {
  if (
    waterState === "Optimal" &&
    lightState === "Optimal" &&
    tempState === "Optimal"
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

const PlantAnimationComponent: React.FC<PlantAnimationComponentProps> = ({
  plantInfo,
}) => {
  const { waterState, lightState, tempState } = plantState(plantInfo);

  return (
    <iframe
      src={getAnimationUrl(waterState, lightState, tempState)}
      title="Plant Animation"
    />
  );
};

export default PlantAnimationComponent;
