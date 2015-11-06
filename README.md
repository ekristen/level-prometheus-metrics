# level-prometheus-metrics

Instruments a LevelDB instances with metric collection and can expose it via an HTTP port for collection by a Prometheus server. Uses https://github.com/ekristen/prometheus-client-js.

## Usage

This will expose metrics at `http://localhost:6754/metrics`

```javascript
var level = require('level')
var metrics = require('level-prometheus-metrics')

level('./db', function(err, db) {
  
  metrics(db)

  db.metrics.createServer().listen()
  
  setInterval(function() {
    db.put('one', 'two', function() {

    })
  }, 500)
})
```
