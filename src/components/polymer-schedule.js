import { LitElement, html } from '@polymer/lit-element';

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
        ${this.daysUI}
        <!-- <div class="day">
          <span class="day-title">Sunday</span>
          <div class="time-slots">
            <div class="time-slot" style="height:9px;top:240px;">
              <strong>8am</strong> Temoc Hsoohw
            </div>
          </div>
        </div>
        <div class="day">
          <span class="day-title">Monday</span>
          <div class="time-slots">
            <div class="time-slot" style="height:28.75px;top:300px;">
            <strong>12pm</strong> Temoc Hsoohw
            </div>
          </div>
        </div>
        <div class="day">
          <span class="day-title">Tuesday</span>
          <div class="time-slots">
          </div>
        </div>
        <div class="day">
        <span class="day-title">Wednesday</span>
          <div class="time-slots">
          </div>
        </div>
        <div class="day">
          <span class="day-title">Thursday</span>
          <div class="time-slots">
          </div>
        </div>
        <div class="day">
          <span class="day-title">Friday</span>
          <div class="time-slots">
            <div class="time-slot" style="height:76.25px;top:375px;">
              <strong>3pm</strong> Temoc Hsoohw
            </div>
          </div>
        </div>
        <div class="day">
          <span class="day-title">Saturday</span>
          <div class="time-slots">
          </div>
        </div> -->
      </div>
    `;
  }

  static get properties() {
    return {
      daysUI: { type: Array },
      data: { type: Array }, // `value` key is useless
    }
  }

  constructor() {
    super();

    // GET api/schedules/{id}/{week}
    // 'id': String hash
    // 'week': Number between 1 and 52
    this.data = [
      { day: 'sunday', events: [
        { name: "Item 1", location: "", startTime: 730, endTime: 800, people: ["Temoc Hsoohw, Enarc"], notes: "Hello world!" },
      ] },
      { day: 'monday', events: [
        { name: "Item 2", location: "Building C", startTime: 1200, endTime: 1315, people: ["Temoc Hsoohw"], notes: "" },
      ] },
      { day: 'tuesday', events: [] },
      { day: 'wednesday', events: [] },
      { day: 'thursday', events: [] },
      { day: 'friday', events: [
        { name: "Item 3", location: "", startTime: 1500, endTime: 1805, people: ["Temoc Hsoohw"], notes: "" },
      ] },
      { day: 'saturday', events: [] },
    ];
    this.daysUI = [];

    var firstStart = 2401;
    var lastEnd = -1;
    var scheduleHeight = 720;
    this.data.forEach((day) => {
      // TODO: sort event times here if needed
      day.events.forEach((event) => {
        if (event.startTime < firstStart) firstStart = event.startTime;
        if (event.endTime > lastEnd) lastEnd = event.endTime;
      });
    });
    if (firstStart % 100 != 0) firstStart = Math.floor(firstStart/100) * 100;
    if (lastEnd % 100 != 0) lastEnd = Math.ceil(lastEnd/100) * 100;
    var timeDiff = lastEnd - firstStart;

    this.data.forEach((day) => {
      var eventsUI = [];
      day.events.forEach((event) => {
        eventsUI.push(html`
          <div class="time-slot" style="height:${(event.endTime-event.startTime)*(scheduleHeight/timeDiff)}px;top:${(event.startTime-firstStart)*(scheduleHeight/timeDiff)}px;">
            <strong>${event.startTime}</strong> ${event.people} <!-- show title otherwise -->
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
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);
