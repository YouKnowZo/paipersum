import * as pdfjsLib from 'pdfjs-dist/webpack';

class SecurePDFRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.watermarkText = `CONFIDENTIAL - ${new Date().toISOString().split('T')[0]}`;
  }

  async render(file, userId) {
    const pdf = await pdfjsLib.getDocument({
      url: URL.createObjectURL(file),
      ownerDocument: this.container.ownerDocument
    }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      canvas.className = 'document-page';
      const ctx = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      this._addWatermark(canvas, userId);
      this.container.appendChild(canvas);
    }
  }

  _addWatermark(canvas, userId) {
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-Math.PI/4);
    ctx.fillText(this.watermarkText, 0, 0);
    ctx.fillText(`USER: ${userId}`, 0, 60);
    ctx.restore();
  }
}