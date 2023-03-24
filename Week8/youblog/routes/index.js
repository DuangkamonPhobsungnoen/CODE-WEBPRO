const express = require('express')
const router = express.Router()
var article = require('../article-db')

router.get('/', function(req, res, next) {
    // var data = { title: 'Express', article: article }
    // res.render('index', data)
    if(req.query.search == "" || req.query.search == null) {
        var searchData = article;
    }else {
        var searchValue = req.query.search;
        var searchData = [];
        article.map((val) => {
            if(val.title.toLowerCase().includes(searchValue.toLowerCase())) {
                searchData.push(val)
            }
        })
    }
    var data = {title: 'You blog', article: searchData}
    res.render('index', data)
})  
 
module.exports = router