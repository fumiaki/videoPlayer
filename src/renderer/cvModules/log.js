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

  process(ctx) {
    //const fp = this.player._cap.get(cv.CAP_PROP_POS_FRAMES) - 1
    const fp = ctx.meta.framePosition
    this.logData[fp] = ctx.lastResult

    this.draw(ctx)
    return {result: this.logData}
  }

  draw(ctx) {
    const fc = ctx.meta.frameCount
    const fp = ctx.meta.framePosition
    const currentValue = this.logData[fp]

    this.canvas.height = ctx.img.rows
    this.canvas.width = ctx.img.cols

    const gc = this.canvas.getContext("2d")
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth

    gc.beginPath()
    this.logData.forEach((value, i) => {
      const x = i * this.canvas.width / fc
      const y = this.params.y - (value * this.params.scale)
      //const ok = (value < this.params.threshold)
      gc.moveTo(x, this.params.y)
      gc.lineTo(x, y)
    })
    gc.moveTo(0, this.params.y)
    gc.lineTo(this.canvas.width, this.params.y)
    gc.stroke()

    // ctx.beginPath()
    // ctx.strokeStyle = this.params.strokeStyleNG
    // ctx.moveTo(0, this.params.y - (this.params.threshold * this.params.scale))
    // ctx.lineTo(this.canvas.width, this.params.y - (this.params.threshold * this.params.scale))

    gc.moveTo(fp * this.canvas.width / fc, this.params.y)
    gc.lineTo(fp * this.canvas.width / fc, this.params.y - (currentValue * this.params.scale))
    gc.font = this.params.font
    gc.fillStyle = this.params.strokeStyle
    gc.fillText(currentValue, fp * this.canvas.width / fc, this.params.y - (currentValue * this.params.scale))
    gc.stroke()
  }
}
LogSingleValue.defaultParams = {
  ...CvLogModule.defaultParams,
  y: 200,
  scale: 2,
  threshold: 35,
  strokeStyle: "rgba(0, 255, 0, 0.5)",
  strokeStyleNG: "rgba(255, 0, 0, 0.5)",
  lineWidth: "1",
  font: "16px sans-serif"
}

class LogDiff extends CvLogModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.prevData = undefined
  }

  process(ctx) {
    const fp = ctx.meta.framePosition

    if (this.prevData != ctx.lastResult) {
      this.logData[fp] = ctx.lastResult
      this.prevData = ctx.lastResult
    }

    this.draw(ctx)
    return {result: this.logData}
  }

  draw(ctx) {
    const fc = ctx.meta.frameCount
    const fp = ctx.meta.framePosition

    const arr = Object.assign([] , this.logData);
    arr[fp] = this.prevData

    this.canvas.height = ctx.img.rows
    this.canvas.width = ctx.img.cols

    const gc = this.canvas.getContext("2d")
    gc.strokeStyle = this.params.strokeStyle
    gc.fillStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth

    var x = 0
    var y = this.params.y
    gc.beginPath()

    gc.moveTo(x, y)
    arr.forEach((value, i) => {
      x = i * this.canvas.width / fc
      gc.lineTo(x, y)
      y = this.params.y - (value * this.params.scale)
      gc.lineTo(x, y)
    })
    gc.lineTo(x, this.params.y)
    gc.closePath()
    gc.fill()

    gc.beginPath()
    gc.moveTo(0, this.params.y)
    gc.lineTo(this.canvas.width, this.params.y)
    gc.stroke()

    // gc.beginPath()
    // gc.strokeStyle = this.params.strokeStyleNG
    // gc.moveTo(0, this.params.y - (this.params.threshold * this.params.scale))
    // gc.lineTo(this.canvas.width, this.params.y - (this.params.threshold * this.params.scale))

    gc.moveTo(fp * this.canvas.width / fc, this.params.y)
    gc.lineTo(fp * this.canvas.width / fc, this.params.y - (arr[fp] * this.params.scale))
    gc.font = this.params.font
    gc.fillStyle = this.params.strokeStyle
    gc.fillText(arr[fp], fp * this.canvas.width / fc, this.params.y - (arr[fp] * this.params.scale))
    gc.stroke()
  }
}
LogDiff.defaultParams = {
  ...CvLogModule.defaultParams,
  y: 200,
  scale: 2,
  threshold: 35,
  strokeStyle: "rgba(0, 255, 0, 0.5)",
  //strokeStyleNG: "rgba(255, 0, 0, 0.5)",
  lineWidth: "1",
  font: "16px sans-serif"
}

//TODO
class CalcAvarageX extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    var sum = 0
    ctx.lastResult.forEach((result) => {
      const x = result.val.maxLoc.x
      sum += x
    })
    const result = sum / ctx.lastResult.length

    return {result}
  }
}
CalcAvarageX.defaultParams = {}

class CalcAvarage extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    var sum = 0
    ctx.lastResult.forEach((result) => {
      const y = result.val.maxLoc.y
      sum += y
    })
    const result = sum / ctx.lastResult.length

    return {result}
  }
}
CalcAvarage.defaultParams = {}

class CalcThreshold extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
  }

  process(ctx) {
    const result = ctx.lastResult < this.params.threshold ? this.params.low : this.params.high

    return {result}
  }
}
CalcThreshold.defaultParams = {
  threshold: 128,
  low: 0,
  high: 255
}

// DEBUG:
class PrintContext extends CvModule {
  process(ctx) {
    console.log({...ctx})
    return {result: ctx.lastResult}
  }
}

// export
module.exports = {
  CvLogModule: CvLogModule,
  LogSingleValue: LogSingleValue,
  LogDiff: LogDiff,
  CalcAvarageX: CalcAvarageX,
  CalcAvarage: CalcAvarage,
  CalcThreshold: CalcThreshold,

  PrintContext:PrintContext
}
