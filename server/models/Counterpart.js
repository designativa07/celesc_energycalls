const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Counterpart = sequelize.define('Counterpart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Código de acesso para login da contraparte'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  homologated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  homologationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  documents: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Counterpart; 