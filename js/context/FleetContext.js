/**
 * GF — FleetContext
 * Manages fleet data, polling, filters, and provides data to all pages
 */
const { createContext, useContext, useState, useEffect, useRef, useCallback } = React;

const FleetContext = createContext();
const useFleet = () => useContext(FleetContext);

const FleetProvider = ({ children }) => {
    const today = new Date().toISOString().split('T')[0];
    const [vagas, setVagas] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const prevAlertCountRef = useRef(0);
    const { addToast } = GF.useToast();

    const [filters, setFilters] = useState({ date: today, startTime: '', endTime: '' });
    const [pollingInterval, setPollingInterval] = useState(30);

    const fetchData = useCallback(async (date, startTime, endTime) => {
        try {
            const hourParam = startTime || undefined;
            const result = await GF.api.getVagas(date, hourParam);
            const rawVagas = result.vagas || (Array.isArray(result) ? result : []);

            const processedVagas = rawVagas.map(v => {
                const resolved = (v.eventos && v.eventos.length > 0)
                    ? GF.conflictResolver.resolveConflicts(v.eventos, v.nome)
                    : [];

                if (endTime && startTime) {
                    const startMin = GF.timeToMinutes(startTime);
                    const endMin = GF.timeToMinutes(endTime);
                    const filtered = resolved.filter(evt => {
                        const evtStart = GF.timeToMinutes(evt.dataInicio);
                        return evtStart >= startMin && evtStart <= endMin;
                    });
                    return { ...v, eventos: filtered };
                }
                return { ...v, eventos: resolved };
            });

            if (GF.cacheManager.hasChanged('vagas', processedVagas)) {
                setVagas(processedVagas);
            }
            GF.cacheManager.set('vagas', processedVagas);
            setIsConnected(true);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('[FleetProvider] Fetch failed:', error);
            setIsConnected(false);
            addToast('Falha ao buscar dados da frota.', 'critical');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const fetchAlerts = useCallback(async () => {
        try {
            const result = await GF.api.getAlerts();
            if (result.success && Array.isArray(result.alerts)) {
                setAlerts(result.alerts);
                if (result.alerts.length > prevAlertCountRef.current && prevAlertCountRef.current > 0) {
                    addToast(`${result.alerts.length - prevAlertCountRef.current} novo(s) alerta(s)!`, 'warning');
                }
                prevAlertCountRef.current = result.alerts.length;
            }
        } catch (error) {
            console.error('[FleetProvider] Fetch alerts failed:', error);
        }
    }, [addToast]);

    const handleDismissAlert = useCallback(async (alertId) => {
        await GF.api.dismissAlert(alertId);
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        addToast('Alerta descartado.', 'success');
    }, [addToast]);

    useEffect(() => {
        fetchData(filters.date, filters.startTime, filters.endTime);
        fetchAlerts();

        const intervalId = setInterval(() => {
            console.log("[Polling] Refreshing data & alerts...");
            fetchData(filters.date, filters.startTime, filters.endTime);
            fetchAlerts();
        }, pollingInterval * 1000);

        const unsubscribe = () => { };

        return () => {
            clearInterval(intervalId);
            unsubscribe();
        };
    }, [filters, pollingInterval]);

    const updateFilters = (newFilters) => {
        const merged = { ...filters, ...newFilters };
        setFilters(merged);
        setLoading(true);
        fetchData(merged.date, merged.startTime, merged.endTime);
    };

    return (
        <FleetContext.Provider value={{
            vagas, alerts, loading, isConnected, lastUpdated,
            refreshData: () => fetchData(filters.date, filters.startTime, filters.endTime),
            refreshAlerts: fetchAlerts,
            handleDismissAlert,
            filters, updateFilters
        }}>
            {children}
        </FleetContext.Provider>
    );
};

window.GF.FleetContext = FleetContext;
window.GF.FleetProvider = FleetProvider;
window.GF.useFleet = useFleet;
console.log('✅ [GF] FleetContext loaded');
