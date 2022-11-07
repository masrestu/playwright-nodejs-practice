const express = require('express')
const configDirectory = require('../config/configDirectory')

let router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(configDirectory.templateDir + '/index.html')
})

router.get('/currencies', (req, res) => {
    res.sendFile(configDirectory.templateDir + '/currencies.html')
})

router.get('/quotes', (req, res) => {
    res.sendFile(configDirectory.templateDir + '/quotes.html')
})

module.exports = router