export async function resizeToSquareDataURL(file: File, size=192, mime='image/jpeg', quality=0.85): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => { URL.revokeObjectURL(url); res(i); };
    i.onerror = rej;
    i.src = url;
  });
  const canvas = document.createElement('canvas');
  const s = Math.min(img.width, img.height);
  const sx = (img.width - s)/2, sy = (img.height - s)/2;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
  return canvas.toDataURL(mime, quality);
}
