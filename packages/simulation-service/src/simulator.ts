import { ISimulationService } from '../isimulation';

export class simulator implements ISimulationService {
  public simulateFromScratch(): void {
    throw new Error('Method not implemented.');
  }
  public simulateFromCache(): void {
    throw new Error('Method not implemented.');
  }
  public getTemperature(x: number, y: number, altitude?: number): number {
    throw new Error('Method not implemented.');
  }
}
