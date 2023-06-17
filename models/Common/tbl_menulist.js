const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_menulist', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    SeqNo: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    MenuName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    InstruId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_menulist',
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
      {
        name: "SeqNo",
        using: "BTREE",
        fields: [
          { name: "SeqNo" },
        ]
      },
    ]
  });
};
