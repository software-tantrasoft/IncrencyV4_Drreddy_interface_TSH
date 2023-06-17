const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_sequnce', {
    P: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    U: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    R: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    E: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    L: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    V: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_sequnce',
    timestamps: false
  });
};
