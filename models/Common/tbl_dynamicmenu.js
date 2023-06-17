const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_dynamicmenu', {
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    menuName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    menuPid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    menuHref: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    menuClass: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    menuIsOpenable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "1=openable & 0=not openable"
    },
    menuSid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_dynamicmenu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "menuId" },
        ]
      },
    ]
  });
};
