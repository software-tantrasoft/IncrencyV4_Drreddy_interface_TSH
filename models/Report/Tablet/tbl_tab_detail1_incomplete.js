const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_detail1_incomplete', {
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
    DP: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_tab_detail1_incomplete',
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
