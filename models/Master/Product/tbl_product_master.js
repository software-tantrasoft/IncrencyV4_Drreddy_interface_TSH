const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_product_master', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ProductId: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductType: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    ProductVersion: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NA"
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isBinWeighing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    BatchSize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    BatchUnit: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    IsBilayer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsBilayerLbl: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    IsTrilayer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsTrilayerLbl: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    IsCoated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsGranulation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsCompress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    NominalNomenclature: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    ActivateChance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GenericName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    ISBfGChecked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Unchecked,1:Checked"
    },
    ISPrdVersionChecked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Unchecked,1:Checked"
    },
    ISVersionChecked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Unchecked,1:Checked"
    },
    IsContent1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "0:Unchecked,1:Checked"
    },
    IsContent2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "0:Unchecked,1:Checked"
    },
    IsContent3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "0:Unchecked,1:Checked"
    },
    IsContent4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "0:Unchecked,1:Checked"
    },
    useBefore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Sys_Appearance: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_MachineSpeed_Min: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_MachineSpeed_Max: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Individual: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Group: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Friability: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    DT: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_product_master',
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
