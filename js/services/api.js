'use strict';

/**
 * GF — API Service
 * Handles Google Apps Script API calls
 */
window.GF = window.GF || {};

const gasGet = async (action, extraParams = {}) => {
    const url = new URL(GF.GAS_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('ts', Date.now().toString());
    Object.entries(extraParams).forEach(([k, v]) => { if (v) url.searchParams.append(k, v); });
    const res = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

const gasPost = async (body) => {
    const res = await fetch(GF.GAS_URL, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'text/plain' }
    });
    return res.json();
};

const generateMockData = () => {
    const baseStatus = ['Trabalhando', 'Parado', 'Manutenção', 'Sem Apropriação'];
    const vagasNomes = [
        'ALTA PRESSÃO - GPS - 01', 'ALTA PRESSÃO - GPS - 02', 'VAGA OPERACIONAL 03', 'INFRAESTRUTURA - 04',
        'VAGA 05 - 24 HS', 'VAGA 06 - MANUTENÇÃO', 'ALTA PRESSÃO - GPS - 07', 'APOIO OPERACIONAL - 08'
    ];
    const vagas = Array.from({ length: 8 }).map((_, i) => {
        const status = baseStatus[Math.floor(Math.random() * baseStatus.length)];
        return {
            id: `eq-${i}`, nome: vagasNomes[i % vagasNomes.length], placa: `MOCK-${2024 + i}`,
            status, horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            eventos: [
                { descricao: 'Operação Iniciada', dataInicio: '08:00', tempoTotal: '04:00', status: 'Trabalhando' },
                { descricao: 'Pausa para Almoço', dataInicio: '12:00', tempoTotal: '01:00', status: 'Parado' }
            ]
        };
    });
    return { success: true, vagas };
};

GF.api = {
    getVagas: async (date, hour) => {
        try {
            const data = await gasGet('getVagas', { date, hour });
            if (!data || (data.success === false && !data.vagas)) {
                console.warn("[API] getVagas falhou, usando dados demo.");
                return generateMockData();
            }
            const rawVagas = Array.isArray(data) ? data : (data.vagas || []);
            const mappedVagas = rawVagas.map((v, index) => ({
                id: v.id || `vaga-${index}`, nome: v.nome || `Vaga ${index + 1}`,
                placa: v.equipamento || v.placa || 'N/I', status: v.status || 'Sem Apropriação',
                horario: v.horario || new Date().toISOString(), eventos: Array.isArray(v.eventos) ? v.eventos : []
            }));
            return { success: true, vagas: mappedVagas };
        } catch (error) {
            console.error("[API] Erro getVagas:", error);
            return generateMockData();
        }
    },
    getAlerts: async () => { try { return await gasGet('getAlerts'); } catch (e) { console.error("[API] Erro getAlerts:", e); return { success: true, alerts: [] }; } },
    dismissAlert: async (alertId) => { try { return await gasPost({ action: 'dismissAlert', alertId }); } catch (e) { console.error("[API] Erro dismissAlert:", e); return { success: false, error: e.message }; } },
    getRules: async () => { try { return await gasGet('getRules'); } catch (e) { console.error("[API] Erro getRules:", e); return { success: true, rules: [] }; } },
    getDashboardData: async () => { try { return await gasGet('getDashboardData'); } catch (e) { console.error("[API] Erro getDashboardData:", e); return { success: false }; } },
    saveRule: async (ruleData) => { try { return await gasPost({ action: 'saveRule', ...ruleData }); } catch (e) { console.error("[API] Erro saveRule:", e); return { success: false }; } },
    deleteRule: async (ruleId) => { try { return await gasPost({ action: 'deleteRule', ruleId }); } catch (e) { console.error("[API] Erro deleteRule:", e); return { success: false }; } },
    toggleRule: async (ruleId, active) => { try { return await gasPost({ action: 'toggleRule', ruleId, active }); } catch (e) { console.error("[API] Erro toggleRule:", e); return { success: false }; } }
};

console.log('✅ [GF] API Service loaded');
