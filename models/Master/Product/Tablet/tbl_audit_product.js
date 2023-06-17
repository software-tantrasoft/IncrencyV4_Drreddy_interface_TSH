const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_product', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TM: {
      type: DataTypes.TIME,
      allowNull: true
    },
    userid: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    username: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    ACT: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Remark: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductId: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrdVersion: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NA"
    },
    ProductType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    OldValueComp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NewValueComp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OldValueGran: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NewValueGran: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OldValueCoat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NewValueCoat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NA"
    },
    OldValue: {
      type: DataTypes.STRING(1200),
      allowNull: true,
      defaultValue: "NA"
    },
    NewValue: {
      type: DataTypes.STRING(1200),
      allowNull: true,
      defaultValue: "NA"
    },
    GenericName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NA"
    },
    BilayerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TrilayerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    useBefore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_product',
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
