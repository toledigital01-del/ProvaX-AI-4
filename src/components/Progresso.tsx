import React from 'react';
import { ProgressData } from '../types';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Layers, HelpCircle, TrendingUp } from 'lucide-react';

interface ProgressoProps {
  progress: ProgressData;
}

export default function Progresso({ progress }: ProgressoProps) {
  // Mocking an evolution line chart of approval probability over study days
  const evolutionHistory = [
    { day: 'Dia 1', prob: 35.0 },
    { day: 'Dia 2', prob: 38.4 },
    { day: 'Dia 3', prob: 42.1 },
    { day: 'Dia 4', prob: 44.0 },
    { day: 'Dia 5', prob: 48.5 },
  ];

  const maxProb = 100;
  
  // Custom SVG calculation parameters for the line graph
  const width = 500;
  const height = 180;
  const padding = 30;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Map evolution list into SVG coordinates
  const points = evolutionHistory.map((item, index) => {
    const x = padding + (index / (evolutionHistory.length - 1)) * graphWidth;
    const y = height - padding - (item.prob / maxProb) * graphHeight;
    return { x, y, prob: item.prob, label: item.day };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Specific CEBRASPE diagnostics
  const getCebraspeDiagnosis = () => {
    const incorrectCount = progress.totalQuestionsAnswered - progress.totalCorrect;
    const netCEBRASPE = progress.totalCorrect - incorrectCount;
    return {
      netScore: netCEBRASPE,
      liquidEfficiency: progress.totalQuestionsAnswered > 0 ? Math.round((netCEBRASPE / progress.totalQuestionsAnswered) * 100) : 0,
      riskRatio: progress.totalQuestionsAnswered > 0 ? Math.round((incorrectCount / progress.totalQuestionsAnswered) * 100) : 0
    };
  };

  const cebraspeStats = getCebraspeDiagnosis();

  return (
    <div className="space-y-6" id="progress-view-wrapper">
      
      {/* Overview statistical cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-dashboard-counters">
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Total Respondidas</span>
          <span className="text-2xl font-black text-white font-mono">{progress.totalQuestionsAnswered}</span>
          <p className="text-[10px] text-slate-400">Questões de simulado e treino</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Taxa de Acertos</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{progress.overallAccuracyRate.toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400">Média de acertos global</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Cobertura do Edital</span>
          <span className="text-2xl font-black text-blue-400 font-mono">{progress.syllabusCoverage.toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400">Total verticalizado estudado</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Nota Líquida CEBRASPE</span>
          <span className="text-2xl font-black text-yellow-500 font-mono">{cebraspeStats.netScore}</span>
          <p className="text-[10px] text-slate-400">Descontando penalidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="progress-deep-panels">
        
        {/* Left col span 2: Line Graph of Evolution */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="evolution-graph-panel">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Curva de Evolução da Aprovação
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold font-mono">Últimos 5 Ciclos</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              Esta curva projeta sua aprovação baseado em tempo de foco acumulado e acerto líquido no CEBRASPE. A nota alvo para estar nos classificados é <b>~72%</b>.
            </p>
          </div>

          {/* SVG line chart workspace */}
          <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex items-center justify-center overflow-x-auto">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full max-w-lg overflow-visible"
              id="svg-line-graph"
            >
              {/* Grid guide systems */}
              <line x1={0 + padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" strokeDasharray="2" />
              <line x1={0 + padding} y1={height - padding - (50 / maxProb) * graphHeight} x2={width - padding} y2={height - padding - (50 / maxProb) * graphHeight} stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
              <line x1={0 + padding} y1={height - padding - (75 / maxProb) * graphHeight} x2={width - padding} y2={height - padding - (75 / maxProb) * graphHeight} stroke="#047857" strokeWidth="1" strokeDasharray="3" />

              {/* Grid labels */}
              <text x={padding - 5} y={height - padding - (75 / maxProb) * graphHeight + 4} fill="#059669" fontSize="9" fontFamily="monospace" textAnchor="end">75% (Aprovado)</text>
              <text x={padding - 5} y={height - padding - (50 / maxProb) * graphHeight + 4} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">50%</text>

              {/* Main vector line path */}
              <path d={pathD} fill="none" stroke="url(#gradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Node highlights */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle cx={point.x} cy={point.y} r="5" fill="#10b981" stroke="#090d16" strokeWidth="2" />
                  <text x={point.x} y={point.y - 12} fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    {point.prob}%
                  </text>
                  <text x={point.x} y={height - padding + 15} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    {point.label}
                  </text>
                </g>
              ))}

              {/* Color Gradient definitions */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-4 pt-2 border-t border-slate-900 leading-normal">
            <span>Início: 35.0%</span>
            <span className="text-emerald-400 font-semibold">Tendência: Estável Crescente (+13.5%)</span>
          </div>
        </div>

        {/* Right col: CEBRASPE exclusive index and warning metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="cebraspe-diagnosis-panel">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 animate-fade-in">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-500 animate-pulse" /> Diagnóstico CEBRASPE
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              O CEBRASPE penaliza severamente os chutes por meio do formato "Uma Errada Anula uma Certa". Veja seu índice de risco.
            </p>

            <div className="space-y-4" id="index-factors">
              {/* Factor 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Líquido de Assertividade</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Seu aproveitamento real líquido de pontos</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-yellow-500 font-mono">{progress.totalQuestionsAnswered > 0 ? (cebraspeStats.netScore) : 0} pts</span>
                  <span className="text-[9px] text-emerald-400 block font-mono">Eficiência: {cebraspeStats.liquidEfficiency}%</span>
                </div>
              </div>

              {/* Factor 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Taxa de Risco de Chute</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Porcentagem de questões zeradas por erro</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-red-500 font-mono">{cebraspeStats.riskRatio}%</span>
                  <span className="text-[9px] text-slate-400 block font-mono">Máximo ideal: &lt;20%</span>
                </div>
              </div>

              {/* Factor 3 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Conselho de Penalização</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Estratégia recomendada por aprovados</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-950/40 p-1.5 rounded">CONSERVADOR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 font-serif italic text-[11px] text-slate-400 text-center leading-relaxed">
            "Deixar em branco vale 0; errar vale -1. Na dúvida extrema, nunca marque!"
          </div>
        </div>

      </div>

      {/* Accuracy checklist details categorized by discipline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg" id="discipline-matrix-progresso">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Detalhamento Analítico por Matéria
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                <th className="py-2.5">Matéria</th>
                <th className="py-2.5 text-center">Respondidas</th>
                <th className="py-2.5 text-center">Acertos</th>
                <th className="py-2.5 text-center">Eficiência</th>
                <th className="py-2.5 text-right">Status do Semáforo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Object.entries(progress.disciplinePerformance).map(([subject, data]) => {
                return (
                  <tr key={subject} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3 font-semibold text-white">{subject}</td>
                    <td className="py-3 text-center font-mono text-slate-300">{data.total}</td>
                    <td className="py-3 text-center font-mono text-emerald-400">{data.correct}</td>
                    <td className="py-3 text-center font-mono">
                      <span className={`font-bold ${
                        data.status === 'safe' ? 'text-emerald-400' :
                        data.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {data.efficiency}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1.5 ${
                        data.status === 'safe' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' :
                        data.status === 'warning' ? 'bg-yellow-950/50 text-yellow-500 border border-yellow-900/10' :
                        'bg-red-950/50 text-red-500 border border-red-900/40 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          data.status === 'safe' ? 'bg-emerald-500' :
                          data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        {data.status === 'safe' ? 'Seguro' :
                         data.status === 'warning' ? 'Atenção' : 'Crítico'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
