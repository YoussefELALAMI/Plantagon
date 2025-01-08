import { useState, useCallback, useRef } from 'react';
import { PlantInfo } from '../types/PlantInfo';

/**
 * Provides a hook for managing plant data.
 * @param initialCount 
 * @returns 
 */

export const usePlantData = (initialCount = 100) => {
  const [recentData, setRecentData] = useState<PlantInfo[]>([]);
  const dataCountRef = useRef(initialCount);
  const idCounterRef = useRef(0);  // Counter for generating unique IDs

  const updateData = useCallback((newData: PlantInfo[]) => {
    setRecentData(current => {
      // Add unique IDs to new data
      const dataWithIds = newData.map(reading => ({
        ...reading,
        id: `reading-${Date.now()}-${idCounterRef.current++}`
      }));

      const combined = [...current, ...dataWithIds];
      // Keep only the most recent n items
      return combined.slice(-dataCountRef.current);
    });
  }, []);

  return { recentData, updateData };
};