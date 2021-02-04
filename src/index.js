import _ from 'lodash';
import { decode as decode_gt } from "blurhash";
import { decode as decode_vanilla } from "./vanilla.js";
import $ from 'jquery';


const decode_variant = function(blur_hash, decode, canvas_id) {
  let canvas = $(canvas_id);
  const width=canvas.attr("width"), height=canvas.attr("height");
  const ctx = canvas.get(0).getContext("2d");
  const imageData = ctx.createImageData(width, height);

  console.time(canvas_id);
  const pixels = decode(blur_hash, width, height);
  console.timeEnd(canvas_id);

  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
};

const blur_hash = "LTL|cM?a-:S1~AozSwXQMdjFD%jF";
decode_variant(blur_hash, decode_gt, "#output_gt");
decode_variant(blur_hash, decode_vanilla, "#output_vanilla");
