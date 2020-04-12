const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// include url model
const Url = require('./models/url')
const bodyParser = require('body-parser')

const port = 3000

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// connect mongoose with mongodb
mongoose.connect('mongodb://localhost/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

// connect error
db.on('error', () => {
  console.log('mongodb error')
})

// connect success
db.once('open', () => {
  console.log('mongodb connect')
})

// serve static files
app.use(express.static('public'))

// set handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url

  if (!url) {
    return res.render('index', {error: 'Please provide a valid URL'})
  }
})

app.get('/:shorten', (req, res) => {
  res.send('get shorten url')
})

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))