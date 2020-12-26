import { Weather } from './weather-constants';

export class Bubble {
  public readonly width: number;
  public readonly height: number;
  public readonly length: number;

  public topBubble: Bubble;
  public northBubble: Bubble;
  public eastBubble: Bubble;

  public temperature: number = Weather.ambientTemp;

  constructor(width: number, height: number, length: number) {
    this.height = height;
    this.width = width;
    this.length = length;
  }

  public getVolume(): number {
    return this.width * this.length * this.height;
  }
}
