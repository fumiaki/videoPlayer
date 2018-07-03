var cv = require('opencv4nodejs');

class VideoPlayer {
  constructor(videoPath, canvas, canvasOverlay, cvModules=[]) {
    this.videoPath = videoPath
    this.canvas = canvas
    this.canvasOverlay = canvasOverlay
    this.cvModules = cvModules
    //this.updateFilterList(cvModules)
    this.playing = false;

    this.timestamp = performance.now();
  }

  set videoPath(videoPath) {
    this._videoPath = videoPath
    this._cap = new cv.VideoCapture(videoPath);
  }

  play() {
    if(!this.playing) {
       requestAnimationFrame(this.play.bind(this))
       return
    }

    var frame = this._cap.read();
    if (frame.empty) {
      this._cap.reset();
      frame = this._cap.read();
    }

    //setTimeout(this.play.bind(this), 1)
    requestAnimationFrame(this.play.bind(this))
    var res = this.process({img: frame, meta:{}})
    this.renderFrame(res.img);
    this.renderProgressBar();
    this.updateStatus()

    //setTimeout(this.play.bind(this), 1)
  }

  renderFrame(img) {
    var matRGBA = img.channels === 1 ? img.cvtColor(cv.COLOR_GRAY2RGBA) : img.cvtColor(cv.COLOR_BGR2RGBA);

    this.canvas.height = img.rows;
    this.canvas.width = img.cols;

    var imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      img.cols,
      img.rows
    );

    this.canvas.getContext('2d').putImageData(imgData, 0, 0);
  }

  /*
  renderMetadata(meta) {
    this.canvasOverlay.height = this.canvas.height
    this.canvasOverlay.width = this.canvas.width
    //this.renderProgressBar();

    if (!meta.path) return;

    var ctx = this.canvasOverlay.getContext('2d');
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    ctx.fill(meta.path)
  }
  */

  renderProgressBar() {
    //test
    this.canvasOverlay.height = this.canvas.height
    this.canvasOverlay.width = this.canvas.width

    var fp = this._cap.get(cv.CAP_PROP_POS_FRAMES)
    var fc = this._cap.get(cv.CAP_PROP_FRAME_COUNT)
    var x = fp*this.canvas.width/fc

    var ctx = this.canvasOverlay.getContext('2d');
    ctx.fillStyle = "rgb(255, 127, 0)";
    //ctx.fillRect (x, 0, 1, this.canvas.height);
    ctx.font = "24px serif";
    ctx.fillText(fp, x+4, this.canvas.height-4);
    ctx.fillStyle = "rgba(255, 255, 127, 0.5)";
    ctx.fillRect (0, this.canvas.height-24, x, this.canvas.height);
    //var p = new Path2D("M10 10 h 80 v 80 h -80 Z");
    //ctx.fill(p)
  }

  updateStatus() {
    var time2 = performance.now();
    var timeInterval = time2-this.timestamp;
    this.timestamp = time2;

    labelFramerate.innerHTML = "FPS: " + (1000/timeInterval)
    labelFrameNumber.innerHTML = "FN : " + this._cap.get(cv.CAP_PROP_POS_FRAMES )
    labelMsec.innerHTML = "MSEC : " + this._cap.get(cv.CAP_PROP_POS_MSEC )
  }

  updateFilterList(cvModules) {
    var htmlstg = "<table>"
    cvModules.forEach((m, i) => {
      htmlstg += `<tr>
      <td><input id="ck_${i}" type="checkbox" ${m.enabled?"checked":""}/></td>
      <th>${m.constructor.name}</th>
      <td>${JSON.stringify(m.params)}</td>
      </tr>`
    })
    htmlstg += "</table>"

    labelFilterList.innerHTML = htmlstg
    cvModules.forEach((m, i) => {
      window[`ck_${i}`].addEventListener("click",e => {m.enabled = !m.enabled;this.updateFilterList(cvModules)})
    })
  }

  process(data) {
    this.cvModules.forEach(m => {
      if(m.enabled) data = m.process(data)
    })

    return data;
  }
}

module.exports = VideoPlayer
