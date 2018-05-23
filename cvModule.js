var cv = require('opencv4nodejs');

// Base class
class CvModule {
  constructor(params) {
    this.params = Object.assign({}, this.constructor.defaultParams, params)
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
  constructor(params) {
    super(params)
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

class HoughLines extends CvModule {
  process(img) {
    var lines = img.houghLines(
      1,
      Math.PI/180.0,
      100
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
}

class HoughLinesP extends CvModule {
  process(img) {
    var lines = img.houghLinesP(
      1,
      Math.PI/180.0,
      50,
      30,
      10
    );
    console.log(lines[0])
    var dst = img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    lines.forEach(vec4 => {
      var x1 = vec4.w
      var y1 = vec4.x
      var x2 = vec4.y
      var y2 = vec4.z
      //var x0 = (x1 + x2) / 2
      //var y0 = (y1 + y2) / 2

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
}
// export
module.exports = {
  CvModule: CvModule,
  CvtColor: CvtColor,
  GaussianBlur: GaussianBlur,
  Canny: Canny,
  HoughLines: HoughLines,
  HoughLinesP: HoughLinesP
}
