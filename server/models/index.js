const User = require('./User');
const Counterpart = require('./Counterpart');
const EnergyCall = require('./EnergyCall');
const Proposal = require('./Proposal');

// Relacionamentos User -> EnergyCall
User.hasMany(EnergyCall, { as: 'createdCalls', foreignKey: 'creatorId' });
EnergyCall.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

User.hasMany(EnergyCall, { as: 'closedCalls', foreignKey: 'closedBy' });
EnergyCall.belongsTo(User, { as: 'closer', foreignKey: 'closedBy' });

// Relacionamentos EnergyCall -> Proposal
EnergyCall.hasMany(Proposal, { foreignKey: 'energyCallId' });
Proposal.belongsTo(EnergyCall, { foreignKey: 'energyCallId' });

// Relacionamentos Counterpart -> Proposal
Counterpart.hasMany(Proposal, { foreignKey: 'counterpartId' });
Proposal.belongsTo(Counterpart, { foreignKey: 'counterpartId' });

// Relacionamentos User -> Proposal (resposta)
User.hasMany(Proposal, { as: 'respondedProposals', foreignKey: 'respondedBy' });
Proposal.belongsTo(User, { as: 'responder', foreignKey: 'respondedBy' });

module.exports = {
  User,
  Counterpart,
  EnergyCall,
  Proposal
}; 