import _ from 'lodash';
import { decode } from "blurhash";
import $ from 'jquery';


const decode_groundtruth = function(blur_hash, canvas_id) {
  var canvas = $(canvas_id);
  const width=canvas.attr("width"), height=canvas.attr("height");
  const pixels = decode(blur_hash, width, height);
  const ctx = canvas.get(0).getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
};

const decode_vanilla = function(blur_hash, canvas_id) {
};

decode_groundtruth("LFDv4iofM|M{E8%MM{of0LWCoxoy", "#output_gt");
decode_vanilla("LFDv4iofM|M{E8%MM{of0LWCoxoy", "#output_vanilla");
