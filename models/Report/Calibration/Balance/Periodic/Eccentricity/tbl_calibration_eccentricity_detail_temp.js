const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_eccentricity_detail_temp', {
    Eccent_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Eccent_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Eccent_BalStdWt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_BalNegTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_BalPosTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_ActualWt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_StdWtID: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Eccent_StdWt: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Eccent_WtIdentification: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_WeightBox_certfctNo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    PercentofCapacity: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    Eccent_ValDate: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_Deviation: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Eccent_Remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_eccentricity_detail_temp',
    timestamps: false
  });
};
