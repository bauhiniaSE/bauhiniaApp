import { Bubble } from './bubble';
import { Direction } from './direction';
import { Weather } from './weather-constants';

//import { Bubble } from './bubble';

export class Facet {
  public borderingBubble: Bubble;
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

  private static readonly heatPenetrationDepth: number = 1; // [m]
  private static readonly careLimit: number = 0.0005;

  public lowerHalf: Facet;
  public upperHalf: Facet;
  public howToCrop: HowToCrop;

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

  public assignBubble(bubble: Bubble) {
    this.borderingBubble = bubble;
  }

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

  public transferHeat(): void {
    let resultTemp: number = this.borderingBubble.temperature;
    const heatFlux: number = //Jurges Formula
      (6.15 + 4.18 * Weather.windVelocity) * (this.temperature - this.borderingBubble.temperature);
    //console.log(heatFlux);
    if (heatFlux > 0) {
      resultTemp +=
        (heatFlux * this.width * this.height * 3600 * 6) /
        (Weather.airDensity * this.borderingBubble.getVolume() * Weather.airSpecificHeat);
      //console.log(heatFlux * this.width * this.height * 3600 * 6); // 6 hours of most intense sunlight
      //console.log(Weather.airDensity * this.borderingBubble.getVolume() * Weather.airSpecificHeat);

      if (resultTemp > this.temperature) {
        this.borderingBubble.temperature = this.temperature;
      } else {
        this.borderingBubble.temperature = resultTemp;
      }
    } else {
      resultTemp -= heatFlux / (this.density * this.specificHeat * Facet.heatPenetrationDepth);
    }
  }

  public crop(cutValue: number): void {
    switch (this.howToCrop) {
      case HowToCrop.BY_X:
        this.cropWallByX(this, cutValue);
        break;
      case HowToCrop.BY_Y:
        this.cropWallByY(this, cutValue);
        break;
      case HowToCrop.BY_ALTITUDE:
        this.cropByAltitude(this, cutValue);
        break;
      case HowToCrop.ROOFY_BY_X:
        this.cropRoofByX(this, cutValue);
        break;
      case HowToCrop.ROOFY_BY_Y:
        this.cropRoofByY(this, cutValue);
        break;
    }
  }

  private cropWallByX(wall: Facet, cutX: number): void {
    wall.lowerHalf = wall.clone();
    wall.lowerHalf.width = cutX - wall.x;

    wall.upperHalf = wall.clone();
    wall.upperHalf.x = cutX;
    wall.upperHalf.width = wall.x + wall.width - cutX;
    if (wall.lowerHalf.width > Facet.careLimit) wall.upperHalf.x += Facet.careLimit / 2;
    if (wall.upperHalf.width > Facet.careLimit) wall.lowerHalf.width -= Facet.careLimit / 2;
    /*toSunWalls.push(wall.lowerHalf);
    toSunWalls.push(wall.upperHalf);*/
  }

  private cropWallByY(wall: Facet, cutY: number): void {
    wall.lowerHalf = wall.clone();
    wall.lowerHalf.width = cutY - wall.y;

    wall.upperHalf = wall.clone();
    wall.upperHalf.y = cutY;
    wall.upperHalf.width = wall.y + wall.width - cutY;
    if (wall.lowerHalf.width > Facet.careLimit) wall.upperHalf.y += Facet.careLimit / 2;
    if (wall.upperHalf.width > Facet.careLimit) wall.lowerHalf.width -= Facet.careLimit / 2;
    /*toSunWalls.push(wall.lowerHalf);
    toSunWalls.push(wall.upperHalf);*/
  }

  private cropRoofByX(roof: Facet, cutX: number): void {
    roof.lowerHalf = roof.clone();
    roof.lowerHalf.width = cutX - roof.x;

    roof.upperHalf = roof.clone();
    roof.upperHalf.x = cutX;
    roof.upperHalf.width = roof.x + roof.width - cutX;

    if (roof.lowerHalf.width < Facet.careLimit) roof.upperHalf.x += Facet.careLimit;
    if (roof.upperHalf.width < Facet.careLimit) roof.lowerHalf.width -= Facet.careLimit;

    /*if (whereToShade === undefined) {
      if (roof.lowerHalf.width > Facet.careLimit) roof.upperHalf.x += Facet.careLimit / 2;
      if (roof.upperHalf.width > Facet.careLimit) roof.lowerHalf.width -= Facet.careLimit / 2;
      /*toSunWalls.push(roof.lowerHalf);
      toSunWalls.push(roof.upperHalf);
    }

    if (whereToShade === FourByFour.LOWER) {
      roof.lowerHalf.shadowed = true;
      /*vertCropped.push(roof.upperHalf);
      result.push(roof.lowerHalf);
    }

    if (whereToShade === FourByFour.UPPER) {
      roof.upperHalf.shadowed = true;
      if (roof.upperHalf.width < Facet.careLimit) roof.lowerHalf.width -= Facet.careLimit / 2;
      if (roof.lowerHalf.width < Facet.careLimit) roof.upperHalf.x += Facet.careLimit / 2;
      /*vertCropped.push(roof.lowerHalf);
      result.push(roof.upperHalf);
    }*/
  }

  private cropRoofByY(roof: Facet, cutY: number): void {
    roof.lowerHalf = roof.clone();
    roof.lowerHalf.height = cutY - roof.y;

    roof.upperHalf = roof.clone();
    roof.upperHalf.y = cutY;
    roof.upperHalf.height = roof.y + roof.height - cutY;

    if (roof.lowerHalf.height < Facet.careLimit) roof.upperHalf.y += Facet.careLimit / 2;
    if (roof.upperHalf.height < Facet.careLimit) roof.lowerHalf.height -= Facet.careLimit / 2;

    /*if (whereToShade === undefined) {      
      toSunWalls.push(roof.lowerHalf);
      toSunWalls.push(roof.upperHalf);
    }

    if (whereToShade === FourByFour.LOWER) {
      roof.lowerHalf.shadowed = true;
      result.push(roof.lowerHalf);
      vertCropped.push(roof.upperHalf);
    }

    if (whereToShade === FourByFour.UPPER) {
      roof.upperHalf.shadowed = true;
      vertCropped.push(roof.lowerHalf);
      result.push(roof.upperHalf);
    }*/
  }

  private cropByAltitude(wall: Facet, cutAltitude: number): void {
    wall.lowerHalf = wall.clone();
    wall.lowerHalf.height = cutAltitude - wall.bottom;
    wall.lowerHalf.shadowed = true;

    wall.upperHalf = wall.clone();
    wall.upperHalf.height = wall.height + wall.bottom - cutAltitude;
    wall.upperHalf.bottom = cutAltitude;

    if (wall.lowerHalf.height > Facet.careLimit) wall.upperHalf.bottom += Facet.careLimit / 2;
    if (wall.upperHalf.height > Facet.careLimit) wall.lowerHalf.height -= Facet.careLimit / 2;
    /*result.push(wall.lowerHalf);
    vertCropped.push(wall.upperHalf);*/
  }
}

export enum HowToCrop {
  BY_X,
  BY_Y,
  BY_ALTITUDE,
  ROOFY_BY_X,
  ROOFY_BY_Y,
}
