import { LitElement, html } from '@polymer/lit-element';
import moment from 'moment';
import 'lodash'; // ?

// This element is *not* connected to the Redux store.
class PolymerSchedule extends LitElement {
  render() {
    return html`
      <style>
        div.main {
          width: 100%;
          display: flex;
          flex-flow: row wrap;
        }
        div.day {
          flex-grow: 1;
          min-width: 150px;
        }
        div.time-slots {
          min-height: 720px;
          flex-grow: 1;
          position: relative;
          background-color: #EFEFEF;
          border-left: dotted 1px #C1C1C1; 
        }
        div.time-slot {
          width: calc(100% - 14px);
          min-height: 16px;
          background-color: lightgray;
          position: absolute;
          font-size: 10pt;
          padding: 0 7px;
          border-left: solid 3px #545454; 
        }
        span.day-title {
          display: block;
          width: 100%;
          color: #545454;
          font-weight: 300;
          text-align: center;
        }
      </style>

      <div class="main">
        ${this.loading 
          ? html`Loading...`
          : html`${this.daysUI}`
        }
      </div>
    `;
  }

  static get properties() {
    return {
      loading: { type: Boolean },
      daysUI: { type: Array },
      data: { type: Array }, // `value` key is useless
    }
  }

  constructor() {
    super();

    this.loading = true;

    // GET api/schedules/{id}/{week}
    // 'id': String hash
    // 'week': Number between 1 and 52    
    this.data = [
      { day: 'Sunday', events: [
        { name: "Item 1", location: "", locationUrl: "", startTime: "2018-12-16T07:30:00-06:00", endTime: "2018-12-16T08:00:00-06:00", people: ["Temoc Hsoohw, Enarc"], notes: "Hello world!" },
      ] },
      { day: 'Monday', events: [
        { name: "Item 2a", location: "Building C", locationUrl: "", startTime: "2018-12-17T12:00:00-06:00", endTime: "2018-12-17T13:15:00-06:00", people: ["Temoc Hsoohw"], notes: "" },
        { name: "Item 2b", location: "", locationUrl: "", startTime: "2018-12-17T08:00:00-06:00", endTime: "2018-12-17T09:15:00-06:00", people: ["Temoc Hsoohw"], notes: "" },
      ] },
      { day: 'Tuesday', events: [] },
      { day: 'Wednesday', events: [] },
      { day: 'Thursday', events: [] },
      { day: 'Friday', events: [
        { name: "Item 3", location: "", locationUrl: "", startTime: "2018-12-21T15:00:00-06:00", endTime: "2018-12-21T18:05:00-06:00", people: [], notes: "" },
      ] },
      { day: 'Saturday', events: [] },
    ];
    this.daysUI = [];

    var firstStart = 2401;
    var lastEnd = -1;
    var scheduleHeight = 720;
    this.data.forEach((day) => {
      // Sort by start date
      day.events = _.sortBy(day.events, (dateObj) => { return moment(dateObj.startTime).toDate() });
      if (day.events.length > 0) {
        var _startTime = parseInt(moment(day.events[0].startTime).format('HHmm'), 10);
        var _endTime = parseInt(moment(day.events[day.events.length-1].endTime).format('HHmm'), 10);
        if (_startTime < firstStart) firstStart = _startTime;
        if (_endTime > lastEnd) lastEnd = _endTime;
      }
    });
    if (firstStart % 100 != 0) firstStart = Math.floor(firstStart/100) * 100;
    if (lastEnd % 100 != 0) lastEnd = Math.ceil(lastEnd/100) * 100;
    var timeDiff = lastEnd - firstStart;

    this.data.forEach((day) => {
      var eventsUI = [];
      day.events.forEach((event) => {
        var _startTime = parseInt(moment(event.startTime).format('HHmm'), 10);
        var _endTime = parseInt(moment(event.endTime).format('HHmm'), 10);
        eventsUI.push(html`
          <div class="time-slot" style="height:${(_endTime-_startTime)*(scheduleHeight/timeDiff)}px;top:${(_startTime-firstStart)*(scheduleHeight/timeDiff)}px;">
            <div style="position:absolute;top:0;right:3px;text-align:right;">+</div>
            <strong>${moment(event.startTime).format('h:mm A')}</strong> 
            ${(event.people.length > 0) 
              ? html`${event.people}` 
              : html`${event.name}`
            }
          </div>
        `);
      });
      this.daysUI.push(html`
        <div class="day">
          <span class="day-title">${day.day}</span>
          <div class="time-slots">
            ${eventsUI}
          </div>
        </div>
      `);
    });

    this.loading = false;
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);
