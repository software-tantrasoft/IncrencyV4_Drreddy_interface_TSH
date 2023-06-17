const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_detail2', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MstSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    RecSeqNo: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    DataValue: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    BatchNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    BFGCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    PName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PVersion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Version: {
      type: DataTypes.STRING(50),
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
    PrDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    PrTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    Side: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    DecimalPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Remark: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "NULL"
    },
    InstrumentID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    InstrumentName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_tab_detail2',
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
