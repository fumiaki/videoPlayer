import fs from 'fs';
import path from 'path';
import * as vp from './videoPlayer';
import cm from './cvModules';
import cv from 'opencv4nodejs';

import {Button} from "@material/mwc-button";

import myelem from './MyElement';
import './app.scss';

window.addEventListener("load", function() {

  var cvModules = [
    new cm.VideoSource({id: "test", uiContainer: "testCtl"}, true),
    new cm.ProgressBar({id:"prog02"}, true),
    //new cm.CameraSource({source:1, width:1200, height:960}, false),
    new cm.CvtColor({color:cm.CvtColor.RGB2GRAY}, true),
    new cm.GaussianBlur({ksize:[11,11]}, true),

    new cm.EdgeSubpixelX({x:200, y:200, width:200, height:100, step:2, bandWidth:1, strokeStyle: "rgba(0, 0, 255, 0.5)"}, true),
    new cm.CalcAvarageX({}, true),
    new cm.LogSingleValue({label: "test", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(0, 0, 255, 0.5)"}, true),

    new cm.Threshold({thresh:64, maxVal:255}, false),
    new cm.Sobel({}, false),
    new cm.Canny({minVal: 80, maxVal: 20,}, false),

    new cm.EdgeSubpixelX({x:200, y:200, width:200, height:100, step:2, bandWidth:1}, true),
    new cm.CalcAvarageX({}, true),
    new cm.LogSingleValue({label: "test", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(255, 0, 0, 0.5)"}, true),

    new cm.HoughLines({}, false),
    new cm.HoughLines2({}, false),
    new cm.HoughLinesP({}, false),
    new cm.HoughLinesP2({}, false),
    new cm.HoughCircles({}, false),
    new cm.BackgroundSubtractorMOG2({}, false),
    new cm.ConnectedComponentsWithStats({}, false),
    new cm.TrackerKCF({rect : [260,200,40,80], fillStyle:"rgba(255, 127, 0, 0.5)"}, false),

    new cm.Diff({gain: 8}, false),
    new cm.LineScannerX({x: 175, width: 1, length: 800,}, false),
    new cm.LineScannerY({}, false),
    new cm.PrintContext({}, true),

  ]

  var xxcvModules = [
    //new cm.VideoSource({id: "log180907_1", uiContainer: "testCtl",}, true),

    new cm.ProgressBar({id:"prog02"}, true),
    new cm.CvtColor({color:cm.CvtColor.RGB2GRAY}, true),
    //new cm.PyrUp({}, false),
    //new cm.PyrDown({}, false),
    //new cm.PyrDown({}, false),
    //new cm.Filter2D({}, false),
    new cm.GaussianBlur({ksize:[9,9]}, true),
    new cm.MedianBlur({ksize:5}, false),
    //new cm.Threshold({maxVal:255}, false),
    //new cm.AdaptiveThreshold({}, false),
    //new cm.Dilate({}, false),
    //new cm.Erode({}, false),
    //new cm.MorphologyEx({kernel: new cv.Mat(15, 15, cv.CV_8U, 1), morphType: cv.MORPH_OPEN}, false),
    //new cm.Sobel({}, false),
    //new cm.Canny({minVal: 80, maxVal: 20,}, false),

    new cm.EdgeSubpixelX({x:100, y:200, width:400, height:400, step:4, bandWidth:2}, false),

    /* for videolog180903
    new cm.EdgeSubpixelY({visible: false, x:900, y:100, width:100, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 255, 0, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 50, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),

    new cm.Intensity({x:1056, y:137, width:12, height:9, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Signal", y: 150, scale: 1, threshold: 25, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),

    new cm.Intensity({x:1146, y:268, width:35, height:37, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 200, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Weld", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),

    new cm.EdgeSubpixelY({visible: false, x:150, y:100, width:200, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 50, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),

    new cm.Intensity({x:543, y:136, width:19, height:11, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Signal", y: 350, scale: 1, threshold: 25, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),

    new cm.Intensity({x:587, y:487, width:38, height:20, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 120, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Weld", y: 400, scale: 1, threshold: 25, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    */

    /* for videolog180904-1
    new cm.EdgeSubpixelY({visible: true, x:891, y:93, width:50, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 255, 0, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 20, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),
    new cm.LogDiff({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),

    new cm.Intensity({x:1013, y:110, width:12, height:9, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Signal", y: 150, scale: 1, threshold: 25, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),

    new cm.Intensity({x:1106, y:246, width:35, height:32, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 200, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Weld", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),

    new cm.EdgeSubpixelY({visible: true, x:140, y:50, width:200, height:150, step:4, bandWidth:2, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 70, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.LogDiff({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),

    new cm.Intensity({x:491, y:110, width:15, height:12, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Signal", y: 350, scale: 1, threshold: 25, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),

    new cm.Intensity({x:534, y:458, width:38, height:20, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 120, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Weld", y: 400, scale: 1, threshold: 25, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    */

    /* for videolog180904-2
    new cm.EdgeSubpixelY({visible: true, x:921, y:93, width:50, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 255, 0, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 20, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),
    new cm.LogDiff({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),

    new cm.Intensity({x:1043, y:110, width:12, height:9, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Signal", y: 150, scale: 1, threshold: 25, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),

    new cm.Intensity({x:1136, y:246, width:35, height:32, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 200, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Weld", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),

    new cm.EdgeSubpixelY({visible: true, x:170, y:50, width:200, height:150, step:4, bandWidth:2, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 70, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.LogDiff({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),

    new cm.Intensity({x:521, y:110, width:15, height:12, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Signal", y: 350, scale: 1, threshold: 25, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),

    new cm.Intensity({x:564, y:458, width:38, height:20, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 120, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Weld", y: 400, scale: 1, threshold: 25, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    */

    /* for videolog180905
    new cm.EdgeSubpixelY({visible: true, x:931, y:143, width:50, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 255, 0, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 20, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),
    new cm.LogDiff({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),

    new cm.Intensity({x:1092, y:163, width:12, height:9, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Signal", y: 150, scale: 1, threshold: 25, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),

    new cm.Intensity({x:1188, y:300, width:32, height:32, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 200, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Weld", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),

    new cm.EdgeSubpixelY({visible: true, x:170, y:110, width:200, height:120, step:4, bandWidth:2, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 70, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.LogDiff({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),

    new cm.Intensity({x:578, y:159, width:15, height:12, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Signal", y: 350, scale: 1, threshold: 25, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),

    new cm.Intensity({x:607, y:505, width:38, height:20, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 120, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Weld", y: 400, scale: 1, threshold: 25, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    */

    // for videolog180906-180907
    new cm.EdgeSubpixelY({visible: true, x:980, y:148, width:50, height:100, step:4, bandWidth:2, strokeStyle: "rgba(0, 255, 0, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 20, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),
    new cm.LogDiff({label: "No3_Door", y: 100, scale: 1, threshold: 25, strokeStyle: "rgba(0, 255, 0, 0.5)"}, true),

    new cm.Intensity({x:1140, y:164, width:12, height:9, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 130, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Signal", y: 150, scale: 1, threshold: 25, strokeStyle: "rgba(64, 196, 64, 0.5)"}, true),

    new cm.Intensity({x:1236, y:306, width:32, height:32, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 200, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No3_Weld", y: 200, scale: 1, threshold: 25, strokeStyle: "rgba(196, 196, 64, 0.5)"}, true),

    new cm.EdgeSubpixelY({visible: true, x:225, y:110, width:200, height:120, step:4, bandWidth:2, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.CalcAvarage({}, true),
    new cm.CalcThreshold({threshold: 70, low: 10, high: 40}, true),
    //new cm.LogSingleValue({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),
    new cm.LogDiff({label: "No?_Door", y: 300, scale: 1, threshold: 25, strokeStyle: "rgba(0, 196, 196, 0.5)",}, true),

    new cm.Intensity({x:623, y:159, width:15, height:12, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 100, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Signal", y: 350, scale: 1, threshold: 25, strokeStyle: "rgba(64, 64, 196, 0.5)"}, true),

    new cm.Intensity({x:647, y:505, width:38, height:20, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    new cm.CalcThreshold({threshold: 120, low: 10, high: 40}, true),
    new cm.LogDiff({label: "No?_Weld", y: 400, scale: 1, threshold: 25, strokeStyle: "rgba(196, 64, 64, 0.5)"}, true),
    //
  ]

  window.player = new vp.VideoPlayer(cvModules);

  // ui
  moduleList.items = cvModules

  //
  window.store = vp.store
  window.actions = vp.actions
})
