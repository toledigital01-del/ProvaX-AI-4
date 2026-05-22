import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize Google GenAI securely server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Athena secure AI module initialized with Gemini API.');
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
} else {
  console.log('Starting server in fallback-simulation mode. To enable real AI Athena, add GEMINI_API_KEY in Settings > Secrets.');
}

// ------------------- API ROUTES -------------------

// 1. Health & Server Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !!ai,
    time: new Date().toISOString(),
  });
});

// 2. Athena Strategic Chat Assistant
app.post('/api/chat-athena', async (req, res) => {
  const { 
    messages, 
    onboarding, 
    progress,
    provider,
    openaiKey,
    anthropicKey,
    geminiKey,
    aiName,
    aiTone,
    aiStrictness,
    aiCustomInstruction
  } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato de mensagens inválido.' });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';
  
  // Custom Tone formulation
  const toneMap: Record<string, string> = {
    elite: 'Elite Policial (Exigente, Rigorosa, Disciplinada e Tática)',
    motivator: 'Motivacional (Empática, Inspiradora, Compreensiva e Focada no Próximo Nível)',
    academic: 'Acadêmica & Jurídica (Formal, Doutrinária, Altamente Técnica e Profunda)',
    direct: 'Direta (Informativa, Assertiva, Focada em Insights Rápidos)'
  };
  const activeTone = toneMap[aiTone] || toneMap.elite;

  const contextPrompt = `
Você é a mentora de inteligência artificial **${aiName || 'Athena'}**, especialista máxima na aprovação do concurso da Polícia Rodoviária Federal (PRF).
Você foi projetada por mentores e delegados experientes em alta performance, dominando as pegadinhas e o edital CEBRASPE.

Seu tom de relacionamento ativo selecionado é: **${activeTone}**. Incorpore essa postura filosófica em cada linha!
Instruções extras comportamentais do Administrador:
"${aiCustomInstruction || 'Manter alta exigência técnica e simulados recorrentes de legislação do CTB.'}"

**Perfil do Candidato:**
- Cargo pretendido: ${onboarding?.role || 'PRF'}
- Horas de estudo diárias disponíveis: ${onboarding?.hoursPerDay || 4}h
- Principais dificuldades declaradas: ${(onboarding?.difficulties || []).join(', ') || 'Nenhuma'}
- Já prestou concurso antes? ${onboarding?.hasDoneExam ? 'Sim' : 'Não'}
- Língua Estrangeira escolhida: ${onboarding?.selectedLanguage || 'Inglês'}

**Progresso atual do candidato:**
- Nível de aprovação estimado regulado: ${progress?.currentApprovalProbability || '48.5'}%
- Total de questões resolvidas: ${progress?.totalQuestionsAnswered || 134}, com precisão de ${progress?.overallAccuracyRate || 64.2}%
- Disciplinas com desempenho crítico (vermelho): ${Object.entries(progress?.disciplinePerformance || {})
    .filter(([_, data]: any) => data.status === 'critical')
    .map(([name]) => name)
    .join(', ') || 'Nenhuma'}

**Filosofia do App:** Foco estratégico no edital da PRF 2021, priorização de tópicos de maior peso, dominar regramentos da banca CEBRASPE (uma errada anula uma certa), domínio pleno de trânsito (CTB), e aconselhamento direcionado e empático.

**Instruções de Resposta:**
1. Responda em Português brasileiro de forma objetiva, motivadora e estratégica, vestindo sempre o papel de ${aiName || 'Athena'}. Use termos normais de preparação de concurso de trânsito.
2. Sempre que perguntado sobre legislação de trânsito (CTB) ou direito constitucional, dê respostas extremamente precisas citando artigos reais e explicando as pegadinhas típicas da CEBRASPE.
3. Ofereça conselhos práticos e rápidos.

Mensagem do usuário: "${lastUserMessage}"
`;

  // Fallback heuristic answers for common onboarding questions
  const simulateFallback = (query: string): string => {
    const qLower = query.toLowerCase();
    if (qLower.includes('olá') || qLower.includes('ola') || qLower.includes('oi') || qLower.includes('athena')) {
      return `Olá, futuro(a) aprovado(a) na PRF! Sou a **${aiName || 'Athena'}**, sua guia e mentora dedicada à sua preparação. Analisei seu perfil de onboarding. Você escolheu focar em **${onboarding?.role || 'PRF'}** estudando **${onboarding?.hoursPerDay || 4}h por dia**. 
As matérias de maior desafio identificadas são: **${(onboarding?.difficulties || []).join(', ') || 'nenhuma no momento'}**.
Minha missão é guiar você até a aprovação. O que deseja planejar hoje? Podemos calibrar seu cronograma semanal, simular pegadinhas do CTB ou treinar uma matéria específica. Siga firme rumo à nomeação! 📝`;
    }
    if (qLower.includes('ctb') || qLower.includes('trânsito') || qLower.includes('transito') || qLower.includes('artigo')) {
      return `Concurseiro(a), a banca **CEBRASPE** adora trocar termos sutis na legislação de trânsito. Por exemplo, no **Artigo 277 do CTB**, preste muita atenção:
A recusa em realizar os testes de bafômetro gera as mesmas penalidades administrativas (infração gravíssima, multa multiplicada por 10 e suspensão do direito de dirigir por 12 meses) que o flagrante de embriaguez, conforme o **Artigo 165-A**.
No estilo de julgamento Certo/Errado deles, se eles colocarem que a recusa exige prova ocular cabal por parte do agente para a autuação administrativa, julgue como **ERRADO**. A recusa em si já é a infração autônoma! Vamos focar nos pontos líquidos!`;
    }
    if (qLower.includes('constitucional') || qLower.includes('artigo 144') || qLower.includes('144')) {
      return `Anote isso no seu fichamento, candidato(a)! O **Artigo 144 da Constituição Federal** é o coração da Segurança Pública e cai frequentemente nos exames da PRF:
* A PRF é um órgão **permanente**, estruturado em **carreira** e mantido e organizado de forma centralizada pela **UNIÃO** (cuidado: o CEBRASPE adora colocar "mantido e organizado pelos estados" ou "pelo Distrito Federal").
* Destina-se ao **patrulhamento ostensivo das rodovias federais** (e não simplesmente estradas estaduais ou vias urbanas). 
Atenção: A PRF pode atuar em apoio em outras áreas mediante convênio, mas seu cerne é o patrulhamento ostensivo das rodovias federais. Marque Certo!`;
    }
    if (qLower.includes('português') || qLower.includes('portugues') || qLower.includes('cebraspe')) {
      return `Para Língua Portuguesa na CEBRASPE, não perca tempo decorando meras terminologias latinas complexas. O foco deles é **Reescrita de Frases** (concordância, regência e crase) e **Coesão Textual** (referência de termos e pronomes).
Sempre que uma assertiva propuser: *"A substituição da palavra X pela palavra Y mantém a correção gramatical e o sentido original"*, faça duas verificações separadas:
1. É gramaticalmente correto?
2. O sentido original foi alterado mesmo que de maneira sutil?
Quase 60% das vezes de reescrita complexa peca no sentido original, mesmo mantendo a gramática correta!`;
    }
    if (qLower.includes('direito penal') || qLower.includes('penal') || qLower.includes('dificuldade')) {
      return `Vi que Direito Penal é um dos pontos cruciais do seu edital. Para a PRF, a CEBRASPE foca muito em **Legítima Defesa**, **Estado de Necessidade** e **Abuso de Autoridade**.
Lembre-se: O excesso punível se aplica a qualquer causa de exclusão da ilicitude, seja doloso ou culposo. Vamos inserir mais sessões curtas de fixação disso no seu cronograma semanal para elevar esse índice de acerto.`;
    }
    return `Compreendido. Analisando o edital da PRF, o seu foco em **${onboarding?.role || 'PRF'}** requer atenção na matéria de **${onboarding?.difficulties?.[0] || 'Legislação de Trânsito'}**.
Minha recomendação imediata: cumpra a meta de estudos de hoje para elevar sua probabilidade de aprovação atual, que está estimada em **${progress?.currentApprovalProbability || '48.5'}%**. Quer que eu gere um mini-simulado focado nesse tema ou prefere revisar seus flashcards mais urgentes?`;
  };

  const sysInstruction = `Você é ${aiName || 'Athena'}, mentora inteligente de preparação estratégica ágil para o concurso da Polícia Rodoviária Federal (PRF). Responda sempre em português brasileiro, com termos encorajadores de estudos, orientações objetivas do edital, do Código de Trânsito Brasileiro (CTB) e análises precisas para neutralizar as pegadinhas tradicionais de Certo ou Errado da banca CEBRASPE. Tom ativo: ${activeTone}.`;

  // 2A. CHOOSE OPENAI GPT PROVIDER
  if (provider === 'openai') {
    const keyToUse = openaiKey || process.env.OPENAI_API_KEY;
    if (keyToUse) {
      try {
        const oaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keyToUse}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: sysInstruction },
              { role: 'user', content: contextPrompt }
            ],
            temperature: 0.7
          })
        });

        if (oaiResponse.ok) {
          const oaiData = await oaiResponse.json();
          const responseText = oaiData.choices?.[0]?.message?.content;
          if (responseText) {
            return res.json({
              content: responseText,
              sender: 'athena',
              timestamp: new Date().toISOString()
            });
          }
        } else {
          const errText = await oaiResponse.text();
          console.error('Erro na chamada OpenAI:', errText);
        }
      } catch (err) {
        console.error('Falha de conexão OpenAI API:', err);
      }
    }
  }

  // 2B. CHOOSE ANTHROPIC CLAUDE PROVIDER
  if (provider === 'anthropic') {
    const keyToUse = anthropicKey || process.env.ANTHROPIC_API_KEY;
    if (keyToUse) {
      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': keyToUse,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: sysInstruction,
            messages: [
              { role: 'user', content: contextPrompt }
            ]
          })
        });

        if (anthropicResponse.ok) {
          const anthData = await anthropicResponse.json();
          const responseText = anthData.content?.[0]?.text;
          if (responseText) {
            return res.json({
              content: responseText,
              sender: 'athena',
              timestamp: new Date().toISOString()
            });
          }
        } else {
          const errText = await anthropicResponse.text();
          console.error('Erro na chamada Anthropic:', errText);
        }
      } catch (err) {
        console.error('Falha de conexão Anthropic API:', err);
      }
    }
  }

  // 2C. CHOOSE GOOGLE GEMINI PROVIDER (DEFAULT / FALLBACK)
  let activeGeminiSdk = ai;
  if (geminiKey) {
    try {
      activeGeminiSdk = new GoogleGenAI({ apiKey: geminiKey });
    } catch (e) {
      console.error('Erro ao instanciar chave Gemini customizada do Admin:', e);
    }
  }

  if (activeGeminiSdk) {
    try {
      const geminiResponse = await activeGeminiSdk.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: sysInstruction,
        },
      });

      return res.json({
        content: geminiResponse.text || simulateFallback(lastUserMessage),
        sender: 'athena',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Erro na chamada Gemini:', error);
    }
  }

  // 2D. NO KEY / SIMULATION FALLBACK MODE
  return res.json({
    content: simulateFallback(lastUserMessage),
    sender: 'athena',
    timestamp: new Date().toISOString()
  });
});

// 3. Generate adaptive Study Schedule based on candidate's profile
app.post('/api/generate-schedule', async (req, res) => {
  const { onboarding, currentProgress } = req.body;

  const prompt = `
Gere um cronograma de estudos completo de 7 dias (Segunda-feira a Domingo) e um plano mensal em JSON para um candidato à PRF.

**Perfil do Onboarding:**
- Nome: ${onboarding?.name || 'Recruta'}
- Cargo: ${onboarding?.role || 'PRF'}
- Horas livres por dia: ${onboarding?.hoursPerDay || 4} horas
- Dificuldades: ${(onboarding?.difficulties || []).join(', ') || 'Nenhuma declarada'}
- Data prevista da prova: ${onboarding?.testDate || '2027-01-01'}
- Língua Estrangeira: ${onboarding?.selectedLanguage || 'Inglês'}

**Regras estritas de distribuição baseadas no Edital PRF 2021:**
- **Bloco II (Legislação de Trânsito - 30 itens / peso supremo de 25%)**: É a maior prioridade isolada da prova. Deve ter obrigatoriamente de 3 a 4 sessões semanais intensivas ou maior carga de minutos.
- **Bloco I (Língua Portuguesa - maior peso do Bloco I, totalizando 55 itens junto às outras)**: Ter no mínimo 2 sessões semanais.
- **Bloco I (Física, Raciocínio Lógico-Matemático e Informática)**: Ter no mínimo 1 sessão semanal cada, focadas na teoria/exercícios da CEBRASPE.
- **Bloco I (Ética e Cidadania, Geopolítica, Língua Estrangeira)**: Carga horária otimizada e condensada para abranger o edital sem sobressaltar as de maior peso.
- **Bloco III (Conteúdo de Direitos - 35 itens no total)**: Integrar de forma alternada o Direito Administrativo, Direito Constitucional, Direito Penal, Direito Processual Penal, Legislação Especial e Direitos Humanos de modo equilibrado.
- **Dificuldades do Aluno**: Se o aluno declarou alguma matéria como dificuldade, acrescente sessões ou tempo extra para essa matéria.
- Máximo de 3 matérias por dia para evitar sobrecarga cognitiva.
- Sábado destina-se a revisão ativa e simulado para consolidação.
- Domingo destina-se a descanso ou apoio estratégico leve.
- Retorne obrigatoriamente um objeto JSON válido, contendo as chaves:
  - "weekly": Array de 7 objetos contendo:
      - "dayOfWeek": Nome do dia da semana (ex: "Segunda-feira", etc.)
      - "disciplines": Array de disciplinas contendo:
          - "name": Nome da matéria
          - "duration": duração em minutos (soma menor ou igual a ${onboarding?.hoursPerDay * 60 || 240})
          - "activityType": "teoria" | "questões" | "revisão" | "simulado"
          - "topic": Descrição curta e realista do artigo/tópico com base no edital oficial da PRF
  - "monthly": Array de 4 objetos contendo:
      - "weekIndex": índice 1 a 4
      - "theme": Tema central macro da semana
      - "focusDisciplines": lista de disciplinas foco da respectiva semana
`;

  // Dynamic adaptive calculation in pure javascript as high-quality local generation / fallback
  const name = onboarding?.name || 'Recruta';
  const hoursPerDay = Number(onboarding?.hoursPerDay) || 4;
  const difficulties = onboarding?.difficulties || [];
  const hasDoneExam = !!onboarding?.hasDoneExam;
  const lang = onboarding?.selectedLanguage || 'Inglês';

  // Total daily minutes
  const totalMinutes = hoursPerDay * 60;
  const weekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
  
  // Custom week layout tailored daily to student answers
  const scheduleMatrix = [
    // Mon (Trânsito focus + Português + Constitucional)
    [
      { name: 'Legislação de Trânsito', baseWeight: 0.45 },
      { name: 'Língua Portuguesa', baseWeight: 0.35 },
      { name: 'Direito Constitucional', baseWeight: 0.20 }
    ],
    // Tue (Penal focus + Raciocínio Lógico-Matemático + Física)
    [
      { name: 'Direito Penal', baseWeight: 0.40 },
      { name: 'Raciocínio Lógico-Matemático', baseWeight: 0.30 },
      { name: 'Física', baseWeight: 0.30 }
    ],
    // Wed (Trânsito heavy + Administrativo + Informática)
    [
      { name: 'Legislação de Trânsito', baseWeight: 0.45 },
      { name: 'Direito Administrativo', baseWeight: 0.30 },
      { name: 'Informática', baseWeight: 0.25 }
    ],
    // Thu (Português + Processual Penal + Foreign Language chosen)
    [
      { name: 'Língua Portuguesa', baseWeight: 0.40 },
      { name: 'Direito Processual Penal', baseWeight: 0.30 },
      { name: `Língua Estrangeira (${lang})`, baseWeight: 0.30 }
    ],
    // Fri (Trânsito focus + Legislação Especial + Direitos Humanos)
    [
      { name: 'Legislação de Trânsito', baseWeight: 0.40 },
      { name: 'Legislação Especial', baseWeight: 0.30 },
      { name: 'Direitos Humanos', baseWeight: 0.30 }
    ]
  ];

  // Adjust schedule weights according to student difficulties
  for (let i = 0; i < scheduleMatrix.length; i++) {
    const daySubjects = scheduleMatrix[i];
    let hasDiff = false;
    daySubjects.forEach(ds => {
      // Check if this subject is marked as a difficulty
      const isDiff = difficulties.some((diff: string) => ds.name.toLowerCase().includes(diff.toLowerCase()));
      if (isDiff) {
        ds.baseWeight += 0.15; // boost dedicated focus
        hasDiff = true;
      }
    });

    if (hasDiff) {
      // Normalize weights so the sum stays exact
      const weightSum = daySubjects.reduce((sum, d) => sum + d.baseWeight, 0);
      daySubjects.forEach(d => {
        d.baseWeight = d.baseWeight / weightSum;
      });
    }
  }

  // Generate weekly array
  const weekly = [];
  for (let i = 0; i < 5; i++) {
    const dayName = weekdays[i];
    const daySubjects = scheduleMatrix[i];
    
    const disciplines = daySubjects.map((ds, idx) => {
      const duration = Math.max(25, Math.round((ds.baseWeight * totalMinutes) / 5) * 5);
      
      // Tailor training activity type based on exam experience parameter
      let activityType = 'teoria';
      if (hasDoneExam) {
        // Veterans focus more on active exercises
        activityType = idx === 0 ? 'questões' : idx === 1 ? 'questões' : 'revisão';
      } else {
        // Beginners focus on concepts
        activityType = idx === 0 ? 'teoria' : idx === 1 ? 'teoria' : 'revisão';
      }

      // If user has difficulty in this subject, customize the action type to match their level
      const isUserDifficulty = difficulties.some((diff: string) => ds.name.toLowerCase().includes(diff.toLowerCase()));
      if (isUserDifficulty) {
        activityType = hasDoneExam ? 'questões' : 'teoria';
      }

      // Populate topics directly according to the PRF official 2021 verticalization
      let topic = '';
      if (ds.name.includes('Trânsito')) {
        const trânsitoTopics = [
          'Artigos 1º ao 16º: Sistema Nacional de Trânsito no CTB',
          'Normas Gerais de Circulação e Conduta (Artigos 26 ao 48 do CTB)',
          'Resolução CONTRAN 432: Testes de alcoolemia e margens de erro',
          'Infrações Gravíssimas, Graves e sistemática de penalidades',
          'Medidas Administrativas de retenção, remoção de veículos e recolhimento'
        ];
        topic = trânsitoTopics[i % trânsitoTopics.length];
      } else if (ds.name.includes('Portuguesa')) {
        topic = 'Sintaxe e regência de termos - Foco nas permutas de palavras CEBRASPE';
      } else if (ds.name.includes('Constitucional')) {
        topic = 'Defesa do Estado e Segurança Pública (Art. 144 CF)';
      } else if (ds.name.includes('Penal')) {
        topic = 'Teoria do crime: fato típico, culpabilidade, ilicitude e dolo';
      } else if (ds.name.includes('Administrativo')) {
        topic = 'Poder de polícia administrativa, limites e discricionariedade';
      } else if (ds.name.includes('Física')) {
        topic = 'Dinâmica do Trauma: Energia cinética durante desaceleração veicular';
      } else if (ds.name.includes('Estrangeira')) {
        topic = `Análise e vocabulário técnico de ocorrências policiais em ${lang}`;
      } else {
        topic = `Dominando tópicos críticos do edital de segurança e questões de ${ds.name}`;
      }

      if (isUserDifficulty) {
        topic += ` [REFORÇO ADAPTATIVO: Dificuldade de ${name}]`;
      }

      return {
        name: ds.name,
        duration,
        activityType,
        topic
      };
    });

    weekly.push({
      dayOfWeek: dayName,
      disciplines
    });
  }

  // Saturday - Active recall, Simulation block and direct weakness override
  const satDuration = Math.max(90, Math.round(totalMinutes * 0.8));
  const mainDifficulty = difficulties[0] || 'Física';
  
  weekly.push({
    dayOfWeek: 'Sábado',
    disciplines: [
      {
        name: mainDifficulty,
        duration: Math.round(satDuration * 0.4),
        activityType: 'questões',
        topic: `Ciclo Corretivo de Nivelamento: Simulados curtos em ${mainDifficulty} para eliminar erros`
      },
      {
        name: 'Simulado Inteligente',
        duration: Math.round(satDuration * 0.6),
        activityType: 'simulado',
        topic: hasDoneExam 
          ? 'Simulado Completo Alto Impacto - 120 Itens modelo Certo/Errado'
          : 'Simulado Progressivo Guiado: Diagnóstico integrado de ansiedade e tempo de prova'
      }
    ]
  });

  // Sunday - Metas calibration
  weekly.push({
    dayOfWeek: 'Domingo',
    disciplines: [
      {
        name: 'Planejamento de Metas',
        duration: 30,
        activityType: 'revisão',
        topic: `Mentoria Athena AI: Ajustar o rendimento da meta de ${hoursPerDay}h diárias`
      }
    ]
  });

  // Monthly Theme adaptivity
  const firstDifficulty = difficulties[0] || 'Língua Portuguesa';
  const secondDifficulty = difficulties[1] || 'Física';
  const monthly = [
    { 
      weekIndex: 1, 
      theme: `Imersão em Legislação de Trânsito e ${firstDifficulty}`, 
      focusDisciplines: ['Legislação de Trânsito', firstDifficulty, 'Direito Constitucional'] 
    },
    { 
      weekIndex: 2, 
      theme: `Trânsito Avançado, ${secondDifficulty} e Prática Penal`, 
      focusDisciplines: ['Legislação de Trânsito', secondDifficulty, 'Direito Penal'] 
    },
    { 
      weekIndex: 3, 
      theme: `Consolidação de Direito Administrativo, Estratégia de ${lang} e ${difficulties[2] || 'Raciocínio Lógico'}`, 
      focusDisciplines: ['Direito Administrativo', `Língua Estrangeira (${lang})`, difficulties[2] || 'Raciocínio Lógico-Matemático'] 
    },
    { 
      weekIndex: 4, 
      theme: 'Trunfos da Banca CEBRASPE, Simulados Gerais e Redação Dissertativa', 
      focusDisciplines: ['Todas as Matérias', 'Revisões Críticas', 'Simulados Adaptativos'] 
    }
  ];

  const fallbackSchedule = {
    weekly,
    monthly,
    createdDate: new Date().toISOString().split('T')[0],
    lastRecalibrated: new Date().toISOString().split('T')[0]
  };

  if (!ai) {
    return res.json(fallbackSchedule);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['weekly', 'monthly'],
          properties: {
            weekly: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['dayOfWeek', 'disciplines'],
                properties: {
                  dayOfWeek: { type: Type.STRING },
                  disciplines: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['name', 'duration', 'activityType', 'topic'],
                      properties: {
                        name: { type: Type.STRING },
                        duration: { type: Type.INTEGER },
                        activityType: { type: Type.STRING },
                        topic: { type: Type.STRING },
                      }
                    }
                  }
                }
              }
            },
            monthly: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['weekIndex', 'theme', 'focusDisciplines'],
                properties: {
                  weekIndex: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  focusDisciplines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        },
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      res.json({
        ...parsed,
        createdDate: new Date().toISOString().split('T')[0],
        lastRecalibrated: new Date().toISOString().split('T')[0]
      });
    } else {
      res.json(fallbackSchedule);
    }
  } catch (error) {
    console.error('Erro ao gerar cronograma com Gemini:', error);
    res.json(fallbackSchedule);
  }
});

// 4. Generate highly customized questions on-demand (CEBRASPE Certo/Errado)
app.post('/api/generate-question', async (req, res) => {
  const { discipline, scoreMode, difficulty } = req.body;

  const prompt = `
Gere uma questão de prova inédita e de alta qualidade no perfil oficial da banca CEBRASPE (estilo Certo ou Errado) para o concurso da Polícia Rodoviária Federal (PRF).
Matéria solicitada: ${discipline || 'Legislação de Trânsito'}
Dificuldade solicitada: ${difficulty || 'Média'}

A resposta deve ser estritamente no seguinte formato de objeto JSON:
{
  "discipline": "${discipline || 'Legislação de Trânsito'}",
  "subtopic": "Tema específico relevante do edital",
  "statement": "O enunciado/assertiva no estilo clássico da CEBRASPE contendo uma situação e uma tese jurídica ou física para o candidato julgar.",
  "correctAnswer": "C" ou "E",
  "difficulty": "${difficulty || 'Média'}",
  "explanation": "A justificativa detalhada explicando o porquê está Certo ou Errado, embasada na legislação, jurisprudência do STF/STJ ou fórmulas físicas reais aplicáveis ao edital da PRF."
}
`;

  const fallbackQuestions: { [key: string]: any[] } = {
    'Legislação de Trânsito': [
      {
         discipline: 'Legislação de Trânsito',
         subtopic: 'Sinalização - Prioridades',
         statement: 'Os veículos de socorro e de de salvamento gozam de prioridade de trânsito e livre circulação em qualquer circunstância, sendo desnecessária a urgência do serviço ou o acionamento simultâneo do dispositivo sonoro para configurar a prerrogativa constitucional.',
         correctAnswer: 'E',
         difficulty: 'Média',
         explanation: 'Incorreto. O Artigo 29, inciso VII do CTB é explícito: os veículos de emergência só gozam de livre circulação, parada e estacionamento quando em serviço de urgência de fato e devidamente identificados por dispositivos regulamentares de alarme sonoro E iluminação vermelha intermitente ligados simulaneamente.'
      }
    ],
    'Direito Constitucional': [
      {
        discipline: 'Direito Constitucional',
        subtopic: 'Forças de Segurança',
        statement: 'A segurança viária, exercida para a preservação da ordem pública e da incolumidade das pessoas e de seu patrimônio nas vias públicas, compreende a educação, engenharia e fiscalização de trânsito, cabendo à PRF, no âmbito da União, sua operação estratégica.',
        correctAnswer: 'C',
        difficulty: 'Fácil',
        explanation: 'Correto. É exatamente o Art. 144, § 10 da Constituição Federal, inserido por emenda constitucional, que rege a segurança viária.'
      }
    ]
  };

  const selectedList = fallbackQuestions[discipline] || fallbackQuestions['Legislação de Trânsito'];
  const fallbackQ = {
    ...selectedList[0],
    id: `g-${Date.now()}`
  };

  if (!ai) {
    return res.json(fallbackQ);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['discipline', 'subtopic', 'statement', 'correctAnswer', 'difficulty', 'explanation'],
          properties: {
            discipline: { type: Type.STRING },
            subtopic: { type: Type.STRING },
            statement: { type: Type.STRING },
            correctAnswer: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            explanation: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      res.json({
        ...parsed,
        id: `g-${Date.now()}`
      });
    } else {
      res.json(fallbackQ);
    }
  } catch (error) {
    console.error('Erro ao gerar questão com Gemini:', error);
    res.json(fallbackQ);
  }
});

// 5. Analyze Library materials uploaded by candidate (extract summaries and create question)
app.post('/api/analyze-library', async (req, res) => {
  const { fileName, textContent } = req.body;

  if (!textContent) {
    return res.status(400).json({ error: 'Nenhum texto recebido para análise.' });
  }

  const prompt = `
Analise o material de estudos compartilhado pelo candidato intitulado: "${fileName}".
O texto do material está abaixo:
---
${textContent.slice(0, 4000)}
---

Sua resposta deve ser estruturada obrigatoriamente como um objeto JSON contendo:
- "summary": String resumida explicando de forma didática o assunto abordado no material focado na PRF, com no máximo 3 parágrafos.
- "keyPoints": Array com 3 a 5 pontos essenciais de repetição espaçada.
- "athenaQuestion": Um objeto representando uma questão CEBRASPE (C/E) retirada diretamente sob o teor desse material, contendo:
    - "discipline": nome da matéria deduzida
    - "subtopic": subtema
    - "statement": enunciado assertivo Certo ou Errado
    - "correctAnswer": "C" ou "E"
    - "explanation": justificativa detalhada correlacionando com o texto.
`;

  const fallbackAnalysis = {
    summary: `Este material traz ensinamentos essenciais para a fiscalização da PRF. Ele aborda noções de conduta operacional, segurança jurídica na fiscalização das rodovias brasileiras e procedimentos de trânsito em face de condutores infratores.`,
    keyPoints: [
      'Atenção ao estado físico dos condutores e indícios visíveis de cansaço ou entorpecimento',
      'Uso de equipamentos aferidores homologados pelo INMETRO para fundamentar penalidades',
      'Abordagem pautada pela cortesia policial, segurança na fiscalização e objetividade legal'
    ],
    athenaQuestion: {
      discipline: 'Legislação de Trânsito',
      subtopic: 'Abordagem Policial e Fiscalização',
      statement: 'Qualquer autuação decorrente de fiscalização com auxílio de radares ou etilômetros afasta a necessidade de o policial rodoviário federal relatar a situação no auto de infração se o condutor se opuser a assinar o respectivo auto.',
      correctAnswer: 'E',
      explanation: 'Incorreto. A recusa do infrator em assinar o auto de infração não o invalida, devendo o agente policial lavrar o fato no próprio documento, preenchendo as testemunhas se houver.'
    }
  };

  if (!ai) {
    return res.json(fallbackAnalysis);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['summary', 'keyPoints', 'athenaQuestion'],
          properties: {
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            athenaQuestion: {
              type: Type.OBJECT,
              required: ['discipline', 'subtopic', 'statement', 'correctAnswer', 'explanation'],
              properties: {
                discipline: { type: Type.STRING },
                subtopic: { type: Type.STRING },
                statement: { type: Type.STRING },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              }
            }
          }
        }
      }
    });

    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallbackAnalysis);
    }
  } catch (err) {
    console.error('Erro ao analisar biblioteca inteligente:', err);
    res.json(fallbackAnalysis);
  }
});

// ------------------- FRAMEWORK SETUP -------------------

async function startServer() {
  // Vite Integration for development / production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PROVAX AI] Server successfully booted at http://localhost:${PORT}`);
  });
}

startServer();
