const supabase = require('../config/supabase');

exports.registrarLeitura = async (req, res) => {
  try {
    const { minutos } = req.body;

    if (!minutos || minutos <= 0) {
      return res.status(400).json({ error: 'Minutos inválidos' });
    }

    const hoje = new Date().toISOString().split('T')[0];

    // Garante que data venha pelo menos como um array vazio em caso de falha/nulo
    const { data, error } = await supabase
      .from('leituras')
      .select('minutos')
      .eq('aluno_id', req.user.id)
      .eq('data', hoje);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const leiturasAtuais = data || [];
    const totalHoje = leiturasAtuais.reduce((acc, item) => acc + item.minutos, 0);

    if (totalHoje + minutos > 16) {
      return res.status(400).json({
        error: `Você já registrou ${totalHoje} minutos hoje. O limite diário é 16 minutos.`
      });
    }

    const { error: insertError } = await supabase
      .from('leituras')
      .insert([
        { aluno_id: req.user.id, minutos, data: hoje }
      ]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.json({ message: 'Leitura registrada' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

exports.rankingTurmas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leituras')
      .select(`
        minutos,
        alunos ( turma )
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const ranking = {};
    const leituras = data || [];

    leituras.forEach(item => {
      // O uso do optional chaining (?.) evita quebrar se "alunos" for nulo
      // Trata tanto se "alunos" vier como objeto ou array (padrão Supabase costuma ser objeto nesse tipo de join)
      const alunoInfo = Array.isArray(item.alunos) ? item.alunos[0] : item.alunos;
      
      if (alunoInfo && alunoInfo.turma) {
        const turma = alunoInfo.turma;
        ranking[turma] = (ranking[turma] || 0) + item.minutos;
      }
    });

    return res.json(ranking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar ranking' });
  }
};

exports.progressoGeral = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leituras')
      .select('minutos');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const leituras = data || [];
    const total = leituras.reduce((acc, item) => acc + item.minutos, 0);

    return res.json({
      total,
      meta: 1000000
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao calcular progresso' });
  }
};