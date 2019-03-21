const cv = require('opencv4nodejs')
const base = require("./base")
const path = require("path")

const CvModule = base.CvModule


const storage = {}

class PushImage extends CvModule {
  constructor(params, enabled=true) {
    super(params, enabled)
  }

  process(context) {
    storage[this.params.key] = context.img
    return {}
  }
}
PushImage.defaultParams = {
  key: "default"
}

class PopImage extends CvModule {
  constructor(params, enabled=true) {
    super(params, enabled)
  }

  process(context) {
    return {img: storage[this.params.key]}
  }
}
PopImage.defaultParams = {
  key: "default"
}

// export
module.exports = {
  PushImage: PushImage,
  PopImage: PopImage
}
