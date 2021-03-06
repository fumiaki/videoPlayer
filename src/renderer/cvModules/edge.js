var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class Sobel extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.sobel(
        this.params.ddepth,
        this.params.dx,
        this.params.dy,
        this.params.ksize,
        this.params.scale,
        this.params.delta,
        this.params.borderType
      )
      .abs()
      .convertTo(cv.CV_8U)
    }
  }
}
Sobel.defaultParams = {
  ddepth : cv.CV_16S,
  dx: 1,
  dy: 0,
  ksize: 3,
  scale: 1.0,
  delta: 0.0,
  borderType: cv.BORDER_DEFAULT
}

class Canny extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.canny(
        this.params.minVal,
        this.params.maxVal
      )
    }
  }
}
Canny.defaultParams = {
  minVal: 40,
  maxVal: 20,
}


// export
module.exports = {
  Sobel: Sobel,
  Canny: Canny,
}
