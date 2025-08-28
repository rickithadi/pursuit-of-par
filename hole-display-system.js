// TPC Sawgrass Hole Display System
// Professional tournament-style hole information display

class TPCHoleDisplaySystem {
    constructor(gameEngine, holeData) {
        this.gameEngine = gameEngine;
        this.holeData = holeData;
        this.currentHole = 1;
        this.selectedTee = 'blue'; // Default championship tees
        this.aerialCache = new Map();
        this.units = 'yards';
        
        this.initializeDisplay();
    }

    initializeDisplay() {
        console.log('🏌️ Initializing TPC Sawgrass hole display system');
        
        // Create hole selector interface
        this.createHoleSelector();
        
        // Create enhanced hole information panel
        this.createHoleInformationPanel();
        
        // Create strategic information overlay
        this.createStrategicOverlay();
        
        // Load initial hole
        this.displayHole(this.currentHole);
    }

    createHoleSelector() {
        const existingSelector = document.getElementById('tpc-hole-selector');
        if (existingSelector) {
            existingSelector.remove();
        }

        const selector = document.createElement('div');
        selector.id = 'tpc-hole-selector';
        selector.className = 'tpc-hole-selector';
        selector.innerHTML = `
            <div class="hole-selector-header">
                <h3>🏆 TPC Sawgrass Stadium Course</h3>
                <div class="course-subtitle">The Players Championship Host Venue</div>
            </div>
            <div class="hole-grid" id="hole-grid">
                <!-- Will be populated with hole thumbnails -->
            </div>
            <div class="tee-selector">
                <label>Championship Tees:</label>
                <select id="tee-selector" class="tee-select">
                    <option value="black">Black Tees (Tournament)</option>
                    <option value="blue" selected>Blue Tees (Championship)</option>
                    <option value="red">Red Tees (Resort)</option>
                    <option value="white">White Tees (Member)</option>
                    <option value="green">Green Tees (Forward)</option>
                </select>
            </div>
        `;

        // Add to sidebar or create floating panel
        const sidebar = document.querySelector('.enhanced-panel');
        if (sidebar) {
            sidebar.insertBefore(selector, sidebar.firstChild);
        } else {
            document.body.appendChild(selector);
        }

        this.populateHoleGrid();
        this.setupHoleSelectorEvents();
    }

    populateHoleGrid() {
        const grid = document.getElementById('hole-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        // Create all 18 holes (we now have complete data)
        for (let i = 1; i <= 18; i++) {
            const holeData = this.holeData.getHoleData(i);
            if (!holeData) continue;

            const holeCard = document.createElement('div');
            holeCard.className = `hole-card ${i === this.currentHole ? 'active' : ''}`;
            holeCard.dataset.hole = i;
            
            holeCard.innerHTML = `
                <div class="hole-number">${i}</div>
                <div class="hole-par">PAR ${holeData.par}</div>
                <div class="hole-yardage">${holeData.yardages[this.selectedTee]}y</div>
                <div class="hole-difficulty">#${holeData.difficulty}</div>
                <div class="hole-name">${holeData.name}</div>
            `;

            // Add aerial image when available
            this.loadHoleAerial(i).then(imageUrl => {
                if (imageUrl) {
                    holeCard.style.backgroundImage = `url(${imageUrl})`;
                    holeCard.classList.add('has-aerial');
                }
            });

            grid.appendChild(holeCard);
        }
    }

    createHoleInformationPanel() {
        const existingPanel = document.getElementById('tpc-hole-info');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'tpc-hole-info';
        panel.className = 'tpc-hole-info-panel';
        
        // Insert into the game viewport overlay
        const viewportOverlay = document.querySelector('.viewport-overlay');
        if (viewportOverlay) {
            // Replace or enhance existing hole info
            const existingHoleInfo = viewportOverlay.querySelector('.hole-info-3d');
            if (existingHoleInfo) {
                existingHoleInfo.replaceWith(panel);
            } else {
                viewportOverlay.appendChild(panel);
            }
        }
    }

    createStrategicOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'strategic-overlay';
        overlay.className = 'strategic-overlay hidden';
        
        overlay.innerHTML = `
            <div class="strategic-header">
                <h4>📊 Strategic Information</h4>
                <button class="close-strategic" onclick="this.parentElement.parentElement.classList.add('hidden')">×</button>
            </div>
            <div class="strategic-content">
                <!-- Will be populated with hole-specific strategy -->
            </div>
        `;

        document.body.appendChild(overlay);
    }

    async displayHole(holeNumber) {
        const holeData = this.holeData.getHoleData(holeNumber);
        if (!holeData) {
            console.warn(`No data available for hole ${holeNumber}`);
            return;
        }

        console.log(`🏌️ Displaying TPC Sawgrass Hole ${holeNumber}`);
        this.currentHole = holeNumber;

        // Update hole information panel
        this.updateHoleInfoPanel(holeData);
        
        // Update hole selector active state
        this.updateHoleSelectorActive();
        
        // Load aerial image
        const aerialUrl = await this.loadHoleAerial(holeNumber);
        if (aerialUrl) {
            this.displayAerialImage(aerialUrl);
        }

        // Update game engine with hole data
        if (this.gameEngine && this.gameEngine.updateHoleData) {
            this.gameEngine.updateHoleData(holeData);
        }
    }

    updateHoleInfoPanel(holeData) {
        const panel = document.getElementById('tpc-hole-info');
        if (!panel) return;

        const yardage = holeData.yardages[this.selectedTee];
        const displayYardage = this.formatDistance(yardage);

        panel.innerHTML = `
            <div class="hole-header">
                <div class="hole-number-large">${holeData.number}</div>
                <div class="hole-title">
                    <div class="hole-name">${holeData.name}</div>
                    <div class="hole-par">PAR ${holeData.par}</div>
                </div>
            </div>
            
            <div class="hole-stats">
                <div class="stat-item">
                    <div class="stat-label">DISTANCE</div>
                    <div class="stat-value">${displayYardage}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">DIFFICULTY</div>
                    <div class="stat-value">#${holeData.difficulty}</div>
                </div>
                ${holeData.longestDrive ? `
                <div class="stat-item">
                    <div class="stat-label">LONGEST DRIVE</div>
                    <div class="stat-value">${holeData.longestDrive.distance}y</div>
                    <div class="stat-note">${holeData.longestDrive.player} (${holeData.longestDrive.year})</div>
                </div>
                ` : ''}
            </div>
            
            <div class="hole-description">
                ${holeData.description}
            </div>
            
            <button class="strategic-button" onclick="document.getElementById('strategic-overlay').classList.remove('hidden')">
                📊 View Strategic Information
            </button>
        `;

        // Update strategic overlay content
        this.updateStrategicOverlay(holeData);
    }

    updateStrategicOverlay(holeData) {
        const overlay = document.getElementById('strategic-overlay');
        const content = overlay?.querySelector('.strategic-content');
        if (!content) return;

        content.innerHTML = `
            <div class="feature-section">
                <h5>🌊 Water Hazards</h5>
                <p>${holeData.features.water}</p>
            </div>
            
            <div class="feature-section">
                <h5>🏖️ Bunkers</h5>
                <p>${holeData.features.bunkers}</p>
            </div>
            
            <div class="feature-section">
                <h5>🎯 Strategy</h5>
                <p>${holeData.features.strategy}</p>
            </div>
            
            <div class="yardage-breakdown">
                <h5>📏 Tee Yardages</h5>
                <div class="tee-grid">
                    ${Object.entries(holeData.yardages).map(([tee, yardage]) => `
                        <div class="tee-option ${tee === this.selectedTee ? 'selected' : ''}">
                            <div class="tee-name">${tee.charAt(0).toUpperCase() + tee.slice(1)}</div>
                            <div class="tee-yardage">${this.formatDistance(yardage)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async loadHoleAerial(holeNumber) {
        // Check cache first
        if (this.aerialCache.has(holeNumber)) {
            return this.aerialCache.get(holeNumber);
        }

        // Try to load from Skyfox Golf
        try {
            const url = this.holeData.getAerialURL(holeNumber);
            const imageUrl = await this.holeData.loadAerialImage(holeNumber);
            
            if (imageUrl) {
                this.aerialCache.set(holeNumber, imageUrl);
                console.log(`✓ Loaded aerial for hole ${holeNumber}`);
                return imageUrl;
            }
        } catch (error) {
            console.warn(`Failed to load aerial for hole ${holeNumber}:`, error);
        }

        // Fallback to local images if they exist
        const localPath = `/Users/hadi.rickit/Documents/tpc-stadium/hole${holeNumber}_aerial.jpg`;
        if (await this.checkLocalImage(localPath)) {
            this.aerialCache.set(holeNumber, localPath);
            return localPath;
        }

        return null;
    }

    async checkLocalImage(path) {
        // This would need proper file system access in a real implementation
        return false;
    }

    displayAerialImage(imageUrl) {
        // Update canvas background or create overlay
        const canvas = document.getElementById('course3DViewport');
        if (canvas && imageUrl) {
            // Create aerial overlay
            let aerialOverlay = document.getElementById('aerial-overlay');
            if (!aerialOverlay) {
                aerialOverlay = document.createElement('div');
                aerialOverlay.id = 'aerial-overlay';
                aerialOverlay.className = 'aerial-overlay';
                canvas.appendChild(aerialOverlay);
            }

            aerialOverlay.style.backgroundImage = `url(${imageUrl})`;
            aerialOverlay.style.backgroundSize = 'cover';
            aerialOverlay.style.backgroundPosition = 'center';
            aerialOverlay.style.opacity = '0.3'; // Subtle background
        }
    }

    setupHoleSelectorEvents() {
        // Hole selection
        document.addEventListener('click', (event) => {
            const holeCard = event.target.closest('.hole-card:not(.placeholder)');
            if (holeCard) {
                const holeNumber = parseInt(holeCard.dataset.hole);
                this.displayHole(holeNumber);
            }
        });

        // Tee selector
        const teeSelector = document.getElementById('tee-selector');
        if (teeSelector) {
            teeSelector.addEventListener('change', (event) => {
                this.selectedTee = event.target.value;
                this.populateHoleGrid();
                this.displayHole(this.currentHole); // Refresh current hole
            });
        }
    }

    updateHoleSelectorActive() {
        const holeCards = document.querySelectorAll('.hole-card');
        holeCards.forEach(card => {
            card.classList.toggle('active', parseInt(card.dataset.hole) === this.currentHole);
        });
    }

    formatDistance(yardage) {
        if (this.units === 'meters') {
            return `${Math.round(yardage * 0.9144)}m`;
        }
        return `${yardage}y`;
    }

    setUnits(units) {
        this.units = units;
        this.displayHole(this.currentHole); // Refresh display
    }

    nextHole() {
        const nextHole = this.currentHole < 18 ? this.currentHole + 1 : 1;
        this.displayHole(nextHole);
    }

    previousHole() {
        const prevHole = this.currentHole > 1 ? this.currentHole - 1 : 18;
        this.displayHole(prevHole);
    }
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.TPCHoleDisplaySystem = TPCHoleDisplaySystem;
} else if (typeof module !== 'undefined') {
    module.exports = TPCHoleDisplaySystem;
}