import _ from 'lodash';
import { decode } from "blurhash";
import $ from 'jquery';


const decode_groundtruth = function(blur_hash, width, height, canvas) {
  const pixels = decode(blur_hash, width, height);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
}

const width=400, height=400;
var canvas_gt = $("#ground_truth");
decode_groundtruth("LFDv4iofM|M{E8%MM{of0LWCoxoy", width, height, canvas_gt.get(0));
