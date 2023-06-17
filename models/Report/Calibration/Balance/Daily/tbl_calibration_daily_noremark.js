const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_daily_noremark', {
    NDCR_SrNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NDCR_BalanceID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    NDCR_Reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    NDCR_DT: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: "NULL"
    },
    NDCR_AddedByID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    NDCR_AddedByName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    NDCR_AddedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_daily_noremark',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NDCR_SrNo" },
        ]
      },
    ]
  });
};
