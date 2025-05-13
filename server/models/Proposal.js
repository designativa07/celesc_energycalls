const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proposal = sequelize.define('Proposal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  energyCallId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'EnergyCalls',
      key: 'id'
    }
  },
  counterpartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Counterparts',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Preço por MWh em R$'
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Quantidade de energia em MWh'
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
    defaultValue: 'pending'
  },
  receivedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  respondedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Proposal; 