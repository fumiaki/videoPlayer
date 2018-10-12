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
  constructor(cvModules=[]) {
    const canvas = document.getElementById('main')

    //redux stuff
    this.store = store
    this.actions = actions
    this.reducer = reducer

    this.canvas = canvas
    this.cvModules = cvModules
    this.cvModules.forEach(module => module.player = this)
    //this.updateFilterList(cvModules)
    //this.playing = false

    store.subscribe(this.render.bind(this))
    //store.subscribe(this.playLoop.bind(this))


    this.timestamp = performance.now()
  }

  render() {
    const state = store.getState()

    if(state.playing && !this.reserveNextFrame) {
      requestAnimationFrame(() => {
        this.reserveNextFrame = false
        store.dispatch(actions.nextFrame())
      })
      this.reserveNextFrame = true
    }

    var res = this.process({
      img: undefined,
      meta: {
        framePosition: 0,
        frameCount: 0,
      },
      results: {}
    })
    this.renderFrame(res.img);
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


  renderStatus() {
    const state = store.getState()

    const time2 = performance.now()
    const timeInterval = time2-this.timestamp;
    this.timestamp = time2;
    labelFramerate.innerHTML = "FPS: " + (1000/timeInterval)
  }

  process(ctx) {
    this.cvModules.forEach(m => {
      if(m.enabled) {
        const out = m.process(ctx)

        ctx.img = out.img ? out.img : ctx.img
        ctx.meta = out.meta ? out.meta : ctx.meta
        ctx.results[m.params.id] = out.result
        ctx.lastResult = out.result
      }
    })

    return ctx;
  }

  //TODO;
  saveLogs() {
    console.log("saveLogs")
    const logFile = "C:\\tmp\\videoLog.csv"

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
