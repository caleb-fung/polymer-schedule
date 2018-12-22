import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
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
      </style>

      <iron-ajax
        auto
        url="http://127.0.0.1:8082/api/schedules/some-token/1"
        handle-as="json"
        on-error="handleError"
        on-response="handleResponse"
        debounce-duration="300">
      </iron-ajax>

      <div class="schedule-main">
        <template is="dom-if" if="[[loading]]">
          Loading...
        </template>
        <template is="dom-if" if="[[!loading]]">
          <dom-repeat items="{{data.data}}">
            <template>
              [[item.day]]
            </template>
          </dom-repeat>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      loading: {
        type: Boolean,
        value: true
      },
      data: {
        type: Array,
        value: []
      },
    };
  }

  handleError(err) {
    console.error('[polymer-schedule]:', err.detail.error.message);
  }

  handleResponse(res) {
    // res.detail.xhr.status == 200
    this.data = res.detail.xhr.response;
    this.loading = false;
    console.log(this.data);
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);