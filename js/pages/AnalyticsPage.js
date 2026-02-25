/**
 * GF — AnalyticsPage (Dashboard)
 */
const { Activity, AlertTriangle, AlertOctagon, Truck, Clock, PieChart, History, BarChart3 } = lucide;
const AnalyticsPage = () => {
    const { vagas, loading } = GF.useFleet();
    if (loading && vagas.length === 0) return (<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>);
    let totalMinFleet = 0, workingMin = 0, stoppedMin = 0, maintMin = 0, idleMin = 0, secondaryMin = 0;
    const perEquip = []; let apropriados = 0, naoApropriados = 0;
    const hourlyEvents = new Array(24).fill(0);
    const statusCounts = { trabalhando: 0, parado: 0, manutencao: 0, semApropriacao: 0 };
    vagas.forEach(v => {
        let eqW = 0, eqS = 0, eqM = 0, eqT = 0, eqI = 0, eqSec = 0, hasData = false;
        if (v.eventos && v.eventos.length > 0) {
            v.eventos.forEach(evt => {
                const es = GF.normalizeStatus(evt.status || evt.descricao, v.nome); const dur = GF.timeToMinutes(evt.tempoTotal); eqT += dur;
                const sm = ((evt.dataInicio || '').match(/(\d{1,2}):\d{2}/)); if (sm) { const hr = parseInt(sm[1], 10); if (hr >= 0 && hr < 24) hourlyEvents[hr]++; }
                if (es === 'motor ligado') { eqW += dur; statusCounts.trabalhando++; hasData = true; }
                else if (es === 'motor secundário ligado') { eqW += dur; eqSec += dur; statusCounts.trabalhando++; hasData = true; }
                else if (es === 'em manutenção') { eqM += dur; statusCounts.manutencao++; hasData = true; }
                else if (['parado ligado', 'parado', 'motor desligado', 'chave geral desligada', 'fora da planta', 'documentação', 'abastecimento', 'abastecimento (água) - lm', 'refeição'].includes(es)) { eqS += dur; statusCounts.parado++; hasData = true; }
                else if (['indisponível / sem apropriação', 'indisponível', 'sem apropriação'].includes(es)) { eqI += dur; statusCounts.semApropriacao++; }
                else { eqS += dur; statusCounts.parado++; hasData = true; }
            });
        }
        if (hasData) apropriados++; else naoApropriados++;
        totalMinFleet += eqT; workingMin += eqW; stoppedMin += eqS; maintMin += eqM; idleMin += eqI; secondaryMin += eqSec;
        const eff = eqT > 0 ? ((eqW / eqT) * 100).toFixed(1) : 0;
        perEquip.push({ name: v.nome, placa: v.placa, workMin: eqW, stoppedMin: eqS, maintMin: eqM, totalMin: eqT, efficiency: parseFloat(eff), secondaryMin: eqSec });
    });
    const wPct = totalMinFleet > 0 ? (workingMin / totalMinFleet) * 100 : 0;
    const sPct = totalMinFleet > 0 ? (stoppedMin / totalMinFleet) * 100 : 0;
    const mPct2 = totalMinFleet > 0 ? (maintMin / totalMinFleet) * 100 : 0;
    const iPct = totalMinFleet > 0 ? (idleMin / totalMinFleet) * 100 : 0;
    const tSnap = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
    const sW = (statusCounts.trabalhando / tSnap) * 100, sS = (statusCounts.parado / tSnap) * 100, sM = (statusCounts.manutencao / tSnap) * 100;
    const pie = `conic-gradient(#10b981 0% ${sW}%,#ef4444 ${sW}% ${sW + sS}%,#f59e0b ${sW + sS}% ${sW + sS + sM}%,#cbd5e1 ${sW + sS + sM}% 100%)`;
    const ranking = [...perEquip].filter(e => e.totalMin > 0).sort((a, b) => b.efficiency - a.efficiency).slice(0, 10);
    const maxH = Math.max(...hourlyEvents, 1); const hPct = hourlyEvents.map(v => Math.round((v / maxH) * 100));
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-500/20"><BarChart3 size={28} /></div>
                <div><h1 className="text-2xl font-bold text-slate-800">Dashboard Operacional</h1><p className="text-slate-500 text-sm">KPIs calculados com dados reais da telemetria</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[{ l: 'Produção Real', v: wPct.toFixed(1) + '%', c: 'emerald', ic: Activity, m: GF.formatMinutes(workingMin) + ' trabalhadas de ' + GF.formatMinutes(totalMinFleet) + ' totais', w: wPct },
                { l: 'Motor Desligado / Parado', v: sPct.toFixed(1) + '%', c: 'red', ic: AlertTriangle, m: GF.formatMinutes(stoppedMin) + ' paradas', w: sPct },
                { l: 'Manutenção', v: mPct2.toFixed(1) + '%', c: 'amber', ic: AlertOctagon, m: GF.formatMinutes(maintMin) + ' em manutenção', w: mPct2 }
                ].map((kpi, i) => <div key={i} className={`bg-white p-5 rounded-2xl border border-${kpi.c}-100 shadow-sm relative overflow-hidden group`}>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><kpi.ic size={60} className={`text-${kpi.c}-500`} /></div>
                    <span className={`text-xs font-bold text-${kpi.c}-600 uppercase tracking-wider`}>{kpi.l}</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">{kpi.v}</div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className={`bg-${kpi.c}-500 h-full`} style={{ width: `${kpi.w}%` }}></div></div>
                    <p className="text-[10px] text-slate-400 mt-2">{kpi.m}</p></div>)}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Truck size={60} className="text-slate-400" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frota Total</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">{vagas.length}</div>
                    <p className="text-[10px] text-slate-400 mt-2"><span className="text-emerald-600 font-bold">{apropriados} apropriados</span> · <span className="text-red-500 font-bold">{naoApropriados} sem dados</span></p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm"><span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Motor Secundário Ligado</span><div className="text-3xl font-bold text-slate-800 mt-2">{GF.formatMinutes(secondaryMin)}</div><div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full" style={{ width: `${totalMinFleet > 0 ? (secondaryMin / totalMinFleet) * 100 : 0}%` }}></div></div><p className="text-[10px] text-slate-400 mt-2">Tempo efetivo de jato/vácuo</p></div>
                <div className="bg-white p-5 rounded-2xl border border-yellow-100 shadow-sm"><span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Parado Ligado</span><div className="text-3xl font-bold text-slate-800 mt-2">{GF.formatMinutes(stoppedMin)}</div><div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full" style={{ width: `${sPct}%` }}></div></div><p className="text-[10px] text-slate-400 mt-2">Custo sem retorno operacional</p></div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sem Apropriação</span><div className="text-3xl font-bold text-slate-800 mt-2">{iPct.toFixed(1)}%</div><div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className="bg-slate-400 h-full" style={{ width: `${iPct}%` }}></div></div><p className="text-[10px] text-slate-400 mt-2">{GF.formatMinutes(idleMin)} — verifique conectividade</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Clock size={20} className="text-blue-600" /> Timeline de Atividade (24h)</h3><span className="text-[10px] text-slate-400 uppercase">Eventos por hora</span></div>
                <div className="overflow-x-auto pb-4 custom-scrollbar"><div className="h-52 min-w-[600px] flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2">
                    {hPct.map((val, hr) => {
                        let bc = 'bg-slate-300'; if (val > 20) bc = 'bg-indigo-300'; if (val > 50) bc = 'bg-indigo-500'; if (val > 80) bc = 'bg-indigo-600';
                        return (<div key={hr} className="flex-1 flex flex-col justify-end group cursor-pointer relative h-full"><div className={`w-full rounded-t-md transition-all duration-300 opacity-80 group-hover:opacity-100 ${bc}`} style={{ height: `${val || 4}%`, minHeight: '4px' }}></div><span className="text-[10px] text-slate-400 text-center mt-2 font-mono">{hr}h</span><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20"><div className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap"><span className="font-bold">{hourlyEvents[hr]} eventos</span></div><div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div></div></div>);
                    })}
                </div></div></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 w-full flex items-center gap-2"><PieChart size={16} className="text-indigo-500" /> Distribuição de Status</h3>
                    <div className="relative w-56 h-56 rounded-full shadow-inner mb-6 transition-all hover:scale-105 duration-500" style={{ background: pie }}>
                        <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg"><div className="text-center"><span className="block text-3xl font-bold text-slate-800">{vagas.length}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Vagas</span></div></div></div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        {[{ l: 'Produzindo', c: 'bg-emerald-500', v: Math.round(sW) }, { l: 'Parado', c: 'bg-red-500', v: Math.round(sS) }, { l: 'Manutenção', c: 'bg-amber-500', v: Math.round(sM) }, { l: 'Sem Dados', c: 'bg-slate-300', v: Math.round(100 - sW - sS - sM) }].map((s, i) =>
                            <div key={i} className="flex justify-between text-xs items-center p-2 bg-slate-50 rounded-lg"><span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${s.c}`}></span> {s.l}</span> <span className="font-bold">{s.v}%</span></div>)}
                    </div></div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><History size={16} className="text-blue-500" /> Produtividade (Top 10)</h3></div>
                    <div className="space-y-3">{ranking.map((v, i) => {
                        const wP = v.totalMin > 0 ? (v.workMin / v.totalMin) * 100 : 0; const sP2 = v.totalMin > 0 ? (v.stoppedMin / v.totalMin) * 100 : 0; const mP = v.totalMin > 0 ? (v.maintMin / v.totalMin) * 100 : 0;
                        return (<div key={i} className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-lg transition-colors"><div className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i < 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div><div className="flex-1 min-w-0"><div className="flex justify-between mb-1"><span className="text-sm font-bold text-slate-700 truncate">{v.name}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${v.efficiency >= 50 ? 'bg-emerald-100 text-emerald-700' : v.efficiency >= 20 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{v.efficiency}%</span></div><div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">{wP > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${wP}%` }}></div>}{sP2 > 0 && <div className="bg-red-400 h-full" style={{ width: `${sP2}%` }}></div>}{mP > 0 && <div className="bg-amber-400 h-full" style={{ width: `${mP}%` }}></div>}</div></div><div className="text-xs font-mono text-slate-400 border border-slate-200 px-2 py-1 rounded bg-white shrink-0">{v.placa}</div></div>);
                    })}{ranking.length === 0 && <div className="text-center text-slate-400 py-4">Sem dados</div>}</div></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Truck size={16} className="text-blue-500" /> Todos os Ativos</h3>
                <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="bg-slate-100 text-slate-500 font-semibold"><tr><th className="p-3 rounded-l-lg">Equipamento</th><th className="p-3">Placa</th><th className="p-3 text-center">Trab.</th><th className="p-3 text-center">Parado</th><th className="p-3 text-center">Manut.</th><th className="p-3 text-center">Motor 2º</th><th className="p-3 text-center">Total</th><th className="p-3 text-center" style={{ minWidth: '120px' }}>Distrib.</th><th className="p-3 text-center rounded-r-lg">Efic.</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{perEquip.sort((a, b) => b.efficiency - a.efficiency).map((eq, i) => {
                        const tw2 = eq.totalMin > 0 ? (eq.workMin / eq.totalMin) * 100 : 0; const ts2 = eq.totalMin > 0 ? (eq.stoppedMin / eq.totalMin) * 100 : 0; const tm2 = eq.totalMin > 0 ? (eq.maintMin / eq.totalMin) * 100 : 0;
                        return (<tr key={i} className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-700 max-w-[200px] truncate">{eq.name}</td><td className="p-3 font-mono text-slate-400">{eq.placa}</td><td className="p-3 text-center text-emerald-600 font-bold">{GF.formatMinutes(eq.workMin)}</td><td className="p-3 text-center text-red-500 font-bold">{GF.formatMinutes(eq.stoppedMin)}</td><td className="p-3 text-center text-amber-600 font-bold">{GF.formatMinutes(eq.maintMin)}</td><td className="p-3 text-center text-cyan-600 font-bold">{GF.formatMinutes(eq.secondaryMin)}</td><td className="p-3 text-center text-slate-600 font-bold">{GF.formatMinutes(eq.totalMin)}</td><td className="p-3"><div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">{tw2 > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${tw2}%` }}></div>}{ts2 > 0 && <div className="bg-red-400 h-full" style={{ width: `${ts2}%` }}></div>}{tm2 > 0 && <div className="bg-amber-400 h-full" style={{ width: `${tm2}%` }}></div>}</div></td><td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${eq.efficiency >= 50 ? 'bg-emerald-100 text-emerald-700' : eq.efficiency >= 20 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{eq.efficiency}%</span></td></tr>);
                    })}</tbody></table></div></div>
        </div>);
};
window.GF.AnalyticsPage = AnalyticsPage;
console.log('✅ [GF] AnalyticsPage loaded');
