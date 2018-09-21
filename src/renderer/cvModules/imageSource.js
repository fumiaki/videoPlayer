const cv = require('opencv4nodejs')
const base = require("./base")
const path = require("path")
const {MDCSlider} = require('@material/slider')

const CvModule = base.CvModule

class VideoSource extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this._initCapture()
    this.playing = true
  }

  _initCapture() {
    const cap = new cv.VideoCapture(path.resolve(this.params.source))

    this.frameCount = cap.get(cv.CAP_PROP_FRAME_COUNT)
    this.cap = cap

    if (this.params.uiContainer) {
      this._buildUi()
    } else if (this.params.uiElements) {
      console.log(this.params.uiElements)
    } else {
      console.log("NO UI")
    }
  }

  _buildUi() {
    const id = this.params.id
    const controller = document.createElement("div")
    controller.innerHTML = `
    <mwc-button id="${id}-btnONOFF">${id}</mwc-button>
    <mwc-button id="${id}-btnReset">Reset</mwc-button>
    <mwc-button id="${id}-btnBack10">-10</mwc-button>
    <mwc-button id="${id}-btnBack">-1</mwc-button>
    <mwc-button id="${id}-btnPlay">Play/Pause</mwc-button>
    <mwc-button id="${id}-btnForward">+1</mwc-button>
    <mwc-button id="${id}-btnForward10">+10</mwc-button>

    <div id="${id}-sldProgress" class="mdc-slider mdc-slider--discrete" tabindex="0" role="slider"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
         data-step="1" aria-label="Select Value">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
        <!--div class="mdc-slider__track-marker-container"></div-->
      </div>
      <div class="mdc-slider__thumb-container">
        <div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker"></span>
        </div>
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>
    `
    const container = document.getElementById(this.params.uiContainer)
    container.appendChild(controller)

    // addEventListener
    document.querySelector(`#${id}-btnONOFF`).addEventListener("click", () => {
      this.enabled = !this.enabled
    })
    document.querySelector(`#${id}-btnReset`).addEventListener("click", () => {
      this.cap.set(cv.CAP_PROP_POS_FRAMES, 0)
    })
    document.querySelector(`#${id}-btnBack10`).addEventListener("click", () => {
      const pos = this.cap.get(cv.CAP_PROP_POS_FRAMES)
      this.cap.set(cv.CAP_PROP_POS_FRAMES, pos - 10)
    })
    document.querySelector(`#${id}-btnBack`).addEventListener("click", () => {
      const pos = this.cap.get(cv.CAP_PROP_POS_FRAMES)
      this.cap.set(cv.CAP_PROP_POS_FRAMES, pos - 1)
    })
    document.querySelector(`#${id}-btnPlay`).addEventListener("click", () => {
      this.playing = !this.playing
    })
    document.querySelector(`#${id}-btnForward`).addEventListener("click", () => {
      const pos = this.cap.get(cv.CAP_PROP_POS_FRAMES)
      this.cap.set(cv.CAP_PROP_POS_FRAMES, pos + 1)
    })
    document.querySelector(`#${id}-btnForward10`).addEventListener("click", () => {
      const pos = this.cap.get(cv.CAP_PROP_POS_FRAMES)
      this.cap.set(cv.CAP_PROP_POS_FRAMES, pos + 10)
    })


    // slider
    const slider = new MDCSlider(document.querySelector(`#${id}-sldProgress`));
    slider.min = 0
    slider.max = this.frameCount
    slider.listen('MDCSlider:input', () => {
      this.cap.set(cv.CAP_PROP_POS_FRAMES, slider.value)
    })
    this.slider = slider

  }

  process(data) {
    if (this.playing) {
      this.pos = this.cap.get(cv.CAP_PROP_POS_FRAMES)
      this.img = this.cap.read()

      if (this.img.empty) {
        this.cap.set(cv.CAP_PROP_POS_FRAMES, 0)
        this.img = this.cap.read()
        this.pos = 0
      }

      this.slider.value = this.pos
    }

    return {
      img: this.img,
      meta: this.pos
    }
  }
}
VideoSource.defaultParams = {
  id: "video1",
  source: path.resolve('asset', 'vtest.avi'),
  uiContainer: undefined,
  uiElements: {
    play:"test",
    slider:"",
    reset:"",
    forword:"",
    back:"",
  }
}

class CameraSource extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)
    this._initCapture()
  }

  _initCapture() {
    const cap = new cv.VideoCapture(this.params.source)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, this.params.width)
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, this.params.height)

    this.cap = cap
  }

  process(data) {
    var img = this.cap.read()
    return {
      img: img,
      meta: {}
    }
  }
}
CameraSource.defaultParams = {
  source: 0,
  width: 640,
  height: 480
}

// export
module.exports = {
  VideoSource: VideoSource,
  CameraSource: CameraSource
}
