import React, { useEffect, useRef, useCallback } from 'react';
import { PlantInfo } from '../types/PlantInfo';

/**
 * Component that fetches data from the server and calls the `onDataFetched` callback
 */
interface DataProviderProps {
  onDataFetched: (infos: PlantInfo[]) => void;
  pollInterval?: number;
}

const DataProviderComponent: React.FC<DataProviderProps> = ({
  onDataFetched,
  pollInterval = 10000
}) => {
  const lastFetchTime = useRef<string | null>(null);

  const fetchLatestData = useCallback(async () => {
    try {
      const url = new URL('http://localhost:5500/infos');
      if (lastFetchTime.current) {
        url.searchParams.set('since', lastFetchTime.current);
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch data');

      const data: PlantInfo[] = await response.json();
      if (data.length > 0) {
        lastFetchTime.current = data[data.length - 1].time;
        onDataFetched(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [onDataFetched]);

  useEffect(() => {
    fetchLatestData();
    const intervalId = setInterval(fetchLatestData, pollInterval);
    return () => clearInterval(intervalId);
  }, [fetchLatestData, pollInterval]);

  return null;
};

export default DataProviderComponent;