export class SaveSystem {
  /**
     * convertMapToPicture
map: any     */
  //map should have type Map
  public convertMapToPicture(map: any): any {
    return 'AAA';
  }
  /**
   * saveMapToDatabase
map: any, id: string   */
  public saveMapToDatabase(map: any, id: string): boolean {
    //const data = JSON.stringify(map);
    //pushToBase(data);
    return true;
  }
  /**
   * downloadPicture
picture: any : boolean  */
  public downloadPicture(picture: any): boolean {
    return true;
  }
}
