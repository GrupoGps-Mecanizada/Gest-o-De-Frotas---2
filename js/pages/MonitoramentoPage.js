/**
 * GF — MonitoramentoPage
 * Main monitoring page with equipment cards, search, filters, and detail panel
 */
const { useState, useRef, useMemo } = React;
const { Search, Filter, ChevronDown, RefreshCw, MonitorPlay, Truck } = lucide;

const MonitoramentoPage = () => {
    const { vagas, loading, refreshData, filters, updateFilters } = GF.useFleet();
    const [selectedEquip, setSelectedEquip] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const scrollRef = useRef(null);
    const scrollDirection = GF.useScrollDirection(scrollRef);

    GF.useBackHandler(!!selectedEquip, () => setSelectedEquip(null));
    GF.useBackHandler(showFilters, () => setShowFilters(false));

    const activeEquipment = selectedEquip ? vagas.find(v => v.id === selectedEquip.id) || selectedEquip : null;

    const uniqueStatuses = useMemo(() => {
        const statuses = new Set();
        vagas.forEach(v => { if (v.status) statuses.add(v.status); });
        return Array.from(statuses).sort();
    }, [vagas]);

    const filteredVagas = vagas.filter(v => {
        const matchesText = v.nome.toLowerCase().includes(filterText.toLowerCase()) ||
            v.placa.toLowerCase().includes(filterText.toLowerCase());
        if (selectedStatus === 'all') return matchesText;
        const matchesStatus = (v.status === selectedStatus) || (GF.normalizeStatus(v.status, v.nome) === selectedStatus);
        return matchesText && matchesStatus;
    });

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50">
                <div className={`flex-shrink-0 z-20 relative transition-all duration-300 ease-in-out overflow-hidden md:max-h-[400px] md:opacity-100 ${scrollDirection === 'down' ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'}`}>
                    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
                        <div className="mb-4 md:mb-6 flex flex-row justify-between items-center gap-2">
                            <div className="min-w-0">
                                <h1 className="text-lg md:text-2xl font-bold text-slate-800 tracking-tight truncate">Monitoramento</h1>
                                <p className="text-slate-500 text-xs md:text-sm mt-0.5 hidden sm:block">Visão geral da operação em tempo real</p>
                            </div>
                            <button onClick={() => refreshData()} className="p-2 md:hidden bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all active:scale-95 shadow-sm shrink-0" title="Recarregar Dados">
                                <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                    <Search className="text-slate-400 shrink-0 mr-2" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Vaga ou Placa..."
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                        className="w-full bg-transparent border-none focus:outline-none text-sm py-2 text-slate-700 placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="hidden md:flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 hover:border-blue-300 transition-colors">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Status Real</span>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer py-1"
                                    >
                                        <option value="all">Todos os Status</option>
                                        <optgroup label="Status da Telemetria">
                                            {uniqueStatuses.map((s, i) => (
                                                <option key={i} value={s}>{s}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Categorias">
                                            <option value="motor ligado">Trabalhando</option>
                                            <option value="parado">Parado</option>
                                            <option value="em manutenção">Em Manutenção</option>
                                            <option value="indisponível / sem apropriação">Sem Apropriação</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Filter size={14} />
                                    <span>Filtros</span>
                                    <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>

                                <div className="hidden md:flex items-center gap-3">
                                    <div className="h-8 w-[1px] bg-slate-200"></div>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Data</span>
                                        <input type="date" value={filters.date} onChange={(e) => updateFilters({ date: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer" />
                                    </div>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Início</span>
                                        <input type="time" value={filters.startTime} onChange={(e) => updateFilters({ startTime: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer" />
                                    </div>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Fim</span>
                                        <input type="time" value={filters.endTime} onChange={(e) => updateFilters({ endTime: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer" />
                                    </div>
                                    <button onClick={() => refreshData()} className="p-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all active:scale-95 shadow-sm" title="Recarregar Dados">
                                        <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="md:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fade-in">
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Data</span>
                                        <input type="date" value={filters.date} onChange={(e) => updateFilters({ date: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer flex-1 min-w-0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Início</span>
                                            <input type="time" value={filters.startTime} onChange={(e) => updateFilters({ startTime: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer flex-1 min-w-0" />
                                        </div>
                                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Fim</span>
                                            <input type="time" value={filters.endTime} onChange={(e) => updateFilters({ endTime: e.target.value })} className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer flex-1 min-w-0" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Status Real</span>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer flex-1 min-w-0"
                                        >
                                            <option value="all">Todos os Status</option>
                                            <optgroup label="Telemetria">
                                                {uniqueStatuses.map((s, i) => (
                                                    <option key={i} value={s}>{s}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Categorias">
                                                <option value="motor ligado">Trabalhando</option>
                                                <option value="parado">Parado</option>
                                                <option value="em manutenção">Em Manutenção</option>
                                                <option value="indisponível / sem apropriação">Sem Apropriação</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <MonitorPlay size={20} className="text-blue-600" />
                            Painel de Monitoramento
                        </h3>

                        {filterText && (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                Filtro: {filterText} ({filteredVagas.length})
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredVagas.length === 0 ? (
                        <div className="text-center p-10 text-slate-400">
                            <Truck size={48} className="mx-auto mb-3 opacity-20" />
                            <p>Nenhum veículo encontrado com os filtros atuais.</p>
                            <button onClick={() => { setFilterText(''); updateFilters({ startTime: '', endTime: '' }); }} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Limpar Filtros</button>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${selectedEquip ? 'xl:grid-cols-2' : 'xl:grid-cols-4'} gap-5 transition-all pb-6`}>
                            {filteredVagas.map((vaga) => (
                                <GF.EquipmentCard
                                    key={vaga.id}
                                    data={vaga}
                                    onClick={setSelectedEquip}
                                    isSelected={selectedEquip?.id === vaga.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activeEquipment && (
                <div className="fixed inset-0 w-full z-50 md:relative md:w-[420px] md:inset-auto border-l border-slate-200 bg-white h-full flex-shrink-0 transition-all duration-300 shadow-2xl">
                    <GF.DetailPanel equipment={activeEquipment} onClose={() => setSelectedEquip(null)} />
                </div>
            )}
        </div>
    );
};

window.GF.MonitoramentoPage = MonitoramentoPage;
console.log('✅ [GF] MonitoramentoPage loaded');
