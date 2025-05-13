const { Proposal, EnergyCall, Counterpart, User } = require('../models');
const { Op } = require('sequelize');

// Obter todas as propostas
exports.getAllProposals = async (req, res) => {
  try {
    const { 
      energyCallId, 
      counterpartId, 
      status, 
      priceMin, 
      priceMax 
    } = req.query;
    
    let whereCondition = {};
    
    // Filtro por chamada de energia
    if (energyCallId) {
      whereCondition.energyCallId = energyCallId;
    }
    
    // Filtro por contraparte
    if (counterpartId) {
      whereCondition.counterpartId = counterpartId;
    }
    
    // Filtro por status
    if (status) {
      whereCondition.status = status;
    }
    
    // Filtro por faixa de preço
    if (priceMin || priceMax) {
      whereCondition.price = {};
      
      if (priceMin) {
        whereCondition.price[Op.gte] = parseFloat(priceMin);
      }
      
      if (priceMax) {
        whereCondition.price[Op.lte] = parseFloat(priceMax);
      }
    }
    
    const proposals = await Proposal.findAll({
      where: whereCondition,
      include: [
        {
          model: EnergyCall,
          attributes: ['id', 'title', 'type', 'energyType', 'status']
        },
        {
          model: Counterpart,
          attributes: ['id', 'companyName', 'cnpj', 'email']
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['receivedAt', 'DESC']]
    });
    
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar propostas', 
      error: error.message 
    });
  }
};

// Obter proposta por ID
exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proposal = await Proposal.findByPk(id, {
      include: [
        {
          model: EnergyCall,
          attributes: ['id', 'title', 'type', 'energyType', 'status', 'deadline', 'amount']
        },
        {
          model: Counterpart,
          attributes: ['id', 'companyName', 'cnpj', 'email', 'contactName', 'phone']
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar proposta', 
      error: error.message 
    });
  }
};

// Criar nova proposta
exports.createProposal = async (req, res) => {
  try {
    const {
      energyCallId,
      counterpartId,
      price,
      amount,
      deliveryDate,
      validUntil,
      comments,
      attachments
    } = req.body;
    
    // Verificar se a chamada de energia existe e está aberta
    const energyCall = await EnergyCall.findByPk(energyCallId);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    if (energyCall.status !== 'open') {
      return res.status(400).json({ 
        message: 'Não é possível criar propostas para chamadas que não estão abertas' 
      });
    }
    
    if (new Date() > new Date(energyCall.deadline)) {
      return res.status(400).json({ 
        message: 'O prazo para envio de propostas para esta chamada já expirou' 
      });
    }
    
    // Verificar se a contraparte existe
    const counterpart = await Counterpart.findByPk(counterpartId);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    if (!counterpart.active) {
      return res.status(400).json({ message: 'Esta contraparte está desativada' });
    }
    
    if (!counterpart.homologated) {
      return res.status(400).json({ message: 'Esta contraparte não está homologada' });
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
      comments: comments || '',
      attachments: attachments || []
    });
    
    res.status(201).json({
      message: 'Proposta criada com sucesso',
      proposal
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar proposta', 
      error: error.message 
    });
  }
};

// Atualizar status de proposta
exports.updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    
    const proposal = await Proposal.findByPk(id, {
      include: [
        {
          model: EnergyCall
        }
      ]
    });
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    // Verificar se a chamada está aberta
    if (proposal.EnergyCall.status !== 'open') {
      return res.status(400).json({ 
        message: 'Não é possível atualizar propostas de chamadas que não estão abertas' 
      });
    }
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status inválido. Valores permitidos: pending, accepted, rejected' 
      });
    }
    
    // Se estiver aceitando a proposta, atualiza a chamada para fechada
    if (status === 'accepted') {
      await proposal.EnergyCall.update({
        status: 'closed',
        closedBy: req.user.id,
        closedAt: new Date(),
        winningProposalId: proposal.id
      });
      
      // Rejeitar todas as outras propostas da mesma chamada
      await Proposal.update(
        { 
          status: 'rejected',
          responseDate: new Date(),
          respondedBy: req.user.id,
          comments: 'Proposta rejeitada automaticamente. Outra proposta foi aceita.'
        },
        { 
          where: { 
            energyCallId: proposal.energyCallId,
            id: { [Op.ne]: proposal.id }
          }
        }
      );
    }
    
    // Atualizar a proposta
    await proposal.update({
      status,
      responseDate: new Date(),
      respondedBy: req.user.id,
      comments: comments ? (proposal.comments + '\n\n' + comments) : proposal.comments
    });
    
    res.status(200).json({
      message: 'Status da proposta atualizado com sucesso',
      proposal
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar status da proposta', 
      error: error.message 
    });
  }
};

// Obter propostas por chamada de energia
exports.getProposalsByEnergyCall = async (req, res) => {
  try {
    const { energyCallId } = req.params;
    
    // Verificar se a chamada existe
    const energyCall = await EnergyCall.findByPk(energyCallId);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    const proposals = await Proposal.findAll({
      where: { energyCallId },
      include: [
        {
          model: Counterpart,
          attributes: ['id', 'companyName', 'cnpj', 'email', 'contactName']
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['receivedAt', 'ASC']] // Ordem de recebimento (primeiro recebido primeiro)
    });
    
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar propostas por chamada', 
      error: error.message 
    });
  }
};

// Obter propostas por contraparte
exports.getProposalsByCounterpart = async (req, res) => {
  try {
    const { counterpartId } = req.params;
    
    // Verificar se a contraparte existe
    const counterpart = await Counterpart.findByPk(counterpartId);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    const proposals = await Proposal.findAll({
      where: { counterpartId },
      include: [
        {
          model: EnergyCall,
          attributes: ['id', 'title', 'type', 'energyType', 'status', 'deadline']
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['receivedAt', 'DESC']]
    });
    
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar propostas por contraparte', 
      error: error.message 
    });
  }
}; 