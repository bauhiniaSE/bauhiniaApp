import { IMap } from 'bauhinia-api/map';

export interface IMapRepository {
  getAllMaps(): Promise<IMap[]>;
  addMap(map: IMap): Promise<boolean>;
  removeMap(id: string): Promise<boolean>;
  getMap(id: string): Promise<IMap>;
  updateMap(map: IMap): Promise<boolean>;
}
