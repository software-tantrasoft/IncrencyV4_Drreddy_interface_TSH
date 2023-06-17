const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_instrumentlog_lod', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EqpID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FromDT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ToDT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    FromTM: {
      type: DataTypes.TIME,
      allowNull: true
    },
    ToTM: {
      type: DataTypes.TIME,
      allowNull: true
    },
    BatchNo: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    BFGCode: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Activity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UserId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    department_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_instrumentlog_lod',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__tbl_inst__36047C74B5181BDA",
        unique: true,
        fields: [
          { name: "RecNo" },
        ]
      },
    ]
  });
};
