var cv = require('opencv4nodejs');

class CvtColor {
  constructor(params) {
    var defaultParams = {color: cv.COLOR_RGBA2GRAY}
    this.params = Object.assign({}, defaultParams, params)
  }

  process(img) {
    return img.cvtColor(this.params.color);
  }
}
CvtColor.RGB2GRAY = cv.COLOR_RGB2GRAY
CvtColor.GRAY2RGB = cv.COLOR_GRAY2RGB
CvtColor.GRAY2RGBA = cv.COLOR_GRAY2RGBA


class GaussianBlur {
  constructor(params) {
    var defaultParams = {
      ksize: [5,5],
      sigmaX:0,
      //sigmaY:0,
      //borderType:0
    }
    this.params = Object.assign({}, defaultParams, params)
    this.params.ksize = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(img) {
    return img.gaussianBlur(
      this.params.ksize,
      this.params.sigmaX
    );
  }
}

class Canny {
  constructor(params) {
    var defaultParams = {
      minVal: 40,
      maxVal: 20,
    }
    this.params = Object.assign({}, defaultParams, params)
  }
  process(img) {
    return img.canny(
      this.params.minVal,
      this.params.maxVal
    );
  }
}
// export
module.exports = {
  CvtColor: CvtColor,
  GaussianBlur: GaussianBlur,
  Canny: Canny
}
