import html2canvas from 'html2canvas';

export class SaveSystem {
  public convertMapToPicture(doc: any): boolean {
    //<script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
    var container = doc.getElementById('grid_id');
    html2canvas(container, { allowTaint: true }).then(function (canvas) {
      var link = doc.createElement('a');
      doc.body.appendChild(link);
      link.download = 'html_image.jpg';
      link.href = canvas.toDataURL();
      link.target = '_blank';
      link.click();
    });
    return true;
  }

  public saveMapToDatabase(map: any, id: string): boolean {
    //trzeba uzyc funkcji z interfacu bazy danych
    //return iMapRepository.add(id, map);
    return true;
  }
}
