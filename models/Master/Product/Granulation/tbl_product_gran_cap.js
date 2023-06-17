const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_product_gran_cap', {
    gran_id: {
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
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductVersion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    Param1_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param1_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param2_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param2_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param3_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param3_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param4_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param4_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param5_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param5_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param6_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param6_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param7_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param7_Nom: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    Param7_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param8_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param8_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param8_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param8_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param9_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param9_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Param10_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_Low: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_Upp: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GenericName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NA"
    }
  }, {
    sequelize,
    tableName: 'tbl_product_gran_cap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "gran_id" },
        ]
      },
    ]
  });
};
