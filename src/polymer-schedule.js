import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-dialog/paper-dialog.js';
import moment from 'moment';
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
          height: 1224px;
          display: flex;
          flex-flow: row nowrap;
          background-color: #f9f9f9;
          position: relative;
        }
        .day-container {
          flex: 1 1 0;
        }
        .day-title {
          height: 24px;
          width: 100%;
          text-align: center;
          font-weight: 300;
          color: #333333;
        }
        .events-container {
          height: calc(100% - 24px);
          border-right: dotted 1px #b7b7b7;
          position: relative;
        }
        .events-container-first {
          border-left: dotted 1px #b7b7b7;
        }
        .event {
          max-width: calc(100% - 10px);
          font-size: 10pt;
          color: #212121;
          position: absolute;
          padding: 0 5px;
        }
        paper-dialog {
          width: 300px;
          margin: 0;
          position: absolute;
          z-index: 1;
        }
        paper-dialog:focus {
          outline: none;
        }
        .event-cover {
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
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

      <template is="dom-if" if="[[loading]]">
        Loading...
      </template>
      <template is="dom-if" if="[[!loading]]">
        <div class="schedule-main">
          <paper-dialog id="dialog" style$="top:[[dialogData.top]]px;left:[[dialogData.left]]px;">
            <h2>[[dialogData.title]]</h2>
            <p>[[dialogData.time]]</p>
            <p>[[dialogData.notes]]</p>
          </paper-dialog>
          <dom-repeat items="{{data.data}}" indexAs="index">
            <template>
              <div class="day-container">
                <div class="day-title">[[item.day]]</div>
                <div class$="[[_eventsContainerClasses(index)]]">
                  <dom-repeat items="{{_preprocessEvents(item.events)}}">
                    <template>
                      <div class="event" style$="background-color:#[[item.color]];width:100%;">
                        <div class="event-cover" on-tap="_openDialog" data-item$="[[item]]"></div>
                        <strong>[[_prettyTime(item.startTime)]]</strong>
                        [[item.title]]
                      </div>
                    </template>
                  </dom-repeat>
                </div>
              </div>
            </template>
          </dom-repeat>
        </div>
      </template>
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
      dialogData: {
        type: Object,
        value: {
          top: 0,
          left: 0,
          title: 'No title',
          time: '',
          notes: ''
        }
      }
    };
  }

  handleError(err) {
    console.error('[polymer-schedule]:', err.detail.error.message);
  }

  handleResponse(res) {
    this.data = res.detail.xhr.response;
    this.loading = false;
    console.log(this.data);
  }

  // This is so stupid
  _eventsContainerClasses(index) {
    return (index == 0) ? 'events-container events-container-first' : 'events-container';
  }

  _prettyTime(timeString) {
    return moment(timeString).format('h:mm A');
  }

  _preprocessEvents(events) {
    var modifiedEvents = [];
    modifiedEvents = events;
    return modifiedEvents;
  }

  _openDialog(event) {
    const mainBounds = event.detail.sourceEvent.path[4].getBoundingClientRect();
    const parentBounds = event.detail.sourceEvent.path[0].getBoundingClientRect();

    const dialog = this.shadowRoot.querySelector('#dialog');
    const item = event.model.item;

    this.dialogData = {
      top: 24,
      left: (parentBounds.right-mainBounds.left+300 < mainBounds.right-mainBounds.left) ? parentBounds.right-mainBounds.left : parentBounds.left-mainBounds.left-300,
      title: item.title,
      time: moment(item.startTime).format('h:mm A') + ' to ' + moment(item.endTime).format('h:mm A'),
      notes: item.notes
    };
    
    dialog.open();
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);