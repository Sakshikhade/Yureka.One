document.addEventListener('DOMContentLoaded', () => {
    // Utility functions
    const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(Math.round(num));
    
    // Gradient Generator Array for colors
    const colors = ['#0ea5e9', '#f59e0b', '#10b981', '#6366f1', '#e11d48', '#14b8a6', '#8b5cf6', '#1e3a8a'];
    const getColor = (str) => {
        if (!str) return '#1e293b';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Group mapping
    const fromPrograms = new Set();
    const toPrograms = new Set();
    const fromToMapping = {};

    transferMatrix.forEach(row => {
        const from = row['Transfer From']?.trim();
        const to = row['Transfer To']?.trim();
        if (!from || !to) return;
        
        fromPrograms.add(from);
        toPrograms.add(to);
        
        if (!fromToMapping[from]) fromToMapping[from] = [];
        fromToMapping[from].push(row);
    });

    const fromArray = Array.from(fromPrograms).sort();
    const toArray = Array.from(toPrograms).sort();

    // DOM Elements
    const fromSelect = document.getElementById('from-select');
    const fromDropdown = document.getElementById('from-dropdown');
    const fromList = document.getElementById('from-list');
    const fromSearch = document.getElementById('from-search');
    const clearFrom = document.getElementById('clear-from');
    
    const toSelect = document.getElementById('to-select');
    const toDropdown = document.getElementById('to-dropdown');
    const toList = document.getElementById('to-list');
    const toSearch = document.getElementById('to-search');
    
    const pointsInput = document.getElementById('points-input');
    const resultsArea = document.getElementById('results-area');
    const resultsContainer = document.getElementById('results-list-container');
    const resultsCount = document.getElementById('results-count');
    const internalSearch = document.getElementById('internal-search');
    
    // UI Filter Elements
    const btnBonus = document.querySelector('.chip-action.active-amber');
    const btnDirect = document.querySelector('.chip-action.active-blue');
    const btnSort = document.querySelectorAll('.chip-action')[2]; 
    const toggleAirlines = document.querySelectorAll('.toggle-item')[0];
    const toggleHotels = document.querySelectorAll('.toggle-item')[1];

    // State
    let selectedFrom = null;
    let selectedTo = null;
    let currentOptions = [];
    
    let filters = {
        bonusOnly: false, // Default false, matching screenshot it was active but let's make it toggleable
        directOnly: false,
        sortByValue: false,
        airlines: true, // Both active by default
        hotels: true
    };
    
    // Initial UI state setup for toggles to match filters object
    btnBonus.classList.remove('active-amber');
    btnDirect.classList.remove('active-blue');
    toggleAirlines.style.opacity = '1';
    toggleHotels.style.opacity = '1';

    // Hook up UI listeners
    btnBonus.addEventListener('click', () => {
        filters.bonusOnly = !filters.bonusOnly;
        btnBonus.classList.toggle('active-amber', filters.bonusOnly);
        renderResults();
    });

    btnDirect.addEventListener('click', () => {
        filters.directOnly = !filters.directOnly;
        btnDirect.classList.toggle('active-blue', filters.directOnly);
        renderResults();
    });

    btnSort.addEventListener('click', () => {
        filters.sortByValue = !filters.sortByValue;
        if(filters.sortByValue) {
            btnSort.style.background = '#f1f5f9';
            btnSort.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg> Highest Value`;
        } else {
            btnSort.style.background = 'var(--card-bg)';
            btnSort.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> Sort by Value`;
        }
        renderResults();
    });

    toggleAirlines.addEventListener('click', () => {
        filters.airlines = !filters.airlines;
        toggleAirlines.style.opacity = filters.airlines ? '1' : '0.4';
        renderResults();
    });

    toggleHotels.addEventListener('click', () => {
        filters.hotels = !filters.hotels;
        toggleHotels.style.opacity = filters.hotels ? '1' : '0.4';
        renderResults();
    });

    const handleSelectUpdate = (el, val) => {

        const textSpan = el.querySelector('.selected-text');
        const iconDiv = el.querySelector('.di-logo');
        if (val) {
            textSpan.textContent = val;
            textSpan.style.color = 'var(--text-dark)';
            iconDiv.style.background = getColor(val);
            iconDiv.textContent = val.substring(0, 2).toUpperCase();
            iconDiv.style.color = '#fff';
        } else {
            textSpan.textContent = 'Any program...';
            textSpan.style.color = 'var(--text-muted)';
            iconDiv.style.background = 'transparent';
            iconDiv.textContent = el.id === 'from-select' ? '📋' : '🎯';
            iconDiv.style.color = 'inherit';
        }
    };

    const renderDropdown = (listElement, dataArray, onSelectValue) => {
        listElement.innerHTML = '';
        dataArray.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            const initials = item.substring(0, 2).toUpperCase();
            const color = getColor(item);
            div.innerHTML = `
                <div class="di-logo" style="background: ${color}; color: white;">${initials}</div>
                <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-dark);">${item}</span>
            `;
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                onSelectValue(item);
            });
            listElement.appendChild(div);
        });
    };

    // Event Handlers
    renderDropdown(fromList, fromArray, (val) => {
        selectedFrom = val;
        handleSelectUpdate(fromSelect, val);
        clearFrom.style.display = 'flex';
        closeDropdowns();
        
        resultsArea.style.display = 'block';
        currentOptions = fromToMapping[selectedFrom] || [];
        renderResults();
    });

    renderDropdown(toList, toArray, (val) => {
        selectedTo = val;
        handleSelectUpdate(toSelect, val);
        closeDropdowns();
        if (selectedFrom) renderResults();
    });

    clearFrom.addEventListener('click', () => {
        selectedFrom = null;
        handleSelectUpdate(fromSelect, null);
        clearFrom.style.display = 'none';
        resultsArea.style.display = 'none';
    });

    const closeDropdowns = () => {
        fromDropdown.classList.remove('open');
        toDropdown.classList.remove('open');
        fromSelect.classList.remove('active');
        toSelect.classList.remove('active');
    };

    fromSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        toDropdown.classList.remove('open');
        toSelect.classList.remove('active');
        fromDropdown.classList.toggle('open');
        fromSelect.classList.toggle('active');
        if(fromDropdown.classList.contains('open')) fromSearch.focus();
    });

    toSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        fromDropdown.classList.remove('open');
        fromSelect.classList.remove('active');
        toDropdown.classList.toggle('open');
        toSelect.classList.toggle('active');
        if(toDropdown.classList.contains('open')) toSearch.focus();
    });

    document.addEventListener('click', closeDropdowns);

    fromSearch.addEventListener('input', (e) => {
        renderDropdown(fromList, fromArray.filter(i => i.toLowerCase().includes(e.target.value.toLowerCase())), (val) => {
            selectedFrom = val;
            handleSelectUpdate(fromSelect, val);
            clearFrom.style.display = 'flex';
            closeDropdowns();
            resultsArea.style.display = 'block';
            currentOptions = fromToMapping[selectedFrom] || [];
            renderResults();
        });
    });

    toSearch.addEventListener('input', (e) => {
        renderDropdown(toList, toArray.filter(i => i.toLowerCase().includes(e.target.value.toLowerCase())), (val) => {
            selectedTo = val;
            handleSelectUpdate(toSelect, val);
            closeDropdowns();
            if (selectedFrom) renderResults();
        });
    });
    
    internalSearch.addEventListener('input', renderResults);
    pointsInput.addEventListener('input', renderResults);

    // Results logic
    function renderResults() {
        if (!selectedFrom) return;
        let filtered = currentOptions;
        
        // Target dropdown filter
        if (selectedTo) filtered = filtered.filter(opt => opt['Transfer To'] === selectedTo);
        
        // Search text filter
        const query = internalSearch.value.toLowerCase();
        if (query) {
            filtered = filtered.filter(opt => opt['Transfer To'].toLowerCase().includes(query) || opt['Via'].toLowerCase().includes(query));
        }

        // Direct/Indirect filter
        if (filters.directOnly) {
            filtered = filtered.filter(opt => opt['Via'] === 'Direct');
        }

        // Hotels / Airlines filter
        filtered = filtered.filter(opt => {
            const cat = (opt['To Category'] || '').toUpperCase();
            if(!filters.airlines && cat === 'AIRLINE') return false;
            if(!filters.hotels && cat === 'HOTEL') return false;
            return true;
        });

        // Compute output mapping inside to allow Sorting by Value!
        const parsedData = filtered.map(opt => {
            const pointsVal = parseFloat(pointsInput.value) || 0;
            const floatMultiplier = parseFloat(opt['Ratio Float']) || 1;
            const outputVal = pointsVal / floatMultiplier; 
            
            // Generate dummy bonus consistently based on name
            const hasBonus = (opt['Transfer To'].length % 2 === 0); 
            
            return {
                opt,
                pointsVal,
                outputVal,
                hasBonus
            };
        });

        // Bonus only filter
        let finalData = parsedData;
        if (filters.bonusOnly) {
            finalData = finalData.filter(d => d.hasBonus);
        }

        // Sorting
        if (filters.sortByValue) {
            finalData.sort((a, b) => b.outputVal - a.outputVal); // Highest value
        }

        resultsCount.textContent = `${finalData.length} Transfer To Options`;
        resultsContainer.innerHTML = '';
        
        finalData.forEach(item => {
            const { opt, pointsVal, outputVal, hasBonus } = item;
            
            const target = opt['Transfer To'];
            const targetColor = getColor(target);
            const sourceColor = getColor(selectedFrom);
            
            const isIndirect = opt['Via'] !== 'Direct';
            const viaText = isIndirect ? ` · <span class="via-link">via ${opt['Via']}</span>` : '';
            const ratioDesc = `${opt['Ratio'] || opt['Ratio Float']} ratio`;
            const timeDesc = opt['Transfer Time'] || 'Unknown Time';
            
            const bonusHtml = hasBonus ? `<div class="res-bonus">✓ 30% Bonus Applied · limited time</div>` : '';

            const estInrSource = Math.round(pointsVal * 0.55);
            const estInrTarget = Math.round(outputVal * 0.93);

            const div = document.createElement('div');
            div.className = 'result-card';
            div.innerHTML = `
                <div class="res-left">
                    <div class="res-logo" style="background: ${targetColor}">${target.substring(0,2).toUpperCase()}</div>
                    <div class="res-info">
                        <h3>${target}</h3>
                        <div class="res-subtitle">${ratioDesc}${viaText} · ${timeDesc}</div>
                        ${bonusHtml}
                    </div>
                </div>
                
                <div class="res-middle">
                    <svg class="heart-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
                </div>
                
                <div class="res-right">
                    <div class="calc-column transfer-col">
                        <div class="calc-label">If you transfer</div>
                        <div class="calc-val-row">
                            <div class="tiny-logo" style="background:${sourceColor}">${selectedFrom.substring(0,2).toUpperCase()}</div>
                            <span>${formatNumber(pointsVal)}</span>
                        </div>
                        <div class="calc-est">est. ₹${formatNumber(estInrSource)}</div>
                    </div>
                    
                    <div class="calc-column receive-col">
                        <div class="calc-label">You'll receive</div>
                        <div class="calc-val-row">
                            <div class="tiny-logo" style="background:${targetColor}">${target.substring(0,2).toUpperCase()}</div>
                            <span style="color: ${targetColor}">${formatNumber(outputVal)}</span>
                        </div>
                        <div class="calc-est">est. ₹${formatNumber(estInrTarget)}</div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(div);
        });
    }
});
