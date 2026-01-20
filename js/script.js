// ========================================
// ELEMENTOS DO DOM
// ========================================
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultArea = document.getElementById('resultArea');
const errorArea = document.getElementById('errorArea');

// Elementos de resultado
const originalValue = document.getElementById('originalValue');
const usdValue = document.getElementById('usdValue');
const eurValue = document.getElementById('eurValue');
const usdRate = document.getElementById('usdRate');
const eurRate = document.getElementById('eurRate');
const timestamp = document.getElementById('timestamp');
const errorMessage = document.getElementById('errorMessage');

// ========================================
// VARIÁVEL DE CACHE
// ========================================
let cachedRates = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 60 segundos
