import { Bubble } from './bubble';

export class BubbleList {
  public bubbles: Bubble[] = [];

  public horizontalHeatTransfer(): void {
    for (let i = 0; i < 3; i++) {
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
}
