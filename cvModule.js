var cv = require('opencv4nodejs');

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

class CvtColor extends CvModule {
  process(data) {
    return {
      img: data.img.cvtColor(this.params.color),
      meta: data.meta
    }
  }
}
CvtColor.RGB2GRAY = cv.COLOR_RGB2GRAY
CvtColor.RGBA2GRAY = cv.COLOR_RGBA2GRAY
CvtColor.GRAY2RGB = cv.COLOR_GRAY2RGB
CvtColor.GRAY2RGBA = cv.COLOR_GRAY2RGBA
CvtColor.defaultParams = {
  color: CvtColor.RGBA2GRAY
}

class Threshold extends CvModule {
  process(data) {
    return {
      img: data.img.threshold(
        this.params.thresh,
        this.params.maxVal,
        this.params.thresholdType
      ),
      meta: data.meta
    }
  }
}
Threshold.BINARY = cv.THRESH_BINARY
Threshold.BINARY_INV = cv.THRESH_BINARY_INV
Threshold.TRUNC = cv.THRESH_TRUNC
Threshold.TOZERO = cv.THRESH_TOZERO
Threshold.TOZERO_INV = cv.THRESH_TOZERO_INV
Threshold.defaultParams = {
  thresh: 127,
  maxVal: 255,
  thresholdType: Threshold.BINARY
}

class AdaptiveThreshold extends CvModule {
  process(data) {
    return {
      img: data.img.adaptiveThreshold(
        this.params.maxVal,
        this.params.adaptiveMethod,
        this.params.thresholdType,
        this.params.blockSize,
        this.params.C
      ),
      meta: data.meta
    }
  }
}
AdaptiveThreshold.MEAN_C = cv.ADAPTIVE_THRESH_MEAN_C
AdaptiveThreshold.GAUSSIAN_C = cv.ADAPTIVE_THRESH_GAUSSIAN_C
AdaptiveThreshold.defaultParams = {
  maxVal: 255,
  adaptiveMethod : AdaptiveThreshold.GAUSSIAN_C,
  thresholdType: Threshold.BINARY,
  blockSize: 11,
  C: 2
}

class GaussianBlur extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this.params.ksizeObj = new cv.Size(this.params.ksize[0], this.params.ksize[1])
  }
  process(data) {
    return {
      img: data.img.gaussianBlur(
        this.params.ksizeObj,
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

class Sobel extends CvModule {
  process(data) {
    return {
      img: data.img.sobel(
        this.params.ddepth,
        this.params.dx,
        this.params.dy,
        this.params.ksize,
        this.params.scale,
        this.params.delta,
        this.params.borderType
      )
      .abs()
      .convertTo(cv.CV_8U),
      meta: data.meta
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
  process(data) {
    return {
      img: data.img.canny(
        this.params.minVal,
        this.params.maxVal
      ),
      meta: data.meta
    }
  }
}
Canny.defaultParams = {
  minVal: 40,
  maxVal: 20,
}


class Dilate extends CvModule {
  process(data) {
    return {
      img: data.img.dilate(
        this.params.kernel,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      ),
      meta: data.meta
    }
  }
}
Dilate.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class Erode extends CvModule {
  process(data) {
    return {
      img: data.img.erode(
        this.params.kernel,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      ),
      meta: data.meta
    }
  }
}
Erode.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}

class MorphologyEx extends CvModule {
  process(data) {
    return {
      img: data.img.morphologyEx(
        this.params.kernel,
        this.params.morphType,
        this.params.anchor,
        this.params.iterations,
        this.params.borderType
      ),
      meta: data.meta
    }
  }
}
MorphologyEx.MORPH_OPEN = cv.MORPH_OPEN
MorphologyEx.MORPH_CLOSE = cv.MORPH_CLOSE
MorphologyEx.MORPH_GRADIENT = cv.MORPH_GRADIENT
MorphologyEx.MORPH_TOPHAT = cv.MORPH_TOPHAT
MorphologyEx.MORPH_BLACKHAT = cv.MORPH_BLACKHAT
MorphologyEx.defaultParams = {
  kernel: new cv.Mat(5, 5, cv.CV_8U, 1),
  morphType : cv.MORPH_OPEN,
  anchor: new cv.Point2(-1, -1),
  iterations: 1,
  borderType: cv.BORDER_CONSTANT
}


class HoughLines extends CvModule {
  process(data) {
    var lines = data.img.houghLines(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.srn,
      this.params.stn,
      this.params.min_theta,
      this.params.max_theta
    );

    var dst = this.draw({img: data.img, meta: lines})

    return {img: dst, meta: lines}
  }

  draw(data) {
    var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    data.meta.forEach(vec2 => {
      var rho = vec2.x
      var theta  = vec2.y
      var a = Math.cos(theta)
      var b = Math.sin(theta)
      var x0 = a*rho
      var y0 = b*rho
      var l = 2000

      var x1 = x0 + l*(-b)
      var y1 = y0 + l*(a)
      var x2 = x0 - l*(-b)
      var y2 = y0 - l*(a)

      dst.drawLine (
        new cv.Point2(x1,y1),
        new cv.Point2(x2,y2),
        new cv.Vec(128, 0, 128),
        1,
        cv.LINE_8,
        0
      )
    })
    return dst
  }
}
HoughLines.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 100,
  srn: 0.0,
  stn: 0.0,
  min_theta: 0.0,
  max_theta: Math.PI
}

class HoughLines2 extends CvDisplayModule {
  process(data) {
    var lines = data.img.houghLines(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.srn,
      this.params.stn,
      this.params.min_theta,
      this.params.max_theta
    );

    this.draw({img: data.img, meta: lines})

    return {img: data.img, meta: lines}
  }

  draw(data) {
    this.canvas.height = data.img.rows;
    this.canvas.width = data.img.cols;

    var ctx = this.canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "rgba(128, 0, 128, 0.8)"
    ctx.lineWidth = "1"
    data.meta.forEach(vec2 => {
      var rho = vec2.x
      var theta  = vec2.y
      var a = Math.cos(theta)
      var b = Math.sin(theta)
      var x0 = a*rho
      var y0 = b*rho
      var l = 2000

      var x1 = x0 + l*(-b)
      var y1 = y0 + l*(a)
      var x2 = x0 - l*(-b)
      var y2 = y0 - l*(a)

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    })
    ctx.stroke();
  }
}
HoughLines2.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 100,
  srn: 0.0,
  stn: 0.0,
  min_theta: 0.0,
  max_theta: Math.PI
}

class HoughLinesP extends CvModule {
  process(data) {
    var lines = data.img.houghLinesP(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.minLineLength,
      this.params.maxLineGap
    );

    var dst = this.draw({img: data.img, meta: lines})

    return {img: dst, meta: lines}
  }

  draw(data) {
        var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
        data.meta.forEach(vec4 => {
          var x1 = vec4.w
          var y1 = vec4.x
          var x2 = vec4.y
          var y2 = vec4.z

          dst.drawLine (
            new cv.Point2(x1,y1),
            new cv.Point2(x2,y2),
            new cv.Vec(255, 0, 0),
            2,
            cv.LINE_8,
            0
          )
        })
        return dst
  }
}
HoughLinesP.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 50,
  minLineLength: 30,
  maxLineGap: 10
}
class HoughLinesP2 extends CvDisplayModule {
  process(data) {
    var lines = data.img.houghLinesP(
      this.params.rho,
      this.params.theta,
      this.params.threshold,
      this.params.minLineLength,
      this.params.maxLineGap
    );

    this.draw({img: data.img, meta: lines})

    return {img: data.img, meta: lines}
  }

  draw(data) {
    this.canvas.height = data.img.rows;
    this.canvas.width = data.img.cols;

    var ctx = this.canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 0, 255, 0.8)"
    ctx.lineWidth = "2"
    data.meta.forEach(vec4 => {
      var x1 = vec4.w
      var y1 = vec4.x
      var x2 = vec4.y
      var y2 = vec4.z

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    })
    ctx.stroke();
  }
}
HoughLinesP2.defaultParams = {
  rho: 1,
  theta: Math.PI/180.0,
  threshold: 50,
  minLineLength: 30,
  maxLineGap: 10
}

class HoughCircles extends CvModule {
  process(data) {
    var circles = data.img.houghCircles(
      this.params.method,
      this.params.dp,
      this.params.minDist,
      this.params.param1,
      this.params.param2,
      this.params.minRadius,
      this.params.maxRadius
    );

    var dst = this.draw({img: data.img, meta: circles})

    return {img: dst, meta: circles}
  }

  draw(data) {
    var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);
    data.meta.forEach(vec3 => {
      var x = vec3.x
      var y = vec3.y
      var r = vec3.z

      dst.drawCircle (
        new cv.Point2(x,y), //center
        r, // radius
        new cv.Vec(0, 0, 255), //  color
        2,// thickness
        cv.LINE_8,// lineType
        0// shift
      )
    })
    return dst
  }
}
HoughCircles.defaultParams = {
  method: cv.HOUGH_GRADIENT,
  dp: 1,
  minDist: 20,
  param1: 100.0,
  param2: 100.0,
  minRadius: 0,
  maxRadius: 0
}

class BackgroundSubtractorMOG2 extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.bgSubtractor  = new cv.BackgroundSubtractorMOG2()
  }

  process(data) {
    var dst = this.bgSubtractor.apply(data.img)
    return {img: dst, meta: data.meta}
  }
}
BackgroundSubtractorMOG2.defaultParams = {
  /*
  sigma : number ,
  lambda : number ,
  interp_factor : number ,
  output_sigma_factor : number ,
  pca_learning_rate : number ,
  resize : boolean ,
  split_coeff : boolean ,
  wrap_kernel : boolean ,
  compress_feature : boolean ,
  max_patch_size : int ,
  compressed_size : int ,
  desc_pca : uint ,
  desc_npca : uint
  */
}

class ConnectedComponentsWithStats extends CvModule {
  process(data) {
    var result = data.img.connectedComponentsWithStats (
      this.params.connectivity,
      this.params.ltype
    )

    var dst = this.draw({img: data.img, meta: result})

    return {img: dst, meta: result}
  }

  draw(data) {
    //var dst = result.labels.convertTo(cv.CV_8U).cvtColor(cv.COLOR_GRAY2BGR)
    var dst = data.img.copy().cvtColor(cv.COLOR_GRAY2BGR);

    var statsArr = data.meta.stats.getDataAsArray()
    statsArr.forEach(stat => {
      //console.log(data)
      dst.drawRectangle (
        new cv.Rect(stat[0], stat[1], stat[2], stat[3]), //rect
        new cv.Vec(0, 0, 255), //  color
        2,// thickness
        cv.LINE_8,// lineType
        0// shift
      )
    })
    var centroidsArr = data.meta.centroids.getDataAsArray()
    centroidsArr.forEach(centroid => {
      //console.log(data)
      dst.drawCircle (
        new cv.Point2(centroid[0], centroid[1]), //center
        4, // radius
        new cv.Vec(0, 255, 255), //  color
        2,// thickness
        cv.LINE_8,// lineType
        0// shift
      )
    })

    return dst

  }
}
ConnectedComponentsWithStats.defaultParams = {
  connectivity: 8,
  ltype: cv.CV_32S,
}


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
      this.tracker.init(data.img, new cv.Rect(200,150,100,100))
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
  /*
  sigma : number ,
  lambda : number ,
  interp_factor : number ,
  output_sigma_factor : number ,
  pca_learning_rate : number ,
  resize : boolean ,
  split_coeff : boolean ,
  wrap_kernel : boolean ,
  compress_feature : boolean ,
  max_patch_size : int ,
  compressed_size : int ,
  desc_pca : uint ,
  desc_npca : uint
  */
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
  CvModule: CvModule,
  CvtColor: CvtColor,
  Threshold: Threshold,
  AdaptiveThreshold: AdaptiveThreshold,
  GaussianBlur: GaussianBlur,
  Dilate: Dilate,
  Erode: Erode,
  MorphologyEx: MorphologyEx,
  Sobel: Sobel,
  Canny: Canny,
  HoughLines: HoughLines,
  HoughLines2: HoughLines2,
  HoughLinesP: HoughLinesP,
  HoughLinesP2: HoughLinesP2,
  HoughCircles: HoughCircles,
  TrackerKCF: TrackerKCF,
  BackgroundSubtractorMOG2: BackgroundSubtractorMOG2,
  ConnectedComponentsWithStats: ConnectedComponentsWithStats,
  Disp_TrackerKCF: Disp_TrackerKCF,
}
