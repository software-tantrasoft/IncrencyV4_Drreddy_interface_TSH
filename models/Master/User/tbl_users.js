const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_users', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Pwd: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PwdChgDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    PwdExpStauts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "0=Active"
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0 : Enabled || 1: Temp Disabled || 2:Permanent Disable || 4: Auto Disable || 6: User Locked"
    },
    Reason: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    PwdChg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "By defaullt value is 1,1 means this password is set by admin.0 means set by user"
    },
    isadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    LastLoginDt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    UserInitials: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: "NULL"
    },
    loginatmpt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    suspensionPeriod: {
      type: DataTypes.DATE,
      allowNull: true
    },
    autoEnbl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "To check logged in already or not"
    },
    realPassword: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    lstActvtyTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Department: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Role: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    HostName: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    loginCounter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    source: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "NULL"
    },
    PREV_STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "This will store the previous status when user is autodisable and he made unsuccessfull attempts"
    },
    Domain: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "NULL"
    },
    failedAtmpTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
      {
        name: "userid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
};
