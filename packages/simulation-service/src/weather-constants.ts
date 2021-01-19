export class Weather {
  public static sunlightAngle: number = 60; // [degrees]
  public static readonly atmPressure: number = 101500; // [Pa]
  public static readonly airHumidity: number = 0.2; // relative humidity
  public static readonly airDensity: number = 1.18; // [kg/m3]
  public static readonly windVelocity: number = 5; // [m/s]
  public static readonly airSpecificHeat: number = 1006; // [J/kgK]
  public static readonly ambientTemp: number = 25; // [*C]
  public static readonly sunPower: number = 1000 * 60 * 60 * 6; // [J]
  public static readonly airDiffusivity: number = (22 * 10000) / 36; //[m2/h]
  public static readonly latentVaporisationHeat: number = 10658000; // [J]
}
