let r = require('./classes/RedisHandler')
let RedisHandler = new r()
let express = require('express')
let router = express.Router()
let areas = require('./classes/AreaLists')
let os = require('os')

router.use((req, res, next) => {
  res.setHeader("server", "debug")
  next()
})

router.get('/', (req, res) => res.json({status: true}))
router.get('/about', (req, res) => res.json({version: "1.0.0-devel", serverName: os.hostname() }))

router.get('/gentestdata', (req, res) => {
  RedisHandler.sendExampleData()
  res.send('success')
})

router.get('/buildings/:building/:floor', (req, res) => {
  let area = req.params.building + ':' + req.params.floor
  RedisHandler.getAreaRedis(area).then((result) =>{
    res.json(result)
  })
})

router.get('/buildings', (req, res) => {
  let area = 'buildings'
  console.log(area)
  RedisHandler.getAreaRedis(area).then((result) =>{
    res.json(result)
  })
})

// TODO: Get average congestion of each floor (realtime)????
router.get('/buildings/:building', (req, res) => {
  let area = req.params.building
  RedisHandler.getAreaRedis(area).then((result) =>{
    res.json(result)
  })
})

// TODO: Get predictive congestion for a given day?????

module.exports = router