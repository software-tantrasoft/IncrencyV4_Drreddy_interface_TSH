const { sequelize } = require('../models');
const initModels = require("../models/init-models");
const models = initModels(sequelize);
module.exports.models = models;
module.exports.sequelize = sequelize;