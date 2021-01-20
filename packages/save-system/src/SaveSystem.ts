export class SaveSystem {
  public convertMapToPicture(src: string): boolean {
    const link = document.createElement('a');
    link.download = 'html_image.jpg';
    link.href = src;
    link.target = '_blank';
    link.click();
    return true;
  }
}
