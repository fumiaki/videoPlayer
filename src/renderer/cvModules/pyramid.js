var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class PyrUp extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.pyrUp(
        this.params.size,
        this.params.borderType
      )
    }
  }
}
PyrUp.defaultParams = {
  size : {},
  borderType: cv.BORDER_DEFAULT
}

class PyrDown extends CvModule {
  process(ctx) {
    return {
      img: ctx.img.pyrDown(
        this.params.size,
        this.params.borderType
      )
    }
  }
}
PyrDown.defaultParams = {
  size : {},
  borderType: cv.BORDER_DEFAULT
}

// export
module.exports = {
  PyrUp: PyrUp,
  PyrDown: PyrDown
}
