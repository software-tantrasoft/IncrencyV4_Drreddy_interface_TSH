const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_detailhtd_archived', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'tbl_tab_detailhtd_archived',
    timestamps: false
  });
};
