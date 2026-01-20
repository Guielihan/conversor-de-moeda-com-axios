const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultArea = document.getElementById('resultArea');
const errorArea = document.getElementById('errorArea');

// Elementos de resultado - novo layout
const brlValueUsd = document.getElementById('brlValueUsd');
const brlValueEur = document.getElementById('brlValueEur');
const usdValue = document.getElementById('usdValue');
const eurValue = document.getElementById('eurValue');
const timestamp = document.getElementById('timestamp');
const errorMessage = document.getElementById('errorMessage');

let cachedRates = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000;

function formatMoney(value, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
    }).format(value);
}

function validateInput(value) {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0;
}

function setLoading(isLoading) {
    if (isLoading) {
        convertBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        resultArea.classList.add('hidden');
        errorArea.classList.add('hidden');
    } else {
        convertBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }
}

async function fetchRates() {
    const now = Date.now();
    if (cachedRates && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('📦 Usando cotações em cache');
        return cachedRates;
    }

    try {
        const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');

        const rates = {
            usd: parseFloat(response.data.USDBRL.bid),
            eur: parseFloat(response.data.EURBRL.bid)
        };

        cachedRates = rates;
        cacheTimestamp = now;

        console.log('🌐 Cotações atualizadas da API');
        return rates;
    } catch (error) {
        throw new Error('Não foi possível buscar as cotações. Verifique sua conexão com a internet.');
    }
}

function renderResult(amount, rates) {
    // Cálculo das conversões
    const usdAmount = amount / rates.usd;
    const eurAmount = amount / rates.eur;

    // Atualização dos valores - BRL (origem)
    brlValueUsd.textContent = formatMoney(amount, 'BRL');
    brlValueEur.textContent = formatMoney(amount, 'BRL');

    // Atualização dos valores convertidos
    usdValue.textContent = formatMoney(usdAmount, 'USD');
    eurValue.textContent = formatMoney(eurAmount, 'EUR');

    // Atualização do timestamp
    const now = new Date();
    timestamp.textContent = `Atualizado em: ${now.toLocaleString('pt-BR')}`;

    // Exibe a área de resultado
    resultArea.classList.remove('hidden');
}

function renderError(message) {
    errorMessage.textContent = message;
    errorArea.classList.remove('hidden');
}

async function handleConvert() {
    const amount = amountInput.value;

    // validacao do input
    if (!validateInput(amount)) {
        renderError('Por favor, digite um valor positivo válido.');
        return;
    }

    setLoading(true);

    try {
        const rates = await fetchRates();
        renderResult(parseFloat(amount), rates);
    } catch (error) {
        renderError(error.message);
    } finally {
        setLoading(false);
    }
}

convertBtn.addEventListener('click', handleConvert);

amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleConvert();
    }
});