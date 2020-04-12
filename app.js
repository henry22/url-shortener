const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// include url model
const Url = require('./models/url')
const bodyParser = require('body-parser')
const randomString = require('randomstring')

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

app.post('/', async (req, res) => {
  const originalUrl = req.body.url

  if (!originalUrl) {
    return res.render('index', {error: 'Please enter URL'})
  }

  try {
    let url = await Url.findOne({
      originalUrl: originalUrl
    }).exec()

    const origin = req.get('origin')
    const shortUrl = randomString.generate({
      length: 5,
      charset: 'alphanumeric'
    })

    if (url) {
      res.render('index', {
        shortUrl: `${origin}/${url.shortenUrl}`,
        originalUrl: url.originalUrl
      })
    } else {
      const newUrl = new Url({
        originalUrl: originalUrl,
        shortenUrl: shortUrl
      })

      newUrl.save()
        .then(url => {
          res.render('index', {
            shortUrl: `${origin}/${url.shortenUrl}`,
            originalUrl: url.originalUrl
          })
        })
        .catch(err => console.log(err))
    }
  } catch(err) {
    if (err) throw new Error(err)

    res.redirect('/')
  }
})

app.get('/:shorten', (req, res) => {
  res.render('index')
})

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))