export function decode(blur_hash, width, height){
  let pixels = new Uint8ClampedArray(width*height*4);
  pixels.fill(127, 0, width*height*4);
  return pixels;
}
