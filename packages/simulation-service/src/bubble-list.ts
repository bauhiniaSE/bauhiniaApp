import { Bubble } from './bubble';
import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class BubbleList {
  public bubbles: Bubble[] = [];

  public horizontalHeatTransfer(): void {
    for (let i = 0; i < Parameters.transferGrainFrequency; i++) {
      this.bubbles.forEach((bubble) => {
        bubble.prepareToTransfer();
      });

      this.bubbles.forEach((bubble) => {
        bubble.transferHeat();
      });

      this.bubbles.forEach((bubble) => {
        bubble.finaliseTheTransfer();
      });
    }
  }
  public findTemperatureAt(x: number, y: number) {
    let result: number = Weather.ambientTemp;
    this.bubbles.forEach((bubble) => {
      if (
        bubble.x <= x &&
        bubble.x + Parameters.bubbleGrain > x &&
        bubble.y <= y &&
        bubble.y + Parameters.bubbleGrain > y
      ) {
        result = bubble.temperature;
      }
    });
    return result;
  }
}
