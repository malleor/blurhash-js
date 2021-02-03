/* reference: https://github.com/woltapp/blurhash/blob/master/Algorithm.md */

const base83_dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~"

function _decode_color(str){
  const digits = _.map(str, (ch) => base83_dict.indexOf(ch)),
        color = _.reduce(digits, (v, d)=>v*83+d),
        b = color % 256,
        g = (color >> 8) % 256,
        r = (color >> 16) % 256;
  return [r, g, b];
}

export function decode(blur_hash, width, height){

  const num_components = base83_dict.indexOf(blur_hash[0]),
        max_ac = base83_dict.indexOf(blur_hash[1]),
        dc_rgb = _decode_color(blur_hash.substr(2, 4)),
        [dc_r, dc_g, dc_b] = dc_rgb;

  console.log("num_components:", num_components);
  console.log("max AC:", max_ac);
  console.log("DC:", dc_rgb);

  let pixels = new Uint8ClampedArray(width*height*4);
  for(let y=0; y<height; y++) {
    for(let x=0; x<width; x++) {
        pixels[4 * (width * y + x)]     = dc_r;
        pixels[4 * (width * y + x) + 1] = dc_g;
        pixels[4 * (width * y + x) + 2] = dc_b;
        pixels[4 * (width * y + x) + 3] = 255;
    }
  }
  console.log('set all pixels to', dc_r, dc_g, dc_b);
  console.log(pixels[0], pixels[1], pixels[2]);
  return pixels;
}
