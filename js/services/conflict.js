'use strict';

/**
 * GF — ConflictResolver
 * Resolves event conflicts, deduplicates, and consolidates consecutive events
 */
window.GF = window.GF || {};

class ConflictResolver {
    constructor() {
        this.stats = { conflictsResolved: 0, duplicatesRemoved: 0, originalRecords: 0, finalRecords: 0, consecutiveConsolidated: 0 };
        this.config = { gapTolerance: 60, conflictResolution: 'priority' };
        this.statusPriorities = {
            'Em manutenção': 15, 'Em Manutenção': 15,
            'Fora da Planta': 14,
            'Motor Ligado': 10, 'Trabalhando': 10,
            'Motor Desligado': 6, 'Parado': 6,
            'Indisponível': 4, 'Sem Apropriação': 4
        };
    }

    resolveConflicts(eventsList, equipmentName) {
        if (!eventsList || eventsList.length === 0) return [];
        console.log(`🔧 [${equipmentName}] Resolvendo ${eventsList.length} eventos`);
        this.stats.originalRecords += eventsList.length;
        let resolved = eventsList;
        resolved = this.removeDuplicates(resolved);
        resolved = this.sortByTime(resolved);
        resolved = this.resolveOverlaps(resolved);
        resolved = this.consolidateConsecutive(resolved);
        this.stats.finalRecords += resolved.length;
        const reduction = ((1 - resolved.length / eventsList.length) * 100).toFixed(1);
        console.log(`✅ [${equipmentName}] ${eventsList.length} → ${resolved.length} (${reduction}% redução)`);
        return resolved;
    }

    removeDuplicates(events) {
        const seen = new Set();
        return events.filter(evt => {
            const key = `${evt.dataInicio}-${evt.dataFim}-${evt.descricao}-${evt.status}`;
            if (seen.has(key)) { this.stats.duplicatesRemoved++; return false; }
            seen.add(key);
            return true;
        });
    }

    sortByTime(events) {
        return [...events].sort((a, b) => this.parseTime(a.dataInicio) - this.parseTime(b.dataInicio));
    }

    resolveOverlaps(events) {
        if (events.length <= 1) return events;
        const resolved = [];
        let current = null;
        for (const evt of events) {
            if (!current) { current = { ...evt }; continue; }
            const currentEnd = this.parseTime(current.dataFim);
            const evtStart = this.parseTime(evt.dataInicio);
            if (evtStart < currentEnd) {
                this.stats.conflictsResolved++;
                const priority1 = this.statusPriorities[current.descricao] || 0;
                const priority2 = this.statusPriorities[evt.descricao] || 0;
                if (priority2 > priority1) current = { ...evt };
            } else {
                resolved.push(current);
                current = { ...evt };
            }
        }
        if (current) resolved.push(current);
        return resolved;
    }

    consolidateConsecutive(events) {
        if (events.length <= 1) return events;
        const consolidated = [];
        let current = null;
        for (const evt of events) {
            if (!current) { current = { ...evt }; continue; }
            const currentEnd = this.parseTime(current.dataFim);
            const evtStart = this.parseTime(evt.dataInicio);
            const gapSeconds = (evtStart - currentEnd) / 1000;
            const sameStatus = (current.descricao === evt.descricao) || (current.status === evt.status);
            if (sameStatus && Math.abs(gapSeconds) <= this.config.gapTolerance) {
                this.stats.consecutiveConsolidated++;
                current.dataFim = evt.dataFim;
                current.tempoTotal = this.calcDuration(current.dataInicio, current.dataFim);
            } else {
                consolidated.push(current);
                current = { ...evt };
            }
        }
        if (current) consolidated.push(current);
        return consolidated;
    }

    parseTime(timeStr) {
        if (!timeStr) return 0;
        if (timeStr instanceof Date) return timeStr.getTime();
        const match = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            const now = new Date();
            now.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
            return now.getTime();
        }
        return new Date(timeStr).getTime();
    }

    calcDuration(start, end) {
        if (!start || !end) return '00:00';
        const diff = this.parseTime(end) - this.parseTime(start);
        if (diff < 0) return '00:00';
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    getStats() { return { ...this.stats }; }
    resetStats() { this.stats = { conflictsResolved: 0, duplicatesRemoved: 0, originalRecords: 0, finalRecords: 0, consecutiveConsolidated: 0 }; }
}

GF.conflictResolver = new ConflictResolver();
console.log('✅ [GF] ConflictResolver initialized');
