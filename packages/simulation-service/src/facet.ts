import { Bubble } from './bubble';
import { Direction } from './direction';
import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

//import { Bubble } from './bubble';

export class Facet {
  public borderingBubble: Bubble;
  public temperature: number = 0;
  public shadowed: boolean = false;
  public duplicated: boolean = false;

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
    public height: number,
    public width: number,
    public readonly direction: Direction,
    public bottom: number = 0,
    public name: string = 'not named',
    public albedo: number = 0.2,
    public evapot: boolean = false,
    public density: number = 3150,
    public specificHeat: number = 700
  ) {}

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
    if (heatFlux > 0) {
      resultTemp +=
        (heatFlux * this.width * this.height * 3600 * 6) /
        (Weather.airDensity * this.borderingBubble.getVolume() * Weather.airSpecificHeat);

      if (resultTemp > this.temperature) {
        this.borderingBubble.temperature = this.temperature;
      } else {
        this.borderingBubble.temperature = resultTemp;
      }
    } else {
      resultTemp -= heatFlux / (this.density * this.specificHeat * Parameters.heatPenetrationDepth);
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
    if (wall.lowerHalf.width > Parameters.careLimit) wall.upperHalf.x += Parameters.careLimit / 2;
    if (wall.upperHalf.width > Parameters.careLimit) wall.lowerHalf.width -= Parameters.careLimit / 2;
    /*toSunWalls.push(wall.lowerHalf);
    toSunWalls.push(wall.upperHalf);*/
  }

  private cropWallByY(wall: Facet, cutY: number): void {
    wall.lowerHalf = wall.clone();
    wall.lowerHalf.width = cutY - wall.y;

    wall.upperHalf = wall.clone();
    wall.upperHalf.y = cutY;
    wall.upperHalf.width = wall.y + wall.width - cutY;
    if (wall.lowerHalf.width > Parameters.careLimit) wall.upperHalf.y += Parameters.careLimit / 2;
    if (wall.upperHalf.width > Parameters.careLimit) wall.lowerHalf.width -= Parameters.careLimit / 2;
    /*toSunWalls.push(wall.lowerHalf);
    toSunWalls.push(wall.upperHalf);*/
  }

  private cropRoofByX(roof: Facet, cutX: number): void {
    roof.lowerHalf = roof.clone();
    roof.lowerHalf.width = cutX - roof.x;

    roof.upperHalf = roof.clone();
    roof.upperHalf.x = cutX;
    roof.upperHalf.width = roof.x + roof.width - cutX;

    if (roof.lowerHalf.width < Parameters.careLimit) roof.upperHalf.x += Parameters.careLimit;
    if (roof.upperHalf.width < Parameters.careLimit) roof.lowerHalf.width -= Parameters.careLimit;

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

    if (roof.lowerHalf.height < Parameters.careLimit) roof.upperHalf.y += Parameters.careLimit / 2;
    if (roof.upperHalf.height < Parameters.careLimit) roof.lowerHalf.height -= Parameters.careLimit / 2;

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

    if (wall.lowerHalf.height > Parameters.careLimit) wall.upperHalf.bottom += Parameters.careLimit / 2;
    if (wall.upperHalf.height > Parameters.careLimit) wall.lowerHalf.height -= Parameters.careLimit / 2;
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
