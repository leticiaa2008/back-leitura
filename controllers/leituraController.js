const supabase = require('../config/supabase');

exports.registrarLeitura = async (req, res) => {

  try {

    const { minutos } = req.body;

    if (minutos <= 0) {
      return res.status(400).json({
        error: 'Minutos inválidos'
      });
    }

    const hoje = new Date()
      .toISOString()
      .split('T')[0];

    const { data } = await supabase
      .from('leituras')
      .select('minutos')
      .eq('aluno_id', req.user.id)
      .eq('data', hoje);

    const totalHoje = data.reduce(
      (acc, item) => acc + item.minutos,
      0
    );

    if (totalHoje + minutos > 16) {

      return res.status(400).json({
        error: `Você já registrou ${totalHoje} minutos hoje`
      });
    }

    await supabase
      .from('leituras')
      .insert([
        {
          aluno_id: req.user.id,
          minutos,
          data: hoje
        }
      ]);

    res.json({
      message: 'Leitura registrada'
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.rankingTurmas = async (req, res) => {

  const { data } = await supabase
    .from('leituras')
    .select(`
      minutos,
      alunos (
        turma
      )
    `);

  const ranking = {};

  data.forEach(item => {

    const turma = item.alunos.turma;

    ranking[turma] =
      (ranking[turma] || 0)
      + item.minutos;
  });

  res.json(ranking);
};

exports.progressoGeral = async (req, res) => {

  const { data } = await supabase
    .from('leituras')
    .select('minutos');

  const total = data.reduce(
    (acc, item) => acc + item.minutos,
    0
  );

  res.json({
    total,
    meta: 1000000
  });
};