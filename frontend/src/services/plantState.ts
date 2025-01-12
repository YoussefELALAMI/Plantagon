import { PlantInfo } from '../types/PlantInfo';

export const plantState = (plantInfo: PlantInfo) => {

    const { time, temp, hygro, lum } = plantInfo;
    let waterState = '';
    let lightState = '';
    let tempState = '';

    // Water states
    if (hygro < 60) {
        waterState = 'Dry';
    } else if (hygro >= 60 && hygro <= 80) {
        waterState = 'Optimal';
    } else {
        waterState = 'Wet';
    }

    // Light states
    if (lum < 500) {
        lightState = 'Dark';
    } else if (lum >= 500 && lum <= 1500) {
        lightState = 'Optimal';
    } else {
        lightState = 'Light';
    }

    // Temperature states
    if (temp < 20) {
        tempState = 'Cold';
    } else if (temp >= 20 && temp <= 28) {
        tempState = 'Optimal';
    } else {
        tempState = 'Hot';
    }

    return {
        waterState,
        lightState,
        tempState
    };
}