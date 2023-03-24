const express = require('express')
const router = express.Router()
var article = require('../article-db')

router.get('/', (req, res) => {
    res.send('ไม่พบบทความ')
})
router.get('/:id', (req, res) => {
    var data = {title: article[req.params.id-1].title+' | You Blog', article: article[req.params.id-1]}
    res.render('detail', data)
})
 
module.exports = router