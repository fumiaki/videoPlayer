var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class GaussianBlur extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this.params.ksizeObj = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(data) {
    return {
      img: data.img.gaussianBlur(
        this.params.ksizeObj,
        this.params.sigmaX
      ),
      meta: data.meta
    }
  }
}
GaussianBlur.defaultParams = {
  ksize: [5,5],
  sigmaX:0,
  //sigmaY:0,
  //borderType:0
}

// export
module.exports = {
  GaussianBlur: GaussianBlur,
}
