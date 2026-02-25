'use strict';

/**
 * GF — Configuration & Constants
 * Central configuration for the Gestão de Frotas application
 */
window.GF = window.GF || {};

GF.GAS_URL = 'https://script.google.com/macros/s/AKfycbyFQ2QVpetDQ7aBWk01JFbxHnbEbe55LFzigaTOuwLMMHs2TsbCCSFS9gfP1_-QPDdUxA/exec';

GF.STATUS_COLORS = {
    'motor ligado': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500', icon: 'bg-green-600' },
    'trabalhando': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500', icon: 'bg-green-600' },
    'motor secundário ligado': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-500', icon: 'bg-emerald-400' },
    'motor desligado': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500', icon: 'bg-red-600' },
    'parado ligado': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500', icon: 'bg-yellow-400' },
    'parado': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500', icon: 'bg-yellow-400' },
    'em manutenção': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500', icon: 'bg-orange-500' },
    'fora da planta': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-600', icon: 'bg-emerald-700' },
    'indisponível / sem apropriação': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400', icon: 'bg-slate-400' },
    'indisponível': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400', icon: 'bg-slate-400' },
    'sem apropriação': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400', icon: 'bg-slate-400' },
    'troca de turno': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500', icon: 'bg-blue-500' },
    'fora do regime': { bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-300', icon: 'bg-slate-100' },
    'sem dados de bordo': { bg: 'bg-slate-200', text: 'text-slate-800', border: 'border-slate-600', icon: 'bg-slate-900' },
    'parada apontada': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500', icon: 'bg-indigo-900' },
    'vaga disponível': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500', icon: 'bg-purple-600' },
    'chave geral desligada': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-500', icon: 'bg-stone-600' },
    'documentação': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-500', icon: 'bg-cyan-600' },
    'abastecimento': { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-500', icon: 'bg-sky-600' },
    'abastecimento (água) - lm': { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-500', icon: 'bg-sky-600' },
    'refeição motorista': { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-500', icon: 'bg-rose-500' },
    'refeição': { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-500', icon: 'bg-rose-500' },
    'default': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400', icon: 'bg-slate-400' }
};

GF.STATUS_LABELS = {
    trabalhando: 'Em Operação',
    parado: 'Parado',
    manutencao: 'Em Manutenção',
    'sem-apropriacao': 'Sem Sinal'
};

console.log('✅ [GF] Config loaded');
