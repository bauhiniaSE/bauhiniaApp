export class SaveSystem {
  public convertMapToPicture(src: string): boolean {
    //<script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
    const link = document.createElement('a');
    link.download = 'html_image.jpg';
    link.href = src;
    link.target = '_blank';
    link.click();
    return true;
  }

  public saveMapToDatabase(map: any, id: string): boolean {
    //trzeba uzyc funkcji z interfacu bazy danych
    //return iMapRepository.add(id, map);
    return true;
  }
}
