import { MockMap } from './mockmap';

export interface ISimulationService {
  simulateFromScratch(map: MockMap): void;
  simulateFromCache(map: MockMap): void;

  getTemperature(x: number, y: number, altitude?: number): number;
}
