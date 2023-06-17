const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_precalibration', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DT: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TM: {
      type: DataTypes.TIME,
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ACT: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Cubicle_Number: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    Area_Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Cubicle_Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Equipment_Type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Calibration_Type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Equipment_ID: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Standard_Weight_Block: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    CalibrationBox_ID: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    CalibrationBox_Elements_IDNo: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    CalibrationBox_Selected_Elements: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    CalibrationBox_Elements_Unit: {
      type: DataTypes.STRING(1500),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_precalibration',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RecNo" },
        ]
      },
    ]
  });
};
