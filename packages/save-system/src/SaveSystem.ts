import * as htmlToImage from 'html-to-image';
//import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export class SaveSystem {
  /**
     * convertMapToPicture
map: any     */
  //map should have type Map
  public filter(url: any) {
    return url.tagName !== 'i';
  }
  public convertMapToPicture(url: any): any {
    //jesli nie dziala to wrzucic tu function filter i usunac this
    htmlToImage.toSvg(url.getElementById('my-node'), { filter: this.filter }).then(function (dataUrl) {
      var link = url.createElement('a');
      link.download = 'test.jpeg';
      link.href = dataUrl;
      link.click();
    });
    /*var node = url.getElementById('my-node');
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        var img = url.createElement('img');
        img.setAttribute('src', dataUrl);
        url.body.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });*/
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
