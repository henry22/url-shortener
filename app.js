const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// include url model
const Url = require('./models/url')

const port = 3000

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

app.post('/:url', (req, res) => {
  res.send('post url')
})

app.get('/:shorten', (req, res) => {
  res.send('get shorten url')
})

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))