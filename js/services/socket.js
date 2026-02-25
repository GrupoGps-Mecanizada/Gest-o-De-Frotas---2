'use strict';

/**
 * GF — WebSocket Service (Mock)
 * Stub for future real-time telemetry
 */
window.GF = window.GF || {};

class MockWebSocketService {
    constructor() {
        this.listeners = [];
        this.intervalId = null;
        this.isConnected = false;
        this.mockEquipments = [];
    }

    connect(initialData) {
        if (this.isConnected) return;
        console.log('[WebSocket] Conectando ao servidor de telemetria...');
        this.mockEquipments = initialData;
        this.isConnected = true;
        this.notify({ type: 'CONNECTION', payload: { status: 'connected' }, timestamp: Date.now() });
    }

    disconnect() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isConnected = false;
        this.notify({ type: 'CONNECTION', payload: { status: 'disconnected' }, timestamp: Date.now() });
        console.log('[WebSocket] Desconectado.');
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    notify(message) { this.listeners.forEach(listener => listener(message)); }
}

GF.socketService = new MockWebSocketService();
console.log('✅ [GF] Socket Service loaded');
