/**
 * GF — ToastContext
 * Provides toast notifications via React Context
 */
const { createContext, useContext, useState, useCallback } = React;

const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, severity = 'info', duration = 6000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, severity }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const severityStyles = {
        info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'ℹ️' },
        success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠️' },
        critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '🚨' }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
                {toasts.map(t => {
                    const s = severityStyles[t.severity] || severityStyles.info;
                    return (
                        <div
                            key={t.id}
                            className={`${s.bg} ${s.border} border rounded-xl p-4 shadow-lg animate-fade-in flex items-start gap-3 cursor-pointer group hover:shadow-xl transition-all`}
                            onClick={() => removeToast(t.id)}
                        >
                            <span className="text-lg shrink-0">{s.icon}</span>
                            <p className={`${s.text} text-sm font-medium flex-1`}>{t.message}</p>
                            <button className="text-slate-400 hover:text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

window.GF = window.GF || {};
GF.ToastContext = ToastContext;
GF.ToastProvider = ToastProvider;
GF.useToast = useToast;
console.log('✅ [GF] ToastContext loaded');
