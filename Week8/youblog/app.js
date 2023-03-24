
const express = require('express')
const path = require('path')
const article = require('./article-db')

// ดึงข้อมูล json มาเก็บไว้ในตัวแปร
const app = express()

// Setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup static path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/blogapi', (req, res) => {
  res.join(article)
})

app.get('/blogapi/:id', (req, res) => {
  res.json(article.find(article => article.id === req.params.id))
})

// Config Router
const indexRouter = require('./routes/index')
const BlogRouter = require('./routes/blog')

app.use('/', indexRouter)
app.use('/blog', BlogRouter)
// console.log(BlogRouter)
// console.log('indexRouter ', indexRouter)

app.listen(3000, () => {
  console.log('Start server at port 3000.')

})
