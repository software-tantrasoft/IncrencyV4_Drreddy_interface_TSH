const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_vernier_print', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RepSrNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Reason: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    Title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Print_Dt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Print_Tm: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_vernier_print',
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
