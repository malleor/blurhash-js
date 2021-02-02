import _ from 'lodash';
import { decode as decode_gt } from "blurhash";
import { decode as decode_vanilla } from "./vanilla.js";
import $ from 'jquery';


const decode_variant = function(blur_hash, decode, canvas_id) {
  let canvas = $(canvas_id);
  const width=canvas.attr("width"), height=canvas.attr("height");
  const pixels = decode(blur_hash, width, height);
  const ctx = canvas.get(0).getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
};

decode_variant("LFDv4iofM|M{E8%MM{of0LWCoxoy", decode_gt, "#output_gt");
decode_variant("LFDv4iofM|M{E8%MM{of0LWCoxoy", decode_vanilla, "#output_vanilla");
