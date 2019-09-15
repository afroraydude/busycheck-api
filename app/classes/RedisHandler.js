var redis = require("redis");
var ioredis = require('ioredis')
let areas = require('./AreaLists')
let config = require('./../../config')

class RedisHandler {
  constructor() {
    this.redis = redis.createClient(config.redisUri);
    this.ioredis = new ioredis(config.redisUri)
    this.getAreaRedis = this.getAreaRedis.bind(this)
    this.sendAreaAverage = this.sendAreaAverage.bind(this)
  }

  sendData(key, value) {
    this.redis.set(key, value);
  }

  async getAreaRedis(area) {
    let test = await this.ioredis.mget(areas[area])
    
    let out = {status: 'success', data: []}

    let values = []
    test.forEach((number) => {
        let num = parseInt(number) / 100 // automatic percentile for bars
        values.push(num)
    })

    // TODO: Fix duplicate error by doing for loop intead of foreach
    values.forEach((v) => {
      let i = values.indexOf(v)

      out.data.push({key: areas[area][i], value: values[i]})
    })

    return out
  }

  async sendAreaAverage(area) {
    let data = await this.ioredis.mget(areas[area])
    
    let out = {status: 'success', data: []}

    let sum = 0
    data.forEach((number) => {
      let num = parseInt(number) // automatic percentile for bars
      sum += num  
    })

    data = Math.round(sum / data.length)

    this.sendData(area, data)
  }

  sendExampleData() {
    this.sendData("fenwick:1:A", Math.floor(Math.random() * 100));
    this.sendData("fenwick:1:B", Math.floor(Math.random() * 100));
    this.sendData("fenwick:1:C", Math.floor(Math.random() * 100));
    this.sendData("fenwick:1:D", Math.floor(Math.random() * 100));
    this.sendData(
      "fenwick:1:Argo.Tea.and.Reading.Area",
      Math.floor(Math.random() * 100)
    );
    this.sendData("fenwick:1:Atrium", Math.floor(Math.random() * 100));

    this.sendData("fenwick:2:Research.Commons", Math.floor(Math.random() * 100));
    this.sendData("fenwick:2:A", Math.floor(Math.random() * 100));
    this.sendData("fenwick:2:B", Math.floor(Math.random() * 100));
    this.sendData("fenwick:2:C", Math.floor(Math.random() * 100));
    this.sendData("fenwick:2:D", Math.floor(Math.random() * 100));
    this.sendData("fenwick:2:E", Math.floor(Math.random() * 100));
    this.sendData(
      "fenwick:2:North.Reading.Room",
      Math.floor(Math.random() * 100)
    );
    this.sendData("fenwick:2:G", Math.floor(Math.random() * 100));

    this.sendData("fenwick:3:A", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:B", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:C", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:D", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:Study.Zone.East", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:Study.Zone.South", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:E", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:F", Math.floor(Math.random() * 100));
    this.sendData("fenwick:3:G", Math.floor(Math.random() * 100));

    this.sendData("fenwick:4:A", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:B", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:C", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:D", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:E", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:F", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:Study.Zone.East", Math.floor(Math.random() * 100));
    this.sendData("fenwick:4:Study.Zone.South", Math.floor(Math.random() * 100));

    this.sendData("fenwick:5:A", Math.floor(Math.random() * 100));
    this.sendData("fenwick:5:B", Math.floor(Math.random() * 100));
    this.sendData("fenwick:5:C", Math.floor(Math.random() * 100));
    this.sendData("fenwick:5:D", Math.floor(Math.random() * 100));
    this.sendData("fenwick:5:E", Math.floor(Math.random() * 100));
    this.sendData(
      "fenwick:5:Graduate.Student.Research.Zone.Southeast",
      Math.floor(Math.random() * 100)
    );
    this.sendData(
      "fenwick:5:Graduate.Student.Research.Zone.East.Northeast",
      Math.floor(Math.random() * 100)
    );
    
    areas['buildings'].forEach((area) => {
      areas[area].forEach((area) => {
        this.sendAreaAverage(area)
      })
      this.sendAreaAverage(area)
    })
  }
}

module.exports = RedisHandler;
