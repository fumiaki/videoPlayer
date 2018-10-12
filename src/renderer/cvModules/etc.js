var cv = require('opencv4nodejs');
var base = require("./base");

var CvModule = base.CvModule;
var CvDisplayModule = base.CvDisplayModule;


class BackgroundSubtractorMOG2 extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.bgSubtractor  = new cv.BackgroundSubtractorMOG2()
  }

  process(ctx) {
    var dst = this.bgSubtractor.apply(ctx.img)
    return {img: dst}
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
  process(ctx) {
    var result = ctx.img.connectedComponentsWithStats (
      this.params.connectivity,
      this.params.ltype
    )

    var dst = this.draw({...ctx, lastResult: result})

    return {img:dst, result}
  }

  draw(ctx) {
    //var dst = result.labels.convertTo(cv.CV_8U).cvtColor(cv.COLOR_GRAY2BGR)
    var dst = ctx.img.copy().cvtColor(cv.COLOR_GRAY2BGR);

    var statsArr = ctx.lastResult.stats.getDataAsArray()
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
    var centroidsArr = ctx.lastResult.centroids.getDataAsArray()
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

// export
module.exports = {
  BackgroundSubtractorMOG2: BackgroundSubtractorMOG2,
  ConnectedComponentsWithStats: ConnectedComponentsWithStats,
}
