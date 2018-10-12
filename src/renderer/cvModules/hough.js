var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;

class HoughLines2 extends CvModule {
  process(ctx) {
    var lines = ctx.img.houghLines(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.srn,
      this.params.stn,
      this.params.min_theta,
      this.params.max_theta
    );

    var dst = this.draw({...ctx, lastResult: lines})

    return {img: dst, result: lines}
  }

  draw(ctx) {
    var dst = ctx.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    ctx.lastResult.forEach(vec2 => {
      var rho = vec2.x
      var theta  = vec2.y
      var a = Math.cos(theta)
      var b = Math.sin(theta)
      var x0 = a*rho
      var y0 = b*rho
      var l = 2000

      var x1 = x0 + l*(-b)
      var y1 = y0 + l*(a)
      var x2 = x0 - l*(-b)
      var y2 = y0 - l*(a)

      dst.drawLine (
        new cv.Point2(x1,y1),
        new cv.Point2(x2,y2),
        new cv.Vec(128, 0, 128),
        1,
        cv.LINE_8,
        0
      )
    })
    return dst
  }
}
HoughLines2.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 100,
  srn: 0.0,
  stn: 0.0,
  min_theta: 0.0,
  max_theta: Math.PI
}

class HoughLines extends CvDisplayModule {
  process(ctx) {
    var lines = ctx.img.houghLines(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.srn,
      this.params.stn,
      this.params.min_theta,
      this.params.max_theta
    );

    this.draw({...ctx, lastResult: lines})

    return {result: lines}
  }

  draw(ctx) {
    this.canvas.height = ctx.img.rows;
    this.canvas.width = ctx.img.cols;

    var gc = this.canvas.getContext("2d")
    gc.beginPath()
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth
    ctx.lastResult.forEach(vec2 => {
      var rho = vec2.x
      var theta  = vec2.y
      var a = Math.cos(theta)
      var b = Math.sin(theta)
      var x0 = a*rho
      var y0 = b*rho
      var l = 2000

      var x1 = x0 + l*(-b)
      var y1 = y0 + l*(a)
      var x2 = x0 - l*(-b)
      var y2 = y0 - l*(a)

      gc.moveTo(x1, y1);
      gc.lineTo(x2, y2);
    })
    gc.stroke();
  }
}
HoughLines.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 100,
  srn: 0.0,
  stn: 0.0,
  min_theta: 0.0,
  max_theta: Math.PI,

  strokeStyle: "rgba(128, 0, 128, 0.8)",
  lineWidth: "1"
}

class HoughLinesP2 extends CvModule {
  process(ctx) {
    var lines = ctx.img.houghLinesP(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.minLineLength,
      this.params.maxLineGap
    );

    var dst = this.draw({...ctx, lastResult: lines})

    return {img: dst, result: lines}
  }

  draw(ctx) {
        var dst = ctx.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
        ctx.lastResult.forEach(vec4 => {
          var x1 = vec4.w
          var y1 = vec4.x
          var x2 = vec4.y
          var y2 = vec4.z

          dst.drawLine (
            new cv.Point2(x1,y1),
            new cv.Point2(x2,y2),
            new cv.Vec(255, 0, 0),
            2,
            cv.LINE_8,
            0
          )
        })
        return dst
  }
}
HoughLinesP2.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 50,
  minLineLength: 30,
  maxLineGap: 10
}

class HoughLinesP extends CvDisplayModule {
  process(ctx) {
    var lines = ctx.img.houghLinesP(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.minLineLength,
      this.params.maxLineGap
    );

    this.draw({...ctx, lastResult: lines})

    return {result: lines}
  }

  draw(ctx) {
    this.canvas.height = ctx.img.rows;
    this.canvas.width = ctx.img.cols;

    var gc = this.canvas.getContext("2d")
    gc.beginPath()
    gc.strokeStyle = this.params.strokeStyle
    gc.lineWidth = this.params.lineWidth
    ctx.lastResult.forEach(vec4 => {
      var x1 = vec4.w
      var y1 = vec4.x
      var x2 = vec4.y
      var y2 = vec4.z

      gc.moveTo(x1, y1);
      gc.lineTo(x2, y2);
    })
    gc.stroke();
  }
}
HoughLinesP.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 50,
  minLineLength: 30,
  maxLineGap: 10,
  strokeStyle: "rgba(0, 0, 255, 0.8)",
  lineWidth: "2"
}

class HoughCircles extends CvModule {
  process(data) {
    var circles = data.img.houghCircles(
      this.params.method,
      this.params.dp,
      this.params.minDist,
      this.params.param1,
      this.params.param2,
      this.params.minRadius,
      this.params.maxRadius
    );

    var dst = this.draw({img: data.img, meta: circles})

    return {img: dst, meta: circles}
  }

  draw(data) {
    var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    data.meta.forEach(vec3 => {
      var x = vec3.x
      var y = vec3.y
      var r = vec3.z

      dst.drawCircle (
        new cv.Point2(x,y), //center
        r, // radius
        new cv.Vec(0, 0, 255), //  color
        2,// thickness
        cv.LINE_8,// lineType
        0// shift
      )
    })
    return dst
  }
}
HoughCircles.defaultParams = {
  method: cv.HOUGH_GRADIENT,
  dp: 1,
  minDist: 20,
  param1: 100.0,
  param2: 100.0,
  minRadius: 0,
  maxRadius: 0
}

// export
module.exports = {
  HoughLines: HoughLines,
  HoughLines2: HoughLines2,
  HoughLinesP: HoughLinesP,
  HoughLinesP2: HoughLinesP2,
  HoughCircles: HoughCircles,
}
