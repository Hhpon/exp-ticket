const express = require('express')
const bodyParder = require('body-parser')
const cors = require('cors')
const options = require('./util/options')
const Ticket = require('./model/ticket')
const getDateAfter_n = require('./util/day')

const app = express()

app.use(bodyParder.json())
app.use(cors(options))

app.get('/', function (req, res) {
  res.cookie('userName', 'admin')
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  let userName = req.body.userName;
  let passWord = req.body.passWord
  if (userName === 'admin' && passWord === 'admin') {
    res.cookie('userName', 'admin')
    res.send({ code: 200 })
  } else {
    res.send({ code: 0 })
  }
})

app.post('/addtic', (req, res) => {
  let oldTicMes = req.body.ticMes;

  console.log(oldTicMes);

  let newTicMes = {
    ticId: oldTicMes.ticId,
    date: oldTicMes.date,
    price: oldTicMes.price,
    disCount: oldTicMes.disCount,
    totalVote: oldTicMes.totalVote,
    resVote: oldTicMes.totalVote,
    outCity: `${oldTicMes.outCity.province}-${oldTicMes.outCity.city}-${oldTicMes.outCity.area}`,
    overCity: `${oldTicMes.overCity.province}-${oldTicMes.overCity.city}-${oldTicMes.overCity.area}`
  }

  for (let i = 1; i <= 15; i++) {
    newTicMes.date[0] = getDateAfter_n(newTicMes.date[0], i)
    newTicMes.date[1] = getDateAfter_n(newTicMes.date[1], i)
    console.log(newTicMes);
    Ticket.create(newTicMes, (err, doc) => {
      if (err) {
        res.send({ code: 0, index: i })
      }
    })
  }
  res.send({ code: 200 })
})

app.get('/getic', (req, res) => {
  Ticket.find((err, doc) => {
    if (err) {
      res.send({ code: 0 })
    }
    res.json(doc)
  })
})

app.post('/editic', (req, res) => {
  let editMes = req.body.editMes;
  for (let prop in editMes) {
    if (prop === 'id') {
      continue
    }
    Ticket.updateOne({ _id: editMes.id }, { $set: { [prop]: editMes[prop] } }, (err, doc) => {
      if (err) {
        res.send({ code: 0 })
      }
    })
  }
  res.send({ code: 200 })
})

app.post('/deltic', (req, res) => {
  let _id = req.body._id;
  Ticket.deleteOne({ _id: _id }, (err, doc) => {
    if (err) {
      res.send({ code: 0 })
    }
  })
  res.send({ code: 200 })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})