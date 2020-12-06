export class Shadow {
  public originHeight: number;
  public originalLength: number;
  public lowerBoundary: number;
  public upperBoundary: number;
  public startingPoint: number;

  public getLengthAt(altitude: number): number {
    return (1 - altitude / this.originHeight) * this.originalLength;
  }

  public getHeightAt(distance: number): number {
    return (1 - distance / this.originalLength) * this.originHeight;
  }

  constructor(
    originHeight: number,
    sunTangent: number,
    lowerBoundary: number,
    upperBoundary: number,
    startingPoint: number
  ) {
    this.originHeight = originHeight;
    this.originalLength = originHeight / sunTangent;
    this.lowerBoundary = lowerBoundary;
    this.upperBoundary = upperBoundary;
    this.startingPoint = startingPoint;
  }
}
