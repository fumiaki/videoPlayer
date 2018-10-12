var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class Dilate extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.dilate(
        this.params.kernel,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      )
    }
  }
}
Dilate.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class Erode extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.erode(
        this.params.kernel,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      )
    }
  }
}
Erode.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class MorphologyEx extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.morphologyEx(
        this.params.kernel,
        this.params.morphType,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      )
    }
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

// export
module.exports = {
  Dilate: Dilate,
  Erode: Erode,
  MorphologyEx: MorphologyEx
}
