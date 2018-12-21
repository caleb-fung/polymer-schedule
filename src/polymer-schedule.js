import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PolymerSchedule extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
        .schedule-main {
          display: flex;
          justify-content: center;
          background-color: #f2f2f2;
        }
        .test-container {
          height: 480px;
          width: 300px;
          background-color: lightgray;
          position: relative;
        }
        .test-event {
          /* min-height: 100px; */
          position: absolute;
        }
      </style>

      <div class="schedule-main">
        <div class="day-container">
          <div class="test-container">
            <div class="test-event" style="background-color:#4286f4;height:200px;width:50%;top:0px;left:0%;z-index:1;"></div>
            <div class="test-event" style="background-color:#f46541;height:200px;width:50%;top:50px;left:50%;"></div>
            
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);