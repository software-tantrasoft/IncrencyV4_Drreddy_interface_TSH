const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_change_password', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "ID of PK AI"
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "When"
    },
    time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "When"
    },
    DoneByUserID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Who"
    },
    DoneByUserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Who"
    },
    AffectedUserID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "What"
    },
    AffectedUserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "What"
    },
    OldValue: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "What"
    },
    NewValue: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "What"
    },
    Action: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "What"
    },
    Remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Why"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_change_password',
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
