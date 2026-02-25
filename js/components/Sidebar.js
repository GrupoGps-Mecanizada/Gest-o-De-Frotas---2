/**
 * GF — Sidebar Component
 * Navigation sidebar with logo, menu items, and user profile
 */
const { useState } = React;
const { Activity, X, MonitorPlay, BarChart3, AlertOctagon, Bell, Settings, LogOut } = lucide;

const Sidebar = ({ currentPage, onNavigate, isOpen, onClose }) => {
    const menuItems = [
        { id: 'monitoramento', label: 'Monitoramento', icon: MonitorPlay },
        { id: 'analytics', label: 'Dashboard', icon: BarChart3 },
        { id: 'manutencao', label: 'Gestão de Manutenção', icon: AlertOctagon },
        { id: 'alarmes', label: 'Alarmes', icon: Bell },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50 border-r border-slate-800 transition-transform duration-300 shadow-xl ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg shadow-blue-500/20 flex items-center justify-center">
                            <img src="public/logo-custom.svg" alt="Logo" className="w-7 h-7" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg tracking-tight leading-none">Gestão De Frota</h1>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-500 px-4 mb-4 uppercase tracking-wider">Principal</div>

                    {menuItems.map((item) => {
                        const isActive = currentPage === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onNavigate(item.id); onClose(); }}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}

                    <div className="mt-8 text-xs font-semibold text-slate-500 px-4 mb-4 uppercase tracking-wider">Sistema</div>
                    <button
                        onClick={() => { onNavigate('configuracoes'); onClose(); }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentPage === 'configuracoes' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                    >
                        <Settings size={20} className={currentPage === 'configuracoes' ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                        <span>Configurações</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800 bg-[#0b1121] shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">Operacional</p>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-800/50">
                        <p className="text-[10px] text-slate-600 font-medium leading-tight">
                            Desenvolvido por <span className="text-slate-500 hover:text-slate-400 transition-colors">Warlison Abreu</span>
                        </p>
                        <p className="text-[9px] text-blue-900/80 font-bold uppercase tracking-widest mt-1 opacity-60">
                            Grupo GPS
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

const MobileHeader = ({ onOpen }) => {
    const { Menu } = lucide;
    return (
        <div className="md:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0 z-30">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1 rounded-md">
                    <img src="public/logo-custom.svg" alt="Logo" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <span className="font-bold text-sm">Gestão De Frota</span>
            </div>
            <button onClick={onOpen} className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                <Menu size={22} />
            </button>
        </div>
    );
};

window.GF.Sidebar = Sidebar;
window.GF.MobileHeader = MobileHeader;
console.log('✅ [GF] Sidebar loaded');
