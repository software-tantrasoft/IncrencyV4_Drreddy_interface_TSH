const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_eccentricity_detail_failed', {
    SrNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Eccent_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Eccent_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eccent_BalStdWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_BalNegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_BalPosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_ActualWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_StdWtID: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_StdWt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_WtIdentification: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_WeightBox_certfctNo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "0"
    },
    Eccent_ValDate: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_eccentricity_detail_failed',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SrNo" },
        ]
      },
    ]
  });
};
