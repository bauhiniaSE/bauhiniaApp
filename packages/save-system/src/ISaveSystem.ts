export interface ISaveSystem {
  convertMapToPicture(map: any): any;
  saveMapToDatabase(map: any, id: string): boolean;
  downloadPicture(picture: any): boolean;
}
