var redis = require("redis");
var ioredis = require("ioredis");
let areas = require("./AreaLists");
let config = require("./../../config");

class RedisHandler {
  constructor() {
    this.redis = redis.createClient(config.redisUri);
    this.ioredis = new ioredis(config.redisUri);
    this.getAreaRedis = this.getAreaRedis.bind(this);
    this.sendAreaAverage = this.sendAreaAverage.bind(this);
  }

  sendData(key, value) {
    this.redis.set(key, value);
  }

  async getAreaRedis(area) {
    let test = await this.ioredis.mget(areas[area]);

    let out = { status: "success", data: [] };

    let values = [];
    test.forEach(number => {
      let num = parseInt(number) / 100; // automatic percentile for bars
      values.push(num);
    });

    // TODO: Fix duplicate error by doing for loop intead of foreach
    values.forEach(v => {
      let i = values.indexOf(v);

      out.data.push({ key: areas[area][i], value: values[i] });
    });

    return out;
  }

  async sendAreaAverage(area) {
    let data = await this.ioredis.mget(areas[area]);

    let out = { status: "success", data: [] };

    let sum = 0;
    data.forEach(number => {
      let num = parseInt(number); // automatic percentile for bars
      sum += num;
    });

    data = Math.round(sum / data.length);

    this.sendData(area, data);
  }

  sendExampleData() {
    areas["buildings"].forEach(building => {
      areas[building].forEach(area => {
        areas[area].forEach(zone => {
          this.sendData(zone, Math.floor(Math.random() * 100));
        });
      });
    });

    this.generateAverages();
  }

  generateAverages() {
    areas["buildings"].forEach(area => {
      areas[area].forEach(area => {
        this.sendAreaAverage(area);
      });
      this.sendAreaAverage(area);
    });
  }
}

module.exports = RedisHandler;
