import React from "react";
import InfosComponent from "../components/InfosComponent";

const Stats: React.FC = () => {
  return (
    <div className="flex col items-center">
      <h1>Statistiques</h1>
      <InfosComponent />
    </div>
  );
};

export default Stats;
