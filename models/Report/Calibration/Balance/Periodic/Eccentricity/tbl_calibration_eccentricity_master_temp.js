const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_eccentricity_master_temp', {
    Eccent_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Eccent_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Eccent_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Eccent_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_LeastCnt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_MaxCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_MinCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Eccent_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "1992-12-08 00:00:00"
    },
    Eccent_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eccent_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Eccent_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Eccent_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eccent_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eccent_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_eccentricity_master_temp',
    timestamps: false,
    indexes: [
      {
        name: "Eccent_RepNo",
        using: "BTREE",
        fields: [
          { name: "Eccent_RepNo" },
        ]
      },
    ]
  });
};
