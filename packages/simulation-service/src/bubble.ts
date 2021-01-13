import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class Bubble {
  public topBubble: Bubble;
  public southBubble: Bubble;
  public westBubble: Bubble;

  public temperature: number = Weather.ambientTemp;
  public newTemperature: number;
  public tempTemperature: number;

  public x: number;
  public y: number;

  public getVolume(): number {
    return Parameters.bubbleGrain * Parameters.bubbleGrain * Parameters.altitudeLimit;
  }

  public transferHeat(): void {
    if (this.southBubble !== undefined) {
      this.transferHeatTo(this.southBubble);
    }
    if (this.westBubble !== undefined) {
      this.transferHeatTo(this.westBubble);
    }
  }

  public prepareToTransfer(): void {
    this.newTemperature = this.temperature;
  }

  public finaliseTheTransfer(): void {
    this.newTemperature = Math.round(this.newTemperature * 100) / 100;
    this.temperature = this.newTemperature;
  }

  public transferHeatTo(neighbour: Bubble): void {
    const nominalTemperatureChange =
      ((this.temperature - neighbour.temperature) * Weather.airDiffusivity) /
      Math.pow(Parameters.bubbleGrain, 2) /
      Parameters.transferGrainFrequency;
    const temperatureChange = nominalTemperatureChange / 4;

    this.newTemperature -= temperatureChange;
    neighbour.newTemperature += temperatureChange;
  }
}
