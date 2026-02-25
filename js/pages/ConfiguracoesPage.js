/**
 * GF — ConfiguracoesPage
 */
const { useState } = React;
const { Settings, RefreshCw, Database, Bell, Download, CheckCircle } = lucide;
const ConfiguracoesPage = () => {
    const { vagas, isConnected, lastUpdated, refreshData } = GF.useFleet();
    const { addToast } = GF.useToast();
    const [pollingLocal, setPollingLocal] = useState(30);
    const [testResult, setTestResult] = useState(null);
    const [testLoading, setTestLoading] = useState(false);
    const handleTestConnection = async () => { setTestLoading(true); setTestResult(null); try { const start = Date.now(); const res = await GF.api.getVagas(); const elapsed = Date.now() - start; if (res && (res.success || res.vagas)) { setTestResult({ ok: true, msg: `Conectado com sucesso em ${elapsed}ms. ${(res.vagas || []).length} vagas retornadas.` }); addToast('Conexão com API validada!', 'success'); } else { setTestResult({ ok: false, msg: 'API não retornou dados válidos.' }); addToast('Falha na validação da API.', 'critical'); } } catch (e) { setTestResult({ ok: false, msg: `Erro: ${e.message}` }); addToast('Erro na conexão.', 'critical'); } finally { setTestLoading(false); } };
    const handleExport = () => { try { const exportData = { frota: vagas.map(v => ({ nome: v.nome, placa: v.placa, status: v.status, eventos: (v.eventos || []).length })), exportedAt: new Date().toISOString(), totalEquipamentos: vagas.length }; const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `frota-export-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); addToast('Dados exportados com sucesso!', 'success'); } catch (e) { addToast('Erro ao exportar dados.', 'critical'); } };
    const cacheStats = GF.cacheManager.getStats();
    const conflictStats = GF.conflictResolver.getStats();
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 animate-fade-in">
            <div className="flex items-center gap-4 mb-8"><div className="bg-slate-700 p-3 rounded-xl text-white shadow-lg"><Settings size={28} /></div><div><h1 className="text-2xl font-bold text-slate-800">Configurações</h1><p className="text-slate-500 text-sm">Ajustes do sistema e diagnóstico</p></div></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><RefreshCw size={16} className="text-blue-500" /> Intervalo de Polling</h3>
                    <div className="flex items-center gap-4 mb-3"><input type="range" min="10" max="120" value={pollingLocal} onChange={e => setPollingLocal(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer" /><span className="text-lg font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-mono">{pollingLocal}s</span></div>
                    <div className="flex justify-between text-[10px] text-slate-400"><span>10s (frequente)</span><span>120s (econômico)</span></div>
                    <p className="text-xs text-slate-400 mt-3">Define o intervalo entre as atualizações automáticas dos dados da frota.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Database size={16} className="text-emerald-500" /> Status da Conexão</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="text-xs text-slate-500">Status</span><span className={`text-xs font-bold flex items-center gap-1.5 ${isConnected ? 'text-emerald-600' : 'text-red-500'}`}><span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>{isConnected ? 'Online' : 'Offline'}</span></div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="text-xs text-slate-500">Última Atualização</span><span className="text-xs font-bold text-slate-700 font-mono">{lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : '--'}</span></div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="text-xs text-slate-500">Equipamentos</span><span className="text-xs font-bold text-slate-700">{vagas.length}</span></div>
                    </div>
                    <button onClick={handleTestConnection} disabled={testLoading} className="w-full mt-4 bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"><RefreshCw size={14} className={testLoading ? 'animate-spin' : ''} />{testLoading ? 'Testando...' : 'Testar Conexão'}</button>
                    {testResult && (<div className={`mt-3 p-3 rounded-lg text-xs font-medium ${testResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{testResult.msg}</div>)}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Bell size={16} className="text-amber-500" /> Testar Notificações</h3>
                    <div className="grid grid-cols-2 gap-2">{['info', 'success', 'warning', 'critical'].map(sev => (<button key={sev} onClick={() => addToast(`Teste de notificação: ${sev}`, sev)} className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:scale-105 active:scale-95 ${sev === 'info' ? 'bg-blue-100 text-blue-700' : sev === 'success' ? 'bg-emerald-100 text-emerald-700' : sev === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{sev}</button>))}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Download size={16} className="text-blue-500" /> Exportar Dados</h3>
                    <p className="text-xs text-slate-400 mb-4">Exporta um snapshot dos dados atuais da frota em formato JSON.</p>
                    <button onClick={handleExport} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"><Download size={16} /> Exportar JSON</button>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Estatísticas do Sistema</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl text-center"><span className="text-2xl font-bold text-slate-700">{cacheStats.size}</span><p className="text-[10px] text-slate-400 uppercase mt-1">Itens em Cache</p></div>
                        <div className="p-4 bg-slate-50 rounded-xl text-center"><span className="text-2xl font-bold text-slate-700">{cacheStats.hitRate}</span><p className="text-[10px] text-slate-400 uppercase mt-1">Cache Hit Rate</p></div>
                        <div className="p-4 bg-slate-50 rounded-xl text-center"><span className="text-2xl font-bold text-slate-700">{conflictStats.conflictsResolved}</span><p className="text-[10px] text-slate-400 uppercase mt-1">Conflitos Resolvidos</p></div>
                        <div className="p-4 bg-slate-50 rounded-xl text-center"><span className="text-2xl font-bold text-slate-700">{conflictStats.duplicatesRemoved}</span><p className="text-[10px] text-slate-400 uppercase mt-1">Duplicados Removidos</p></div>
                    </div></div>
            </div></div>);
};
window.GF.ConfiguracoesPage = ConfiguracoesPage;
console.log('✅ [GF] ConfiguracoesPage loaded');
