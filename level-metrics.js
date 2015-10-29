var prometheus = require('prometheus-client-js')
var xtend = require('xtend')

module.exports = LevelMetrics

function put(db, key, value, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }

  var startTime = process.hrtime()
  var callback2 = function(err) {
    var endTime = process.hrtime(startTime)
    
    var labels = {
      status: 200
    }

    if (err && err.status) {
      labels.status = err.status
    }

    db._metrics.metrics.put.increment(labels, 1)
    db._metrics.metrics.putTime.observe( (endTime[1]/1000000) )
    callback.apply(db, arguments)
  }

  db._metrics.put.call(db, key, value, options, callback2)
}

function get(db, key, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }

  var startTime = process.hrtime()
  var callback2 = function(err) {
    var endTime = process.hrtime(startTime)

    var labels = {
      status: 200
    }

    if (err && err.status) {
      labels.status = err.status
    }

    db._metrics.metrics.get.increment(labels, 1)
    db._metrics.metrics.getTime.observe( (endTime[1]/1000000) )
    callback.apply(db, arguments)
  }

  db._metrics.get.call(db, key, options, callback2)
}

function del(db, key, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }

  var startTime = process.hrtime()
  var callback2 = function(err) {
    var endTime = process.hrtime(startTime)
    var labels = {
      status: 200
    }

    if (err && err.status) {
      labels.status = err.status
    }

    db._metrics.metrics.del.increment(labels, 1)
    db._metrics.metrics.delTime.observe( (endTime[1]/1000000) )
    callback.apply(db, arguments)
  }

  db._metrics.del.call(db, key, options, callback2)
}

function batch(db, arr, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }

  var startTime = process.hrtime()
  var callback2 = function(err) {
    var endTime = process.hrtime(startTime)
    var labels = {
      status: 200
    }

    if (err && err.status) {
      labels.status = err.status
    }

    db._metrics.metrics.batch.increment(labels, 1)
    db._metrics.metrics.batchTime.observe( (endTime[1]/1000000) )
    callback.apply(db, arguments)
  }

  db._metrics.batch.call(db, arr, options, callback)
}

function LevelMetrics(db, opts) {
  if (db._metrics) {
    return
  }

  opts = xtend({
    namespace: 'leveldb'
  }, opts)

  var metrics = new prometheus()

  db.put = put.bind(null, db)
  db.get = get.bind(null, db)
  db.del = del.bind(null, db)
  db.batch = batch.bind(null, db)
  db.metrics = metrics

  db._metrics = {
    put: db.put.bind(db),
    get: db.get.bind(db),
    del: db.del.bind(db),
    batch: db.batch.bind(db),
    close: db.close.bind(db),
    metrics: {
      put: metrics.newCounter({
        namespace: opts.namespace,
        name: "level_puts_total",
        help: "The number of puts to the database"
      }),
      putTime: metrics.newHistogram({
        namespace: opts.namespace,
        name: "level_put_duration_milliseonds",
        help: "The duration of puts to the database"
      }),
      get: metrics.newCounter({
        namespace: opts.namespace,
        name: "level_gets_total",
        help: "The number of gets to the database"
      }),
      getTime: metrics.newHistogram({
        namespace: opts.namespace,
        name: "level_get_duration_milliseonds",
        help: "The duration of gets to the database"
      }),
      del: metrics.newCounter({
        namespace: opts.namespace,
        name: "level_dels_total",
        help: "The number of dels to the database"
      }),
      delTime: metrics.newHistogram({
        namespace: opts.namespace,
        name: "level_del_duration_milliseonds",
        help: "The duration of dels to the database"
      }),
      batch: metrics.newCounter({
        namespace: opts.namespace,
        name: "level_batches_total",
        help: "The number of batches to the database"
      }),
      batchTime: metrics.newHistogram({
        namespace: opts.namespace,
        name: "level_batch_duration_milliseonds",
        help: "The duration of batches to the database"
      }),
    }
  }

  return db
}
