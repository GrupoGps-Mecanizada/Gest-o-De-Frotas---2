/**
 * GF — MaintenanceTracker Page
 */
const { useState } = React;
const { AlertOctagon, Search, X, BarChart3, ArrowLeft } = lucide;
const MaintenanceTracker = () => {
    const { vagas } = GF.useFleet();
    const [searchText, setSearchText] = useState('');
    const [selectedEquip, setSelectedEquip] = useState(null);
    GF.useBackHandler(!!selectedEquip, () => setSelectedEquip(null));
    const calculateStats = () => {
        const stats = { totalTime: 0, totalWorking: 0, totalMaint: 0, rankingFreq: [], rankingTime: [], equipList: [] };
        const maintMap = {};
        vagas.forEach(v => {
            if (v.eventos) {
                v.eventos.forEach(evt => {
                    const evtStatus = GF.normalizeStatus(evt.status || evt.descricao, v.nome); const duration = GF.timeToMinutes(evt.tempoTotal); stats.totalTime += duration;
                    if (evtStatus === 'motor ligado' || evtStatus === 'motor secundário ligado') stats.totalWorking += duration;
                    if (evtStatus === 'em manutenção') {
                        stats.totalMaint += duration; if (!maintMap[v.nome]) maintMap[v.nome] = { name: v.nome, placa: v.placa, count: 0, time: 0, events: [] };
                        maintMap[v.nome].count++; maintMap[v.nome].time += duration;
                        maintMap[v.nome].events.push({ descricao: evt.descricao || evt.status || 'Manutenção', dataInicio: evt.dataInicio || '--', dataFim: evt.dataFim || '--', duration });
                    }
                });
            }
        });
        stats.equipList = Object.values(maintMap).sort((a, b) => b.time - a.time);
        stats.rankingFreq = [...stats.equipList].sort((a, b) => b.count - a.count).slice(0, 5);
        stats.rankingTime = [...stats.equipList].sort((a, b) => b.time - a.time).slice(0, 5);
        return stats;
    };
    const data = calculateStats();
    const efficiency = data.totalTime > 0 ? ((data.totalWorking / data.totalTime) * 100).toFixed(1) : 0;
    const maintPct = data.totalTime > 0 ? ((data.totalMaint / data.totalTime) * 100).toFixed(1) : 0;
    const filteredEquips = data.equipList.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()) || e.placa.toLowerCase().includes(searchText.toLowerCase()));
    const activeEquip = selectedEquip ? data.equipList.find(e => e.name === selectedEquip) : null;
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 animate-fade-in">
            <div className="flex items-center gap-4 mb-8"><div className="bg-amber-600 p-3 rounded-xl text-white shadow-lg shadow-amber-500/20"><AlertOctagon size={28} /></div><div><h1 className="text-2xl font-bold text-slate-800">Gestão de Manutenção</h1><p className="text-slate-500 text-sm">Monitoramento de ativos em manutenção e eficiência real</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"><span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Eficiência Real (Produção)</span><div className="text-4xl font-bold text-slate-800 mt-2">{efficiency}%</div><div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${efficiency}%` }}></div></div><p className="text-xs text-slate-400 mt-2">Auto Vácuo (Sucção) + Alta Pressão (Motor Secundário)</p></div>
                <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm"><span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tempo em Manutenção</span><div className="text-4xl font-bold text-slate-800 mt-2">{maintPct}%</div><div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden"><div className="bg-amber-500 h-full" style={{ width: `${maintPct}%` }}></div></div><p className="text-xs text-slate-400 mt-2">{GF.formatMinutes(data.totalMaint)} do tempo total da frota</p></div>
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm"><span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ativos Monitorados</span><div className="text-4xl font-bold text-slate-800 mt-2">{vagas.length}</div><p className="text-xs text-slate-400 mt-2"><span className="text-amber-600 font-bold">{data.equipList.length}</span> com registros de manutenção</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Search size={16} className="text-amber-500" /> Equipamentos com Manutenção</h3>
                    <div className="relative mb-4"><input type="text" placeholder="Buscar por nome ou placa..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm pl-9 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" value={searchText} onChange={e => setSearchText(e.target.value)} /><Search size={16} className="absolute left-3 top-3 text-slate-400" />
                        {searchText && <button onClick={() => setSearchText('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"><X size={16} /></button>}</div>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredEquips.length === 0 ? <p className="text-center text-slate-400 text-sm py-6">Nenhum equipamento encontrado.</p>
                            : filteredEquips.map((item, i) => (
                                <div key={i} onClick={() => setSelectedEquip(selectedEquip === item.name ? null : item.name)} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-amber-50 ${selectedEquip === item.name ? 'bg-amber-50 border-l-4 border-amber-500 shadow-sm' : 'border border-slate-100'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.time > 60 ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                                    <div className="flex-1 min-w-0"><div className="text-sm font-bold text-slate-700 truncate">{item.name}</div><div className="text-[10px] font-mono text-slate-400">{item.placa}</div></div>
                                    <div className="text-right shrink-0"><div className="text-xs font-bold text-amber-600">{item.count}x</div><div className="text-[10px] text-slate-400">{GF.formatMinutes(item.time)}</div></div>
                                </div>))}
                    </div></div>
                <div className="lg:col-span-2">
                    {activeEquip ? (
                        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col lg:relative lg:inset-auto lg:bg-transparent lg:block animate-slide-in-right lg:animate-fade-in p-4 lg:p-0 overflow-y-auto lg:overflow-visible">
                            <div className="flex items-center gap-3 mb-6 lg:hidden sticky top-0 bg-slate-50 z-10 py-2 border-b border-slate-200"><button onClick={() => setSelectedEquip(null)} className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600"><ArrowLeft size={20} /></button><h3 className="font-bold text-slate-800">Detalhes do Ativo</h3></div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100"><div><h3 className="text-lg font-bold text-slate-800">{activeEquip.name}</h3><p className="text-sm font-mono text-slate-400">{activeEquip.placa}</p></div><div className="flex items-center gap-4"><div className="text-center"><div className="text-2xl font-bold text-amber-600">{activeEquip.count}</div><div className="text-[10px] text-slate-400 uppercase">Ocorrências</div></div><div className="flex items-center gap-4"><div className="text-center hidden sm:block"><div className="text-xs text-slate-400 uppercase font-bold">Total Parado</div><div className="text-lg font-bold text-amber-600">{GF.formatMinutes(activeEquip.time)}</div></div><button onClick={() => setSelectedEquip(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hidden lg:block"><X size={20} /></button></div></div></div>
                                <table className="w-full text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3 text-left rounded-l-lg">#</th><th className="p-3 text-left">Descrição</th><th className="p-3 text-center">Início</th><th className="p-3 text-center">Fim</th><th className="p-3 text-center rounded-r-lg">Duração</th></tr></thead>
                                    <tbody className="divide-y divide-slate-100">{activeEquip.events.map((evt, j) => (<tr key={j} className="hover:bg-slate-50"><td className="p-3 text-slate-400 font-bold">{j + 1}</td><td className="p-3 font-medium text-slate-700">{evt.descricao}</td><td className="p-3 text-center text-slate-500 font-mono">{evt.dataInicio}</td><td className="p-3 text-center text-slate-500 font-mono">{evt.dataFim}</td><td className="p-3 text-center"><span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{GF.formatMinutes(evt.duration)}</span></td></tr>))}</tbody></table></div></div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2"><BarChart3 size={18} className="text-amber-500" /> Top 5 - Mais Manutenção</h3>
                            <div className="space-y-3">{data.rankingTime.map((item, i) => (<div key={i} onClick={() => setSelectedEquip(item.name)} className="flex items-center gap-3 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"><div className={`font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full ${i < 3 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div><div className="flex-1 min-w-0"><div className="text-sm font-bold text-slate-700 truncate">{item.name}</div><div className="text-[10px] font-mono text-slate-400">{item.placa}</div></div><span className="text-sm font-bold text-red-600">{GF.formatMinutes(item.time)}</span></div>))}
                                {data.rankingTime.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Sem registros.</p>}</div></div>)}
                </div></div></div>);
};
window.GF.MaintenanceTracker = MaintenanceTracker;
console.log('✅ [GF] MaintenanceTracker loaded');
