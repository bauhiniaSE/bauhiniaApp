import { IMap } from 'bauhinia-api/map';

import { Direction } from './direction';

export interface ISimulationService {
  simulateFromScratch(map: IMap, sunDirection: Direction, sunlightAngle: number): void;
  getTemperature(x: number, y: number, altitude?: number): number;
}
