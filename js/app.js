/**
 * GF — App (Root Component)
 * Initializes providers and renders application layout
 */
const { useState } = React;

const App = () => {
    const [currentPage, setCurrentPage] = useState('monitoramento');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <GF.ToastProvider>
            <GF.FleetProvider>
                <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
                    <GF.MobileHeader onOpen={() => setIsMobileMenuOpen(true)} />

                    <GF.Sidebar
                        currentPage={currentPage}
                        onNavigate={setCurrentPage}
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />

                    <main className="flex-1 md:ml-64 overflow-hidden relative flex flex-col transition-all duration-300 min-h-0">
                        {currentPage === 'monitoramento' && <GF.MonitoramentoPage />}
                        {currentPage === 'analytics' && <GF.AnalyticsPage />}
                        {currentPage === 'manutencao' && <GF.MaintenanceTracker />}
                        {currentPage === 'alarmes' && <GF.AlarmesPage />}
                        {currentPage === 'configuracoes' && <GF.ConfiguracoesPage />}
                    </main>
                </div>
            </GF.FleetProvider>
        </GF.ToastProvider>
    );
};

// Hide loading screen and render the app
const hideLoadingAndRender = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hide');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);
    }
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
};

// Wait for DOM and then render
if (document.readyState === 'complete') {
    setTimeout(hideLoadingAndRender, 800);
} else {
    window.addEventListener('load', () => setTimeout(hideLoadingAndRender, 800));
}

console.log('✅ [GF] App loaded — Ready to render');
