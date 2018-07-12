import fs from 'fs';
import path from 'path';
import * as vp from './videoPlayer';
import cm from './cvModules';
import cv from 'opencv4nodejs';

import test from './TEST';
import myelem from './MyElement';

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
    /*
    new cm.HoughLines({},enabled=false),
    new cm.HoughLines2({},enabled=false),
    new cm.HoughLinesP({},enabled=false),
    new cm.HoughLinesP2({},enabled=false),
    new cm.HoughCircles({},enabled=false),
    new cm.BackgroundSubtractorMOG2({},enabled=false),
    new cm.ConnectedComponentsWithStats({},enabled=false),
    */
    new cm.TrackerKCF({rect : [320,280,40,40]}, false),
    new cm.Disp_TrackerKCF({}, false),

    new cm.Diff({gain: 8}, false),
    new cm.LineScannerX({x: 175, width: 1, length: 800,}, false),
    new cm.LineScannerY({}, false),
    new cm.Sobel({dx:0, dy:3, ksize: 5}, false),
    new cm.Canny({minVal: 80, maxVal: 20,}, false),
  ]

  const player = new vp.VideoPlayer(VIDEO_FILE, cvs, cvsOL, cvModules);

  //vp.store.dispatch(vp.play())

  // ui
  moduleList.items = cvModules

  //
  window.store = vp.store
  window.actions = vp.actions
})
