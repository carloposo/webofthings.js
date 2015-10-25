//TODO: refactor with CorePlugin

var resources = require('./../../resources/model'),
  utils = require('./../../utils/utils.js');

var interval;
var model = resources.pi.sensors;
var pluginName = 'Temperature & Humidity';
var localParams = {'simulate': false, 'frequency': 5000};

exports.start = function (params) {
  localParams = params;
  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    sensor.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
 var sensorDriver = require('node-dht-sensor');
  var sensor = {
    initialize: function () {
      return sensorDriver.initialize(22, model.temperature.gpio);
    },
    read: function () {
      var readout = sensorDriver.read();
      model.temperature.value = parseFloat(readout.temperature.toFixed(2));
      model.humidity.value = parseFloat(readout.humidity.toFixed(2));
      showValue();

      setTimeout(function () {
        sensor.read();
      }, localParams.frequency);
    }
  };
  if (sensor.initialize()) {
    console.info('Hardware %s sensor started!', pluginName);
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor!');
  }
};

function simulate() {
  interval = setInterval(function () {
    model.temperature.value = utils.randomInt(0, 40);
    model.humidity.value = Math.random(0, 100);
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info('Temperature: %s C, humidity %s \%',
    model.temperature.value, model.humidity.value);
};

function addData(t,h) {
  // TODO: support several values model.data.push({"1" : value, "2" : false, "timestamp" : utils.isoTimestamp()});
  model.data = [{"1" : value, "2" : value, "timestamp" : utils.isoTimestamp(), "status" : "completed"}];
  model.temperature;
  model.temperature.value = utils.randomInt(0, 40);
  model.humidity.value = Math.random(0, 100);

};
