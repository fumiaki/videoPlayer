import cv from 'opencv4nodejs'
import { createStore } from 'redux'

// Initial state
const initialState = {
  playing: false,
  frameNo: 0,
  jump: false,
}

// Actions
const PLAY = "PLAY"
const JUMP = "JUMP"
const NEXT_FRAME = "NEXT_FRAME"

export const actions = {
  play: () => ({type: PLAY}),
  jump: (frameNo) => ({type: JUMP, frameNo: frameNo}),
  nextFrame: () => ({type: NEXT_FRAME}),
}

// Reducer
export const reducer = (state, action) => {
  //console.log(action) // debug
  switch (action.type) {
    case PLAY:
      return {...state, playing: !state.playing}
    case JUMP:
      console.log(action.frameNo)
      return {...state, frameNo: action.frameNo, jump: true}
    case NEXT_FRAME:
      return {...state, frameNo: state.frameNo + 1, jump: false}
    default:
      return state;
  }
}

// Store
export const store = createStore(reducer, initialState)

// TEST listener
const testListener = () => {console.log(store.getState())}
store.subscribe(testListener)

export class VideoPlayer {
  constructor(videoPath, canvas, canvasOverlay, cvModules=[]) {
    this.videoPath = videoPath
    this.canvas = canvas
    this.canvasOverlay = canvasOverlay
    this.cvModules = cvModules
    //this.updateFilterList(cvModules)
    //this.playing = false

    store.subscribe(this.render.bind(this))
    //store.subscribe(this.playLoop.bind(this))

    this.timestamp = performance.now()
  }

  set videoPath(videoPath) {
    this._videoPath = videoPath
    this._cap = new cv.VideoCapture(videoPath);
  }

  render() {
    const state = store.getState()

    //const currentFramePos = this._cap.get(cv.CAP_PROP_POS_FRAMES)
    if(state.jump) {
      this._cap.set(cv.CAP_PROP_POS_FRAMES, state.frameNo) // too slow
    }

    this.frame = this._cap.read();
    if (this.frame.empty) {
      //this._cap.reset()
      store.dispatch(actions.jump(0))
      return
    }

    if(state.playing && !this.reserveNextFrame) {
      requestAnimationFrame(() => {
        this.reserveNextFrame = false
        store.dispatch(actions.nextFrame())
      })
      this.reserveNextFrame = true
    }

    var res = this.process({img: this.frame, meta:{}})
    this.renderFrame(res.img);
    this.renderProgressBar();
    this.renderStatus()
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

  renderProgressBar() {
    //test
    this.canvasOverlay.height = this.canvas.height
    this.canvasOverlay.width = this.canvas.width

    var fp = this._cap.get(cv.CAP_PROP_POS_FRAMES) - 1
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

  renderStatus() {
    var time2 = performance.now();
    var timeInterval = time2-this.timestamp;
    this.timestamp = time2;

    labelFramerate.innerHTML = "FPS: " + (1000/timeInterval)
    labelFrameNumber.innerHTML = "FN : " + this._cap.get(cv.CAP_PROP_POS_FRAMES )
    labelMsec.innerHTML = "MSEC : " + this._cap.get(cv.CAP_PROP_POS_MSEC )
  }

  /*
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
  */

  process(data) {
    this.cvModules.forEach(m => {
      if(m.enabled) data = m.process(data)
    })

    return data;
  }
}

//module.exports = VideoPlayer
//export default VideoPlayer
