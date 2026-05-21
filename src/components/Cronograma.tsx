import React, { useState } from 'react';
import { StudySchedule, StudyTask, TaskType } from '../types';
import { Calendar, Layers, Clock, Shield, Sparkles, RefreshCw, BadgeHelp, CheckCircle2, AlertCircle } from 'lucide-react';

interface CronogramaProps {
  schedule: StudySchedule;
  onboardingData: any;
  onUpdateSchedule: (newSchedule: StudySchedule) => void;
}

export default function Cronograma({ schedule, onboardingData, onUpdateSchedule }: CronogramaProps) {
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    discipline: string;
    duration: number;
    activityType: TaskType;
    topic: string;
    justification: string;
  } | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);
  const [recalibrateMsg, setRecalibrateMsg] = useState<string>('');

  const handeRecalibrate = async () => {
    setIsRecalibrating(true);
    setRecalibrateMsg('Analisando seu desempenho CEBRASPE recente...');
    
    setTimeout(() => {
      setRecalibrateMsg('Mapeando fraquezas em Direito Penal e Física...');
    }, 1200);

    setTimeout(() => {
      setRecalibrateMsg('Distribuindo sessões prioritárias de CTB/Multas...');
    }, 2400);

    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding: onboardingData }),
      });
      const data = await response.json();
      onUpdateSchedule(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecalibrating(false);
      setRecalibrateMsg('');
    }
  };

  const getSlotJustification = (name: string, type: TaskType, topic: string) => {
    const prfOfficerPhrases = [
      `Concurseiro(a), o bloco de **Legislação de Trânsito** representa o maior contingente de questões no edital da PRF. Colocamos esta sessão focada em "${topic}" para alternar o estudo teórico com a fixação de resoluções de trânsito de alta relevância no CTB.`,
      `Estudos mostram que ciclos inteligentes recomendam revisões rápidas em matérias complexas como **${name}** para blindar seu aproveitamento contra as armadilhas clássicas de troca de conceitos da CEBRASPE.`,
      `Esta alocação cumpre o edital verticalizado. Intercalamos temas de alta abstração como Direito Constitucional com disciplinas de peso estratégico para otimizar sua absorção de estudos durante as ${onboardingData?.hoursPerDay || 4}h diárias.`
    ];
    
    if (name.includes('Trânsito')) return prfOfficerPhrases[0];
    if (type === 'revisão' || type === 'questões') return prfOfficerPhrases[1];
    return prfOfficerPhrases[2];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="cronograma-view-container">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <span className="text-xs text-emerald-400 font-mono tracking-widest font-semibold uppercase">PLANO DE ESTUDOS</span>
          <h2 className="text-xl font-extrabold text-white">Cronograma Mapeado pela Athena</h2>
          <p className="text-xs text-slate-400 mt-1">
            Plano adaptativo distribuído para o concurso de **{onboardingData?.role === 'PRF' ? 'Policial Rodoviário Federal (PRF)' : (onboardingData?.role || 'PRF')}**.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-850 flex items-center shrink-0">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
                viewType === 'weekly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
                viewType === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            onClick={handeRecalibrate}
            disabled={isRecalibrating}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-yellow-500 hover:text-yellow-400 hover:border-yellow-500/20 hover:bg-slate-900 transition-all disabled:opacity-45"
            id="btn-recalibrate-cronograma"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-emerald-500' : ''}`} />
            Recalibrar IA
          </button>
        </div>
      </div>

      {isRecalibrating && (
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl text-center space-y-4 animate-pulse">
          <RefreshCw className="w-8 h-8 text-yellow-500 animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-300">{recalibrateMsg}</p>
          <p className="text-xs text-slate-500">A Athena está recalculando a carga do edital...</p>
        </div>
      )}

      {/* WEEKLY VISÃO GRADE */}
      {!isRecalibrating && viewType === 'weekly' && (
        <div className="space-y-4 animate-fade-in" id="weekly-view-grid">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            
            {schedule.weekly.map((day, dIdx) => (
              <div key={day.dayOfWeek} className="bg-slate-950 rounded-xl border border-slate-850 p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white font-mono text-xs border-b border-slate-900 pb-1.5 mb-2 text-center text-emerald-400">
                    {day.dayOfWeek.split('-')[0]}
                  </h4>
                  
                  <div className="space-y-3">
                    {day.disciplines.map((disc, subIdx) => (
                      <div 
                        key={subIdx}
                        onClick={() => setSelectedSlot({
                          day: day.dayOfWeek,
                          discipline: disc.name,
                          duration: disc.duration,
                          activityType: disc.activityType,
                          topic: disc.topic,
                          justification: getSlotJustification(disc.name, disc.activityType, disc.topic)
                        })}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700/80 cursor-pointer transition-all space-y-1.5 text-left"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[10px] font-sans font-bold text-slate-200 truncate leading-snug">
                            {disc.name.split('(')[0]}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                          <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5 text-slate-500" /> {disc.duration}m</span>
                          <span className={`px-1 rounded ${
                            disc.activityType === 'teoria' ? 'bg-blue-950 text-blue-300' :
                            disc.activityType === 'questões' ? 'bg-yellow-950 text-yellow-300' :
                            disc.activityType === 'revisão' ? 'bg-purple-950 text-purple-300' :
                            'bg-red-950 text-red-300'
                          }`}>
                            {disc.activityType === 'teoria' ? 'Teor' :
                             disc.activityType === 'questões' ? 'Ques' :
                             disc.activityType === 'revisão' ? 'Rev' : 'Sim'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] text-slate-650 font-mono text-center pt-2 border-t border-slate-900">
                  Carga: {day.disciplines.reduce((sum, d) => sum + d.duration, 0)} min
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <span>Dica: clique em qualquer bloco de matéria para ver a <b>justificativa da Athena</b> para aquela alocação semanal.</span>
            <span className="text-[10px] font-mono">Última recalibração: {schedule.lastRecalibrated}</span>
          </div>
        </div>
      )}

      {/* MONTHLY VISION TABLE */}
      {!isRecalibrating && viewType === 'monthly' && (
        <div className="space-y-4 animate-fade-in" id="monthly-view-list">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {schedule.monthly.map((week) => (
              <div key={week.weekIndex} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <span className="text-xs font-mono font-bold text-emerald-400">SEMANA {week.weekIndex}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{week.theme}</h4>
                  <p className="text-xs text-slate-400">Ciclo focado em cobrir e consolidar revisões dos tópicos macros de maior incidência.</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Disciplinas em Foco</span>
                  <div className="flex flex-wrap gap-1.5">
                    {week.focusDisciplines.map((fd, fIdx) => (
                      <span key={fIdx} className="bg-slate-900 border border-slate-850 text-slate-350 text-[10px] px-2 py-0.5 rounded-md">
                        {fd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLOT DETAIL MODAL INSIGHT DRAWER */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-900/50 max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/20 text-emerald-400 text-xl">
                🦉
              </div>
              <div>
                <dt className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold">{selectedSlot.day}</dt>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{selectedSlot.discipline}</h3>
                <span className="text-xs text-slate-400 font-mono italic">Tópico: {selectedSlot.topic}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl mb-6 text-sm text-slate-200 leading-relaxed italic">
              "{selectedSlot.justification}"
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4 border-b border-slate-900 pb-4">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duração: {selectedSlot.duration} minutos</span>
              <span className="bg-slate-950 px-2.5 py-0.5 rounded text-slate-400 uppercase text-[10px]">{selectedSlot.activityType}</span>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedSlot(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:scale-[1.01] transition-transform"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
