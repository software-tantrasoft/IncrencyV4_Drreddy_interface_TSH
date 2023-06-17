const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_product_capsule', {
    cap_id: {
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
    Param0_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
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
      allowNull: false,
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
      allowNull: false,
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
    Param3_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    Param0_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param0_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param0_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param0_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param0_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param0_Dp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param0_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param0_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      allowNull: false,
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
    Param5_DP: {
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
      allowNull: false,
      defaultValue: 0
    },
    Param6_Nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
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
    Param6_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param6_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    Param7_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    Param8_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param8_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    Version: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    ProductVersion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    ProductName: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isBinWeighing: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "0"
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
    Param1_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    GenericName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NA"
    },
    Param9_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Content-1"
    },
    Param9_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param9_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param9_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param9_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param9_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param9_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    Param9_ContentType: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param9_ContentDesc: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param10_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Content-2"
    },
    Param10_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param10_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param10_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param10_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param10_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param10_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    Param10_ContentType: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param10_ContentDesc: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param11_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Content-3"
    },
    Param11_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param11_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param11_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param11_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param11_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param11_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param11_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param11_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param11_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    Param11_ContentType: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param11_ContentDesc: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param12_Nom: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000,
      comment: "Content-4"
    },
    Param12_T1Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param12_T1Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param12_T2Neg: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param12_T2Pos: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Param12_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param12_LimitOn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param12_IsOnStd: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Param12_NMTTab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Param12_Nomenclature: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NA"
    },
    Param12_ContentType: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param12_ContentDesc: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param1_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
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
    Param0_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param5_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param9_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param10_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param11_Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Param12_Unit: {
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
    Param9_IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Not Applicable,1:Applicable"
    }
  }, {
    sequelize,
    tableName: 'tbl_product_capsule',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cap_id" },
        ]
      },
    ]
  });
};
