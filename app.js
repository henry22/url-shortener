const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// include url model
const Url = require('./models/url')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const validUrl = require('valid-url')

const port = 3000

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// connect mongoose with mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

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

  if (validUrl.isUri(originalUrl)) {
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
  } else {
    res.render('index', {error: 'Please provide valid URL'})
  }
})

app.get('/:shorten_url', (req, res) => {
  const shortenUrl = req.params.shorten_url

  Url.findOne({
    shortenUrl: shortenUrl
  }, (err, url) => {
    if (err) throw new Error(err)

    if (url) {
      res.redirect(url.originalUrl)
    } else {
      res.redirect('/')
    }
  })
})

app.listen(process.env.PORT || port, () => console.log('App is running'))