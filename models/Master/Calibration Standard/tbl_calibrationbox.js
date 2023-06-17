const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibrationbox', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CB_Type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    CB_ID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    CB_CertNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    CB_validDt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    CB_WTNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    CB_Wt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    CB_unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    CB_identificationNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    CB_DP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    locked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    CB_Is_UnderEdit: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    CB_CalibDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CB_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibrationbox',
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
