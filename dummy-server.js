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
        { name: "Item 1", location: "", locationUrl: "", startTime: "2018-12-16T07:30:00-06:00", endTime: "2018-12-16T08:00:00-06:00", people: ["Temoc Hsoohw, Enarc"], notes: "Hello world!" }
      ] },
      { day: 'Monday', events: [
        { name: "Item 2a", location: "", locationUrl: "", startTime: "2018-12-17T08:00:00-06:00", endTime: "2018-12-17T09:15:00-06:00", people: ["Temoc Hsoohw"], notes: "" },
        { name: "Item 2b", location: "Building C", locationUrl: "", startTime: "2018-12-17T12:00:00-06:00", endTime: "2018-12-17T13:15:00-06:00", people: ["Temoc Hsoohw"], notes: "" }
      ] },
      { day: 'Tuesday', events: [] },
      { day: 'Wednesday', events: [] },
      { day: 'Thursday', events: [] },
      { day: 'Friday', events: [
        { name: "Item 3", location: "", locationUrl: "", startTime: "2018-12-21T15:00:00-06:00", endTime: "2018-12-21T18:05:00-06:00", people: [], notes: "" },
      ] },
      { day: 'Saturday', events: [] }
    ]
  });
});

app.listen(port, () => console.log(`Dummy server listening on port ${port}!`));