let sensorData = [];

const saveSensorData = (data) => {
  sensorData.push(data);
};

const getSensorData = () => {
  return sensorData;
};

module.exports = {
  saveSensorData,
  getSensorData
};