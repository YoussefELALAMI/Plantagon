import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface Info {
  time: string; // Date au format ISO 8601
  temp: number; // Température en °C
  hygro: number; // Humidité en %
  lum: number; // Luminosité en lux
}

interface ChartComponentProps {
  infos: Info[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ infos }) => {
  // Préparer les données pour chaque courbe
  const temperatureData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.temp,
  }));

  const humidityData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.hygro,
  }));

  const luminosityData = infos.map((info) => ({
    x: new Date(info.time),
    y: info.lum,
  }));

  // Options de configuration pour le graphique
  const options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Graphique Température, Humidité et Luminosité",
    },
    axisX: {
      title: "Temps",
      valueFormatString: "DD MMM HH:mm",
    },
    axisY: {
      title: "Valeur",
      includeZero: false,
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      horizontalAlign: "center",
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "Température (°C)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## °C",
        dataPoints: temperatureData,
      },
      {
        type: "line",
        showInLegend: true,
        name: "Humidité (%)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## %",
        dataPoints: humidityData,
      },
      {
        type: "line",
        showInLegend: true,
        name: "Luminosité (lux)",
        xValueFormatString: "DD MMM HH:mm",
        yValueFormatString: "#,##0.## lux",
        dataPoints: luminosityData,
      },
    ],
  };

  return <CanvasJSChart options={options} />;
};

export default ChartComponent;
