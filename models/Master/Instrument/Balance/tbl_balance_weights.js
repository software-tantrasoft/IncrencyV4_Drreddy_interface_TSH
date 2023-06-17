const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_balance_weights', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Bal_ID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_StdWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_NegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_PosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_Daily: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_Periodic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_Linearity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_IsEccentricity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_EccentPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_IsUncertinity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_UncertCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_IsRepetability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_ReptCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PercentofCapacity: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    }
  }, {
    sequelize,
    tableName: 'tbl_balance_weights',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
    ]
  });
};
