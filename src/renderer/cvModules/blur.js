var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class GaussianBlur extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this._ksizeObj = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(ctx) {
    return {
      img: ctx.img.gaussianBlur(
        this._ksizeObj,
        this.params.sigmaX,
        this.params.sigmaY,
        this.params.borderType
      )
    }
  }
}
GaussianBlur.defaultParams = {
  ksize: [5,5],
  sigmaX:0,
  sigmaY:0,
  borderType: cv.BORDER_REPLICATE
}

class MedianBlur extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.medianBlur(
        this.params.ksize
      )
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
