'use strict';

/**
 * GF — Utility Functions
 * Shared helpers: format, parse, normalize
 */
window.GF = window.GF || {};

GF.normalizeStatus = (rawStatus, equipmentName) => {
    if (!rawStatus) return 'default';
    const s = rawStatus.toLowerCase().trim();
    const name = (equipmentName || "").toUpperCase();

    if (s.includes('manutenção') || s.includes('manutencao')) return 'em manutenção';

    if (name.includes('AUTO VÁCUO') || name.includes('AUTO VACUO')) {
        if (s.includes('parado ligado')) return 'motor ligado';
        if (s.includes('motor ligado') || s.includes('trabalhando') || s.includes('operando')) return 'motor ligado';
    }

    if (name.includes('ALTA PRESSÃO') || name.includes('ALTA PRESSAO') || name.includes('HIPER VÁCUO') || name.includes('HIPER VACUO')) {
        if (s.includes('motor secundário')) return 'motor secundário ligado';
        if (s.includes('parado ligado')) return 'parado ligado';
        if (s === 'motor ligado') return 'parado ligado';
    }

    if (s.includes('motor secundário')) return 'motor secundário ligado';
    if (s === 'motor ligado' || s === 'trabalhando' || s === 'operando') return 'motor ligado';
    if (s === 'motor desligado') return 'motor desligado';
    if (s === 'parado ligado') return 'parado ligado';
    if (s === 'parado' || s === 'ocioso') return 'parado';
    if (s === 'fora da planta') return 'fora da planta';
    if (s.includes('indisponível') && s.includes('sem apropriação')) return 'indisponível / sem apropriação';
    if (s === 'indisponível' || s === 'indisponivel') return 'indisponível';
    if (s === 'sem apropriação' || s === 'sem apropriacao') return 'sem apropriação';
    if (s === 'troca de turno') return 'troca de turno';
    if (s === 'fora do regime') return 'fora do regime';
    if (s === 'sem dados de bordo') return 'sem dados de bordo';
    if (s === 'parada apontada') return 'parada apontada';
    if (s === 'vaga disponível' || s === 'vaga disponivel') return 'vaga disponível';
    if (s === 'chave geral desligada') return 'chave geral desligada';
    if (s.includes('documentação') || s.includes('documentacao')) return 'documentação';
    if (s.includes('abastecimento')) return 'abastecimento';
    if (s.includes('refeição') || s.includes('refeicao')) return 'refeição';

    if (s.includes('ligado')) return 'motor ligado';
    if (s.includes('desligado')) return 'motor desligado';
    if (s.includes('parad')) return 'parado';

    return 'default';
};

GF.formatDateTime = (dateString) => {
    if (!dateString) return '--:-- --/--/----';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString.replace('GMT-0300 (Horário Padrão de Brasília)', '').substring(0, 16);
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
};

GF.timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return 0;
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return (hours * 60) + minutes + (seconds / 60);
};

GF.calculateDuration = (startStr, endStr) => {
    const startMins = GF.timeToMinutes(startStr);
    const endMins = GF.timeToMinutes(endStr);
    let diff = endMins - startMins;
    if (diff < 0) diff += 1440;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

GF.formatDuration = (val) => {
    if (!val) return '00:00';
    const s = String(val);
    if (s.includes('1899') || s.includes('T')) {
        try {
            const d = new Date(s);
            if (!isNaN(d.getTime())) {
                return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
            }
        } catch (e) { }
    }
    if (s.includes(':')) return s.substring(0, 5);
    return s;
};

GF.formatMinutes = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return '0h 00min';
    const h = Math.floor(totalMinutes / 60);
    const m = Math.round(totalMinutes % 60);
    if (h === 0) return `${m}min`;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
};

GF.toPascalCase = (str) => str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

console.log('✅ [GF] Utils loaded');
