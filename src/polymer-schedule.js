import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-icon/iron-icon.js';
// import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-icons/notification-icons.js';
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
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .event-cover {
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
        }

        /* Dialog */
        paper-card {
          width: 300px;
          margin: 0;
          padding: 5px 9px;
          position: absolute;
          z-index: 1;
        }
        paper-card:focus {
          outline: none;
        }
        paper-card > h2 {
          font-size: 16pt;
          margin: 0 0 6px 0;
        }
        paper-card > p {
          font-size: 11pt;
          margin: 3px 0 3px 0;
        }
        paper-card > p > iron-icon {
          --iron-icon-height: 18px;
          --iron-icon-width: 18px;
          margin-right: 6px;
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
        <div class="schedule-main" on-tap="_closeDialog">
          <paper-card elevation="3" hidden$="[[hidden]]" style$="top:[[dialogData.top]]px;left:[[dialogData.left]]px;">
            <h2>[[dialogData.title]]</h2>
            <p><iron-icon icon="device:access-time"></iron-icon> [[dialogData.time]]</p>
            <template is="dom-if" if="[[_isNonEmptyString(dialogData.notes)]]">
              <p><iron-icon icon="notification:event-note"></iron-icon> [[dialogData.notes]]</p>
            </template>
          </paper-card>
          <dom-repeat items="{{data.data}}" indexAs="index">
            <template>
              <div class="day-container">
                <div class="day-title">[[item.day]]</div>
                <div class$="[[_eventsContainerClasses(index)]]">
                  <dom-repeat items="{{_preprocessEvents(item.events)}}" indexAs="_index">
                    <template>
                      <div class="event" style$="background-color:#[[item.color]];width:calc([[item.width]]% - 10px);left:[[item.left]]%;height:[[item.height]]px;top:[[item.top]]px;">
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
      scheduleHeight: {
        type: Number,
        value: 1224
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
      },
      hidden: { // Won't work if part of `dialogData`
        type: Boolean, 
        value: true 
      }
    };
  }

  handleError(err) {
    console.error('[polymer-schedule]:', err.detail.error.message);
  }

  handleResponse(res) {
    this.data = res.detail.xhr.response;

    this.data.data.forEach((day) => {
      var overlaps = [];
      for (const i in day.events) {
        day.events[i].width = 100;
        day.events[i].left = 0;
        const startTime = Number.parseInt(moment(day.events[i].startTime).format('HHmm'), 10);
        const endTime = Number.parseInt(moment(day.events[i].endTime).format('HHmm'), 10);
        day.events[i]._startTime = startTime;
        day.events[i]._endTime = endTime;
        day.events[i].top = startTime*(this.scheduleHeight/2400);
        day.events[i].height = (endTime-startTime)*(this.scheduleHeight/2400);
        if (i == 0) continue;
        if (day.events[i].startTime <= day.events[i-1].endTime) {
          if (i == 1) overlaps.push(day.events[i-1]);
          overlaps.push(day.events[i]);
        }
      }
      var cols = overlaps.length;
      for (const i in overlaps) {
        var modified = false;
        overlaps[i].startUnder = -1;
        overlaps[i].units = 1;
        overlaps[i].dirty = false;
        for (const j in overlaps) {
          if (overlaps[i]._startTime >= overlaps[j]._endTime && !overlaps[j].dirty) {
            if (!modified) {
              cols--;
              overlaps[i].startUnder = j;
              modified = true;
              overlaps[i].units--;
            }
            overlaps[i].units++;
            overlaps[j].dirty = true;
          }
        }
      }
      console.log(overlaps);
      for (const i in overlaps) {
        overlaps[i].width = overlaps[i].units*(100/cols);
        if (overlaps[i].startUnder != -1) {
          overlaps[i].left = overlaps[i].startUnder*(100/cols);
        } else {
          overlaps[i].left = i*(100/cols);
        }
      }
    });

    console.log(this.data);

    this.loading = false;
  }

  // This is so stupid
  _eventsContainerClasses(index) {
    return (index == 0) ? 'events-container events-container-first' : 'events-container';
  }

  _prettyTime(timeString) {
    return moment(timeString).format('h:mma');
  }

  _preprocessEvents(events) {
    var modifiedEvents = [];
    modifiedEvents = events;
    return modifiedEvents;
  }

  _openDialog(event) {
    const mainBounds = event.detail.sourceEvent.path[4].getBoundingClientRect();
    const parentBounds = event.detail.sourceEvent.path[0].getBoundingClientRect();
    const item = event.model.item;

    this.dialogData = {
      top: parentBounds.top-mainBounds.top,
      left: (parentBounds.right-mainBounds.left+300 < mainBounds.right-mainBounds.left) ? parentBounds.right-mainBounds.left : parentBounds.left-mainBounds.left-300,
      title: item.title,
      time: moment(item.startTime).format('h:mma') + ' to ' + moment(item.endTime).format('h:mma'),
      notes: item.notes
    };
    this.hidden = false;
  }

  _closeDialog(event) {
    if (event.detail.sourceEvent.path[0].className !== 'event-cover') {
      this.hidden = true;
    }
  }

  _isNonEmptyString(str) {
    return (str && str.length > 0);
  }

  // _computeEventHeight(event) {
  //   const startTime = Number.parseInt(moment(event.startTime).format('HHmm'), 10);
  //   const endTime = Number.parseInt(moment(event.endTime).format('HHmm'), 10);
  //   return (endTime-startTime)*(this.scheduleHeight/2400);
  // }

  // _computeEventWidth(event,index) {
  //   return 100;
  // }

  // _computeEventOffset(event) {
  //   const startTime = Number.parseInt(moment(event.startTime).format('HHmm'), 10);
  //   return startTime*(this.scheduleHeight/2400);
  // }
}

window.customElements.define('polymer-schedule', PolymerSchedule);