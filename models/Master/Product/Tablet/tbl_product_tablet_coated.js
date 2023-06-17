const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_product_tablet_coated', {
    tab_id: {
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
      defaultValue: "NA"
    },
    ProductVersion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Param1_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param1_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param1_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param1_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param1_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param2_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param2_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param2_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param2_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param2_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param3_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param3_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param3_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param3_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param3_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param4_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param4_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param4_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param4_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param4_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param5_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param5_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param5_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param5_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param5_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param6_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param6_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param6_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param6_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param6_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GrpQty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GrpFreq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param7_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param7_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param7_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
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
    Param8_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param8_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param8_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param8_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    VibrationLavel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    FrbltyQty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param7_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param13_Nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param13_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param13_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param13_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param13_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param13_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isBinWeighing: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    Param15_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param15_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param15_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param15_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param16_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param16_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param16_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param16_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param17_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param17_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param17_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param17_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param1_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param1_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    TheroticalYield: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    YieldNLT: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    TotalLossNMT: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Yield_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GenericName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NA"
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Param2_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param3_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param5_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param6_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param1_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param2_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param9_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param10_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param11_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param12_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    },
    Param4_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_product_tablet_coated',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tab_id" },
        ]
      },
    ]
  });
};
