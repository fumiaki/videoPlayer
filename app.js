var cv = require('opencv4nodejs');
var cm = require('./cvModule.js');

class VideoPlayer {
  constructor(videoPath, canvas, cvModules=[]) {
    this.videoPath = videoPath
    this.canvas = canvas
    this.cvModules = cvModules
    this.updateFilterList(cvModules)
    this.playing = false;

    this.timestamp = performance.now();
  }

  set videoPath(videoPath) {
    this._videoPath = videoPath
    this._cap = new cv.VideoCapture(videoPath);
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

  play() {
    if(!this.playing) {
       setTimeout(this.play.bind(this), 33)
       return
    }

    var frame = this._cap.read();
    if (frame.empty) {
      this._cap.reset();
      frame = this._cap.read();
    }

    setTimeout(this.play.bind(this), 1)
    var dst = this.processImage(frame)
    this.renderFrame(dst);

    this.updateStatus()

    //setTimeout(this.play.bind(this), 1)
  }

  updateStatus() {
    var time2 = performance.now();
    var timeInterval = time2-this.timestamp;
    this.timestamp = time2;

    labelFramerate.innerHTML = "FPS: " + (1000/timeInterval)
    labelFrameNumber.innerHTML = "FN : " + this._cap.get(cv.CAP_PROP_POS_FRAMES )
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

  processImage(img) {
    this.cvModules.forEach(m => {
      if(m.enabled) img = m.process(img)
    })

    return img;
  }
}
