const express = require('express')
const process = require('process')
const app = express()

process.on('SIGINT', () => {
  console.log('App interrompida')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('App finalizada')
  process.exit(0)
})

app.get('/', function (req, res){
    res.send('Express app')
})


app.listen(3000)