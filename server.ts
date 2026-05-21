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
  const { messages, onboarding, progress } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato de mensagens inválido.' });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const contextPrompt = `
Você é a mentora de inteligência artificial **Athena**, especialista no concurso da Polícia Rodoviária Federal (PRF).
Você foi projetada por especialistas em alta performance de preparação estratégica para concursos federais, dominando as pegadinhas e o edital CEBRASPE.

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
1. Responda em Português brasileiro de forma objetiva, motivadora, empática e estratégica. Use termos normais de preparação de concurso de trânsito (como "mantenha o foco aceso", "siga no fluxo de estudos", "conquiste suas metas diárias").
2. Sempre que perguntado sobre legislação de trânsito (CTB) ou direito constitucional, dê respostas precisas citando artigos reais e explicando as pegadinhas típicas da CEBRASPE.
3. Ofereça conselhos práticos e rápidos.

Mensagem do usuário: "${lastUserMessage}"
`;

  // Fallback heuristic answers for common onboarding questions
  const simulateFallback = (query: string): string => {
    const qLower = query.toLowerCase();
    if (qLower.includes('olá') || qLower.includes('ola') || qLower.includes('oi') || qLower.includes('athena')) {
      return `Olá, futuro(a) aprovado(a) na PRF! Sou a **Athena**, sua guia e mentora dedicada à sua preparação. Analisei seu perfil de onboarding. Você escolheu focar em **${onboarding?.role || 'PRF'}** estudando **${onboarding?.hoursPerDay || 4}h por dia**. 
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

  if (!ai) {
    // Return simulated response instantly
    return res.json({
      content: simulateFallback(lastUserMessage),
      sender: 'athena',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: 'Você é Athena, mentora inteligente de preparação estratégica ágil para o concurso da Polícia Rodoviária Federal (PRF). Responda sempre em português, com termos encorajadores de estudos voltados para concurseiros da PRF, orientações objetivas extraídas do edital, do Código de Trânsito Brasileiro (CTB) e análises precisas para neutralizar as pegadinhas tradicionais de Certo ou Errado da banca CEBRASPE.',
      },
    });

    res.json({
      content: geminiResponse.text || simulateFallback(lastUserMessage),
      sender: 'athena',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erro na chamada Gemini do chat:', error);
    res.json({
      content: `${simulateFallback(lastUserMessage)}\n\n*(Nota: Rodando em modo de simulação otimizada devido a instabilidade com a credencial externa, mas com pleno embasamento profissional do edital PRF!)*`,
      sender: 'athena',
      timestamp: new Date().toISOString(),
    });
  }
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

  const fallbackSchedule = {
    weekly: [
      {
        dayOfWeek: 'Segunda-feira',
        disciplines: [
          { name: 'Legislação de Trânsito', duration: 90, activityType: 'teoria', topic: 'Artigos 1º ao 16º: SNT e vias públicas' },
          { name: 'Língua Portuguesa', duration: 60, activityType: 'questões', topic: 'Reescrita e Coesão Textual CEBRASPE' },
          { name: 'Física', duration: 30, activityType: 'revisão', topic: 'Revisão rápida de cinemática' }
        ]
      },
      {
        dayOfWeek: 'Terça-feira',
        disciplines: [
          { name: 'Direito Constitucional', duration: 90, activityType: 'teoria', topic: 'Artigo 5º - Direitos Individuais e Coletivos' },
          { name: 'Raciocínio Lógico-Matemático', duration: 60, activityType: 'questões', topic: 'Equivalências de condicionais e tabelas verdade' },
          { name: 'Direito Administrativo', duration: 30, activityType: 'revisão', topic: 'Agentes Públicos e Responsabilidades' }
        ]
      },
      {
        dayOfWeek: 'Quarta-feira',
        disciplines: [
          { name: 'Legislação de Trânsito', duration: 90, activityType: 'teoria', topic: 'Normas de circulação e conduta e preferência' },
          { name: 'Direito Penal', duration: 60, activityType: 'teoria', topic: 'Teoria da Atividade e Tempo do Crime' },
          { name: 'Legislação de Trânsito', duration: 30, activityType: 'questões', topic: 'Exercícios práticos de velocidade e ultrapassagem' }
        ]
      },
      {
        dayOfWeek: 'Quinta-feira',
        disciplines: [
          { name: 'Língua Portuguesa', duration: 90, activityType: 'teoria', topic: 'Emprego do sinal indicativo de crase' },
          { name: 'Informática', duration: 60, activityType: 'questões', topic: 'Ataques de Ransomware, Phishing e Defesas' },
          { name: 'Direito Constitucional', duration: 30, activityType: 'revisão', topic: 'Revisão ativa Artigo 5º incisos' }
        ]
      },
      {
        dayOfWeek: 'Sexta-feira',
        disciplines: [
          { name: 'Legislação de Trânsito', duration: 70, activityType: 'teoria', topic: 'Art. 165 e Crimes de Trânsito - Lei Seca' },
          { name: 'Direito Administrativo', duration: 70, activityType: 'teoria', topic: 'Poder de polícia administrativa e prerrogativas' },
          { name: 'Física', duration: 40, activityType: 'questões', topic: 'Determinação de energia cinética em Frenagem' }
        ]
      },
      {
        dayOfWeek: 'Sábado',
        disciplines: [
          { name: 'Revisão Geral Semanal', duration: 90, activityType: 'revisão', topic: 'Revolução de resumos e preenchimento de pontos lacunares' },
          { name: 'Simulado Inteligente', duration: 90, activityType: 'simulado', topic: 'Simulado de 40 questões focado em Trânsito e Direito' }
        ]
      },
      {
        dayOfWeek: 'Domingo',
        disciplines: [
          { name: 'Planejamento de Metas', duration: 30, activityType: 'revisão', topic: 'Análise de métricas com a Athena AI e descanso ativo' }
        ]
      }
    ],
    monthly: [
      { weekIndex: 1, theme: 'Imersão em Legislação e Fundamentos Sociais', focusDisciplines: ['Legislação de Trânsito', 'Língua Portuguesa', 'Direito Constitucional'] },
      { weekIndex: 2, theme: 'Trânsito Avançado, Física Traumática e Crimes', focusDisciplines: ['Legislação de Trânsito', 'Física', 'Direito Penal'] },
      { weekIndex: 3, theme: 'Poder de Polícia, Agentes e Coesão Gramatical', focusDisciplines: ['Língua Portuguesa', 'Direito Administrativo', 'Raciocínio Lógico-Matemático'] },
      { weekIndex: 4, theme: 'Consolidação Geral, Simulado e Trunfos da Banca', focusDisciplines: ['Simulados Adaptativos', 'Revisões Críticas', 'Legislação Curta'] }
    ],
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
