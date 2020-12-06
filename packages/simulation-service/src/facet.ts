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
  public bottom: number;
  public x: number;
  public y: number;

  /*public lowerBoundary: number;
  public upperBoundary: number;
  public anchor: number;
  public crop: any;*/

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    direction: Direction,
    bottom?: number,
    name?: string,
    albedo?: number,
    evapot?: boolean,
    density?: number,
    specificHeat?: number
  ) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.direction = direction;
    this.bottom = bottom || 0;
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

  public getRoofyLowerXHalf(cutX: number, shade?: boolean): Facet {
    console.log('Really roofy');
    let result: Facet = this.clone();
    result.width = cutX - this.x;
    if (shade) result.shadowed = true;
    return result;
  }

  public getRoofyUpperXHalf(cutX: number, shade?: boolean): Facet {
    let result: Facet = this.clone();
    result.width = this.width + this.x - cutX;
    result.x = cutX;
    if (shade) result.shadowed = true;
    return result;
  }

  public getRoofyLowerYHalf(cutY: number, shade?: boolean): Facet {
    let result: Facet = this.clone();
    result.height = cutY - this.y;
    if (shade) result.shadowed = true;
    return result;
  }

  public getRoofyUpperYHalf(cutY: number, shade?: boolean): Facet {
    let result: Facet = this.clone();
    result.height = this.width + this.y - cutY;
    result.y = cutY;
    if (shade) result.shadowed = true;
    return result;
  }

  public getLowerXHalf(cutX: number): Facet {
    let result: Facet = this.clone();
    result.width = cutX - this.x;
    return result;
  }

  public getUpperXHalf(cutX: number): Facet {
    let result: Facet = this.clone();
    result.width = this.width + this.x - cutX;
    result.x = cutX;
    return result;
  }

  public getLowerYHalf(cutY: number): Facet {
    let result: Facet = this.clone();
    result.width = cutY - this.y;
    return result;
  }

  public getUpperYHalf(cutY: number): Facet {
    let result: Facet = this.clone();
    result.width = this.width + this.y - cutY;
    result.y = cutY;
    return result;
  }

  public getLowerZHalf(cutZ: number): Facet {
    let result: Facet = this.clone();
    result.height = cutZ - this.bottom;
    result.shadowed = true;
    return result;
  }

  public getUpperZHalf(cutZ: number): Facet {
    let result: Facet = this.clone();
    result.height = this.height + this.bottom - cutZ;
    result.bottom = cutZ;
    return result;
  }
}
