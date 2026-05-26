const supabase = require('../config/supabase'); // Ajuste o caminho se necessário
const bcrypt = require('bcrypt'); // Certifique-se de ter instalado: npm install bcrypt

exports.registrar = async (req, res) => {
  try {
    const { nome, rm, turma, senha } = req.body;

    if (!nome || !rm || !turma || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { error } = await supabase
      .from('alunos')
      .insert([
        { nome, rm, turma, senha: senhaHash }
      ]);

    if (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Aluno cadastrado' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};