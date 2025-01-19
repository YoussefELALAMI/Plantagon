import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { PlantInfo } from "../types/PlantInfo";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartComponentProps {
  infos: PlantInfo[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ infos }) => {
  // Préparer les données pour chaque courbe
  const temperatureData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.temp,
  }));

  const hygrometryData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.hygro,
  }));

  const luminosityData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.lum,
  }));

  const humidityData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.hum,
  }));

  // Options de configuration pour le graphique
  const hygrometryOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Graphique Hygrométrie et Humidité",
    },
    axisX: {
      title: "Temps",
      valueFormatString: "DD MMM HH:mm",
    },
    axisY: {
      title: "Pourcentage (%)",
      includeZero: false,
      maximum: 100,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "Humidité (%)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## %",
        dataPoints: hygrometryData,
      },
      {
        type: "line",
        showInLegend: true,
        name: "Hygrométrie (%)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## %",
        dataPoints: humidityData,
      },
    ],
  };

  const temperatureOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Graphique Température",
    },
    axisX: {
      title: "Temps",
      valueFormatString: "DD MMM HH:mm",
    },
    axisY: {
      title: "Température (°C)",
      includeZero: false,
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        color: "red",
        name: "Température (°C)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## °C",
        dataPoints: temperatureData,
      },
    ],
  };

  const luminosityOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Graphique Luminosité",
    },
    axisX: {
      title: "Temps",
      valueFormatString: "DD MMM HH:mm",
    },
    axisY: {
      title: "Luminosité (lux)",
      includeZero: false,
    },
    data: [
      {
        type: "line",
        color: "orange",
        showInLegend: true,
        name: "Luminosité (lux)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## lux",
        dataPoints: luminosityData,
      },
    ],
  };

  return (
    <>
      <CanvasJSChart options={hygrometryOptions} />
      <CanvasJSChart options={temperatureOptions} />
      <CanvasJSChart options={luminosityOptions} />
    </>
  );
};

export default ChartComponent;
