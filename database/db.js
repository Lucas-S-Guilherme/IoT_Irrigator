const sensorData = require('../backend/models/sensorData');

module.exports = {
  saveSensorData: sensorData.saveSensorData,
  getSensorData: sensorData.getSensorData
};