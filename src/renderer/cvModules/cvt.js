var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class CvtColor extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.cvtColor(this.params.color)
    }
  }
}
CvtColor.RGB2GRAY = cv.COLOR_RGB2GRAY
CvtColor.RGBA2GRAY = cv.COLOR_RGBA2GRAY
CvtColor.GRAY2RGB = cv.COLOR_GRAY2RGB
CvtColor.GRAY2RGBA = cv.COLOR_GRAY2RGBA
CvtColor.defaultParams = {
  color: CvtColor.RGBA2GRAY
}

class Threshold extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.threshold(
        this.params.thresh,
        this.params.maxVal,
        this.params.thresholdType
      )
    }
  }
}
Threshold.BINARY = cv.THRESH_BINARY
Threshold.BINARY_INV = cv.THRESH_BINARY_INV
Threshold.TRUNC = cv.THRESH_TRUNC
Threshold.TOZERO = cv.THRESH_TOZERO
Threshold.TOZERO_INV = cv.THRESH_TOZERO_INV
Threshold.defaultParams = {
  thresh: 127,
  maxVal: 255,
  thresholdType: Threshold.BINARY
}

class AdaptiveThreshold extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.adaptiveThreshold(
        this.params.maxVal,
        this.params.adaptiveMethod,
        this.params.thresholdType,
        this.params.blockSize,
        this.params.C
      )
    }
  }
}
AdaptiveThreshold.MEAN_C = cv.ADAPTIVE_THRESH_MEAN_C
AdaptiveThreshold.GAUSSIAN_C = cv.ADAPTIVE_THRESH_GAUSSIAN_C
AdaptiveThreshold.defaultParams = {
  maxVal: 255,
  adaptiveMethod : AdaptiveThreshold.GAUSSIAN_C,
  thresholdType: Threshold.BINARY,
  blockSize: 11,
  C: 2
}

// export
module.exports = {
  CvtColor: CvtColor,
  Threshold: Threshold,
  AdaptiveThreshold: AdaptiveThreshold
}
