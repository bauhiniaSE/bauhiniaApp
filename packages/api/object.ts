// images/${id}.jpg

export interface IObject {
  id: string;
  image: string;
  widthWE: number;
  widthNS: number;
  height?: number;

  canPlaceOn: boolean;

  material: IMaterial;

  price: number;
}

export interface IMaterial {
  albedo: number;
  density: number;
}
