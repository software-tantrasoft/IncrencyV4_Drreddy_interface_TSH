const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_detailhtd_incomplete', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MstSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RecSeqNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    DataValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    DataValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    DP: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_tab_detailhtd_incomplete',
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
