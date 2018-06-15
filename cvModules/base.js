// Base class
class CvModule {
  constructor(params, enabled=true) {
    this.params = Object.assign({}, this.constructor.defaultParams, params)
    this.enabled = enabled
  }

  // data = {
  //   img: image to process,
  //   meta: metadata
  // }
  process(data) {
    // do nothing
    return data
  }
}
CvModule.defaultParams = {}

// Base class for display metadata
class CvDisplayModule extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.canvas = document.createElement("canvas")
    this.canvas.style.position = "absolute"
    document.getElementById('imgDisplay').appendChild(this.canvas)
  }

  set enabled(enabled) {
    if (this.canvas) this.canvas.style.display = enabled ? "block" : "none"
    this._enabled = enabled
  }
  get enabled() {
    return this._enabled
  }
}
CvDisplayModule.defaultParams = {}

// export
module.exports = {
  CvModule: CvModule,
  CvDisplayModule: CvDisplayModule
}
