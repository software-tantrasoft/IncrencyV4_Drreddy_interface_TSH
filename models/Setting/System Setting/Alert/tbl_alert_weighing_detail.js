const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_alert_weighing_detail', {
    RecSrNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DetSrNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RestartDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RestartTm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    StopDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    StopTm: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_alert_weighing_detail',
    timestamps: false
  });
};
