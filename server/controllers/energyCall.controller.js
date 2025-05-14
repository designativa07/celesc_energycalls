const { EnergyCall, Proposal, User, Counterpart } = require('../models');
const { Op } = require('sequelize');

// Obter todas as chamadas de energia
exports.getAllEnergyCalls = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      type, 
      energyType, 
      isExtraordinary, 
      startDateFrom, 
      startDateTo,
      registeredInCCEE
    } = req.query;
    
    let whereCondition = {};
    
    // Filtro de pesquisa
    if (search) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Filtro de status
    if (status) {
      whereCondition.status = status;
    }
    
    // Filtro por tipo (compra/venda)
    if (type) {
      whereCondition.type = type;
    }
    
    // Filtro por tipo de energia
    if (energyType) {
      whereCondition.energyType = energyType;
    }
    
    // Filtro por chamada extraordinária
    if (isExtraordinary !== undefined) {
      whereCondition.isExtraordinary = isExtraordinary === 'true';
    }
    
    // Filtro por data de início
    if (startDateFrom || startDateTo) {
      whereCondition.startDate = {};
      
      if (startDateFrom) {
        whereCondition.startDate[Op.gte] = new Date(startDateFrom);
      }
      
      if (startDateTo) {
        whereCondition.startDate[Op.lte] = new Date(startDateTo);
      }
    }
    
    // Filtro por registro na CCEE
    if (registeredInCCEE !== undefined) {
      whereCondition.registeredInCCEE = registeredInCCEE === 'true';
    }
    
    const energyCalls = await EnergyCall.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(energyCalls);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar chamadas de energia', 
      error: error.message 
    });
  }
};

// Obter chamada de energia por ID
exports.getEnergyCallById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Tentando buscar chamada de energia com ID: ${id}`);
    
    const energyCall = await EnergyCall.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'closer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Proposal,
          include: [
            {
              model: Counterpart,
              attributes: ['id', 'companyName', 'cnpj', 'email']
            },
            {
              model: User,
              as: 'responder',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
    
    if (!energyCall) {
      console.log(`Chamada de energia com ID ${id} não encontrada`);
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    console.log(`Chamada de energia com ID ${id} encontrada com sucesso`);
    res.status(200).json(energyCall);
  } catch (error) {
    console.error(`Erro ao buscar chamada de energia com ID ${req.params.id}:`, error);
    res.status(500).json({ 
      message: 'Erro ao buscar chamada de energia', 
      error: error.message 
    });
  }
};

// Criar nova chamada de energia
exports.createEnergyCall = async (req, res) => {
  try {
    const {
      title,
      type,
      energyType,
      amount,
      startDate,
      endDate,
      deadline,
      description,
      requirements,
      isExtraordinary,
      status
    } = req.body;
    
    // O criador é o usuário autenticado ou um ID temporário para testes
    const creatorId = req.user?.id || 1; // Usando ID 1 como fallback para testes
    
    const energyCall = await EnergyCall.create({
      title,
      type,
      energyType,
      amount,
      startDate,
      endDate,
      deadline,
      description,
      requirements,
      creatorId,
      isExtraordinary: isExtraordinary || false,
      status: status || 'draft'
    });
    
    res.status(201).json({
      message: 'Chamada de energia criada com sucesso',
      energyCall
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar chamada de energia', 
      error: error.message 
    });
  }
};

// Atualizar chamada de energia
exports.updateEnergyCall = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      energyType,
      amount,
      startDate,
      endDate,
      deadline,
      description,
      requirements,
      isExtraordinary,
      status
    } = req.body;
    
    const energyCall = await EnergyCall.findByPk(id);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Não permitir edição se a chamada já estiver fechada ou cancelada
    if (['closed', 'completed', 'canceled'].includes(energyCall.status)) {
      return res.status(400).json({ 
        message: 'Não é possível editar uma chamada que já foi fechada, concluída ou cancelada' 
      });
    }
    
    await energyCall.update({
      title: title || energyCall.title,
      type: type || energyCall.type,
      energyType: energyType || energyCall.energyType,
      amount: amount || energyCall.amount,
      startDate: startDate || energyCall.startDate,
      endDate: endDate || energyCall.endDate,
      deadline: deadline || energyCall.deadline,
      description: description || energyCall.description,
      requirements: requirements || energyCall.requirements,
      isExtraordinary: isExtraordinary !== undefined ? isExtraordinary : energyCall.isExtraordinary,
      status: status || energyCall.status
    });
    
    res.status(200).json({
      message: 'Chamada de energia atualizada com sucesso',
      energyCall
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar chamada de energia', 
      error: error.message 
    });
  }
};

// Publicar chamada de energia (mudar status para 'open')
exports.publishEnergyCall = async (req, res) => {
  try {
    const { id } = req.params;
    
    const energyCall = await EnergyCall.findByPk(id);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Verificar se a chamada está em rascunho
    if (energyCall.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Apenas chamadas em rascunho podem ser publicadas' 
      });
    }
    
    await energyCall.update({ status: 'open' });
    
    res.status(200).json({
      message: 'Chamada de energia publicada com sucesso',
      energyCall
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao publicar chamada de energia', 
      error: error.message 
    });
  }
};

// Fechar chamada de energia
exports.closeEnergyCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { winningProposalId } = req.body;
    
    const energyCall = await EnergyCall.findByPk(id, {
      include: [
        {
          model: Proposal
        }
      ]
    });
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Verificar se a chamada está aberta
    if (energyCall.status !== 'open') {
      return res.status(400).json({ 
        message: 'Apenas chamadas abertas podem ser fechadas' 
      });
    }
    
    // Obter o ID do usuário (se disponível)
    const userId = req.user ? req.user.id : null;
    
    // Validar a proposta vencedora se fornecida
    if (winningProposalId) {
      const winningProposal = energyCall.Proposals.find(p => p.id === parseInt(winningProposalId));
      
      if (!winningProposal) {
        return res.status(400).json({ 
          message: 'Proposta vencedora não encontrada nesta chamada' 
        });
      }
      
      // Atualizar o status da proposta vencedora
      await winningProposal.update({ 
        status: 'accepted',
        responseDate: new Date(),
        respondedBy: userId
      });
      
      // Atualizar status das outras propostas
      for (const proposal of energyCall.Proposals) {
        if (proposal.id !== parseInt(winningProposalId)) {
          await proposal.update({ 
            status: 'rejected',
            responseDate: new Date(),
            respondedBy: userId
          });
        }
      }
    }
    
    // Fechar a chamada
    await energyCall.update({ 
      status: 'closed',
      closedBy: userId,
      closedAt: new Date(),
      winningProposalId: winningProposalId || null
    });
    
    res.status(200).json({
      message: 'Chamada de energia fechada com sucesso',
      energyCall
    });
  } catch (error) {
    console.error('Erro ao fechar chamada:', error);
    res.status(500).json({ 
      message: 'Erro ao fechar chamada de energia', 
      error: error.message 
    });
  }
};

// Cancelar chamada de energia
exports.cancelEnergyCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const energyCall = await EnergyCall.findByPk(id);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Verificar se a chamada está em rascunho ou aberta
    if (!['draft', 'open'].includes(energyCall.status)) {
      return res.status(400).json({ 
        message: 'Apenas chamadas em rascunho ou abertas podem ser canceladas' 
      });
    }
    
    // Obter o ID do usuário (se disponível)
    const userId = req.user ? req.user.id : null;
    
    await energyCall.update({ 
      status: 'canceled',
      notes: reason || 'Cancelada pelo usuário',
      closedBy: userId,
      closedAt: new Date()
    });
    
    res.status(200).json({
      message: 'Chamada de energia cancelada com sucesso',
      energyCall
    });
  } catch (error) {
    console.error('Erro ao cancelar chamada:', error);
    res.status(500).json({ 
      message: 'Erro ao cancelar chamada de energia', 
      error: error.message 
    });
  }
};

// Registrar chamada na CCEE
exports.registerInCCEE = async (req, res) => {
  try {
    const { id } = req.params;
    const { registrationInfo } = req.body;
    
    const energyCall = await EnergyCall.findByPk(id);
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Verificar se a chamada está fechada
    if (energyCall.status !== 'closed') {
      return res.status(400).json({ 
        message: 'Apenas chamadas fechadas podem ser registradas na CCEE' 
      });
    }
    
    await energyCall.update({ 
      registeredInCCEE: true,
      registrationDate: new Date(),
      status: 'completed',
      notes: energyCall.notes + '\n\nRegistro CCEE: ' + (registrationInfo || 'Registrado pelo usuário')
    });
    
    res.status(200).json({
      message: 'Chamada de energia registrada na CCEE com sucesso',
      energyCall
    });
  } catch (error) {
    console.error('Erro ao registrar chamada na CCEE:', error);
    res.status(500).json({ 
      message: 'Erro ao registrar chamada na CCEE', 
      error: error.message 
    });
  }
};

// Gerar relatório de chamada de energia
exports.generateCallReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const energyCall = await EnergyCall.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'department']
        },
        {
          model: User,
          as: 'closer',
          attributes: ['id', 'name', 'email', 'department']
        },
        {
          model: Proposal,
          include: [
            {
              model: Counterpart,
              attributes: ['id', 'companyName', 'cnpj', 'email', 'contactName', 'phone']
            }
          ]
        }
      ]
    });
    
    if (!energyCall) {
      return res.status(404).json({ message: 'Chamada de energia não encontrada' });
    }
    
    // Preparar dados para o relatório
    const reportData = {
      callInfo: {
        id: energyCall.id,
        title: energyCall.title,
        type: energyCall.type,
        energyType: energyCall.energyType,
        amount: energyCall.amount,
        startDate: energyCall.startDate,
        endDate: energyCall.endDate,
        deadline: energyCall.deadline,
        status: energyCall.status,
        createdAt: energyCall.createdAt,
        closedAt: energyCall.closedAt,
        registeredInCCEE: energyCall.registeredInCCEE,
        registrationDate: energyCall.registrationDate,
        isExtraordinary: energyCall.isExtraordinary
      },
      creator: energyCall.creator ? {
        name: energyCall.creator.name,
        email: energyCall.creator.email,
        department: energyCall.creator.department
      } : null,
      closer: energyCall.closer ? {
        name: energyCall.closer.name,
        email: energyCall.closer.email,
        department: energyCall.closer.department
      } : null,
      proposals: energyCall.Proposals.map(proposal => ({
        id: proposal.id,
        counterpart: {
          companyName: proposal.Counterpart.companyName,
          cnpj: proposal.Counterpart.cnpj,
          contactName: proposal.Counterpart.contactName,
          email: proposal.Counterpart.email,
          phone: proposal.Counterpart.phone
        },
        price: proposal.price,
        amount: proposal.amount,
        receivedAt: proposal.receivedAt,
        status: proposal.status,
        isWinner: energyCall.winningProposalId === proposal.id
      })),
      winningProposal: energyCall.Proposals.find(p => p.id === energyCall.winningProposalId) || null
    };
    
    res.status(200).json({
      message: 'Relatório gerado com sucesso',
      report: reportData
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao gerar relatório', 
      error: error.message 
    });
  }
};

// Obter estatísticas de chamadas
exports.getCallStats = async (req, res) => {
  try {
    // Contagem de chamadas ativas (status = open)
    const activeCalls = await EnergyCall.count({
      where: { status: 'open' }
    });
    
    // Contagem de chamadas concluídas (status = completed)
    const completedCalls = await EnergyCall.count({
      where: { status: 'completed' }
    });
    
    // Contagem de propostas pendentes
    const pendingProposals = await Proposal.count({
      where: { status: 'pending' },
      include: [
        {
          model: EnergyCall,
          where: { status: 'open' }
        }
      ]
    });
    
    res.status(200).json({
      activeCalls,
      completedCalls,
      pendingProposals
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ 
      message: 'Erro ao obter estatísticas', 
      error: error.message 
    });
  }
}; 