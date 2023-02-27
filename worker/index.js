const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("./keys");

const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    reconnectStrategy:()=>100,
  },
});

const redisSubscriber = redisClient.duplicate();

(async () => {
  try {
    await redisClient.connect();
    await redisSubscriber.connect();
  } catch (e) {
    console.log("worker failed to connect to the redis server");
    return;
  }
})();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 2) + fib(index - 1);
}

const listener = (message, channel) => {
  console.log("event is triggered")
  console.log(message,channel)
  redisClient.hSet("values", message, fib(parseInt(message)));
};

(async () => {
  await redisSubscriber.subscribe("insert", listener);
})();


console.log("worker is working...")


process.on("unhandledRejection", (err) => {
  console.log(`error on worker [${err.message}]`);
  process.exit(1);
});