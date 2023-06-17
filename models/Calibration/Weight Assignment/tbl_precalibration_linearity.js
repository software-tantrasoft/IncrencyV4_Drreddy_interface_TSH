const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_precalibration_linearity', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary Key Auto Increment"
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Used UID to Store Id col of tbl_balance_weights"
    },
    Equipment_ID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Id of Balance\/Vernier\/Hardness\/Moisture"
    },
    Equipment_Type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Balance\/Vernier\/Hardness\/Moisture"
    },
    Cubicle_Number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Int number given by tbl_cubical"
    },
    Area_Name: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Name of Area which is Having Cubicle"
    },
    Cubicle_Name: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Name of Cubicle Which is Having Equipment"
    },
    Standard_Weight_Block: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Standard Weight\/Block of Balance\/Vernier"
    },
    Negative_Tolerance: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Negative Tolerance of Standard Weight\/Block"
    },
    Positive_Tolerance: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Positive Tolerance of Standard Weight\/Block"
    },
    CalibrationBox_ID: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox ID"
    },
    CalibrationBox_Calibration_Date: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Calibration Date"
    },
    CalibrationBox_Validity_Date: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Due Date"
    },
    CalibrationBox_Calibration_CertificateNo: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Certificate Number"
    },
    CalibrationBox_Elements_IDNo: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Individual Weight\/Block ID's"
    },
    CalibrationBox_Selected_Elements: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Individual Weight\/Block Weight\/Length"
    },
    CalibrationBox_Elements_Unit: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "WeightBox\/BlockBox Individual Weight\/Block Unit"
    },
    Repeat_Count: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "Number of times weight should be repeated"
    },
    Percent_of_Capacity: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Percentage of standard weight capacity"
    },
    Decimal_Point: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "Decimal point after standard element"
    }
  }, {
    sequelize,
    tableName: 'tbl_precalibration_linearity',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
