var express = require('express');
var cors = require('cors');
var app = express();
const port = 8082;

app.use(cors());

app.get('/api/schedules/:id/:week(\\d+)/', function (req, res) {
  if (req.params.week < 1 || req.params.week > 52) {
    res.status(400).send({ error: 'incorrect week specified' });
  }
  res.status(200).send({ 
    data: [
      { day: 'Sunday', events: [
        { title: "Item 1", location: "", locationUrl: "", startTime: "2018-12-16T07:30:00-06:00", endTime: "2018-12-16T08:00:00-06:00", people: ["Temoc Hsoohw, Enarc"], notes: "Hello world!", color: "90CAF9" }
      ] },
      { day: 'Monday', events: [
        { title: "Item 2a", location: "", locationUrl: "", startTime: "2018-12-17T08:00:00-06:00", endTime: "2018-12-17T09:15:00-06:00", people: ["Temoc Hsoohw"], notes: "", color: "EF9A9A" },
        { title: "Item 2b", location: "Building C", locationUrl: "", startTime: "2018-12-17T08:00:00-06:00", endTime: "2018-12-17T09:15:00-06:00", people: ["Temoc Hsoohw"], notes: "", color: "80CBC4" },
        { title: "Item 2c", location: "", locationUrl: "", startTime: "2018-12-17T08:30:00-06:00", endTime: "2018-12-17T10:00:00-06:00", people: ["Temoc Hsoohw"], notes: "", color: "EF9A9A" },
        { title: "Item 2d", location: "", locationUrl: "", startTime: "2018-12-17T09:15:00-06:00", endTime: "2018-12-17T10:45:00-06:00", people: ["Temoc Hsoohw"], notes: "", color: "90CAF9" },
        { title: "Item 2e", location: "", locationUrl: "", startTime: "2018-12-17T10:00:00-06:00", endTime: "2018-12-17T11:30:00-06:00", people: ["Temoc Hsoohw"], notes: "", color: "80CBC4" }
      ] },
      { day: 'Tuesday', events: [] },
      { day: 'Wednesday', events: [] },
      { day: 'Thursday', events: [] },
      { day: 'Friday', events: [
        { title: "Item 3", location: "", locationUrl: "", startTime: "2018-12-21T15:00:00-06:00", endTime: "2018-12-21T18:05:00-06:00", people: [], notes: "", color: "90CAF9" },
      ] },
      { day: 'Saturday', events: [] }
    ]
  });
});

app.listen(port, () => console.log(`Dummy server listening on port ${port}!`));