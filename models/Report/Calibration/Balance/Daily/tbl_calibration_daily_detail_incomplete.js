const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_daily_detail_incomplete', {
    SeqNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Daily_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Daily_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Daily_BalStdWt1: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol1: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol1: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt1: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID1: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo1: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_WeightBox_certfctNo1: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate1: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWt1: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity1: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalStdWt2: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol2: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol2: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt2: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID2: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_WeightBox_certfctNo2: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate2: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    PercentofCapacity2: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalStdWt3: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol3: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol3: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt3: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID3: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo3: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt3: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_WeightBox_certfctNo3: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_ValDate3: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    PercentofCapacity3: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalStdWt4: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol4: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol4: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt4: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID4: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo4: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt4: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity4: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_WeightBox_certfctNo4: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate4: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_BalStdWt5: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol5: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol5: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt5: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID5: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo5: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt5: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity5: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_WeightBox_certfctNo5: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate5: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_BalStdWt6: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol6: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol6: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt6: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID6: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo6: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt6: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity6: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_WeightBox_certfctNo6: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate6: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_BalStdWt7: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol7: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol7: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt7: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID7: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo7: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt7: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity7: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_WeightBox_certfctNo7: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate7: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_BalStdWt8: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalNegTol8: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_BalPosTol8: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ActualWt8: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWtBoxID8: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_StdWtIDNo8: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Daily_StdWt8: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity8: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_WeightBox_certfctNo8: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Daily_ValDate8: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_daily_detail_incomplete',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SeqNo" },
        ]
      },
    ]
  });
};
