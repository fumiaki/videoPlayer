var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class Filter2D extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this._karnel = new cv.Mat(this.params.karnel, cv.CV_32FC1)
    this._anchor = new cv.Point(...this.params.anchor)
  }
  process(data) {
    return {
      img: data.img.filter2D(
        this.params.ddepth,
        this._karnel,
        this._anchor,
        this.params.delta,
        this.params.borderType
      ),
      meta: data.meta
    }
  }
}
Filter2D.defaultParams = {
  ddepth: -1,
  karnel: [[0,0.5,0],[0.5,0,0.5],[0,0.5,0]],
  anchor: [-1,-1],
  delta: 0,
  borderType: cv.BORDER_DEFAULT
}

// export
module.exports = {
  Filter2D: Filter2D,
}
