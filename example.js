var level = require('level')
var metrics = require('./level-metrics.js')
var bytespace = require('bytespace')
var sublevel = require('level-sublevel')

level('./db', function(err, db) {
  
  metrics(db)

  db.metrics.createServer()
  
  setInterval(function() {
    db.put('one', 'two', function() {
    })
  }, 500)
  
  setInterval(function() {
    db.get('one', function() {
    })
  }, 750)

  setInterval(function() {
    db.del('one', function() {
    })
  }, 1000)
  
  setInterval(function() {
    db.del('something12311', function() {
      
    })
  }, 1250)
  
  setInterval(function() {
    db.get('one123', function() {
    })
  }, 1550)

})

process.on('uncaughtException', function(err) {
  console.log(err)
  process.exit(1)
})
