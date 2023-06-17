const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_sp_error_log', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    DT_TM: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    warning: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    error: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    }
  }, {
    sequelize,
    tableName: 'tbl_sp_error_log',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
