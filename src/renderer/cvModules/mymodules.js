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


//TODO
class EdgeSubpixelX extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    const results = []

    //
    //const filter = new cv.Mat([[1,-2,1],[1,-2,1],[1,-2,1]], cv.CV_16S)
    //const filteredImg = data.img.filter2D(-1, filter, {borderType: cv.BORDER_ISOLATED})

    //
    for(let y = this.params.y; y < this.params.y + this.params.height; y += this.params.step) {
      //
      //const row = data.img.row(y)
      //console.log(row)
      //const sum = data.img.sum();
      //console.log(sum)

      //



      //const rect = new cv.Rect(0, y, data.img.cols, this.params.bandWidth)
      const rect = new cv.Rect(this.params.x, y, this.params.width, this.params.bandWidth)
      const region = data.img.getRegion(rect)

      const region1 = region.copyMakeBorder(0, 0, 1, 0, cv.BORDER_REPLICATE)
      const region2 = region.copyMakeBorder(0, 0, 0, 1, cv.BORDER_REPLICATE)
      const regionDiff = region1.absdiff(region2)

      //regionDiff.getRegion(new cv.Rect(0, 0, region.cols, region.rows)).copyTo(region)
      results.push({y: y, val: regionDiff.minMaxLoc()})
    }

    this.draw({img: data.img, meta: results})
    return {img: data.img, meta: results}
  }

  draw(data) {
    this.canvas.height = data.img.rows
    this.canvas.width = data.img.cols

    const ctx = this.canvas.getContext("2d")
    ctx.strokeStyle = this.params.strokeStyle
    ctx.lineWidth = this.params.lineWidth
    ctx.font = "16px sans-serif";
    ctx.fillStyle = this.params.strokeStyle

    ctx.beginPath()
    data.meta.forEach((result) => {
      const x = this.params.x + result.val.maxLoc.x
      const y = result.y

      ctx.moveTo(x, y - this.params.step/2)
      ctx.lineTo(x, y + this.params.bandWidth + this.params.step/2)

      //
      ctx.fillText(x, x+12, y + 6);
      ctx.fillRect(this.params.x, y, result.val.maxLoc.x, this.params.bandWidth)
    })
    ctx.stroke()
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
  lineWidth: "4"
}


//TODO
class EdgeSubpixelY extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    const results = []
    for(let x = this.params.x; x < this.params.x + this.params.width; x += this.params.step) {
      const rect = new cv.Rect(x, this.params.y,  this.params.bandWidth, this.params.height)
      const region = data.img.getRegion(rect)

      const region1 = region.copyMakeBorder(1, 0, 0, 0, cv.BORDER_REPLICATE)
      const region2 = region.copyMakeBorder(0, 1, 0, 0, cv.BORDER_REPLICATE)
      const regionDiff = region1.absdiff(region2)

      //regionDiff.getRegion(new cv.Rect(0, 0, region.cols, region.rows)).copyTo(region)
      results.push({x: x, val: regionDiff.minMaxLoc()})
    }

    this.draw({img: data.img, meta: results})
    return {img: data.img, meta: results}
  }

  draw(data) {
    if (!this.params.visible) return

    this.canvas.height = data.img.rows
    this.canvas.width = data.img.cols

    const ctx = this.canvas.getContext("2d")
    ctx.strokeStyle = this.params.strokeStyle
    ctx.lineWidth = this.params.lineWidth
    ctx.font = "16px serif";
    ctx.fillStyle = this.params.strokeStyle

    ctx.beginPath()
    data.meta.forEach((result) => {
      const x = result.x
      const y = this.params.y + result.val.maxLoc.y

      ctx.moveTo(x - this.params.step/2, y)
      ctx.lineTo(x + this.params.bandWidth + this.params.step/2, y)

      //
      ctx.fillText(y, x+6, y + 12)
      ctx.fillRect(x, this.params.y, this.params.bandWidth, result.val.maxLoc.y)
    })
    ctx.stroke()
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
  lineWidth: "4"
}


class Intensity extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    const rect = new cv.Rect(this.params.x, this.params.y, this.params.width, this.params.height)
    const region = data.img.getRegion(rect)
    const intensity = region.mean().w

    this.draw({img: data.img, meta: intensity})
    return {img: data.img, meta: intensity}
  }

  draw(data) {
    this.canvas.height = data.img.rows
    this.canvas.width = data.img.cols

    const ctx = this.canvas.getContext("2d")
    ctx.strokeStyle = this.params.strokeStyle
    ctx.lineWidth = this.params.lineWidth
    ctx.font = "32px serif";
    ctx.fillStyle = this.params.strokeStyle

    ctx.beginPath()
    const x = this.params.x
    const y = this.params.y
    const w = this.params.width
    const h = this.params.height

    ctx.rect(x, y, w, h)
    ctx.fillText(data.meta, x+6, y + 12)

    ctx.stroke()
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
  lineWidth: "4"
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
