const { Counterpart } = require('../models');
const { Op } = require('sequelize');

// Obter todas as contrapartes
exports.getAllCounterparts = async (req, res) => {
  try {
    const { search, active, homologated } = req.query;
    
    let whereCondition = {};
    
    // Filtro de pesquisa
    if (search) {
      whereCondition = {
        [Op.or]: [
          { companyName: { [Op.iLike]: `%${search}%` } },
          { cnpj: { [Op.iLike]: `%${search}%` } },
          { contactName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Filtro de status ativo
    if (active !== undefined) {
      whereCondition.active = active === 'true';
    }
    
    // Filtro de homologação
    if (homologated !== undefined) {
      whereCondition.homologated = homologated === 'true';
    }
    
    const counterparts = await Counterpart.findAll({
      where: whereCondition,
      order: [['companyName', 'ASC']]
    });
    
    res.status(200).json(counterparts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar contrapartes', 
      error: error.message 
    });
  }
};

// Obter contraparte por ID
exports.getCounterpartById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const counterpart = await Counterpart.findByPk(id);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    res.status(200).json(counterpart);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar contraparte', 
      error: error.message 
    });
  }
};

// Criar nova contraparte
exports.createCounterpart = async (req, res) => {
  try {
    const { 
      companyName, 
      cnpj, 
      contactName, 
      email, 
      phone, 
      active, 
      homologated,
      homologationDate,
      documents,
      notes
    } = req.body;
    
    // Verificar se já existe uma contraparte com o mesmo CNPJ
    const existingCounterpart = await Counterpart.findOne({ where: { cnpj } });
    
    if (existingCounterpart) {
      return res.status(400).json({ message: 'Já existe uma contraparte com este CNPJ' });
    }
    
    const counterpart = await Counterpart.create({
      companyName,
      cnpj,
      contactName,
      email,
      phone,
      active: active !== undefined ? active : true,
      homologated: homologated !== undefined ? homologated : false,
      homologationDate: homologationDate || null,
      documents: documents || {},
      notes: notes || ''
    });
    
    res.status(201).json({
      message: 'Contraparte criada com sucesso',
      counterpart
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar contraparte', 
      error: error.message 
    });
  }
};

// Atualizar contraparte
exports.updateCounterpart = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      companyName, 
      cnpj, 
      contactName, 
      email, 
      phone, 
      active, 
      homologated,
      homologationDate,
      documents,
      notes
    } = req.body;
    
    const counterpart = await Counterpart.findByPk(id);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    // Verificar se o CNPJ atualizado já existe em outra contraparte
    if (cnpj && cnpj !== counterpart.cnpj) {
      const existingCounterpart = await Counterpart.findOne({ 
        where: { 
          cnpj,
          id: { [Op.ne]: id } 
        } 
      });
      
      if (existingCounterpart) {
        return res.status(400).json({ message: 'Já existe outra contraparte com este CNPJ' });
      }
    }
    
    await counterpart.update({
      companyName: companyName || counterpart.companyName,
      cnpj: cnpj || counterpart.cnpj,
      contactName: contactName || counterpart.contactName,
      email: email || counterpart.email,
      phone: phone || counterpart.phone,
      active: active !== undefined ? active : counterpart.active,
      homologated: homologated !== undefined ? homologated : counterpart.homologated,
      homologationDate: homologationDate || counterpart.homologationDate,
      documents: documents || counterpart.documents,
      notes: notes || counterpart.notes
    });
    
    res.status(200).json({
      message: 'Contraparte atualizada com sucesso',
      counterpart
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar contraparte', 
      error: error.message 
    });
  }
};

// Excluir contraparte
exports.deleteCounterpart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const counterpart = await Counterpart.findByPk(id);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    // Em vez de excluir, desativar a contraparte
    await counterpart.update({ active: false });
    
    res.status(200).json({
      message: 'Contraparte desativada com sucesso'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao desativar contraparte', 
      error: error.message 
    });
  }
};

// Homologar contraparte
exports.homologateCounterpart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const counterpart = await Counterpart.findByPk(id);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    await counterpart.update({ 
      homologated: true,
      homologationDate: new Date()
    });
    
    res.status(200).json({
      message: 'Contraparte homologada com sucesso',
      counterpart
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao homologar contraparte', 
      error: error.message 
    });
  }
}; 