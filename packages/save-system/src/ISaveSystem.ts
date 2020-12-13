export interface ISaveSystem {
  convertMapToPicture(doc: any): boolean;
  saveMapToDatabase(map: any, id: string): boolean;
}
