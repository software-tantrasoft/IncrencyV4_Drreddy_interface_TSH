const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_detail3_incomplete', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      allowNull: true,
      defaultValue: "0"
    },
    DecimalPoint: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    UserId: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    PrEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrEndTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    Side: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    SideNo: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_tab_detail3_incomplete',
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
