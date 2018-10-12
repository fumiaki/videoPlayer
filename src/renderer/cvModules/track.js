var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;

class TrackerKCF extends CvDisplayModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.initialized = false;
  }

  //
  set enabled(enabled) {
    super.enabled = enabled
    this.initialized = false
  }

  get enabled() {
    return super.enabled
  }

  process(ctx) {
    if (!this.initialized) {
      this.tracker = new cv.TrackerKCF()
      this.tracker.init(ctx.img, new cv.Rect(...this.params.rect))
      this.initialized = true;
    }
    var rect = this.tracker.update(ctx.img);

    this.draw({...ctx, lastResult: rect})

    return {result: rect}
  }

  draw(ctx) {
    if (!this.params.visible) return

    this.canvas.height = ctx.img.rows;
    this.canvas.width = ctx.img.cols;

    var r = ctx.lastResult
    var gc = this.canvas.getContext("2d")
    gc.fillStyle = this.params.fillStyle
    gc.fillRect(r.x, r.y, r.width, r.height)
  }
}

// export
module.exports = {
  TrackerKCF: TrackerKCF,
}
