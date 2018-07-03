var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;

class PyrUp extends CvModule {
  process(data) {
    return {
      img: data.img.pyrUp(
        this.params.size,
        this.params.borderType
      ),
      meta: data.meta
    }
  }
}
PyrUp.defaultParams = {
  size : {},
  borderType: cv.BORDER_DEFAULT
}

class PyrDown extends CvModule {
  process(data) {
    return {
      img: data.img.pyrDown(
        this.params.size,
        this.params.borderType
      ),
      meta: data.meta
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
