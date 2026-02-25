/**
 * GF — DetailPanel Component
 * Side panel showing detailed equipment information and event history
 */
const { useState, useEffect } = React;
const { X, Truck, Activity, Power, Clock, BarChart2, History, CalendarDays } = lucide;

const DetailPanel = ({ equipment, onClose }) => {
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [currentTimeStr, setCurrentTimeStr] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!equipment) return null;

    const statusKey = GF.normalizeStatus(equipment.status, equipment.nome);
    const label = equipment.status || 'Sem Dados';
    const style = GF.STATUS_COLORS[statusKey] || GF.STATUS_COLORS['default'];
    const events = equipment.eventos || [];

    return (
        <div className="h-full bg-white border-l border-slate-200 shadow-xl flex flex-col w-full animate-slide-in-right relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">VAGA SELECIONADA</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-1">{equipment.nome}</h2>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Truck size={14} />
                        <span className="text-sm font-mono font-medium">{equipment.placa}</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                    <X size={20} />
                </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 p-6 space-y-8">
                <div className={`p-6 rounded-2xl border ${style.bg} ${style.border.replace('border-', 'border-opacity-30 ')} relative overflow-hidden transition-all duration-300`}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className={`text-xs font-bold uppercase tracking-wide opacity-80 ${style.text}`}>Status Atual</span>
                            <div className={`p-2 rounded-full bg-white/50`}>
                                <Activity className={style.text} size={20} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className={`text-3xl font-bold block mb-1 ${style.text} tracking-tight`}>{label}</span>
                            <span className={`text-xs opacity-80 font-medium ${style.text}`}>
                                Monitoramento em tempo real
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
                            <div className="flex flex-col">
                                <span className={`text-[10px] uppercase font-bold opacity-60 ${style.text}`}>Motor</span>
                                <div className={`flex items-center gap-1.5 font-bold ${style.text}`}>
                                    <Power size={14} />
                                    {statusKey === 'trabalhando' ? 'Ligado' : 'Desligado'}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[10px] uppercase font-bold opacity-60 ${style.text}`}>Desde</span>
                                <div className={`flex items-center gap-1.5 font-bold ${style.text}`}>
                                    <Clock size={14} />
                                    {events.length > 0 ? events[events.length - 1].dataInicio : '--:--'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 ${style.icon.replace('bg-', 'bg-')}`}></div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Timeline do Dia
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">24h</span>
                    </div>

                    <div className="relative h-12 bg-slate-100 rounded-lg w-full overflow-hidden flex border border-slate-200">
                        {events.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 italic">Sem eventos registrados hoje</div>
                        ) : (
                            events.map((evt, idx) => {
                                const isLastEvent = idx === events.length - 1;
                                let durationMins = 0;

                                if (isLastEvent && !evt.dataFim && currentTimeStr) {
                                    const start = GF.timeToMinutes(evt.dataInicio);
                                    const now = GF.timeToMinutes(currentTimeStr);
                                    let diff = now - start;
                                    if (diff < 0) diff += 1440;
                                    durationMins = Math.max(diff, 0.5);
                                } else {
                                    durationMins = GF.timeToMinutes(evt.tempoTotal);
                                }

                                const flexGrow = durationMins > 0 ? durationMins : 0.5;
                                const evtKey = GF.normalizeStatus(evt.status || evt.descricao, equipment.nome);
                                const color = GF.STATUS_COLORS[evtKey]?.icon.replace('bg-', 'bg-') || 'bg-slate-300';

                                return (
                                    <div key={idx} className={`${color} h-full border-r border-white/20 hover:opacity-90 transition-opacity relative group`} style={{ flexGrow }}>
                                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl z-20 whitespace-nowrap">
                                            <span className="font-bold block mb-0.5">{evt.descricao}</span>
                                            <div className="flex gap-2 font-mono text-slate-300">
                                                <span>{evt.dataInicio}</span>
                                                <span>-</span>
                                                <span>{isLastEvent ? 'Agora' : evt.dataFim || '?'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 px-1 mt-1 font-mono">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>23:59</span>
                    </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <BarChart2 size={14} /> Última Comunicação
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                        {GF.formatDateTime(equipment.horario)}
                    </span>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <History size={16} className="text-blue-500" />
                        Últimos Eventos
                    </h3>
                    <div className="space-y-0 relative border-l-2 border-slate-100 ml-2 pl-6 py-1">
                        {events.slice().reverse().slice(0, 4).map((evt, idx) => {
                            const isCurrent = idx === 0;
                            const status = GF.normalizeStatus(evt.status || evt.descricao, equipment.nome);
                            const isWorking = status === 'trabalhando';

                            return (
                                <div key={idx} className="mb-6 last:mb-0 relative group">
                                    <span className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${isWorking ? 'bg-emerald-500' : 'bg-slate-300'} ${isCurrent ? 'animate-pulse' : ''}`} />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{evt.descricao}</p>
                                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                                Início: {evt.dataInicio}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${isCurrent ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {isCurrent ? 'Em andamento' : GF.formatDuration(evt.tempoTotal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {events.length === 0 && <p className="text-xs text-slate-400 italic">Sem eventos recentes.</p>}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                    onClick={() => setShowFullHistory(true)}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-slate-200"
                >
                    <CalendarDays size={16} /> Ver Histórico Completo
                </button>
            </div>

            {showFullHistory && (
                <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <History size={18} /> Histórico Completo
                        </h3>
                        <button onClick={() => setShowFullHistory(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 text-slate-500 font-semibold">
                                <tr>
                                    <th className="p-2 rounded-l-lg">Evento</th>
                                    <th className="p-2">Início</th>
                                    <th className="p-2">Fim</th>
                                    <th className="p-2 rounded-r-lg">Duração</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {events.slice().reverse().map((evt, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-2 font-medium text-slate-700">{evt.descricao}</td>
                                        <td className="p-2 text-slate-500">{evt.dataInicio}</td>
                                        <td className="p-2 text-slate-500">{evt.dataFim || '-'}</td>
                                        <td className="p-2 text-slate-500 font-mono">{i === 0 ? 'Atual' : GF.formatDuration(evt.tempoTotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

window.GF.DetailPanel = DetailPanel;
