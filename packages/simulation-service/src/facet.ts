import { Bubble } from './bubble';
import { Direction } from './direction';
import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

//import { Bubble } from './bubble';

export class Facet {
  public borderingBubble: Bubble;
  public temperature: number = 0;
  public shadowed: boolean = false;

  public lowerHalf: Facet;
  public upperHalf: Facet;
  public howToCrop: HowToCrop;

  constructor(
    public x: number,
    public y: number,
    public height: number,
    public width: number,
    public readonly direction: Direction,
    public bottom: number = 0,
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
        this.cropWallByX(cutValue);
        break;
      case HowToCrop.BY_Y:
        this.cropWallByY(cutValue);
        break;
      case HowToCrop.BY_ALTITUDE:
        this.cropByAltitude(cutValue);
        break;
      case HowToCrop.ROOFY_BY_X:
        this.cropRoofByX(cutValue);
        break;
      case HowToCrop.ROOFY_BY_Y:
        this.cropRoofByY(cutValue);
        break;
    }
  }

  private cropWallByX(cutX: number): void {
    this.lowerHalf = this.clone();
    this.lowerHalf.width = cutX - this.x;

    this.upperHalf = this.clone();
    this.upperHalf.x = cutX;
    this.upperHalf.width = this.x + this.width - cutX;
    if (this.lowerHalf.width > Parameters.careLimit) this.upperHalf.x += Parameters.careLimit / 2;
    if (this.upperHalf.width > Parameters.careLimit) this.lowerHalf.width -= Parameters.careLimit / 2;
  }

  private cropWallByY(cutY: number): void {
    this.lowerHalf = this.clone();
    this.lowerHalf.width = cutY - this.y;

    this.upperHalf = this.clone();
    this.upperHalf.y = cutY;
    this.upperHalf.width = this.y + this.width - cutY;
    if (this.lowerHalf.width > Parameters.careLimit) this.upperHalf.y += Parameters.careLimit / 2;
    if (this.upperHalf.width > Parameters.careLimit) this.lowerHalf.width -= Parameters.careLimit / 2;
  }

  private cropRoofByX(cutX: number): void {
    this.lowerHalf = this.clone();
    this.lowerHalf.width = cutX - this.x;

    this.upperHalf = this.clone();
    this.upperHalf.x = cutX;
    this.upperHalf.width = this.x + this.width - cutX;

    if (this.lowerHalf.width < Parameters.careLimit) this.upperHalf.x += Parameters.careLimit;
    if (this.upperHalf.width < Parameters.careLimit) this.lowerHalf.width -= Parameters.careLimit;
  }

  private cropRoofByY(cutY: number): void {
    this.lowerHalf = this.clone();
    this.lowerHalf.height = cutY - this.y;

    this.upperHalf = this.clone();
    this.upperHalf.y = cutY;
    this.upperHalf.height = this.y + this.height - cutY;

    if (this.lowerHalf.height < Parameters.careLimit) this.upperHalf.y += Parameters.careLimit / 2;
    if (this.upperHalf.height < Parameters.careLimit) this.lowerHalf.height -= Parameters.careLimit / 2;
  }

  private cropByAltitude(cutAltitude: number): void {
    this.lowerHalf = this.clone();
    this.lowerHalf.height = cutAltitude - this.bottom;
    this.lowerHalf.shadowed = true;

    this.upperHalf = this.clone();
    this.upperHalf.height = this.height + this.bottom - cutAltitude;
    this.upperHalf.bottom = cutAltitude;

    if (this.lowerHalf.height > Parameters.careLimit) this.upperHalf.bottom += Parameters.careLimit / 2;
    if (this.upperHalf.height > Parameters.careLimit) this.lowerHalf.height -= Parameters.careLimit / 2;
  }
}

export enum HowToCrop {
  BY_X,
  BY_Y,
  BY_ALTITUDE,
  ROOFY_BY_X,
  ROOFY_BY_Y,
}
