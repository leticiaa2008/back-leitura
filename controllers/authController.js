const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  try {
    const { nome, rm, turma, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const { error } = await supabase
      .from('alunos')
      .insert([
        {
          nome,
          rm,
          turma,
          senha: senhaHash
        }
      ]);

    if (error) {
      return res.status(400).json(error);
    }

    res.json({
      message: 'Aluno cadastrado'
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {

    const { rm, senha } = req.body;

    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('rm', rm)
      .single();

    if (error || !data) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      data.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Senha inválida'
      });
    }

    const token = jwt.sign(
      {
        id: data.id,
        turma: data.turma
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      token,
      aluno: data
    });

  } catch (err) {
    res.status(500).json(err);
  }
};