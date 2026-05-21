import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, CheckCircle, ArrowRight, ShieldAlert, Check, 
  MessageSquare, Compass, Star, Award, BookOpen, Clock, Calendar, Layers, 
  Sparkles, ListTodo, HelpCircle, Flame, CreditCard, ChevronRight, Menu, X,
  Sliders, TrendingUp, Scale, AlertTriangle, GraduationCap, ChevronDown, CheckSquare
} from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLoginDirectly: () => void;
}

export default function LandingPage({ onStartOnboarding, onLoginDirectly }: LandingPageProps) {
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Floating Mobile bottom CTA bar activation
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Accordion active FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Interactive study profiles for Cronograma feature
  const [selectedProfile, setSelectedProfile] = useState<'worker' | 'dedicated' | 'advanced'>('worker');

  // Sticky navbar state on scroll
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky navbar shadow
      if (window.scrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Show floating CTA on mobile if scrolled past hero section (~450px)
      if (window.scrollY > 450) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1a1a2e] font-sans selection:bg-amber-500/20 selection:text-slate-900" id="landing-container">
      
      {/* SEÇÃO 0 — Barra de Urgência de Matrícula */}
      <div className="bg-[#1a1a2e] text-slate-100 px-4 py-2.5 text-center text-[11px] sm:text-xs font-mono font-medium tracking-wider flex items-center justify-center gap-2 border-b border-amber-500/20 z-50 relative">
        <span className="inline-block w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
        <span>CONDIÇÃO PRÉ-EDITAL: Garanta 7 Dias de Acesso Grátis com suporte integral da Mentora <span className="text-[#F97316] font-extrabold">Athena</span> AI.</span>
      </div>

      {/* NAVBAR (fixa no topo) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isSticky 
          ? 'bg-[#1a1a2e] shadow-lg border-b border-slate-900' 
          : 'bg-[#1a1a2e] border-b border-slate-9a0/10'
      }`} id="landing-navbar" style={{ marginTop: '0px' }}>
        {/* We make sure the layout stacks or has standard padding for SEÇÃO 0 spacer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Branding */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="compact" theme="dark" />
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#como-funciona" 
                onClick={(e) => handleScrollToSection(e, 'como-funciona')}
                className="text-xs sm:text-sm text-white/60 hover:text-white font-medium transition-colors"
              >
                Como funciona
              </a>
              <a 
                href="#funcionalidades" 
                onClick={(e) => handleScrollToSection(e, 'funcionalidades')}
                className="text-xs sm:text-sm text-white/60 hover:text-white font-medium transition-colors"
              >
                Funcionalidades
              </a>
              <a 
                href="#precos" 
                onClick={(e) => handleScrollToSection(e, 'precos')}
                className="text-xs sm:text-sm text-white/60 hover:text-white font-medium transition-colors"
              >
                Preços
              </a>
              <a 
                href="#depoimentos" 
                onClick={(e) => handleScrollToSection(e, 'depoimentos')}
                className="text-xs sm:text-sm text-white/60 hover:text-white font-medium transition-colors"
              >
                Depoimentos
              </a>
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={onLoginDirectly}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 bg-transparent rounded-xl transition-all cursor-pointer"
                id="landing-signin-btn"
              >
                Entrar
              </button>
              <button 
                onClick={onStartOnboarding}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-[#1a1a2e] bg-[#F59E0B] hover:bg-amber-500 rounded-xl transition-all shadow-md cursor-pointer"
                id="landing-signup-btn"
              >
                Começar grátis
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white/80 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-800 bg-[#1a1a2e]/95 backdrop-blur-md overflow-hidden shadow-inner"
              id="landing-mobile-dropdown"
            >
              <div className="px-4 pt-2.5 pb-6 space-y-3.5">
                <a 
                  href="#como-funciona"
                  onClick={(e) => handleScrollToSection(e, 'como-funciona')}
                  className="block text-sm text-slate-300 hover:text-white font-semibold py-1.5"
                >
                  Como funciona
                </a>
                <a 
                  href="#funcionalidades"
                  onClick={(e) => handleScrollToSection(e, 'funcionalidades')}
                  className="block text-sm text-slate-300 hover:text-white font-semibold py-1.5"
                >
                  Funcionalidades
                </a>
                <a 
                  href="#precos"
                  onClick={(e) => handleScrollToSection(e, 'precos')}
                  className="block text-sm text-slate-300 hover:text-white font-semibold py-1.5"
                >
                  Preços
                </a>
                <a 
                  href="#depoimentos"
                  onClick={(e) => handleScrollToSection(e, 'depoimentos')}
                  className="block text-sm text-slate-300 hover:text-white font-semibold py-1.5"
                >
                  Depoimentos
                </a>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <button 
                    onClick={onLoginDirectly}
                    className="w-full text-center py-2.5 text-xs text-white border border-[#E2E8F0]/10 rounded-xl bg-transparent font-bold"
                  >
                    Entrar
                  </button>
                  <button 
                    onClick={onStartOnboarding}
                    className="w-full text-center py-2.5 text-xs text-[#1a1a2e] bg-[#F59E0B] font-bold rounded-xl"
                  >
                    Começar grátis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for sticky navbar */}
      <div className="h-16 sm:h-20 bg-[#1a1a2e]" />

      {/* SEÇÃO 1 — Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-[#F8FAFC]" id="landing-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Coluna Esquerda - Texto */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FEF3C7] border-[0.5px] border-[#F59E0B] rounded-full text-xs font-semibold text-[#92400E] shadow-sm">
                <span>✦ Exclusivo para o concurso da PRF</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1a1a2e] leading-tight">
                Pare de estudar <br className="hidden sm:inline" />
                às cegas.
                <span className="block mt-2 text-[#F59E0B]">
                  Comece a estudar <br className="hidden sm:inline" />
                  para passar.
                </span>
              </h1>

              {/* Subheadline (compliant with constraint: no public servant mentions) */}
              <p className="text-[#64748B] text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                O ProvaX AI é a única plataforma de estudos estrategicamente desenhada para o concurso nacional da PRF. Nossa mentora de inteligência artificial, a <span className="text-[#F97316] font-bold">Athena</span>, foi treinada no padrão histórico da banca CEBRASPE — ela conhece as pegadinhas, os tópicos favoritos da banca e os erros que eliminam candidatos preparados. Além disso, analisa seu desempenho em tempo real, mapeia o peso real de cada disciplina do edital e elabora sua missão diária calibrada. Você não estuda mais por intuição. Você estuda com precisão cirúrgica — de forma 100% automatizada.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
                <button 
                  onClick={onStartOnboarding}
                  className="px-8 py-4.5 text-sm sm:text-base font-extrabold text-white bg-[#1a1a2e] hover:bg-[#25253c] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.015] shadow-lg shadow-slate-350/80 transition-all cursor-pointer"
                >
                  <span>Começar 7 dias grátis →</span>
                </button>
                <a 
                  href="#como-funciona"
                  onClick={(e) => handleScrollToSection(e, 'como-funciona')}
                  className="px-6 py-4.5 text-sm font-semibold text-[#1a1a2e] border border-[#E2E8F0] bg-white hover:bg-slate-50 rounded-xl text-center shadow-sm transition-all fast-hover"
                >
                  Ver como funciona
                </a>
              </div>

              {/* Row of confidence */}
              <p className="text-[11px] text-[#64748B] font-mono">
                Sem cartão de crédito · 7 dias Premium grátis · Cancele quando quiser
              </p>
            </div>

            {/* Coluna Direita - Visual (Dashboard Mockup) */}
            <div className="lg:col-span-5 mt-12 lg:mt-0 relative">
              <div className="relative p-2 bg-slate-900 border border-slate-800 rounded-[24px] shadow-2xl max-w-md mx-auto sm:max-w-xl lg:max-w-none">
                
                {/* Simulated UI Applet representing App's dashboard */}
                <div className="bg-[#F8FAFC] border-[0.5px] border-[#E2E8F0] rounded-[18px] overflow-hidden shadow-inner text-[#1a1a2e] flex flex-col font-sans select-none relative pb-4">
                  
                  {/* Card Header Section */}
                  <div className="bg-[#1a1a2e] p-4 text-white text-left flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase block">PREPARAÇÃO ATIVA · PRF 2026</span>
                      <h4 className="font-extrabold text-sm sm:text-base mt-0.5">Rumo à Aprovação, Carlos Oliveira!</h4>
                    </div>
                    <div className="bg-amber-500/10 border border-[#F59E0B]/20 px-2 py-1 rounded text-right shrink-0">
                      <span className="text-[8px] font-mono block text-[#F59E0B] leading-none uppercase">FALTAM PARA A PROVA</span>
                      <strong className="text-yellow-405 font-mono text-xs text-[#F59E0B] block mt-0.5">209 dias</strong>
                    </div>
                  </div>

                  {/* Three Simulated Metrics side-by-side */}
                  <div className="p-3 grid grid-cols-3 gap-2">
                    
                    {/* Metric 1 */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] text-left relative flex flex-col justify-between h-24">
                      <span className="text-[7.5px] font-mono text-[#64748B] block uppercase tracking-tight leading-none">Nível de Aprovação</span>
                      <div className="flex items-center gap-1 my-1">
                        <div className="w-6 h-6 rounded-full border-2 border-[#22C55E] flex items-center justify-center text-[7.5px] font-bold text-[#22C55E]">
                          41%
                        </div>
                        <span className="font-mono text-xs font-black text-[#22C55E]">41.2%</span>
                      </div>
                      <span className="text-[7px] text-[#64748B] block leading-none">Preditivo CEBRASPE</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] text-left relative flex flex-col justify-between h-24">
                      <span className="text-[7.5px] font-mono text-[#64748B] block uppercase tracking-tight leading-none font-bold">Dias Consecutivos</span>
                      <div className="flex items-center gap-1 my-1">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                        <span className="text-xs font-black text-slate-800">3 Dias</span>
                      </div>
                      <span className="text-[7px] text-[#22C55E] font-bold block leading-none">Streak Ativo</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] text-left relative flex flex-col justify-between h-24">
                      <span className="text-[7.5px] font-mono text-[#64748B] block uppercase tracking-tight leading-none font-bold">Conselho da <span className="text-[#F97316]">Athena</span></span>
                      <p className="text-[7px] italic text-[#64748B] leading-tight my-0.5 max-h-12 overflow-hidden truncate">
                        "Foque no Bloco II do edital..."
                      </p>
                      <span className="text-[7.5px] font-bold text-[#F97316] leading-none">Ver Mentora sutil</span>
                    </div>

                  </div>

                  {/* Card "MISSÃO DE HOJE" block */}
                  <div className="mx-3 p-3 bg-white border border-[#E2E8F0] rounded-xl text-left shadow-sm space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <strong className="text-[9px] font-extrabold uppercase text-[#1a1a2e] block">METAS DE HOJE • ESTUDO ESTRATÉGICO</strong>
                      <span className="text-[8px] font-mono font-bold text-[#22C55E]">PASSO 1 DE 3</span>
                    </div>
                    
                    <div className="space-y-1.5 font-sans text-[8.5px]">
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <CheckSquare className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-slate-800 font-bold leading-normal">Legislação de Trânsito (Art. 306 CTB)</strong>
                          <span className="text-[7.5px] text-[#64748B] block font-mono">15 questões estratégicas do CEBRASPE</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar with Blue and Amber indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[7px] text-[#64748B] font-mono">
                        <span>XP REQUERIDA DE PROGRESSO</span>
                        <span>33.3% COMPLETA</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-[#1a1a2e] h-full" style={{ width: '23%' }} />
                        <div className="bg-[#F59E0B] h-full" style={{ width: '10.3%' }} />
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — Prova social */}
      <section className="bg-white border-y-[0.5px] border-[#E2E8F0] py-12 sm:py-16" id="landing-social-proof">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-mt-6">
          <p className="text-xs sm:text-sm text-[#64748B] font-medium tracking-wide uppercase">
            Candidatos que já estudam com método e inteligência artificial
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10 max-w-4xl mx-auto" id="social-metrics-grid">
            
            {/* Metric 1 */}
            <div className="space-y-1.5 p-4 rounded-xl">
              <span className="text-4xl sm:text-5xl font-black text-[#1a1a2e] block">12.000+</span>
              <span className="text-xs sm:text-sm text-[#64748B] block font-semibold">questões PRF no banco de dados</span>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1.5 p-4 rounded-xl">
              <span className="text-4xl sm:text-5xl font-black text-[#1a1a2e] block">209</span>
              <span className="text-xs sm:text-sm text-[#64748B] block font-semibold">dias monitorados pela <span className="text-[#F97316] font-bold">Athena</span></span>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1.5 p-4 rounded-xl">
              <span className="text-4xl sm:text-5xl font-black text-[#1a1a2e] block">7 dias</span>
              <span className="text-xs sm:text-sm text-[#64748B] block font-semibold">para sentir a diferença no seu estudo</span>
            </div>

          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] italic mt-10 max-w-xl mx-auto block leading-relaxed">
            "Feito por um time de elite com anos de experiência que conhece cada detalhe da banca CEBRASPE."
          </p>
        </div>
      </section>

      {/* SEÇÃO 3 — O problema */}
      <section className="bg-[#F8FAFC] py-16 sm:py-24 scroll-mt-6" id="o-problema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight max-w-2xl mx-auto">
            Você estuda, mas não sabe se está no caminho certo.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 sm:mt-16">
            
            {/* Card 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border-[0.5px] border-[#E2E8F0] shadow-sm flex flex-col items-start text-left space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Compass className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Você estuda tudo por igual</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Sem saber o que a PRF cobra mais, você perde tempo com conteúdo de baixo peso enquanto as matérias críticas ficam para trás.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border-[0.5px] border-[#E2E8F0] shadow-sm flex flex-col items-start text-left space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Sliders className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Você lê e esquece</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Sem revisão inteligente no momento certo, o cérebro descarta o conteúdo. Você recomeça do zero toda vez que abre o material.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border-[0.5px] border-[#E2E8F0] shadow-sm flex flex-col items-start text-left space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Cursinho genérico não é PRF</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                A PRF tem edital específico, banca CEBRASPE com penalização de -1 e questões de trânsito exclusivas. Método genérico gera resultado genérico.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 4 — A solução (3 features com layout alternado) */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-250/30 scroll-mt-6" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cabeçalho Solução */}
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-20 sm:mb-28">
            <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-widest font-extrabold block">A SOLUÇÃO</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] tracking-tight">
              A <span className="text-[#F97316]">Athena</span> resolve isso de forma inteligente.
            </h2>
            <p className="text-[#64748B] text-base leading-relaxed">
              Nossa IA foi treinada com o edital da PRF, o histórico de provas CEBRASPE e a experiência de quem já trilhou esse caminho com sucesso. Ela não é um chatbot genérico — ela é sua mentora estratégica.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-36">

            {/* Feature 1 — Cronograma (texto esquerda, visual direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left text */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] border-[0.5px] border-[#F59E0B] rounded-full text-[11px] font-mono font-bold text-[#92400E]">
                  CRONOGRAMA IA
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
                  Seu cronograma, gerado e recalibrado toda semana
                </h3>
                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  A <span className="text-[#F97316] font-bold">Athena</span> analisa o peso real de cada matéria no edital da PRF, suas horas disponíveis por dia, a data estimada da prova e seu desempenho atual. O resultado: um cronograma semanal inteligente onde quem está fraco estuda mais e quem está bem mantém o ritmo. E recalibra automaticamente toda segunda-feira.
                </p>
                
                <ul className="space-y-3 text-xs sm:text-sm text-[#1a1a2e]">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Distribuição baseada no peso real do edital PRF</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Recalibração automática semanal com base no desempenho</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Clique em qualquer bloco para ver a justificativa da <span className="text-[#F97316] font-bold">Athena</span></span>
                  </li>
                </ul>
              </div>

              {/* Right mockup visual: Cronograma */}
              <div className="lg:col-span-6">
                <div className="bg-white border-[0.5px] border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden text-left p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2.5">
                    <div>
                      <span className="text-[8px] font-mono tracking-widest text-[#64748B] uppercase">PLANO DE ESTUDOS</span>
                      <h4 className="font-extrabold text-[#1a1a2e] text-xs sm:text-sm">Cronograma Mapeado pela <span className="text-[#F97316]">Athena</span></h4>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="text-[7.5px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded font-mono font-bold">Semanal</span>
                      <span className="text-[7.5px] bg-slate-100 text-[#64748B] px-2 py-0.5 rounded font-mono">Mensal</span>
                      <span className="text-[7.5px] bg-[#F97316] text-white px-2.5 py-0.5 rounded font-mono font-bold select-none cursor-pointer">Recalibrar IA</span>
                    </div>
                  </div>

                  {/* 7 Days Grid Column layout inside desktop layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-[9px] font-sans">
                    
                    {[{ day: "Seg", title: "Dir. Trânsito", min: "120 min", type: "Teor" },
                      { day: "Ter", title: "Física Geral", min: "90 min", type: "Ques" },
                      { day: "Qua", title: "Const. Art 144", min: "120 min", type: "Teor" },
                      { day: "Qui", title: "Cód. Trânsito", min: "150 min", type: "Rev" },
                      { day: "Sex", title: "Admin. Público", min: "80 min", type: "Ques" },
                      { day: "Sáb", title: "Lei Penal 8072", min: "120 min", type: "Sim" },
                      { day: "Dom", title: "Descanso Ativo", min: "0 min", type: "Desc" }
                    ].map((item, id) => (
                      <div key={id} className="border border-[#E2E8F0] bg-[#F8FAFC] p-2 rounded-xl flex flex-col justify-between h-20 text-left">
                        <span className="font-mono text-[#64748B] uppercase font-bold text-[8px]">{item.day}</span>
                        <p className="font-extrabold text-[#1a1a2e] leading-tight my-1 truncate">{item.title}</p>
                        <div>
                          <span className="block font-mono text-[7px] text-[#64748B] mb-0.5">{item.min}</span>
                          {item.type === "Teor" && <span className="bg-[#1a1a2e] text-white text-[6.5px] px-1 py-0.2 rounded font-bold">Teor</span>}
                          {item.type === "Ques" && <span className="bg-[#F59E0B] text-[#1a1a2e] text-[6.5px] px-1 py-0.2 rounded font-bold">Ques</span>}
                          {item.type === "Rev" && <span className="bg-purple-650 text-white text-[6.5px] px-1 py-0.2 rounded font-bold bg-purple-600">Rev</span>}
                          {item.type === "Sim" && <span className="bg-[#22C55E] text-white text-[6.5px] px-1 py-0.2 rounded font-bold">Sim</span>}
                          {item.type === "Desc" && <span className="bg-slate-300 text-slate-750 text-[6.5px] px-1 py-0.2 rounded">Desc</span>}
                        </div>
                      </div>
                    ))}

                  </div>

                  <div className="flex sm:justify-between items-center text-[8px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0] flex-wrap gap-2">
                    <span>Última recalibração: 20/05/2026</span>
                    <span className="text-[#F97316] font-bold">● Recalibração de emergência ativada por IA</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Feature 2 — Athena (visual esquerda, texto direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left mockup visual: Chat Arena */}
              <div className="lg:col-span-6 order-last lg:order-first">
                <div className="bg-white border-[0.5px] border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden text-left flex flex-col h-[320px]">
                  
                  {/* Avatar box */}
                  <div className="bg-[#1a1a2e] p-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a2e] border border-amber-500/30 flex items-center justify-center text-base">
                        🦉
                      </div>
                      <div className="text-left">
                        <h4 className="font-extrabold text-[#F97316] text-xs tracking-wide">Athena AI</h4>
                        <p className="text-[7.5px] text-[#64748B] uppercase font-mono tracking-wider font-bold">MENTORA DE ELITE · Status: Analisando seu edital</p>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  </div>

                  {/* Messages Feed area */}
                  <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto text-[9.5px] font-sans">
                    
                    {/* User message block */}
                    <div className="flex justify-end pl-10">
                      <div className="bg-[#1a1a2e] text-white p-2.5 rounded-xl text-left border border-slate-900/10">
                        Quais as pegadinhas do Artigo 144 da CF?
                      </div>
                    </div>

                    {/* Athena message response */}
                    <div className="flex justify-start pr-10">
                      <div className="bg-[#F8FAFC] text-slate-705 border border-[#E2E8F0] p-2.5 rounded-xl text-left font-sans">
                        <p className="text-[#F97316] font-extrabold font-mono text-[7px] uppercase tracking-widest mb-1">Athena AI:</p>
                        Olá, futuro aprovado! Mantenha o foco aceso. Com sua rotina de 4h diárias, você tem tempo para consolidar teoria e detonar nos exercícios. O Art. 144 é terreno fértil para o CEBRASPE...
                      </div>
                    </div>

                  </div>

                  {/* Base input simulated */}
                  <div className="p-2 border-t border-[#E2E8F0] flex gap-2 items-center bg-[#F8FAFC]">
                    <div className="flex-1 bg-white border border-[#E2E8F0] rounded-md px-2.5 py-1 text-[8.5px] text-[#64748B] text-left">
                      Pergunte sobre crimes, recursos, CTB ou bizus da banca...
                    </div>
                    <button className="bg-[#1a1a2e] text-white p-1 rounded font-bold text-[8px] uppercase">Enviar</button>
                  </div>

                </div>
              </div>

              {/* Right text */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border-[0.5px] border-[#F97316]/20 rounded-full text-[11px] font-mono font-bold text-[#F97316]">
                  MENTORA IA
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
                  Uma mentora que te conhece de verdade
                </h3>
                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  A <span className="text-[#F97316] font-bold">Athena</span> lembra do seu histórico, seus erros mais frequentes, suas matérias mais fracas e o edital completo da PRF. Pergunte qualquer coisa: o que estudar hoje, como está seu desempenho, qual a armadilha do CEBRASPE em Direito Penal. Ela responde com precisão.
                </p>
                
                <ul className="space-y-3 text-xs sm:text-sm text-[#1a1a2e]">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Disponível 24h — responde em segundos</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Memória do seu desempenho e histórico de estudo</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Conhece o edital PRF e a banca CEBRASPE a fundo</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Feature 3 — Simulados (texto esquerda, visual direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left text */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] border-[0.5px] border-[#F59E0B] rounded-full text-[11px] font-mono font-bold text-[#92400E]">
                  SIMULADOS CEBRASPE
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
                  Treine como na prova real. Com a penalização real.
                </h3>
                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  A regra da CEBRASPE é brutal: uma questão errada anula uma certa. O ProvaX AI simula exatamente esse cenário. Você aprende a estratégia de quando responder e quando deixar em branco — antes de chegar na prova de verdade.
                </p>
                
                <ul className="space-y-3 text-xs sm:text-sm text-[#1a1a2e]">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Simulado Completo: 15 questões no padrão PRF</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Mini Simulado: 5 questões em 10 minutos</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span><span className="text-[#F97316] font-bold">Athena</span> IA: simulado focado nas suas fraquezas</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                    <span>Folha de respostas e timer como na prova real</span>
                  </li>
                </ul>
              </div>

              {/* Right mockup visual: Simulados */}
              <div className="lg:col-span-6">
                <div className="bg-white border-[0.5px] border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden p-4 sm:p-5 text-left grid grid-cols-12 gap-4">
                  
                  {/* Info area - 8 columns */}
                  <div className="col-span-12 sm:col-span-8 space-y-3 border-r border-[#E2E8F0]/30 pr-0 sm:pr-4">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#F59E0B]/20 text-[#1a1a2e] font-mono font-extrabold text-[8px] px-1.5 py-0.5 rounded font-black">C/E</span>
                        <span className="font-extrabold text-[#1a1a2e] text-[9.5px]">Questão 1 de 15</span>
                      </div>
                      <span className="text-[8px] text-red-600 font-mono font-bold leading-none select-none">⏱ Restam: 29:53</span>
                    </div>

                    <span className="inline-block bg-slate-100 text-slate-700 font-mono text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Legislação de Trânsito
                    </span>

                    <p className="text-[9px] text-[#1a1a2e] font-normal leading-relaxed">
                      De acordo com o Código de Trânsito Brasileiro (CTB), conduzir veículo automotor com capacidade psicomotora alterada em razão da influência de álcool dita infração penal...
                    </p>

                    {/* Question Action Selectors */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="border-[1.5px] border-[#22C55E]/40 text-center py-2 rounded-xl text-[9.5px] font-bold text-[#22C55E] bg-[#22C55E]/5 cursor-pointer">
                        Certo
                      </div>
                      <div className="border-[1.5px] border-[#E2E8F0] hover:border-slate-300 text-center py-2 rounded-xl text-[9.5px] font-bold text-[#64748B] cursor-pointer bg-white transition-all">
                        Errado
                      </div>
                    </div>
                    <div className="text-center font-mono text-[8px] text-[#64748B] hover:text-[#1a1a2e] underline cursor-pointer">
                      Deixar em Branco
                    </div>
                  </div>

                  {/* Sidebar Answer grid sheet - 4 columns */}
                  <div className="col-span-12 sm:col-span-4 space-y-2.5 text-left">
                    <span className="text-[8px] font-mono tracking-wider font-extrabold text-[#64748B] uppercase block">FOLHA DE RESPOSTAS</span>
                    <div className="grid grid-cols-5 gap-1 font-mono text-[8.5px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                        <div 
                          key={n} 
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold font-mono border ${
                            n === 1 
                              ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5 shrink-0' 
                              : 'border-[#E2E8F0] tracking-normal inline-block text-[#64748B]'
                          }`}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 5 — Como funciona */}
      <section className="bg-[#F8FAFC] py-20 sm:py-28 scroll-mt-6 border-t border-[#E2E8F0]" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-widest font-extrabold block mb-2">METODOLOGIA ADAPTATIVA</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight">
            Simples assim.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            De zero a estudando com método em menos de 3 minutos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left relative" id="how-it-works-grid">
            
            {/* Step 1 */}
            <div className="space-y-4 relative bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-black text-[#F59E0B] opacity-40 font-mono">01</span>
                <div className="h-[1px] bg-[#E2E8F0] flex-1 mx-4 hidden sm:block" />
              </div>
              <h3 className="text-md sm:text-lg font-bold text-[#1a1a2e]">"Conta seu perfil para a <span className="text-[#F97316]">Athena</span>"</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Responda 5 perguntas rápidas: cargo que busca, horas disponíveis por dia, data do edital e suas maiores dificuldades. Leva menos de 2 minutos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-black text-[#F59E0B] opacity-40 font-mono">02</span>
                <div className="h-[1px] bg-[#E2E8F0] flex-1 mx-4 hidden sm:block" />
              </div>
              <h3 className="text-md sm:text-lg font-bold text-[#1a1a2e]">"Ela monta seu plano completo"</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                A <span className="text-[#F97316] font-bold">Athena</span> gera seu cronograma semanal, sua primeira Missão do Dia e já identifica o que você precisa atacar primeiro baseado no edital real da PRF.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-black text-[#F59E0B] opacity-40 font-mono">03</span>
              </div>
              <h3 className="text-md sm:text-lg font-bold text-[#1a1a2e]">"Você estuda com foco total"</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Todo dia uma missão clara com tarefas calibradas. Questões, revisões, flashcards e simulados na ordem certa. A <span className="text-[#F97316] font-bold">Athena</span> ajusta o plano toda semana.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 6 — Grade de funcionalidades */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E2E8F0]/30 scroll-mt-6" id="funcionalidades">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight">
              Tudo que você precisa para passar na PRF
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm">
              Uma plataforma completa. Nada que você não vá usar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 text-left">
            
            {[
              { title: "Banco de Questões PRF", desc: "Questões reais de provas anteriores no estilo CEBRASPE, organizadas por disciplina e tópico" },
              { title: "Cronograma com IA", desc: "Gerado e recalibrado automaticamente toda semana com base no edital e no seu desempenho" },
              { title: "Missão do Dia", desc: "Tarefas diárias calibradas com impacto calculado na sua chance de aprovação" },
              { title: "Revisão Espaçada", desc: "Sistema que revisa o conteúdo antes que você esqueça, no momento exato" },
              { title: "Flashcards Inteligentes", desc: "6 modos de memorização incluindo Lei Seca e flashcards gerados pela IA" },
              { title: "Simulados CEBRASPE", desc: "Simulados completos com a penalização real de -1 por erro" },
              { title: "Calculadora de Risco", desc: "Descubra seu placar líquido e aprenda quando deixar em branco" },
              { title: "Modo Foco Pomodoro", desc: "Timer integrado ao estudo para sessões de alta concentração" },
              { title: "Athena 24h", desc: "Mentora de IA disponível a qualquer hora para dúvidas e estratégia" },
              { title: "Biblioteca Inteligente", desc: `Suba seus PDFs e a Athena cria questões baseadas nos seus materiais` },
              { title: "Nível de Aprovação", desc: "Métrica única que traduz todo seu progresso em chance real de passar" },
              { title: "Diagnóstico CEBRASPE", desc: "Análise do seu índice de risco de chute e eficiência de assertividade" }
            ].map((feature, id) => (
              <div key={id} className="p-5.5 bg-white border-[0.5px] border-[#E2E8F0] rounded-xl hover:shadow-md transition-all scale-hover text-left space-y-2.5">
                <div className="p-2 bg-amber-500/10 rounded-lg w-max shrink-0">
                  <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]/10" />
                </div>
                <strong className="block text-sm font-bold text-[#1a1a2e]">{feature.title}</strong>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {/* Replace "Athena" word to match color styling correctly */}
                  {feature.desc.includes("Athena") ? (
                    <span>
                      {feature.desc.split("Athena")[0]}
                      <span className="text-[#F97316] font-semibold">Athena</span>
                      {feature.desc.split("Athena")[1]}
                    </span>
                  ) : feature.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SEÇÃO 7 — Progresso visual (diferencial único) */}
      <section className="bg-[#F8FAFC] py-20 sm:py-28 scroll-mt-6 border-b border-[#E2E8F0]" id="progresso">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border-[0.5px] border-[#22C55E]/20 rounded-full text-[11px] font-mono font-bold text-[#22C55E]">
                MEU PROGRESSO
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
                Veja sua curva de aprovação crescer dia a dia
              </h3>
              <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                O ProvaX AI não mostra só quantas questões você acertou. Ele calcula seu Nível de Aprovação real — comparando seu desempenho com as notas de corte históricas da PRF. Você vê exatamente se está no caminho para ser aprovado.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-[#1a1a2e]">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                  <span>Nível de Aprovação baseado nas notas de corte reais da PRF</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                  <span>Curva de evolução diária com projeção de aprovação</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4.5 h-4.5 text-[#22C55E] stroke-[2.5] shrink-0" />
                  <span>Diagnóstico CEBRASPE: índice de risco de chute e placar líquido</span>
                </li>
              </ul>
            </div>

            {/* Right mockup visual: Progresso dashboard screen */}
            <div className="lg:col-span-6">
              <div className="bg-white border-[0.5px] border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden p-5 space-y-5 text-left">
                
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-[#64748B] uppercase">EVOLUÇÃO ESTATÍSTICA</span>
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#1a1a2e]">CURVA DE EVOLUÇÃO DA APROVAÇÃO · Últimos 5 Ciclos</h4>
                </div>

                {/* Simulated Growth Chart plot */}
                <div className="relative border-b border-l border-[#E2E8F0]/80 h-32 flex items-end justify-between font-mono text-[8px] text-[#64748B] pt-4 px-2 pb-1 bg-slate-50/50 rounded-lg">
                  
                  {/* Dotted target approval line at 75% score */}
                  <div className="absolute top-8 left-0 right-0 border-t border-dashed border-[#22C55E]/45 z-0 flex justify-between items-center px-1">
                    <span className="text-[7px] text-[#22C55E] font-bold leading-none bg-white px-1">75% (Aprovado)</span>
                  </div>

                  {/* Growth Line simulated visually with simple flex bars and marked points */}
                  <div className="flex-1 flex justify-around items-end h-full relative z-10">
                    {[
                      { cycle: "Dia 1", val: 35 },
                      { cycle: "Dia 2", val: 38.4 },
                      { cycle: "Dia 3", val: 42.1 },
                      { cycle: "Dia 4", val: 44 },
                      { cycle: "Dia 5", val: 48.5 }
                    ].map((step, id) => (
                      <div key={id} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="relative flex flex-col items-center">
                          <span className="text-[8px] font-bold text-[#1a1a2e] block mb-0.5">{step.val}%</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-white shadow-sm" />
                          <div className="w-1 bg-[#22C55E]/20 rounded-t" style={{ height: `${step.val * 0.9}px` }} />
                        </div>
                        <span className="text-[7.5px] uppercase block tracking-wider mt-1">{step.cycle}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom card: DIAGNÓSTICO CEBRASPE */}
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-sm">
                  <div className="text-left space-y-1">
                    <span className="text-[8px] font-mono font-bold tracking-wider text-[#64748B] uppercase block">DIAGNÓSTICO CEBRASPE</span>
                    <p className="text-[9.5px] text-[#1a1a2e] font-bold">Líquido de Assertividade: <span className="text-[#22C55E]">6 pts</span> · Taxa de Risco: <span className="text-red-500">25%</span></p>
                  </div>
                  <div>
                    <span className="text-[7.5px] text-[#F59E0B] bg-[#FEF3C7] border border-[#F59E0B]/30 px-2 py-1 rounded font-mono font-bold block uppercase tracking-wider">CONSERVADOR</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 8 — Depoimentos */}
      <section className="bg-white py-20 sm:py-28 border-b border-[#E2E8F0]/35 scroll-mt-6" id="depoimentos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
            <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-widest font-extrabold block">QUEM USA DEPOIMENTOS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight">
              O que candidatos estão dizendo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Depoimento 1 */}
            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left space-y-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "Estudei 8 meses sozinho sem resultado. Em 3 semanas com o ProvaX, a <span className="text-[#F97316] font-semibold">Athena</span> identificou que eu estava desperdiçando tempo em matérias de baixo peso. Meu Nível de Aprovação subiu 18pp."
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white font-extrabold flex items-center justify-center text-xs">
                  CM
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-[#1a1a2e] font-bold">Carlos M.</strong>
                  <span className="text-[10px] text-[#64748B] block font-mono">Candidato ao cargo de Agente PRF</span>
                  <div className="text-amber-500 text-[10px] mt-0.5">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left space-y-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "O cronograma gerado pela <span className="text-[#F97316] font-semibold">Athena</span> é o que eu precisava desde o início. Ela distribui as matérias de forma inteligente e me avisa quando preciso revisar antes de esquecer. É como ter um professor particular."
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#1a1a2e] font-extrabold flex items-center justify-center text-xs">
                  AL
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-[#1a1a2e] font-bold">Ana L.</strong>
                  <span className="text-[10px] text-[#64748B] block font-mono">Candidata PRF — 2ª tentativa</span>
                  <div className="text-amber-500 text-[10px] mt-0.5">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left space-y-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "A Calculadora de Risco CEBRASPE me fez entender que deixar em branco às vezes é melhor que chutar. Esse detalhe sozinho mudou minha estratégia de prova."
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#22C55E] text-white font-extrabold flex items-center justify-center text-xs">
                  RT
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-[#1a1a2e] font-bold">Rafael T.</strong>
                  <span className="text-[10px] text-[#64748B] block font-mono">Aprovado na 1ª fase PRF</span>
                  <div className="text-amber-500 text-[10px] mt-0.5">★★★★★</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 9 — Preços */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC] scroll-mt-6" id="precos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-widest font-extrabold block">PREMIUM ACCELERATOR</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] tracking-tight">
              Adquira seu Painel de Especialista
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Turbine suas chances de aprovação liberando nosso simulador adaptativo por IA e mentoria ilimitada <span className="text-[#F97316]">Athena</span>.
            </p>
          </div>

          {/* Test drive premium banner */}
          <div className="max-w-4xl mx-auto mb-12 bg-[#FEF3C7] border border-[#F59E0B] rounded-xl p-4 text-center font-sans text-xs sm:text-sm text-[#92400E] font-semibold">
            🎁 7 Dias de Teste Grátis no Plano Premium AI — Experimente sem compromisso. Cancele com um clique se não desejar continuar.
          </div>

          {/* Plans Three Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch" id="pricing-matrix">
            
            {/* Plan 1 Gratuitio */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-3xl flex flex-col justify-between space-y-8 shadow-sm text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] block">Gratuito</h3>
                  <p className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-bold mt-1">Plano Base</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-[#64748B]">R$</span>
                  <span className="text-4xl font-black text-[#1a1a2e]">0,00</span>
                  <span className="text-xs text-[#64748B]">/mês</span>
                </div>

                <div className="h-[0.5px] bg-[#E2E8F0]" />

                <ul className="space-y-3.5 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Acesso a 5 questões diárias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Plano de estudos padrão genérico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Até 3 mensagens diárias com a <span className="text-[#F97316]">Athena</span></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Flashcards pré-programados limitados</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-[#64748B] hover:text-[#1a1a2e] border border-[#E2E8F0] hover:border-slate-350 bg-white font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                Plano gratuito
              </button>
            </div>

            {/* Plan 2 Essencial */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-3xl flex flex-col justify-between space-y-8 shadow-sm text-left relative">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] block">Essencial</h3>
                  <p className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-wider font-bold mt-1">Mais Escolhido</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-[#64748B]">R$</span>
                  <span className="text-4xl font-black text-[#1a1a2e]">49,90</span>
                  <span className="text-xs text-[#64748B]">/mês</span>
                </div>

                <div className="h-[0.5px] bg-[#E2E8F0]" />

                <ul className="space-y-3.5 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Resolução ilimitada de questões da PRF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Onboarding completo e cronograma personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Flashcards em todos os modos e Lei Seca</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Suporte para até 50 mensagens diárias com a <span className="text-[#F97316]">Athena</span></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Histórico de progresso e estatísticas básicas</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-[#1a1a2e] hover:text-[#19192c] border border-slate-300 font-bold bg-[#F8FAFC] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
              >
                Assinar Essencial
              </button>
            </div>

            {/* Plan 3 Athena Gold */}
            <div className="p-6 sm:p-8 bg-white border-2 border-[#F59E0B] rounded-3xl flex flex-col justify-between space-y-8 shadow-md text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#F59E0B] rounded-full text-[8.5px] font-black text-[#1a1a2e] font-mono tracking-widest uppercase block leading-none">
                A MAIS OFERTADA
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] block">A Athena Gold</h3>
                  <p className="text-[10px] font-mono text-[#F97316] uppercase tracking-wider font-bold mt-1">Acesso Supremo</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-[#64748B]">R$</span>
                  <span className="text-4xl font-black text-[#1a1a2e]">97,00</span>
                  <span className="text-xs text-[#64748B]">/mês</span>
                </div>

                <div className="h-[0.5px] bg-[#E2E8F0]" />

                <ul className="space-y-3.5 text-xs text-[#1a1a2e]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="font-bold">Mentora estratégica <span className="text-[#F97316]">Athena</span> 100% ILIMITADA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="font-bold">Simulados ilimitados e gerados sob demanda por IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Análise preditiva CEBRASPE e probabilidade de aprovação real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Biblioteca inteligente de PDFs e materiais de leitura por IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Geração personalizada de questões e flashcards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>Acesso antecipado a novas funcionalidades</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-white bg-[#1a1a2e] hover:bg-[#25253c] font-black rounded-xl transition-all hover:scale-[1.015] cursor-pointer text-center shadow-lg"
              >
                Começar 7 dias grátis →
              </button>
            </div>

          </div>

          <p className="text-center font-mono text-[10.5px] text-[#64748B] mt-12">
            Pagamento seguro via Stripe · Sem fidelidade · Cancele quando quiser
          </p>

        </div>
      </section>

      {/* SEÇÃO 10 — CTA final */}
      <section className="bg-[#1a1a2e] py-20 sm:py-28 text-center text-white relative z-10 overflow-hidden" id="landing-cta-final">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            O edital não espera. <br />
            <span className="text-[#F59E0B]">Comece hoje com o método certo.</span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
            7 dias grátis. Sem cartão. Sem compromisso.
          </p>

          <button 
            onClick={onStartOnboarding}
            className="px-10 py-4.5 text-sm sm:text-base font-bold text-[#1a1a2e] bg-[#F59E0B] rounded-xl hover:scale-[1.02] shadow-xl shadow-amber-500/10 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            Criar minha conta grátis →
          </button>

          <div className="flex justify-center items-center gap-6 sm:gap-8 flex-wrap font-mono text-[10.5px] text-white/50 pt-8 max-w-md mx-auto">
            <span>🔒 Pagamento seguro</span>
            <span>✓ Cancele quando quiser</span>
            <span>⚡ Acesso imediato</span>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a2e] text-left text-xs text-white/50 border-t border-white/10 py-16 font-mono tracking-wider" id="landing-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Coluna 1 - Marca */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <Logo variant="compact" theme="dark" />
              </div>
              
              <p className="text-[11px] font-sans lowercase normal-case text-white/60 leading-relaxed max-w-sm">
                A plataforma de estudos com IA exclusiva para o concurso da PRF. Feita por quem passou.
              </p>
            </div>

            {/* Coluna 2 - Produto */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[11px] font-bold text-white uppercase block tracking-widest">Produto</span>
              <ul className="space-y-2 font-sans lowercase normal-case text-white/70">
                <li>
                  <a href="#como-funciona" onClick={(e) => handleScrollToSection(e, 'como-funciona')} className="hover:text-white transition-colors">Como funciona</a>
                </li>
                <li>
                  <a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="hover:text-white transition-colors">Funcionalidades</a>
                </li>
                <li>
                  <a href="#precos" onClick={(e) => handleScrollToSection(e, 'precos')} className="hover:text-white transition-colors">Preços</a>
                </li>
                <li>
                  <a href="#depoimentos" onClick={(e) => handleScrollToSection(e, 'depoimentos')} className="hover:text-white transition-colors">Depoimentos</a>
                </li>
              </ul>
            </div>

            {/* Coluna 3 - Legal */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[11px] font-bold text-white uppercase block tracking-widest">Legal</span>
              <ul className="space-y-2 font-sans lowercase normal-case text-white/70">
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors">Contato: contato@provaxai.com.br</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40">
            <span>© 2026 ProvaX AI. Todos os direitos reservados. · Desenvolvido por SYNTRO</span>
            <span>Preparação estratégica com foco na aprovação.</span>
          </div>

        </div>
      </footer>

      {/* Persistent floating bottom mobile viewport CTA button */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-4 inset-x-4 z-40 md:hidden bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4"
            id="mobile-bottom-persistent-cta"
          >
            <div className="text-left font-mono">
              <span className="text-[9px] text-[#F59E0B] font-bold block leading-none uppercase">ProvaX AI</span>
              <span className="text-[11px] text-[#1a1a2e] font-extrabold block mt-0.5">Estude Grátis p/ PRF</span>
            </div>
            <button 
              onClick={onStartOnboarding}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1a1a2e] rounded-xl flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Estudar Grátis</span>
              <ArrowRight className="w-3 h-3 text-amber-500 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
