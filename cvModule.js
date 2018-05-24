var cv = require('opencv4nodejs');

// Base class
class CvModule {
  constructor(params, enabled=true) {
    this.params = Object.assign({}, this.constructor.defaultParams, params)
    this.enabled = enabled
  }

  process(img) {
    // do nothing
    return img
  }
}
CvModule.defaultParams = {}

class CvtColor extends CvModule {
  // constructor(params) {
  //   super(params)
  // }

  process(img) {
    return img.cvtColor(this.params.color)
  }
}
CvtColor.RGB2GRAY = cv.COLOR_RGB2GRAY
CvtColor.RGBA2GRAY = cv.COLOR_RGBA2GRAY
CvtColor.GRAY2RGB = cv.COLOR_GRAY2RGB
CvtColor.GRAY2RGBA = cv.COLOR_GRAY2RGBA
CvtColor.defaultParams = {
  color: CvtColor.RGBA2GRAY
}

class GaussianBlur extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this.params.ksizeObj = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(img) {
    return img.gaussianBlur(
      this.params.ksizeObj,
      this.params.sigmaX
    );
  }
}
GaussianBlur.defaultParams = {
  ksize: [5,5],
  sigmaX:0,
  //sigmaY:0,
  //borderType:0
}

class Canny extends CvModule {
  process(img) {
    return img.canny(
      this.params.minVal,
      this.params.maxVal
    );
  }
}
Canny.defaultParams = {
  minVal: 40,
  maxVal: 20,
}


class Dilate extends CvModule {
  process(img) {
    return img.dilate(
      this.params.kernel,
      this.params.anchor,
      this.params.iterations,
      this.params.borderType
    );
  }
}
Dilate.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class Erode extends CvModule {
  process(img) {
    return img.erode(
      this.params.kernel,
      this.params.anchor,
      this.params.iterations,
      this.params.borderType
    );
  }
}
Erode.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class MorphologyEx extends CvModule {
  process(img) {
    return img.morphologyEx(
      this.params.kernel,
      this.params.morphType,
      this.params.anchor,
      this.params.iterations,
      this.params.borderType
    );
  }
}
MorphologyEx.MORPH_OPEN = cv.MORPH_OPEN
MorphologyEx.MORPH_CLOSE = cv.MORPH_CLOSE
MorphologyEx.MORPH_GRADIENT = cv.MORPH_GRADIENT
MorphologyEx.MORPH_TOPHAT = cv.MORPH_TOPHAT
MorphologyEx.MORPH_BLACKHAT = cv.MORPH_BLACKHAT
MorphologyEx.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  morphType : cv.MORPH_OPEN,
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}


class HoughLines extends CvModule {
  process(img) {
    var lines = img.houghLines(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.srn,
      this.params.stn,
      this.params.min_theta,
      this.params.max_theta
    );
    //console.log(lines[0])
    var dst = img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    lines.forEach(vec2 => {
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
HoughLines.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 100,
  srn: 0.0,
  stn: 0.0,
  min_theta: 0.0,
  max_theta: Math.PI
}

class HoughLinesP extends CvModule {
  process(img) {
    var lines = img.houghLinesP(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.minLineLength,
      this.params.maxLineGap
    );

    var dst = img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    lines.forEach(vec4 => {
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
HoughLinesP.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 50,
  minLineLength: 30,
  maxLineGap: 10
}

class HoughCircles extends CvModule {
  process(img) {
    var circles = img.houghCircles(
      this.params.method,
      this.params.dp,
      this.params.minDist,
      this.params.param1,
      this.params.param2,
      this.params.minRadius,
      this.params.maxRadius
    );

    var dst = img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    circles.forEach(vec3 => {
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
  CvModule: CvModule,
  CvtColor: CvtColor,
  GaussianBlur: GaussianBlur,
  Dilate: Dilate,
  Erode: Erode,
  MorphologyEx: MorphologyEx,
  Canny: Canny,
  HoughLines: HoughLines,
  HoughLinesP: HoughLinesP,
  HoughCircles: HoughCircles
}
