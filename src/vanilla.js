/* reference: https://github.com/woltapp/blurhash/blob/master/Algorithm.md */

const base83_dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~"

function decode_dc(str){
  const digits = _.map(str, (ch) => base83_dict.indexOf(ch)),
        color = _.reduce(digits, (v, d)=>v*83+d),
        b = color % 256,
        g = (color >> 8) % 256,
        r = (color >> 16) % 256;
  return _.map([r, g, b], sRGB_to_linear);
}

function decode_ac(str, nx, ny, max_ac, dc){
  let ac = _.map(str, (ch) => base83_dict.indexOf(ch));

  let decode_pixel = function(hi, lo){
    const pix = hi*83+lo,
          b = pix % 19,
          g = _.floor(pix / 19) % 19,
          r = _.floor(pix / 19 / 19) % 19;
    return _.map([r, g, b], (c) => (c > 8 ? 1 : -1) * (c-9)*(c-9) / 81);
  }

  ac = _.range(0, nx*ny-1).flatMap((i) => decode_pixel(...ac.slice(2*i,2*i+2)));
  ac = ac.map((v) => v * max_ac);
  ac = _.concat(dc, ac);

  return ac;
}

function linear_to_sRGB(v){
    v = _.clamp(v, 0, 1);
    if(v <= 0.0031308)
      return _.floor(v * 12.92 * 255 + 0.5);
    else
      return _.floor((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255 + 0.5);
}

function sRGB_to_linear(v){
    v = v / 255
    if(v <= 0.04045)
      return v / 12.92;
    else
      return Math.pow((v + 0.055) / 1.055, 2.4);
}

const pi = Math.PI;
function gen_pixel(x, y, ac, nx, ny, width, height){
    return _.range(0,3).map(function(ch){
      return _.sum(_.range(0,ny).flatMap(function(j){
        return _.range(0,nx).flatMap(function(i){
          return ac[(i + nx*j)*3 + ch] * Math.cos(x * i * pi / width) * Math.cos(y * j * pi / height)
        })
      }))
    }).map(linear_to_sRGB);
}

export function decode(blur_hash, width, height){

  const num_components = base83_dict.indexOf(blur_hash[0]),
        nx = (num_components % 9) + 1,
        ny = _.floor(num_components / 9) + 1,
        max_ac = (base83_dict.indexOf(blur_hash[1]) + 1) / 166,
        dc_rgb = decode_dc(blur_hash.substr(2, 4)),
        [dc_r, dc_g, dc_b] = dc_rgb.map(linear_to_sRGB),
        ac = decode_ac(blur_hash.substr(6), nx, ny, max_ac, dc_rgb);

  // console.log("num_components:", nx, ny);
  // console.log("max AC:", max_ac);
  // console.log("DC:", dc_rgb);

  let pixels = new Uint8ClampedArray(width*height*4);
  for(let y=0; y<height; y++) {
    for(let x=0; x<width; x++) {
        let [px_r, px_g, px_b] = gen_pixel(x, y, ac, nx, ny, width, height);
        pixels[4 * (width * y + x)]     = px_r;
        pixels[4 * (width * y + x) + 1] = px_g;
        pixels[4 * (width * y + x) + 2] = px_b;
        pixels[4 * (width * y + x) + 3] = 255;
    }
  }
  return pixels;
}
