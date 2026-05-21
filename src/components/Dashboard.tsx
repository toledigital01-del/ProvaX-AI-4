import React, { useState } from 'react';
import { StudySchedule, ProgressData, StudyTask, DailyMission } from '../types';
import { ShieldAlert, CheckCircle, Clock, Award, Flame, Compass, Sparkles, AlertTriangle, ArrowRight, Play, Info } from 'lucide-react';

interface DashboardProps {
  onboardingName: string;
  testDate: string;
  progress: ProgressData;
  schedule: StudySchedule;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
  onSelectTaskToTrain: (task: StudyTask) => void;
}

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  schedule,
  completedTasks,
  onToggleTask,
  onNavigate,
  onSelectTaskToTrain
}: DashboardProps) {
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<StudyTask | null>(null);

  // Calculates countdown
  const getDaysRemaining = () => {
    const today = new Date();
    const planned = new Date(testDate || '2026-12-15');
    const difference = planned.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Deduces current day schedule based on local day of week
  const getDailyTasksForToday = (): StudyTask[] => {
    const daysMap = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDayName = daysMap[new Date().getDay()];
    const dayData = schedule?.weekly?.find(d => d.dayOfWeek.includes(currentDayName)) || schedule?.weekly?.[0];
    
    if (!dayData) return [];

    return dayData.disciplines.map((disc, idx) => ({
      id: `today-task-${idx}`,
      discipline: disc.name,
      activityType: disc.activityType,
      durationMinutes: disc.duration,
      completed: completedTasks.includes(`today-task-${idx}`),
      impactScore: Math.round((disc.activityType === 'simulado' ? 0.8 : disc.activityType === 'questões' ? 0.5 : 0.3) * 10) / 10,
      title: disc.topic,
      athenaJustification: `Esta sessão foca em ${disc.topic}. A CEBRASPE atribui peso de ${disc.name.includes('Trânsito') ? 'elevado (25% do certame)' : 'grau médio'} para este assunto, fazendo deste objetivo um passo crucial para consolidar sua aprovação hoje.`
    }));
  };

  const todayTasks = getDailyTasksForToday();
  const completedTodayCount = todayTasks.filter(t => completedTasks.includes(t.id)).length;
  const progressPercent = todayTasks.length > 0 ? (completedTodayCount / todayTasks.length) * 100 : 0;
  const potentialGainSum = todayTasks.reduce((sum, t) => sum + (completedTasks.includes(t.id) ? 0 : t.impactScore), 0);

  // Athena's quick advice insight
  const getAthenaInsight = () => {
    const criticalDiscipline = Object.entries(progress.disciplinePerformance)
      .find(([_, data]) => data.status === 'critical');

    if (criticalDiscipline) {
      return `candidato(a), notei uma queda vertical na sua eficácia de **${criticalDiscipline[0]}**. A CEBRASPE não perdoa flutuações abaixo de 50%. Dedique pelo menos 20 minutos de revisão ativa de flashcards nessa disciplina hoje. Eu já configurei suas Metas de Estudos do Dia para mitigar essa lacuna!`;
    }
    return `Sua rotina de estudos está exemplar! Sua taxa de acertos em **Constitucional** subiu para ${progress.disciplinePerformance['Direito Constitucional']?.efficiency || 75}%. As metas de hoje contêm reforço de trânsito focado para consolidar seu streak de ${progress.daysConsecutive} dias. Mantenha os estudos aquecidos!`;
  };

  return (
    <div className="space-y-6" id="dashboard-tab-view">
      {/* 1. Header Banner with countdown & personalized greeting */}
      <div className="relative bg-slate-900 border border-emerald-950/50 rounded-2xl p-6 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-slate-950/60" id="welcome-banner">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-mono tracking-widest text-emerald-400 font-semibold uppercase">Estudo Ativo • PRF 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Foco na Aprovação, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{onboardingName || 'Colega'}</span>!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Sua mentora de inteligência artificial **Athena** mapeou o edital mais recente. Você tem metas pendentes no seu cronograma de estudos hoje.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-center md:text-right flex md:flex-col items-center justify-between md:justify-center gap-3 md:gap-1 shadow-inner shrink-0" id="countdown-card">
          <span className="text-xs text-slate-400 uppercase font-mono tracking-wider font-semibold">Faltam para a prova</span>
          <div className="flex items-baseline gap-1 justify-center">
            <span className="text-3xl font-black text-yellow-500 font-mono tracking-tight">{getDaysRemaining()}</span>
            <span className="text-sm font-semibold text-slate-400">dias</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Prova estimada: {new Date(testDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* 2. Key Metrics Row (Nível de aprovação , Streak, Athena Tip) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="metrics-rowGrid">
        {/* Metric 1: Nível de aprovação */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="metric-approval-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Nível de Aprovação
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/30">PREDITIVO</span>
          </div>

          <div className="flex items-center gap-6 py-2">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-950 border-4 border-slate-800 justify-self-center shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-emerald-950"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-emerald-500 transition-all duration-500 ease-out"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (progress.currentApprovalProbability + (completedTodayCount * 0.4)) / 100)}`}
                  fill="transparent"
                />
              </svg>
              <span className="text-xl font-mono font-black text-white">{(progress.currentApprovalProbability + (completedTodayCount * 0.4)).toFixed(1)}%</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Medido pela Athena comparando desempenho no CEBRASPE com notas de corte históricas da PRF (média líquida ~82 pts).</p>
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{(completedTodayCount * 0.4).toFixed(1)}% conquistado hoje!
              </p>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono border-t border-slate-800/60 pt-2">
            Eleve acertando Simulados e concluindo Missões diárias.
          </div>
        </div>

        {/* Metric 2: Streak Study */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between animate-fade-in" id="metric-streak-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" /> Dias Consecutivos
            </h2>
            <span className="text-xs text-slate-500 font-mono">Streak Ativo</span>
          </div>

          <div className="flex items-center gap-5 py-2">
            <div className="p-4 bg-red-950/20 text-red-500 border border-red-500/20 rounded-full shrink-0">
              <Flame className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="text-3xl font-black text-white font-mono">{progress.daysConsecutive} Dias</div>
              <p className="text-xs text-slate-400 mt-1">Estudo ininterrupto. A persistência cria a memória cortical necessária para o artigo do CTB!</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2 text-center" id="streak-week-check">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => {
              const active = idx < progress.daysConsecutive;
              return (
                <div key={idx} className="space-y-1">
                  <div className={`w-full h-1.5 rounded-full ${active ? 'bg-gradient-to-r from-red-600 to-yellow-500' : 'bg-slate-950'}`} />
                  <span className="text-[10px] text-slate-500 font-mono">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Athena Strategist advice panel */}
        <div className="athena-box-style p-5 shadow-lg flex flex-col justify-between" id="athena-instant-advice">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/20 dark:border-amber-500/10">
            <Sparkles className="w-4 h-4 text-athena-title animate-spin" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-athena-title font-bold">Conselho da Athena</h3>
          </div>
          <p className="text-xs text-athena-body leading-relaxed italic">
            "{getAthenaInsight()}"
          </p>
          <div className="mt-3 flex justify-end">
            <button 
              onClick={() => onNavigate('athena')}
              className="text-xs font-bold text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-colors"
            >
              Comandar Athena <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Metas do Dia detail section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-mission-area">
        {/* Left 2 cols: Today's tasks in detail */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg" id="col-mission-todo">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-emerald-400 font-mono tracking-widest font-semibold uppercase">METAS DE HOJE</span>
              <h2 className="text-xl font-extrabold text-white">Objetivos de Estudo do Dia</h2>
            </div>
            {potentialGainSum > 0 && (
              <div className="bg-amber-500/15 border border-amber-500/25 rounded-lg px-3 py-1.5 text-xs text-amber-400 flex items-center gap-1.5 shrink-0 shadow-sm" id="badge-potencial-ganho">
                <Compass className="w-4 h-4 text-amber-400 animate-pulse" /> Potencial de Ganho: <b className="text-white font-extrabold">+{potentialGainSum.toFixed(1)}%</b> na Aprovação
              </div>
            )}
          </div>

          {/* Progress Bar of Mission */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Progresso Geral das Metas</span>
              <span className="text-white font-bold">{Math.round(progressPercent)}% concluído</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3" id="today-tasks-items-list">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500" id="empty-state-tasks">
                <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p>Nenhuma meta cadastrada para hoje. Use a aba "Cronograma" para pedir uma recalibração da Athena.</p>
              </div>
            ) : (
              todayTasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                return (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCompleted 
                        ? 'bg-emerald-950/10 border-emerald-900/30 opacity-75' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex gap-3">
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isCompleted 
                            ? 'bg-emerald-600 border-emerald-600 text-slate-950 hover:bg-emerald-700' 
                            : 'border-slate-700 text-transparent hover:border-emerald-500'
                        }`}
                        id={`btn-complete-task-${task.id}`}
                      >
                        ✓
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white">{task.discipline}</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                            task.activityType === 'teoria' ? 'bg-blue-950/60 text-blue-300 border border-blue-900/40' :
                            task.activityType === 'questões' ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-900/40' :
                            task.activityType === 'revisão' ? 'bg-purple-950/60 text-purple-300 border border-purple-900/40' :
                            'bg-red-950/60 text-red-300 border border-red-900/40'
                          }`}>
                            {task.activityType === 'teoria' ? 'MTeoria' :
                             task.activityType === 'questões' ? 'MQuestões' :
                             task.activityType === 'revisão' ? 'MRevisão' :
                             'MSimulado'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">+{task.impactScore}% aprovação</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal font-sans italic">{task.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button 
                        onClick={() => setSelectedTaskDetail(task)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
                        title="Ver justificativa da Athena"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          onSelectTaskToTrain(task);
                          onNavigate('treinar');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isCompleted 
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        disabled={isCompleted}
                      >
                        <Play className="w-3 h-3" /> Iniciar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right col: Visor semáforo visual por matéria de aprovação */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="col-subject-semaforo">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-500" /> Semáforo de Foco
              </h2>
              <span className="text-xs text-slate-500 font-mono">Eficácia</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              Status medido em relação à nota ideal de corte do CEBRASPE. A área crítica necessita de reforço pesado.
            </p>

            <div className="space-y-4" id="semaforo-items-wrapper">
              {Object.entries(progress.disciplinePerformance).map(([subject, data]) => {
                return (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[170px]">{subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-bold">{data.efficiency}%</span>
                        {/* Semaphore DOT indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          data.status === 'safe' ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' :
                          data.status === 'warning' ? 'bg-yellow-500 shadow-md shadow-yellow-500/50' :
                          'bg-red-500 shadow-md shadow-red-500/50 animate-pulse'
                        }`} title={
                          data.status === 'safe' ? 'Seguro (>70% acertos)' :
                          data.status === 'warning' ? 'Atenção (50% a 70%)' :
                          'Crítico! (<50% acertos)'
                        } />
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          data.status === 'safe' ? 'bg-emerald-500' :
                          data.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${data.efficiency || 15}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button 
              onClick={() => onNavigate('progresso')}
              className="w-full text-center py-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors border border-slate-800"
            >
              Ver Estatísticas Detalhadas
            </button>
          </div>
        </div>
      </div>

      {/* 4. Radar de Resoluções do CONTRAN Bento Widget */}
      <div 
        onClick={() => onNavigate('contran')}
        className="bg-slate-900 border border-amber-500/25 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:border-amber-400/50 hover:shadow-amber-950/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 select-none"
        id="contran-radar-shortcut-widget"
      >
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest text-[#F59E0B] font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">EDiTAL PRF • EXCLUSIVO</span>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40 animate-pulse">5 RESOLUÇÕES MAPEADAS</span>
            </div>
            <h3 className="text-lg font-black text-white">Radar de Resoluções do CONTRAN</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
              As resoluções do CONTRAN são o núcleo de maior peso na prova de Legislação de Trânsito. Acesse o mapeamento tático da Athena focado nas famosas pegadinhas de prova do CEBRASPE e domine as resoluções **432 (Lei Seca)**, **960 (Insulfilm)**, **789 (Habilitação)** e mais!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-end text-right font-mono text-[10px] text-slate-500">
            <span>Diagnóstico Ativo</span>
            <span className="text-amber-500 font-extrabold">PRONTIDÃO: 70%</span>
          </div>
          <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-[#F59E0B] hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all w-fit">
            <span>Mapear Resoluções</span>
            <ArrowRight className="w-4 h-4 text-slate-950 font-extrabold" />
          </div>
        </div>
      </div>

      {/* 4. Athena's Task Justification Dialog / Drawer popup */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-900/50 max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/20 text-emerald-400 text-xl">
                🦉
              </div>
              <div>
                <dt className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold">Justificativa da Athena</dt>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{selectedTaskDetail.discipline}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{selectedTaskDetail.title}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl mb-6 text-sm text-slate-200 font-sans leading-relaxed italic">
              "{selectedTaskDetail.athenaJustification}"
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-6">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Tempo: {selectedTaskDetail.durationMinutes} min</span>
              <span className="text-emerald-400">+ {selectedTaskDetail.impactScore}% na probabilidade de aprovação</span>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold hover:text-white hover:bg-slate-800 transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  onSelectTaskToTrain(selectedTaskDetail);
                  setSelectedTaskDetail(null);
                  onNavigate('treinar');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5"
                disabled={completedTasks.includes(selectedTaskDetail.id)}
              >
                Let's Go! <Play className="w-3 h-3 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
