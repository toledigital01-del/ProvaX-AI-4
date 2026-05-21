import React, { useState, useEffect, useRef } from 'react';
import { PRF_QUESTIONS, PRF_FLASHCARDS } from '../data/mockData';
import { Question, Flashcard, StudyTask } from '../types';
import { BookOpen, RefreshCw, Layers, Clock, Check, X, HelpCircle, ChevronRight, Play, Pause, AlertTriangle, Sparkles, Plus, CheckCircle2, Shield } from 'lucide-react';
import { playTimerStartSound, playSuccessSound } from '../utils/audioEffects';
import RadarContran from './RadarContran';

interface TreinarProps {
  selectedTaskToTrain: StudyTask | null;
  onQuestionAnswered: (isCorrect: boolean, discipline: string) => void;
  onFocusCycleCompleted: (discipline: string, minutes: number) => void;
  defaultActiveTab?: ModeType;
}

type ModeType = 'questoes' | 'revisao' | 'flashcards' | 'foco' | 'contran';

export default function Treinar({ selectedTaskToTrain, onQuestionAnswered, onFocusCycleCompleted, defaultActiveTab = 'questoes' }: TreinarProps) {
  const [activeTab, setActiveTab] = useState<ModeType>(defaultActiveTab);

  // Sync state when defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  // Activate Pomodoro focal if a task was assigned from Dashboard
  useEffect(() => {
    if (selectedTaskToTrain) {
      if (selectedTaskToTrain.activityType === 'questões') {
        setActiveTab('questoes');
        setFilterDiscipline(selectedTaskToTrain.discipline);
      } else if (selectedTaskToTrain.activityType === 'teoria' || selectedTaskToTrain.activityType === 'revisão') {
        setActiveTab('foco');
        setFocoDiscipline(selectedTaskToTrain.discipline);
        setFocoTopic(selectedTaskToTrain.title);
      }
    }
  }, [selectedTaskToTrain]);

  // ==================== MODE 1: QUESTÕES (CEBRASPE) ====================
  const [questionsList, setQuestionsList] = useState<Question[]>(PRF_QUESTIONS);
  const [filterDiscipline, setFilterDiscipline] = useState<string>('Todos');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Todos');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'C' | 'E' | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  const filteredQuestions = questionsList.filter(q => {
    const disciplineMatch = filterDiscipline === 'Todos' || q.discipline === filterDiscipline;
    const difficultyMatch = filterDifficulty === 'Todos' || q.difficulty === filterDifficulty;
    return disciplineMatch && difficultyMatch;
  });

  const currentQuestion = filteredQuestions[currentQIndex] || null;

  const handleChooseAnswer = (ans: 'C' | 'E') => {
    if (hasAnswered) return;
    setSelectedAnswer(ans);
  };

  const handleConfirmAnswer = () => {
    if (!currentQuestion || !selectedAnswer || hasAnswered) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setHasAnswered(true);
    
    // Update local state isCorrect
    setQuestionsList(prev => prev.map(q => q.id === currentQuestion.id ? { ...q, userAnswer: selectedAnswer, isCorrect } : q));
    
    // Report metric to parent progress
    onQuestionAnswered(isCorrect, currentQuestion.discipline);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCurrentQIndex(0); // reset or generate
    }
  };

  const handleGenerateAiQuestion = async () => {
    setIsAiGenerating(true);
    try {
      const disc = filterDiscipline === 'Todos' ? 'Legislação de Trânsito' : filterDiscipline;
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discipline: disc, difficulty: filterDifficulty === 'Todos' ? 'Média' : filterDifficulty }),
      });
      const data = await response.json();
      
      // Add custom new question to the pool
      setQuestionsList(prev => [data, ...prev]);
      setFilterDiscipline(data.discipline); 
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==================== MODE 2: REVISÃO INTELIGENTE ====================
  const [revisaoCards, setRevisaoCards] = useState<string[]>([
    'Artigo 144 CF (Polícia Rodoviária Federal é mantida pela União e destina-se ao patrulhamento ostensivo das rodovias federais)',
    'Artigo 306 do CTB (Capacidade psicomotora alterada por álcool acima de 0,34 mg/Ar ou 6dg/Sangue)',
    'Resolução CONTRAN 432: regulamenta bafômetro, margem de erro tolerada do INMETRO',
    'Artigo 5º inc. XI CF: Inviolabilidade domiciliar. Determinação judicial só permite invasão alheia durante o DIA',
    'Artigo 165-A do CTB: Recusa do condutor ao teste gera infração gravíssima com mesma multa multiplicada por 10 e suspensão autónoma'
  ]);
  const [completeRevisaoStep, setCompleteRevisaoStep] = useState<boolean[]>(new Array(5).fill(false));

  const handleResolveRevisao = (idx: number) => {
    const updated = [...completeRevisaoStep];
    updated[idx] = !updated[idx];
    setCompleteRevisaoStep(updated);
    
    if (updated[idx]) {
      onQuestionAnswered(true, 'Legislação de Trânsito');
    }
  };

  // ==================== MODE 3: FLASHCARDS ====================
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>(PRF_FLASHCARDS);
  const [fcIndex, setFcIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [generatingCard, setGeneratingCard] = useState<boolean>(false);

  const activeCard = flashcardDeck[fcIndex] || null;

  const handleNextCard = () => {
    setIsFlipped(false);
    if (fcIndex < flashcardDeck.length - 1) {
      setFcIndex(fcIndex + 1);
    } else {
      setFcIndex(0);
    }
  };

  const handleCardFeedback = (learned: boolean) => {
    handleNextCard();
  };

  const handleGenerateAiFlashcard = async () => {
    setGeneratingCard(true);
    try {
      const response = await fetch('/api/chat-athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ content: 'Gere um flashcard estratégico inédito de Legislação de Trânsito no formato Pergunta e Resposta curta. Retorne somente esse texto de forma direta, sem introdução.' }],
        })
      });
      const data = await response.json();
      
      const newCard: Flashcard = {
        id: `fc-ai-${Date.now()}`,
        category: 'Trânsito',
        question: data.content.split('Resposta:')[0]?.replace('Pergunta:', '')?.trim() || 'Qual a consequência jurídica da decisão de pronúncia?',
        answer: data.content.split('Resposta:')[1]?.trim() || data.content,
        importance: 'Alta',
      };

      setFlashcardDeck(prev => [newCard, ...prev]);
      setFcIndex(0);
      setIsFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCard(false);
    }
  };

  // ==================== MODE 4: MODO FOCO (POMODORO) ====================
  const [focoDiscipline, setFocoDiscipline] = useState<string>('Legislação de Trânsito');
  const [focoTopic, setFocoTopic] = useState<string>('Normas Gerais de Circulação e Ultrapassagens');
  const [focoMinutesPreset, setFocoMinutesPreset] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [cycleCompleted, setCycleCompleted] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(focoMinutesPreset * 60);
    setTimerRunning(false);
    setCycleCompleted(false);
  }, [focoMinutesPreset]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setCycleCompleted(true);
            playSuccessSound(); // Play success tone when Pomodoro is finished!
            if (timerRef.current) clearInterval(timerRef.current);
            onFocusCycleCompleted(focoDiscipline, focoMinutesPreset);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, focoDiscipline, focoMinutesPreset]);

  const handleToggleTimer = () => {
    const nextRunning = !timerRunning;
    if (nextRunning) {
      playTimerStartSound(); // Play pleasant start study tone
    }
    setTimerRunning(nextRunning);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(focoMinutesPreset * 60);
    setCycleCompleted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="train-view-container">
      {/* 1. Interactive Tabs */}
      <div className="flex border-b border-slate-800 pb-3 justify-between items-center gap-4 mb-6">
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
          {[
            { id: 'questoes', label: 'Questões CEBRASPE', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'revisao', label: 'Revisão Espaçada', icon: <Layers className="w-4 h-4" /> },
            { id: 'flashcards', label: 'Flashcards', icon: <RefreshCw className="w-4 h-4" /> },
            { id: 'foco', label: 'Modo Foco Pomodoro', icon: <Clock className="w-4 h-4" /> },
            { id: 'contran', label: 'Radar CONTRAN', icon: <Shield className="w-4 h-4 text-amber-500 animate-pulse" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ModeType)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-colors border ${
                activeTab === tab.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
              id={`tab-${tab.id}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================== TABCONTENT: QUESTÕES ==================================== */}
      {activeTab === 'questoes' && (
        <div className="space-y-6" id="questoes-sub-view">
          {/* Header & Filter Controls */}
          <div className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Disciplina</label>
              <select 
                value={filterDiscipline} 
                onChange={(e) => { setFilterDiscipline(e.target.value); setCurrentQIndex(0); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todos">Todas as Disciplinas</option>
                <option value="Língua Portuguesa">Língua Portuguesa</option>
                <option value="Raciocínio Lógico-Matemático">Raciocínio Lógico-Matemático</option>
                <option value="Informática">Informática</option>
                <option value="Física">Física</option>
                <option value="Ética e Cidadania">Ética e Cidadania</option>
                <option value="Geopolítica">Geopolítica</option>
                <option value="Língua Estrangeira">Língua Estrangeira</option>
                <option value="Legislação de Trânsito">Legislação de Trânsito</option>
                <option value="Direito Administrativo">Direito Administrativo</option>
                <option value="Direito Constitucional">Direito Constitucional</option>
                <option value="Direito Penal">Direito Penal</option>
                <option value="Direito Processual Penal">Direito Processual Penal</option>
                <option value="Legislação Especial">Legislação Especial</option>
                <option value="Direitos Humanos">Direitos Humanos</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Dificuldade</label>
              <select 
                value={filterDifficulty} 
                onChange={(e) => { setFilterDifficulty(e.target.value); setCurrentQIndex(0); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todos">Todas as Dificuldades</option>
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="pt-5 justify-self-stretch md:justify-self-end">
              <button 
                onClick={handleGenerateAiQuestion}
                disabled={isAiGenerating}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg text-xs shadow-md transition-all disabled:opacity-50"
                id="btn-ai-question"
              >
                <Sparkles className="w-3.5 h-3.5" /> 
                {isAiGenerating ? 'A Athena está escrevendo...' : 'Gerar Questão Inédita por IA'}
              </button>
            </div>
          </div>

          {currentQuestion ? (
            <div className="space-y-4" id="active-question-card">
              {/* Question metadata */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                  {currentQuestion.discipline} • {currentQuestion.subtopic}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentQuestion.difficulty === 'Fácil' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                  currentQuestion.difficulty === 'Média' ? 'bg-yellow-950 text-yellow-500 border border-yellow-900/10' :
                  'bg-red-950 text-red-400 border border-red-900/30'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* CEBRASPE Question Code Block style */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <span className="absolute top-2 right-4 text-[10px] font-mono text-slate-700 select-none">CEBRASPE EXCLUSIVE</span>
                <p className="text-slate-200 leading-relaxed text-sm font-sans" id="question-statement-text">
                  {currentQuestion.statement}
                </p>
              </div>

              {/* Core Choices (Certo/Errado) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChooseAnswer('C')}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border font-bold text-center transition-all ${
                    selectedAnswer === 'C' 
                      ? 'bg-green-950/40 border-green-500 text-green-400 ring-2 ring-green-950 shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                  id="btn-choice-c"
                >
                  <span className="block text-xl mb-1">Certo</span>
                  <span className="text-[10px] font-mono font-medium text-slate-500">(Assertiva Verdadeira)</span>
                </button>
                <button
                  onClick={() => handleChooseAnswer('E')}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border font-bold text-center transition-all ${
                    selectedAnswer === 'E' 
                      ? 'bg-red-950/50 border-red-500 text-red-300 ring-2 ring-red-950 shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                  id="btn-choice-e"
                >
                  <span className="block text-xl mb-1">Errado</span>
                  <span className="text-[10px] font-mono font-medium text-slate-500">(Assertiva Falsa)</span>
                </button>
              </div>

              {/* Confirm / Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                {!hasAnswered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedAnswer}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                      selectedAnswer 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.01]' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                    id="btn-submit-answer"
                  >
                    Confirmar Julgamento
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    id="btn-next-question"
                  >
                    Próxima Questão <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Athena's detailed explanation box */}
              {hasAnswered && (
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 animate-slide-up space-y-3" id="explanation-box">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span className="flex items-center gap-2 font-bold text-xs text-slate-300">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Check className="w-4 h-4 bg-emerald-950 rounded-full p-0.5" /> GABARITO CORRETO!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 font-bold">
                          <X className="w-4 h-4 bg-red-950 rounded-full p-0.5" /> GABARITO INCORRETO.
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">Gabarito: <b className="text-yellow-500">{currentQuestion.correctAnswer === 'C' ? 'Certo' : 'Errado'}</b></span>
                  </div>

                  <div className="athena-box-style p-4 mt-4 flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">🦉</span>
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-mono text-athena-title font-semibold tracking-wide">Veredito da Mentora Athena:</p>
                      <p className="text-xs text-athena-body leading-relaxed font-sans">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500" id="empty-state-questions">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p>Nenhuma questão encontrada para os filtros selecionados.</p>
              <button 
                onClick={handleGenerateAiQuestion}
                disabled={isAiGenerating}
                className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
              >
                Gerar com IA Athena agora!
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TABCONTENT: REVISÃO ESPAÇADA ==================================== */}
      {activeTab === 'revisao' && (
        <div className="space-y-5" id="revisao-sub-view">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Repetição Espaçada Inteligente</h3>
            <p className="text-xs text-slate-400">
              A Athena agendou as noções jurídicas e de trânsito abaixo para fixar antes do relaxamento da curva de esquecimento semanal.
            </p>
          </div>

          <div className="space-y-3" id="revisao-items-list-container">
            {revisaoCards.map((card, idx) => {
              const isDone = completeRevisaoStep[idx];
              return (
                <div 
                  key={idx}
                  className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                    isDone 
                      ? 'bg-emerald-950/10 border-emerald-900/30 opacity-70' 
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-600 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed pt-0.5">{card}</p>
                  </div>

                  <button
                    onClick={() => handleResolveRevisao(idx)}
                    className={`py-1 px-3 rounded-lg text-[10px] font-mono font-extrabold shadow-sm flex items-center gap-1 transition-all shrink-0 ${
                      isDone 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isDone ? (
                      <><Check className="w-3.5 h-3.5" /> Revisado</>
                    ) : (
                      'Marcar Lido'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/55 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 leading-normal flex items-start gap-2.5">
            <span className="text-base">📅</span>
            <p>
              Estes lembretes representam o ciclo de revisão ativa (24h - 7d - 30d). Manter as revisões zeradas garante seu **Nível de Aprovação** estável no simulador.
            </p>
          </div>
        </div>
      )}

      {/* ==================================== TABCONTENT: FLASHCARDS ==================================== */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6" id="flashcards-sub-view">
          {/* Controls bar */}
          <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded-xl flex-wrap gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>Deck de Memorização • Ativo: <b className="text-emerald-400">{fcIndex + 1}/{flashcardDeck.length}</b></span>
            </div>
            <button 
              onClick={handleGenerateAiFlashcard}
              disabled={generatingCard}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-1.5 px-3.5 rounded-lg text-xs font-bold hover:scale-[1.01] transition-transform shadow disabled:opacity-40"
              id="btn-generate-fc-ai"
            >
              <Sparkles className="w-3 h-3" />
              {generatingCard ? 'Escrevendo...' : 'Gerar Flashcard com IA'}
            </button>
          </div>

          {activeCard ? (
            <div className="flex flex-col items-center justify-center max-w-lg mx-auto" id="flashcard-deck-box">
              {/* Card Container */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[220px] bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-2xl cursor-pointer shadow-lg p-6 flex flex-col justify-between transition-all duration-300 relative select-none ${
                  isFlipped ? 'shadow-emerald-950/20 shadow-xl border-emerald-900/40 bg-gradient-to-b from-slate-950 to-emerald-950/10' : ''
                }`}
                id="interactive-fc-card"
              >
                {/* Category label indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">
                    {activeCard.category}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">{isFlipped ? 'Resposta' : 'Pergunta'}</span>
                </div>

                {/* Central sentence */}
                <div className="text-center py-6">
                  {isFlipped ? (
                    <p className="text-slate-100 font-medium text-sm sm:text-base leading-relaxed font-sans">{activeCard.answer}</p>
                  ) : (
                    <p className="text-white font-extrabold text-sm sm:text-lg leading-snug font-sans">{activeCard.question}</p>
                  )}
                </div>

                {/* Footer advice */}
                <span className="text-center text-[10px] text-slate-600 font-mono tracking-wide uppercase font-semibold">
                  {isFlipped ? 'Clique para ver a Pergunta' : 'Clique para Revelar a Resposta'}
                </span>
              </div>

              {/* Action buttons (only displayed once card is flipped over) */}
              {isFlipped && (
                <div className="flex justify-center gap-4 mt-6 w-full animate-fade-in" id="fc-controls">
                  <button 
                    onClick={() => handleCardFeedback(false)}
                    className="flex-1 py-2 px-4 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-950/40 font-bold font-mono text-xs transition-colors"
                  >
                    Errei / Esqueci
                  </button>
                  <button 
                    onClick={() => handleCardFeedback(true)}
                    className="flex-1 py-2 px-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 font-bold font-mono text-xs transition-colors"
                  >
                    Lembrei Fácil!
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>Nenhum card disponível.</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TABCONTENT: MODO FOCO POMODORO ==================================== */}
      {activeTab === 'foco' && (
        <div className="space-y-6" id="foco-sub-view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="foco-pomodoro-layout">
            
            {/* Left Col: Setup Pomodoro parameters */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">Parametrizar Sessão de Foco</h3>
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Matéria Foco</label>
                <select 
                  value={focoDiscipline}
                  onChange={(e) => setFocoDiscipline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Raciocínio Lógico-Matemático">Raciocínio Lógico-Matemático</option>
                  <option value="Informática">Informática</option>
                  <option value="Física">Física</option>
                  <option value="Ética e Cidadania">Ética e Cidadania</option>
                  <option value="Geopolítica">Geopolítica</option>
                  <option value="Língua Estrangeira">Língua Estrangeira</option>
                  <option value="Legislação de Trânsito">Legislação de Trânsito</option>
                  <option value="Direito Administrativo">Direito Administrativo</option>
                  <option value="Direito Constitucional">Direito Constitucional</option>
                  <option value="Direito Penal">Direito Penal</option>
                  <option value="Direito Processual Penal">Direito Processual Penal</option>
                  <option value="Legislação Especial">Legislação Especial</option>
                  <option value="Direitos Humanos">Direitos Humanos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Tópico ou Atividade</label>
                <input 
                  type="text"
                  value={focoTopic}
                  onChange={(e) => setFocoTopic(e.target.value)}
                  placeholder="Ex: Resoluções do CONTRAN sobre velocidade"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Tempo Estimado da Patrulha</label>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 40, 50].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFocoMinutesPreset(t)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        focoMinutesPreset === t 
                          ? 'bg-emerald-950/40 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t} Minutos
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Visual Countdown Clock */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-6" id="countdown-flipper">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">{focoDiscipline}</span>
                <span className="text-xs text-slate-400 truncate max-w-[200px] block italic">"{focoTopic}"</span>
              </div>

              {/* Big aesthetic clock face */}
              <div className="relative w-40 h-40 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-inner">
                <div className="text-3xl font-black text-white font-mono tracking-tight" id="focus-timer-clock-digits">
                  {formatTime(timeLeft)}
                </div>
                {/* Visual ticking indicator */}
                <div className={`absolute top-0 right-0 bottom-0 left-0 border-4 border-transparent rounded-full border-t-emerald-500 ${timerRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </div>

              {/* Control Trigger buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleToggleTimer}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                    timerRunning 
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-slate-950' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  id="btn-foco-toggle"
                >
                  {timerRunning ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Iniciar Patrulha</>}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold hover:text-white"
                  id="btn-foco-reset"
                >
                  Reiniciar
                </button>
              </div>

              {cycleCompleted && (
                <div className="text-emerald-400 text-xs font-bold font-mono text-center flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Parabéns! Ciclo de estudos concluído! +0.8% adicionado.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================================== TABCONTENT: RADAR CONTRAN ==================================== */}
      {activeTab === 'contran' && (
        <RadarContran />
      )}
    </div>
  );
}
