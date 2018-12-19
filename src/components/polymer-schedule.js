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
          min-width: 100px;
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
        <div class="day">
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
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      data: { type: Array }, // `value` key is useless
    }
  }

  constructor() {
    super();

    // GET api/schedules/{id}/{week}
    // 'id': String hash
    // 'week': Number between 1 and 52
    this.data = [
      { day: 'sunday', items: [
        { name: "Item 1", location: "", startTime: 800, endTime: 830, people: ["Temoc Hsoohw"], notes: "Hello world!" },
      ] },
      { day: 'monday', items: [
        { name: "Item 2", location: "Building C", startTime: 1200, endTime: 1315, people: ["Temoc Hsoohw"], notes: "" },
      ] },
      { day: 'tuesday', items: [] },
      { day: 'wednesday', items: [] },
      { day: 'thursday', items: [] },
      { day: 'friday', items: [
        { name: "Item 3", location: "", startTime: 1500, endTime: 1805, people: ["Temoc Hsoohw"], notes: "" },
      ] },
      { day: 'saturday', items: [] },
    ];

    
  }
}

window.customElements.define('polymer-schedule', PolymerSchedule);
