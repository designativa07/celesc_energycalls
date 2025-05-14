const { EnergyCall, Proposal, Counterpart } = require('../models');
const { Op } = require('sequelize');

// Obter chamadas de energia abertas para a contraparte
exports.getAvailableCalls = async (req, res) => {
  try {
    const counterpartId = req.counterpart.id;
    
    // Buscar apenas chamadas abertas cujo prazo não expirou
    const calls = await EnergyCall.findAll({
      where: {
        status: 'open',
        deadline: {
          [Op.gte]: new Date() // Data de prazo maior ou igual a hoje
        }
      },
      attributes: [
        'id', 
        'title', 
        'type', 
        'energyType', 
        'amount', 
        'startDate', 
        'endDate', 
        'deadline', 
        'description', 
        'requirements', 
        'isExtraordinary',
        'createdAt'
      ],
      order: [['deadline', 'ASC']] // Ordenar por prazo crescente
    });
    
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar chamadas disponíveis', 
      error: error.message 
    });
  }
};

// Obter detalhes de uma chamada específica
exports.getCallDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const call = await EnergyCall.findByPk(id, {
      attributes: [
        'id',
        'title',
        'type',
        'energyType',
        'amount',
        'startDate',
        'endDate',
        'deadline',
        'status',
        'description',
        'requirements',
        'isExtraordinary',
        'createdAt'
      ]
    });
    
    if (!call) {
      return res.status(404).json({ message: 'Chamada não encontrada' });
    }
    
    if (call.status !== 'open') {
      return res.status(403).json({ message: 'Esta chamada não está aberta para propostas' });
    }
    
    if (new Date() > new Date(call.deadline)) {
      return res.status(403).json({ message: 'O prazo para envio de propostas para esta chamada já expirou' });
    }
    
    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar detalhes da chamada', 
      error: error.message 
    });
  }
};

// Enviar proposta para uma chamada
exports.submitProposal = async (req, res) => {
  try {
    const counterpartId = req.counterpart.id;
    const { 
      energyCallId, 
      price, 
      amount, 
      deliveryDate, 
      validUntil, 
      comments 
    } = req.body;
    
    // Verificar se a chamada existe
    const energyCall = await EnergyCall.findByPk(energyCallId);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Verificar se a chamada está aberta
    if (energyCall.status !== 'open') {
      return res.status(403).json({ message: 'Esta chamada não está aberta para propostas' });
    }
    
    // Verificar se o prazo não expirou
    if (new Date() > new Date(energyCall.deadline)) {
      return res.status(403).json({ message: 'O prazo para envio de propostas para esta chamada já expirou' });
    }
    
    // Verificar se a contraparte já enviou uma proposta para esta chamada
    const existingProposal = await Proposal.findOne({
      where: {
        energyCallId,
        counterpartId
      }
    });
    
    if (existingProposal) {
      return res.status(400).json({ message: 'Você já enviou uma proposta para esta chamada' });
    }
    
    // Criar a proposta
    const proposal = await Proposal.create({
      energyCallId,
      counterpartId,
      price,
      amount,
      deliveryDate: deliveryDate || null,
      status: 'pending',
      receivedAt: new Date(),
      validUntil: validUntil || null,
      comments: comments || ''
    });
    
    res.status(201).json({
      message: 'Proposta enviada com sucesso',
      proposal
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao enviar proposta', 
      error: error.message 
    });
  }
};

// Obter propostas enviadas pela contraparte
exports.getMyProposals = async (req, res) => {
  try {
    const counterpartId = req.counterpart.id;
    
    const proposals = await Proposal.findAll({
      where: { counterpartId },
      include: [
        {
          model: EnergyCall,
          attributes: ['id', 'title', 'type', 'energyType', 'status', 'deadline']
        }
      ],
      order: [['receivedAt', 'DESC']]
    });
    
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar suas propostas', 
      error: error.message 
    });
  }
}; 