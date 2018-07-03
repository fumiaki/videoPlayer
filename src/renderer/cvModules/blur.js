var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class GaussianBlur extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this._ksizeObj = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(data) {
    return {
      img: data.img.gaussianBlur(
        this._ksizeObj,
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

class MedianBlur extends CvModule {
  process(data) {
    return {
      img: data.img.medianBlur(
        this.params.ksize
      ),
      meta: data.meta
    }
  }
}
MedianBlur.defaultParams = {
  ksize: 5,
}

// export
module.exports = {
  GaussianBlur: GaussianBlur,
  MedianBlur: MedianBlur
}
