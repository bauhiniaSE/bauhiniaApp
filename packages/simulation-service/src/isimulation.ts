export interface ISimulationService {
  simulateFromScratch(): void;
  simulateFromCache(): void;

  getTemperature(x: number, y: number, altitude?: number): number;
}
