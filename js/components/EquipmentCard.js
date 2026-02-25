/**
 * GF — EquipmentCard Component
 * Individual equipment card for the monitoring grid view
 */
const { useState, useEffect } = React;
const { MapPin, Truck, Clock } = lucide;

const EquipmentCard = ({ data, onClick, isSelected }) => {
    const [currentTimeStr, setCurrentTimeStr] = useState('');

    useEffect(() => {
        const updateTime = () => {
            setCurrentTimeStr(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const statusKey = GF.normalizeStatus(data.status, data.nome);
    const style = GF.STATUS_COLORS[statusKey] || GF.STATUS_COLORS['default'];
    const label = data.status || 'Sem Dados';

    return (
        <div
            onClick={() => onClick(data)}
            className={`bg-white rounded-xl border shadow-sm transition-all cursor-pointer overflow-hidden group relative flex flex-col justify-between
                ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-md' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}
            `}
        >
            <div className={`h-1.5 w-full ${style.icon}`} />

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border.replace('border-', 'border-opacity-20 ')}`}>
                        {label}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={16} className="text-blue-500" />
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug" title={data.nome}>
                            {data.nome}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 pl-6">
                        <Truck size={12} className="text-slate-400" />
                        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                            {data.placa}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>{GF.formatDateTime(data.horario)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${style.icon.replace('bg-', 'bg-')} animate-pulse`}></span>
                        <span className="text-[10px] text-slate-400 font-medium">Ao vivo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.GF.EquipmentCard = EquipmentCard;
