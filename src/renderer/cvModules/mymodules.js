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

  process(ctx) {
    if (!this.initialized) {
      this.prevImg = ctx.img
      this.initialized = true
    }
    var diffImg = ctx.img.absdiff(this.prevImg)
    this.prevImg = ctx.img

    //return {img: data.img, meta:{path: p}}
    return {img: diffImg}
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

  process(ctx) {
    if (!this.initialized) {
      this.outputImg = new cv.Mat(ctx.img.rows, this.params.width * this.params.length, ctx.img.type)
      this.pos = 0
      this.initialized = true
    }
    var fromRegion = ctx.img.getRegion(new cv.Rect(this.params.x, 0, this.params.width, ctx.img.rows))
    var toRegion = this.outputImg.getRegion(new cv.Rect(this.params.width*this.pos, 0, this.params.width, ctx.img.rows))
    fromRegion.copyTo(toRegion);

    this.pos = (this.pos + 1) % this.params.length

    this.canvas.height = this.outputImg.rows;
    this.canvas.width = this.outputImg.cols;
    /*
    this.canvas.height = data.img.rows;
    this.canvas.width = data.img.cols;
    */

    var gc = this.canvas.getContext("2d")
    gc.fillStyle = this.params.fillStyle
    gc.fillRect(this.params.width*this.pos, 0, this.params.width, this.canvas.height)

    //ctx.fillRect(this.params.x, 0, this.params.width, this.canvas.height)

    //return {img: data.img, meta:{path: p}}
    //return {img: data.img, meta:data.meta}
    return {img: this.outputImg}
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

  process(ctx) {
    if (!this.initialized) {
      this.outputImg = new cv.Mat(this.params.width * this.params.length, ctx.img.cols, ctx.img.type)
      this.pos = 0
      this.initialized = true
    }
    var fromRegion = ctx.img.getRegion(new cv.Rect(0, this.params.y, ctx.img.cols, this.params.width))
    var toRegion = this.outputImg.getRegion(new cv.Rect(0, this.params.width*this.pos, ctx.img.cols, this.params.width))
    fromRegion.copyTo(toRegion);

    this.pos = (this.pos + 1) % this.params.length

    this.canvas.height = this.outputImg.rows;
    this.canvas.width = this.outputImg.cols;

    var gc = this.canvas.getContext("2d")
    gc.fillStyle = this.params.fillStyle
    gc.fillRect(0, this.params.width*this.pos, this.canvas.width, this.params.width)

    //return {img: data.img, meta:{path: p}}
    return {img: this.outputImg}
  }
}
LineScannerY.defaultParams = {
  y: 300,
  width: 1,
  length: 350,
  fillStyle: "rgba(0, 255, 255, 0.5)"
}


//TODO
class EdgeSubpixelX extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    const edges = []
    for(let y = this.params.y; y < this.params.y + this.params.height; y += this.params.step) {
      const rect = new cv.Rect(this.params.x, y, this.params.width, this.params.bandWidth)
      const region = ctx.img.getRegion(rect)

      const region1 = region.copyMakeBorder(0, 0, 1, 0, cv.BORDER_REPLICATE)
      const region2 = region.copyMakeBorder(0, 0, 0, 1, cv.BORDER_REPLICATE)
      const regionDiff = region1.absdiff(region2)

      //regionDiff.getRegion(new cv.Rect(0, 0, region.cols, region.rows)).copyTo(region)
      edges.push({y: y, val: regionDiff.minMaxLoc()})
    }

    this.draw({...ctx, lastResult: edges})
    return {result : edges}
  }

  draw(ctx) {
    if (!this.params.visible) return

    this.canvas.height = ctx.img.rows
    this.canvas.width = ctx.img.cols

    const gc = this.canvas.getContext("2d")
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth
    gc.font = this.params.font
    gc.fillStyle = this.params.strokeStyle

    gc.beginPath()
    ctx.lastResult.forEach((result) => {
      const x = this.params.x + result.val.maxLoc.x
      const y = result.y

      gc.moveTo(x, y - this.params.step/2)
      gc.lineTo(x, y + this.params.bandWidth + this.params.step/2)

      //
      gc.fillText(x, x+12, y + 6);
      gc.fillRect(this.params.x, y, result.val.maxLoc.x, this.params.bandWidth)
    })
    gc.stroke()
  }
}
EdgeSubpixelX.defaultParams = {
  ...CvDisplayModule.defaultParams,
  x: 100,
  y: 300,
  width: 400,
  height: 100,
  bandWidth: 4,
  step: 10,
  strokeStyle: "rgba(255, 0, 0, 0.5)",
  lineWidth: "4",
  font: "16px serif"
}


//TODO
class EdgeSubpixelY extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    const edges = []
    for(let x = this.params.x; x < this.params.x + this.params.width; x += this.params.step) {
      const rect = new cv.Rect(x, this.params.y,  this.params.bandWidth, this.params.height)
      const region = ctx.img.getRegion(rect)

      const region1 = region.copyMakeBorder(1, 0, 0, 0, cv.BORDER_REPLICATE)
      const region2 = region.copyMakeBorder(0, 1, 0, 0, cv.BORDER_REPLICATE)
      const regionDiff = region1.absdiff(region2)

      //regionDiff.getRegion(new cv.Rect(0, 0, region.cols, region.rows)).copyTo(region)
      edges.push({x: x, val: regionDiff.minMaxLoc()})
    }

    this.draw({...ctx, lastResult: edges})
    return {result : edges}
  }

  draw(ctx) {
    if (!this.params.visible) return

    this.canvas.height = ctx.img.rows
    this.canvas.width = ctx.img.cols

    const gc = this.canvas.getContext("2d")
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth
    gc.font = this.params.font
    gc.fillStyle = this.params.strokeStyle

    gc.beginPath()
    ctx.lastResult.forEach((result) => {
      const x = result.x
      const y = this.params.y + result.val.maxLoc.y

      gc.moveTo(x - this.params.step/2, y)
      gc.lineTo(x + this.params.bandWidth + this.params.step/2, y)

      //
      gc.fillText(y, x+6, y + 12)
      gc.fillRect(x, this.params.y, this.params.bandWidth, result.val.maxLoc.y)
    })
    gc.stroke()
  }
}
EdgeSubpixelY.defaultParams = {
  ...CvDisplayModule.defaultParams,
  x: 300,
  y: 100,
  width: 100,
  height: 400,
  bandWidth: 4,
  step: 10,
  strokeStyle: "rgba(255, 0, 0, 0.5)",
  lineWidth: "4",
  font: "16px serif"
}


class Intensity extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    const rect = new cv.Rect(this.params.x, this.params.y, this.params.width, this.params.height)
    const region = ctx.img.getRegion(rect)
    const intensity = region.mean().w

    this.draw({...ctx, lastResult: intensity})
    return {result: intensity}
  }

  draw(ctx) {
    this.canvas.height = ctx.img.rows
    this.canvas.width = ctx.img.cols

    const gc = this.canvas.getContext("2d")
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth
    gc.font = this.params.font
    gc.fillStyle = this.params.strokeStyle

    gc.beginPath()
    const x = this.params.x
    const y = this.params.y
    const w = this.params.width
    const h = this.params.height

    gc.rect(x, y, w, h)
    gc.fillText(ctx.lastResult, x+6, y + 12)

    gc.stroke()
  }
}
Intensity.defaultParams = {
  ...CvDisplayModule.defaultParams,
  x: 300,
  y: 100,
  width: 100,
  height: 400,
  threshold: 128,
  strokeStyle: "rgba(64, 64, 128, 0.5)",
  lineWidth: "4",
  font: "32px serif"
}

// export
module.exports = {
  Diff: Diff,
  LineScannerX: LineScannerX,
  LineScannerY: LineScannerY,
  EdgeSubpixelX: EdgeSubpixelX,
  EdgeSubpixelY: EdgeSubpixelY,
  Intensity: Intensity,
}
