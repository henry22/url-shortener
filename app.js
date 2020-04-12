const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const port = 3000

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