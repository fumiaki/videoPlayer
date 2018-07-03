//import {LitElement}  from '/node_modules/@polymer/lit-element/lit-element.js'
//import { html, svg, render } from '/node_modules/lit-html/lit-html.js';

import {LitElement} from '@polymer/lit-element/lit-element.js'
import { html, svg, render } from 'lit-html/lit-html.js'

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
      <style>
        div {background-color: #aaaaaa}
      </style>
      <div>
        ${items.map((m, i) => {/*html`<cv-module-panel id="ck_${i}" checked="${m.enabled}" name="${m.constructor.name}" params="${JSON.stringify(m.params)}"/>`)*/
          let c = new ModulePanelElement();
          c.m = m;
          c.addEventListener("click", e => {m.enabled = !m.enabled; c.requestRender();})
          return c;
        })}
      </div>`
  }
}
customElements.define('cv-module-list', ModuleListElement)

class ModulePanelElement extends LitElement {
  static get properties() {
    return {
      m: Object
    };
  }
  constructor() {
      super()
      this.m = {name:"NO_NAME", params:{}}
  }

  _render({m}) {
    return html`
      <style>
        div {background-color: #dddddd}
        div.enabled {background-color: #4de4dd}
      </style>
      <div class="${m.enabled?'enabled':''}">
        ${m.enabled?'ON ':'OFF'}
        ${m.constructor.name} :
        ${JSON.stringify(m.params)} :
      </div>
    `
    /*
    return html`
      <tr>
        <td><input id="${id}" type="checkbox" ${m.enabled?"checked":""}/></td>
        <td>${m.constructor.name}</td>
        <td>${JSON.stringify(m.params)}</td>
      </tr>
    `*/
  }
}
customElements.define('cv-module-panel', ModulePanelElement)
