import React, { useMemo } from 'react';
import { usePlantData } from '../hooks/usePlantData';
import DataProviderComponent from '../components/DataProviderComponent';
import { PlantInfo } from '../types/PlantInfo';

const Plante: React.FC = () => {
  const { recentData, updateData } = usePlantData(100);

  const { wateringStatus, percentage } = useMemo(() => {
    if (recentData.length === 0) {
      return { wateringStatus: '', percentage: 0 };
    }

    const lastData = recentData[recentData.length - 1];
    const hygro = lastData.hygro;

    return {
      wateringStatus: hygro < 50 ? "Water me please!" : "I'm good, thanks!",
      percentage: hygro < 50 ? 100 - hygro : hygro
    };
  }, [recentData]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="plante-container">
      <h1>Ma Plante</h1>
      <p>L'état courant de l'eau : {wateringStatus}</p>
      <p>Le taux d'humidité : {percentage}%</p>
      
      <div className="data-container">
        <h2>Recent Readings</h2>
        <div className="readings-list">
          {recentData.slice(-10).map((data: any) => (
            <div key={data.id} className="reading-item">
              <span>{formatTime(data.time)}</span>
              <span>Temp: {data.temp}°C</span>
              <span>Hygro: {data.hygro}%</span>
              <span>Lum: {data.lum}%</span>
            </div>
          ))}
        </div>
      </div>

      <DataProviderComponent 
        onDataFetched={updateData}
        pollInterval={5000}
      />
    </div>
  );
};

export default Plante;
