import { IMap } from 'bauhinia-api/map';

export interface ISimulationService {
  simulateFromScratch(map: IMap): void;
  simulateFromCache(map: IMap): void;

  getTemperature(x: number, y: number, altitude?: number): number;
}
