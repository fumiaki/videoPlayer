var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;

class TrackerKCF extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.initialized = false;
  }

  //
  set enabled(enabled) {
    this.initialized = false
    this._enabled = enabled
  }
  get enabled() {
    return this._enabled
  }

  process(data) {
    if (!this.initialized) {
      this.tracker = new cv.TrackerKCF()
      this.tracker.init(data.img, new cv.Rect(...this.params.rect))
      this.initialized = true;
    }
    var rect = this.tracker.update(data.img);

    //var dst = this.draw({img: data.img, meta: {rect:rect}})

    return {img: data.img, meta: {rect:rect}}
  }

  draw(data) {
    var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    dst.drawRectangle (
      data.meta.rect, //rect
      new cv.Vec(0, 0, 255), //  color
      2,// thickness
      cv.LINE_8,// lineType
      0// shift
    )

    return dst
  }
}
TrackerKCF.defaultParams = {
  rect : [200,150,100,100] ,
}

class Disp_TrackerKCF extends CvDisplayModule {
  process(data) {
    if (!data.meta.rect) return data;//do nothing

    this.canvas.height = data.img.rows;
    this.canvas.width = data.img.cols;

    var r = data.meta.rect
    var ctx = this.canvas.getContext("2d")
    ctx.fillStyle = this.params.fillStyle
    ctx.fillRect(r.x, r.y, r.width, r.height)

    //return {img: data.img, meta:{path: p}}
    return {img: data.img, meta:data.meta}
  }
}
Disp_TrackerKCF.defaultParams = {
  fillStyle: "rgba(255, 0, 0, 0.5)"
}

// export
module.exports = {
  TrackerKCF: TrackerKCF,
  Disp_TrackerKCF: Disp_TrackerKCF,
}
