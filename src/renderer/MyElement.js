//import {LitElement}  from '/node_modules/@polymer/lit-element/lit-element.js'
//import { html, svg, render } from '/node_modules/lit-html/lit-html.js';

import {LitElement} from '@polymer/lit-element/lit-element.js'
import { html, svg, render } from 'lit-html/lit-html.js'
//import {MDCCard} from '@material/card'


class ModuleListElement extends LitElement {
  static get properties() {
    return {
      items: Array
    };
  }
  constructor() {
      super();
      this.items = new Array();
  }

  _render({items}) {
    return html`
      <div>
        ${items.map((m, i) => {/*html`<cv-module-panel id="ck_${i}" checked="${m.enabled}" name="${m.constructor.name}" params="${JSON.stringify(m.params)}"/>`)*/
          const c = new ModulePanelElement(m);
          //c.m = m;
          //c.addEventListener("click", e => {m.enabled = !m.enabled; c.requestRender();})
          return c;
        })}
      </div>`
  }

  _createRoot() {
    return this
  }
}
customElements.define('cv-module-list', ModuleListElement)

class ModulePanelElement extends LitElement {
  static get properties() {
    return {
      m: Object
    };
  }

  constructor(cvmodule) {
      super()
      this.m = cvmodule
      this.checkButton = new CheckButtonElement(cvmodule.enabled)

      this.checkButton.addEventListener("click", e => {
        this.m.enabled = !this.m.enabled
        this.checkButton.checked = this.m.enabled
        this.requestRender()
      })
  }

  _render({m}) {
    return html`
      <style>
      div.enabled {background-color: #eeffff}
      div.mdc-card {margin: 16px}
      </style>
      <div class="mdc-card ${m.enabled?'enabled':''}">
        <!-- ... content ... -->
        <div class="mdc-typography--headline6">${m.constructor.name}</div>
        <div class="mdc-typography--body2">${JSON.stringify(m.params)}</div>

        <div class="mdc-card__actions">
          <div class="mdc-card__action-icons">
            ${this.checkButton}
            <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="More options">more_vert</button>
          </div>
        </div>
      </div>
    `
  }
  _createRoot() {
    return this
  }
}
customElements.define('cv-module-panel', ModulePanelElement)


class CheckButtonElement extends LitElement {
  static get properties() {
    return {
      checked: Boolean
    };
  }
  constructor(checked) {
      super()
      this.checked = checked
  }

  _render({checked}) {
    return html`
      <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
       title="enable/disable">
        ${checked ? 'check_box' : 'check_box_outline_blank'}
      </button>
    `
  }
  _createRoot() {
    return this
  }
}
customElements.define('cv-check-button', CheckButtonElement)
