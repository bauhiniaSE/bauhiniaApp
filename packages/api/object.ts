// images/${id}.jpg

export interface IObject {
  id: string;
  widthWE: number;
  widthNS: number;
  height?: number;

  canPlaceOn: boolean;

  material: Material;
}

export interface Material {
  albedo: number;
  density: number;
}
