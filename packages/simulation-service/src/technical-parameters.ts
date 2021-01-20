import { Weather } from './weather-constants';

export class Parameters {
  public static readonly heatPenetrationDepth: number = 1; // [m]
  public static readonly careLimit: number = 0.0001;
  public static readonly loopLimitFactor: number = 20;
  public static readonly bubbleGrain: number = 1;
  public static readonly altitudeLimit: number = 500;
  public static readonly transferGrainFrequency: number = 100;
  public static readonly facetStartingTemperature: number = Weather.ambientTemp;
}
