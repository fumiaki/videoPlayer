import cv from 'opencv4nodejs'
import csv from 'csv'
import path from 'path'
import fs from 'fs'
import { createStore } from 'redux'
import {MDCSlider} from '@material/slider'

import cm from './cvModules';

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
//const testListener = () => {console.log(store.getState())}
//store.subscribe(testListener)

export class VideoPlayer {
  constructor(videoPath, canvas, canvasOverlay, cvModules=[]) {
    //redux stuff
    this.store = store
    this.actions = actions
    this.reducer = reducer

    // slider
    this.slider = new MDCSlider(document.querySelector('#sldMain'));
    this.slider.listen('MDCSlider:input', () => {
      console.log(`Value changed to ${this.slider.value}`)
      if(store.getState().frameNo != this.slider.value) {
        store.dispatch(actions.jump(this.slider.value))
      }
    });

    this.videoPath = videoPath
    this.canvas = canvas
    this.canvasOverlay = canvasOverlay
    this.cvModules = cvModules
    this.cvModules.forEach(module => module.player = this)
    //this.updateFilterList(cvModules)
    //this.playing = false

    store.subscribe(this.render.bind(this))
    //store.subscribe(this.playLoop.bind(this))


    this.timestamp = performance.now()
  }

  set videoPath(videoPath) {
    this._videoPath = videoPath
    this._cap = new cv.VideoCapture(videoPath);
    var fc = this._cap.get(cv.CAP_PROP_FRAME_COUNT)

    this.slider.min = 0
    this.slider.max = fc
  }

  render() {
    const state = store.getState()

    if(state.save) {
      saveLogs()
      return
    }

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
    var fp = this._cap.get(cv.CAP_PROP_POS_FRAMES) - 1
    var fc = this._cap.get(cv.CAP_PROP_FRAME_COUNT)

    //this.slider.min = 0
    //this.slider.max = fc
    this.slider.value = fp

    //test
    this.canvasOverlay.height = this.canvas.height
    this.canvasOverlay.width = this.canvas.width
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
    const state = store.getState()

    const time2 = performance.now()
    const timeInterval = time2-this.timestamp;
    this.timestamp = time2;

    labelFramerate.innerHTML = "FPS: " + (1000/timeInterval)
    labelFrameNumber.innerHTML = "FN : " + this._cap.get(cv.CAP_PROP_POS_FRAMES ) + " : " + state.frameNo + " / " + this._cap.get(cv.CAP_PROP_FRAME_COUNT)

    const pos_ms = this._cap.get(cv.CAP_PROP_POS_MSEC )
    const time = new Date(pos_ms)
    var ms = ("000" + time.getMilliseconds()).slice(-3)
    const sec = ("00" + time.getSeconds()).slice(-2)
    const min = ("00" + time.getMinutes()).slice(-2)
    labelMsec.innerHTML = "TIME: " + min + ":" + sec + "." + ms
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

  //TODO;
  saveLogs() {
    console.log("saveLogs")
    const logFile = "C:\\Users\\f.oshima3978\\Desktop\\tmp\\videoLog.csv"

    const stringifier = csv.stringify({header: false})
    const writableStream = fs.createWriteStream(logFile, {flags: 'w', encoding: 'utf-8'})
    stringifier.pipe(writableStream)
    //stringifier.pipe(process.stdout)

    const logs = []
    const labels = ["frameNo"]
    var max = 0
    this.cvModules.forEach(m => {
      if(m instanceof cm.CvLogModule) {
        //console.log(m.params.label + " : " + m.logData.length)
        logs.push(m.logData)
        labels.push(m.params.label)
        max = m.logData.length > max ? m.logData.length : max
      }
    })
    //console.log("max : " + max)
    //console.log(logs)
    stringifier.write(labels)

    let rowData = []
    for(let i = 0; i < max; i++) {
      rowData[0] = i
      logs.forEach((log,j) => {

        rowData[j+1] = log[i] ? log[i] : rowData[j+1]
      })
      stringifier.write(rowData)
      //console.log(rowData)
    }
    stringifier.destroy()
  }
}

//module.exports = VideoPlayer
//export default VideoPlayer
