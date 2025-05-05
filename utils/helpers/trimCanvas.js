export function trimCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height).data;

  let top = null,
    bottom = null,
    left = null,
    right = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha !== 0) {
        if (top === null) top = y;
        if (bottom === null || y > bottom) bottom = y;
        if (left === null || x < left) left = x;
        if (right === null || x > right) right = x;
      }
    }
  }

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;
  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  const trimmedCtx = trimmedCanvas.getContext("2d");
  trimmedCtx.drawImage(
    canvas,
    left,
    top,
    trimmedWidth,
    trimmedHeight,
    0,
    0,
    trimmedWidth,
    trimmedHeight
  );
  return trimmedCanvas;
}
