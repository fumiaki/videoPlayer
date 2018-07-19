import fs from 'fs';
import path from 'path';
import * as vp from './videoPlayer';
import cm from './cvModules';
import cv from 'opencv4nodejs';

import {Button} from "@material/mwc-button";

import test from './TEST';
import myelem from './MyElement';
import './app.scss';

window.addEventListener("load", function() {

  var VIDEO_FILE = path.resolve('asset', 'vtest.avi');
  var cvs = document.getElementById('main');
  var cvsOL = document.getElementById('progress');

  //
  var cvModules = [
    new cm.CvtColor({color:cm.CvtColor.RGB2GRAY}, true),
    new cm.PyrUp({}, false),
    new cm.PyrDown({}, true),
    new cm.PyrDown({}, false),
    new cm.Filter2D({}, false),
    new cm.GaussianBlur({ksize:[9,9]}, false),
    new cm.MedianBlur({ksize:5}, false),
    new cm.Threshold({maxVal:255}, false),
    new cm.AdaptiveThreshold({}, false),
    new cm.Dilate({}, false),
    new cm.Erode({}, false),
    new cm.MorphologyEx({kernel: new cv.Mat(15, 15, cv.CV_8U, 1), morphType: cv.MORPH_OPEN}, false),
    new cm.Sobel({}, false),
    new cm.Canny({minVal: 80, maxVal: 20,}, false),
    new cm.HoughLines({}, false),
    new cm.HoughLines2({}, false),
    new cm.HoughLinesP({}, false),
    new cm.HoughLinesP2({}, false),
    new cm.HoughCircles({}, false),
    new cm.BackgroundSubtractorMOG2({}, false),
    new cm.ConnectedComponentsWithStats({}, false),
    new cm.TrackerKCF({rect : [260,200,40,80]}, false),
    new cm.Disp_TrackerKCF({fillStyle:"rgba(255, 127, 0, 0.5)"}, false),

    new cm.Diff({gain: 8}, false),
    new cm.LineScannerX({x: 175, width: 1, length: 800,}, false),
    new cm.LineScannerY({}, false),
  ]

  const player = new vp.VideoPlayer(VIDEO_FILE, cvs, cvsOL, cvModules);

  //vp.store.dispatch(vp.play())

  // ui
  moduleList.items = cvModules

  //
  window.store = vp.store
  window.actions = vp.actions
})
