/**
 * GF — TimelineRow Component
 * Horizontal 24h timeline row for list view
 */
const { Truck } = lucide;

const TimelineRow = ({ data, onClick, isSelected, currentTimeStr }) => {
    const statusKey = GF.normalizeStatus(data.status, data.nome);
    const style = GF.STATUS_COLORS[statusKey] || GF.STATUS_COLORS['default'];
    const label = data.status || 'Sem Dados';
    const events = data.eventos || [];

    return (
        <div
            onClick={() => onClick(data)}
            className={`bg-white border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition-colors p-3 flex items-center gap-4 cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
        >
            {/* Col 1: Identification */}
            <div className="w-64 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <Truck size={16} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-800 truncate" title={data.nome}>{data.nome}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${style.icon}`}></span>
                    <span className="text-xs text-slate-500 font-mono">{data.placa}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} uppercase font-bold`}>
                        {label}
                    </span>
                </div>
            </div>

            {/* Col 2: 24h Timeline */}
            <div className="flex-1 h-8 bg-slate-100 rounded-md overflow-hidden flex relative min-w-[200px]">
                {events.length === 0 ? (
                    <div className="w-full flex items-center justify-center text-[10px] text-slate-400">Sem eventos</div>
                ) : (
                    events.map((evt, idx) => {
                        const isLastEvent = idx === events.length - 1;
                        let durationMins = 0;

                        if (isLastEvent && !evt.dataFim) {
                            const start = GF.timeToMinutes(evt.dataInicio);
                            const now = currentTimeStr ? GF.timeToMinutes(currentTimeStr) : start + 1;
                            let diff = now - start;
                            if (diff < 0) diff += 1440;
                            durationMins = Math.max(diff, 0.5);
                        } else {
                            durationMins = GF.timeToMinutes(evt.tempoTotal);
                        }

                        const flexGrow = Math.max(durationMins, 0.01);
                        const evtKey = GF.normalizeStatus(evt.status || evt.descricao, data.nome);
                        const color = GF.STATUS_COLORS[evtKey]?.icon.replace('bg-', 'bg-') || 'bg-slate-300';

                        return (
                            <div
                                key={idx}
                                className={`${color} h-full border-r border-white/20 relative group`}
                                style={{ flexGrow: flexGrow }}
                                title={`${evt.descricao} (${evt.dataInicio} - ${evt.dataFim || 'Agora'})`}
                            >
                                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                    {evt.descricao}
                                </div>
                            </div>
                        );
                    })
                )}
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                    <div className="w-px h-2 bg-slate-300/50 mt-auto"></div>
                    <div className="w-px h-2 bg-slate-300/50 mt-auto"></div>
                    <div className="w-px h-2 bg-slate-300/50 mt-auto"></div>
                </div>
            </div>

            {/* Col 3: Current Status */}
            <div className="w-24 text-right flex-shrink-0">
                <div className="text-xs font-bold text-slate-700">
                    {events.length > 0 ? (events[events.length - 1].status || events[events.length - 1].descricao) : '--'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                    {events.length > 0 ? events[events.length - 1].dataInicio : '--:--'}
                </div>
            </div>
        </div>
    );
};

window.GF.TimelineRow = TimelineRow;
