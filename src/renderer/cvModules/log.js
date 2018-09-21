var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;

class CvLogModule extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.logData = []
  }
}
CvLogModule.defaultParams = {
  ...CvDisplayModule.defaultParams,
  label: "DefaultLabel",
}


class LogSingleValue extends CvLogModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    const fp = this.player._cap.get(cv.CAP_PROP_POS_FRAMES) - 1
    this.logData[fp] = data.meta

    this.draw({img: data.img, meta: this.logData})
    return {img: data.img, meta: this.logData}
  }

  draw(data) {
    var fc = this.player._cap.get(cv.CAP_PROP_FRAME_COUNT)
    var fp = this.player._cap.get(cv.CAP_PROP_POS_FRAMES) - 1

    this.canvas.height = data.img.rows
    this.canvas.width = data.img.cols

    const ctx = this.canvas.getContext("2d")
    ctx.strokeStyle = this.params.strokeStyle
    ctx.lineWidth = this.params.lineWidth

    ctx.beginPath()
    data.meta.forEach((value, i) => {
      const x = i * this.canvas.width / fc
      const y = this.params.y - (value * this.params.scale)
      //const ok = (value < this.params.threshold)
      ctx.moveTo(x, this.params.y)
      ctx.lineTo(x, y)
    })
    ctx.moveTo(0, this.params.y)
    ctx.lineTo(this.canvas.width, this.params.y)
    ctx.stroke()

    // ctx.beginPath()
    // ctx.strokeStyle = this.params.strokeStyleNG
    // ctx.moveTo(0, this.params.y - (this.params.threshold * this.params.scale))
    // ctx.lineTo(this.canvas.width, this.params.y - (this.params.threshold * this.params.scale))

    ctx.moveTo(fp * this.canvas.width / fc, this.params.y)
    ctx.lineTo(fp * this.canvas.width / fc, this.params.y - (data.meta[fp] * this.params.scale))
    ctx.font = "32px serif";
    ctx.fillStyle = this.params.strokeStyle
    ctx.fillText(data.meta[fp], fp * this.canvas.width / fc, this.params.y - (data.meta[fp] * this.params.scale))
    ctx.stroke()
  }
}
LogSingleValue.defaultParams = {
  ...CvLogModule.defaultParams,
  y: 200,
  scale: 2,
  threshold: 35,
  strokeStyle: "rgba(0, 255, 0, 0.5)",
  strokeStyleNG: "rgba(255, 0, 0, 0.5)",
  lineWidth: "1"
}

class LogDiff extends CvLogModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.prevData = undefined
  }

  process(data) {
    const fp = this.player._cap.get(cv.CAP_PROP_POS_FRAMES) - 1

    if (this.prevData != data.meta) {
      this.logData[fp] = data.meta
      this.prevData = data.meta
    }
    this.draw({img: data.img, meta: this.logData})
    return {img: data.img, meta: this.logData}
  }

  draw(data) {
    var fc = this.player._cap.get(cv.CAP_PROP_FRAME_COUNT)
    var fp = this.player._cap.get(cv.CAP_PROP_POS_FRAMES) - 1

    const arr = Object.assign([] , data.meta);
    arr[fp] = this.prevData

    this.canvas.height = data.img.rows
    this.canvas.width = data.img.cols

    const ctx = this.canvas.getContext("2d")
    ctx.strokeStyle = this.params.strokeStyle
    ctx.fillStyle = this.params.strokeStyle
    ctx.lineWidth = this.params.lineWidth

    var x = 0
    var y = this.params.y
    ctx.beginPath()

    ctx.moveTo(x, y)
    arr.forEach((value, i) => {
      x = i * this.canvas.width / fc
      ctx.lineTo(x, y)
      y = this.params.y - (value * this.params.scale)
      ctx.lineTo(x, y)
    })
    ctx.lineTo(x, this.params.y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, this.params.y)
    ctx.lineTo(this.canvas.width, this.params.y)
    ctx.stroke()

    // ctx.beginPath()
    // ctx.strokeStyle = this.params.strokeStyleNG
    // ctx.moveTo(0, this.params.y - (this.params.threshold * this.params.scale))
    // ctx.lineTo(this.canvas.width, this.params.y - (this.params.threshold * this.params.scale))

    ctx.moveTo(fp * this.canvas.width / fc, this.params.y)
    ctx.lineTo(fp * this.canvas.width / fc, this.params.y - (arr[fp] * this.params.scale))
    ctx.font = "16px sans-serif";
    ctx.fillStyle = this.params.strokeStyle
    ctx.fillText(arr[fp], fp * this.canvas.width / fc, this.params.y - (arr[fp] * this.params.scale))
    ctx.stroke()
  }
}
LogDiff.defaultParams = {
  ...CvLogModule.defaultParams,
  y: 200,
  scale: 2,
  threshold: 35,
  strokeStyle: "rgba(0, 255, 0, 0.5)",
  strokeStyleNG: "rgba(255, 0, 0, 0.5)",
  lineWidth: "1"
}

//TODO
class CalcAvarageX extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    var sum = 0
    data.meta.forEach((result) => {
      const x = result.val.maxLoc.x
      sum += x
    })
    const average = sum / data.meta.length

    return {img: data.img, meta: average}
  }
}
CalcAvarageX.defaultParams = {}

class CalcAvarage extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    var sum = 0
    data.meta.forEach((result) => {
      const y = result.val.maxLoc.y
      sum += y
    })
    const average = sum / data.meta.length

    return {img: data.img, meta: average}
  }
}
CalcAvarage.defaultParams = {}

class CalcThreshold extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(data) {
    return {
      img: data.img,
      meta: data.meta < this.params.threshold ? this.params.low : this.params.high
    }
  }
}
CalcThreshold.defaultParams = {
  threshold: 128,
  low: 0,
  high: 255
}

// export
module.exports = {
  CvLogModule: CvLogModule,
  LogSingleValue: LogSingleValue,
  LogDiff: LogDiff,
  CalcAvarageX: CalcAvarageX,
  CalcAvarage: CalcAvarage,
  CalcThreshold: CalcThreshold,
}
