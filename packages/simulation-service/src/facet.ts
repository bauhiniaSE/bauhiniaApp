import { Direction } from './direction';
//import { Bubble } from './bubble';

export class Facet {
  //private borderingBubble: Bubble;
  public temperature: number = 0;
  public shadowed: boolean = false;
  public duplicated: boolean = false;
  public name: string;

  public readonly direction: Direction;
  public albedo: number;
  public evapot: boolean;
  public density: number;
  public specificHeat: number;

  public height: number;
  public width: number;

  /*public lowerBoundary: number;
  public upperBoundary: number;
  public anchor: number;
  public crop: any;*/

  constructor(
    public x: number,
    public y: number,
    height: number,
    width: number,
    direction: Direction,
    public bottom: number = 0,
    name?: string,
    albedo?: number,
    evapot?: boolean,
    density?: number,
    specificHeat?: number
  ) {
    this.height = height;
    this.width = width;
    this.direction = direction;
    this.name = name || 'not named';
    this.albedo = albedo || 0.2;
    this.evapot = evapot || false;
    this.density = density || 3150;
    this.specificHeat = specificHeat || 700;
  }

  /*public assignBubble(bubble: Bubble) {
    this.borderingBubble = bubble;
  }*/

  public getMass() {
    return this.density * this.height * this.width;
  }

  public clone(): Facet {
    return new Facet(
      this.x,
      this.y,
      this.height,
      this.width,
      this.direction,
      this.bottom,
      this.name,
      this.albedo,
      this.evapot,
      this.density,
      this.specificHeat
    );
  }
}
