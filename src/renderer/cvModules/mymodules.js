var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;

class Diff extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.initialized = false;
  }

  set enabled(enabled) {
    this.initialized = false
    super.enabled = enabled
  }
  get enabled() {
    return super.enabled
  }

  process(data) {
    if (!this.initialized) {
      this.prevImg = data.img
      this.initialized = true
    }
    var diffImg = data.img.absdiff(this.prevImg)
    this.prevImg = data.img

    //return {img: data.img, meta:{path: p}}
    return {img: diffImg, meta:data.meta}
  }
}
Diff.defaultParams = {
  gain: 1
}


class LineScannerX extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.initialized = false;
  }

  //
  set enabled(enabled) {
    this.initialized = false
    super.enabled = enabled
  }
  get enabled() {
    return super.enabled
  }

  process(data) {
    if (!this.initialized) {
      this.outputImg = new cv.Mat(data.img.rows, this.params.width * this.params.length, data.img.type)
      this.pos = 0
      this.initialized = true
    }
    var fromRegion = data.img.getRegion(new cv.Rect(this.params.x, 0, this.params.width, data.img.rows))
    var toRegion = this.outputImg.getRegion(new cv.Rect(this.params.width*this.pos, 0, this.params.width, data.img.rows))
    fromRegion.copyTo(toRegion);

    this.pos = (this.pos + 1) % this.params.length

    this.canvas.height = this.outputImg.rows;
    this.canvas.width = this.outputImg.cols;
    /*
    this.canvas.height = data.img.rows;
    this.canvas.width = data.img.cols;
    */

    var ctx = this.canvas.getContext("2d")
    ctx.fillStyle = this.params.fillStyle
    ctx.fillRect(this.params.width*this.pos, 0, this.params.width, this.canvas.height)

    //ctx.fillRect(this.params.x, 0, this.params.width, this.canvas.height)

    //return {img: data.img, meta:{path: p}}
    //return {img: data.img, meta:data.meta}
    return {img: this.outputImg, meta:data.meta}
  }
}
LineScannerX.defaultParams = {
  x: 220,
  width: 1,
  length: 350,
  fillStyle: "rgba(0, 255, 255, 0.5)"
}

class LineScannerY extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.initialized = false;
  }

  //
  set enabled(enabled) {
    this.initialized = false
    super.enabled = enabled
  }
  get enabled() {
    return super.enabled
  }

  process(data) {
    if (!this.initialized) {
      this.outputImg = new cv.Mat(this.params.width * this.params.length, data.img.cols, data.img.type)
      this.pos = 0
      this.initialized = true
    }
    var fromRegion = data.img.getRegion(new cv.Rect(0, this.params.y, data.img.cols, this.params.width))
    var toRegion = this.outputImg.getRegion(new cv.Rect(0, this.params.width*this.pos, data.img.cols, this.params.width))
    fromRegion.copyTo(toRegion);

    this.pos = (this.pos + 1) % this.params.length

    this.canvas.height = this.outputImg.rows;
    this.canvas.width = this.outputImg.cols;

    var ctx = this.canvas.getContext("2d")
    ctx.fillStyle = this.params.fillStyle
    ctx.fillRect(0, this.params.width*this.pos, this.canvas.width, this.params.width)

    //return {img: data.img, meta:{path: p}}
    return {img: this.outputImg, meta:data.meta}
  }
}
LineScannerY.defaultParams = {
  y: 300,
  width: 1,
  length: 350,
  fillStyle: "rgba(0, 255, 255, 0.5)"
}



// export
module.exports = {
  Diff: Diff,
  LineScannerX: LineScannerX,
  LineScannerY: LineScannerY,
}
