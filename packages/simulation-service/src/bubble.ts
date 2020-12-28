import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class Bubble {
  public topBubble: Bubble;
  public southBubble: Bubble;
  public westBubble: Bubble;

  public temperature: number = Weather.ambientTemp;

  public getVolume(): number {
    return Parameters.bubbleGrain * Parameters.bubbleGrain * Parameters.altitudeLimit;
  }
}
