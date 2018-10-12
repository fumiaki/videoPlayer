// Base class
class CvModule {
  constructor(params, enabled=true) {
    const id = params.id ? params.id : this.generateUuid()
    //this.params = Object.assign({}, this.constructor.defaultParams, params)
    this.params = {
      ...this.constructor.defaultParams,
      ...params,
      id
    }
    this.enabled = enabled
  }

  /* context data model
  {
    img: ((Image Data)),
    meta: {
      frameCount: ((Total Frame)),
      framePosition: ((Current Frame Position))
    },
    lastResult: {
      ((alias for Results of last processed Module))
    },
    results: {
      ((moduleId)) : {
        ((Results of the Module))
      },
      ((moduleId)) : {
        ((Results of the Module))
      },
      ........
    }
  }
  */
  /* return data model
  {
    img((option)): ((Image Data)),
    meta((option)): {
      frameCount: ((Total Frame)),
      framePosition: ((Current Frame Position))
    },
    result((option)): {
      ((Result of this Module))
    }
  }
  */
  process(context) {
    // do nothing
    return {}
  }

  generateUuid() {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
  }
}
CvModule.defaultParams = {
  id: undefined
}

// Base class for display metadata
class CvDisplayModule extends CvModule {
  constructor(params, enabled) {
    super(params, enabled)

    this.canvas = document.createElement("canvas")
    this.canvas.style.position = "absolute"
    this.canvas.id = this.params.id
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
CvDisplayModule.defaultParams = {
  ...CvModule.defaultParams,
  visible: true
}

// export
module.exports = {
  CvModule: CvModule,
  CvDisplayModule: CvDisplayModule
}
