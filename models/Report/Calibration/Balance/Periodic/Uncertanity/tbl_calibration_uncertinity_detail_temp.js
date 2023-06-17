const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_uncertinity_detail_temp', {
    Uncertinity_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Uncertinity_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_BalStdWt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Uncertinity_BalNegTol: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Uncertinity_BalPosTol: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Uncertinity_ActualWt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Uncertinity_StdWtID: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_StdWt: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_WtIdentification: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_WeightBox_certfctNo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PercentofCapacity: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: "0"
    },
    Uncertinity_ValDate: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_Remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    d: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    dsquare: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_uncertinity_detail_temp',
    timestamps: false
  });
};
