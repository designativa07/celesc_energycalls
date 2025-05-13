const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnergyCall = sequelize.define('EnergyCall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false
  },
  energyType: {
    type: DataTypes.ENUM('conventional', 'incentivized'),
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Quantidade de energia em MWh'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Data e hora limite para recebimento de propostas'
  },
  status: {
    type: DataTypes.ENUM('draft', 'open', 'closed', 'canceled', 'completed'),
    defaultValue: 'draft'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  closedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  winningProposalId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  registeredInCCEE: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isExtraordinary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = EnergyCall; 