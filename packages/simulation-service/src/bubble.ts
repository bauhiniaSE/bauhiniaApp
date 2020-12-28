import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class Bubble {
  public topBubble: Bubble;
  public northBubble: Bubble;
  public eastBubble: Bubble;

  public temperature: number = Weather.ambientTemp;

  public getVolume(): number {
    return Parameters.bubbleGrain * Parameters.bubbleGrain * Parameters.altitudeLimit;
  }
}
