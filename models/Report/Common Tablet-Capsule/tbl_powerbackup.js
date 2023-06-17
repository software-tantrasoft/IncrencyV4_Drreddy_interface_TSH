const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  let powerbackup =  sequelize.define('tbl_powerbackup', {
    CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    WeighmentType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WeighmentName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ProductType: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Userid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ReportType: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Incomp_RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    RecSampleNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EntryTimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    TimUpdate: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Childcno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    ISCommOff: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Idsno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Sys_CubType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Sys_BFGCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Sys_Batch: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TableType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Instrument_Model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Before_Count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    After_Count: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_powerbackup',
    timestamps: false
  });
  powerbackup.removeAttribute('id');
  return powerbackup;
};
