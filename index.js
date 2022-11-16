const path = require('path');
const fs = require('fs');
const os = require('os');

function allocateMemory(size) {
  // Simulate allocation of bytes
  const numbers = size / 8;
  const arr = [];
  arr.length = numbers;
  for (let i = 0; i < numbers; i++) {
    arr[i] = i;
  }
  return arr;
}
function allocateMemoryToBuffer(size) {
  // Simulate allocation of bytes
  var buffer = Buffer.alloc(size);
  for (var i = 0; i < size; i++) {
    buffer[i] = 0;
  }
  return buffer;
}

const memoryLeakAllocations = [];
const memoryLeakAllocationsBuffer = [];

const field = 'heapUsed';
const allocationStep = 10000 * 1024; // 10MB

const TIME_INTERVAL_IN_MSEC = 400;

const start = Date.now();
const LOG_FILE = path.join(__dirname, 'memory-usage.csv');

fs.writeFile(
  LOG_FILE,
  'Time Alive (secs),Memory GB' + os.EOL,
  () => {}); // fire-and-forget

setInterval(() => {
  const allocation = allocateMemory(allocationStep);
  const bufferAllocation = allocateMemoryToBuffer(allocationStep);

  memoryLeakAllocationsBuffer.push(bufferAllocation)
  memoryLeakAllocations.push(allocation);

  const mu = process.memoryUsage();
  const heapUsed = getFormatValue(mu['heapUsed']);
  const heapTotal = getFormatValue(mu['heapTotal']);
  const external = getFormatValue(mu['external']);
  const rss = getFormatValue(mu['rss']);
  const arrayBuffers = getFormatValue(mu['arrayBuffers']);

  const elapsedTimeInSecs = (Date.now() - start) / 1000;
  const timeRounded = Math.round(elapsedTimeInSecs * 100) / 100;

  fs.appendFile(
    LOG_FILE,
    timeRounded + ',' + heapUsed + os.EOL,
    () => {}); // fire-and-forget

  console.log(`memory info: \n heapTotal: ${heapTotal} GB \n heapUsed: ${heapUsed} GB \n external: ${external} GB \n rss: ${rss} GB   \n arrayBuffers: ${arrayBuffers} GB`);
}, TIME_INTERVAL_IN_MSEC);

function getFormatValue(filed) {
  const gbNow = filed / 1024 / 1024 / 1024;
  const gbRounded = Math.round(gbNow * 100) / 100;
  return gbRounded;
}