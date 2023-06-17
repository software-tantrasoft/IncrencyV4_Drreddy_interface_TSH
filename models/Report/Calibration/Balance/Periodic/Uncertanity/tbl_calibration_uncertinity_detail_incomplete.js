const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_uncertinity_detail_incomplete', {
    Uncertinity_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Uncertinity_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Uncertinity_BalStdWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Uncertinity_BalNegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Uncertinity_BalPosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Uncertinity_ActualWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Uncertinity_StdWtID: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_StdWt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_WtIdentification: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_WeightBox_certfctNo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "0"
    },
    Uncertinity_ValDate: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    D: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    D_Square: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_uncertinity_detail_incomplete',
    timestamps: false,
    indexes: [
      {
        name: "Uncertinity_RecNo",
        using: "BTREE",
        fields: [
          { name: "Uncertinity_RecNo" },
        ]
      },
    ]
  });
};
