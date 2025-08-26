const courseData = {
    name: "TPC Sawgrass - THE PLAYERS Stadium Course",
    totalPar: 72,
    totalYardage: 6394,
    holes: [
        {
            number: 1,
            par: 4,
            yardage: 394,
            handicap: 11,
            difficulty: 13,
            scoringAverage: 3.954,
            description: "Slight dogleg right demanding accuracy from the tee"
        },
        {
            number: 2,
            par: 5,
            yardage: 532,
            handicap: 15,
            difficulty: 16,
            scoringAverage: 4.523,
            description: "Long par 5 with bunkers guarding the green"
        },
        {
            number: 3,
            par: 3,
            yardage: 177,
            handicap: 17,
            difficulty: 3,
            scoringAverage: 3.195,
            description: "Mid-iron to well-protected green"
        },
        {
            number: 4,
            par: 4,
            yardage: 384,
            handicap: 9,
            difficulty: 6,
            scoringAverage: 4.021,
            description: "Strategic placement off tee, elevated green"
        },
        {
            number: 5,
            par: 4,
            yardage: 471,
            handicap: 3,
            difficulty: 1,
            scoringAverage: 4.198,
            description: "Longest and toughest par 4 on the course"
        },
        {
            number: 6,
            par: 4,
            yardage: 393,
            handicap: 13,
            difficulty: 10,
            scoringAverage: 3.987,
            description: "Dogleg left with water hazard"
        },
        {
            number: 7,
            par: 4,
            yardage: 442,
            handicap: 1,
            difficulty: 5,
            scoringAverage: 4.087,
            description: "Challenging par 4 with bunkers and water"
        },
        {
            number: 8,
            par: 3,
            yardage: 237,
            handicap: 7,
            difficulty: 2,
            scoringAverage: 3.234,
            description: "Long par 3 over water to large green"
        },
        {
            number: 9,
            par: 5,
            yardage: 583,
            handicap: 5,
            difficulty: 14,
            scoringAverage: 4.698,
            description: "Reachable par 5 with risk/reward second shot"
        },
        {
            number: 10,
            par: 4,
            yardage: 424,
            handicap: 12,
            difficulty: 9,
            scoringAverage: 4.032,
            description: "Start of challenging back nine"
        },
        {
            number: 11,
            par: 5,
            yardage: 558,
            handicap: 8,
            difficulty: 15,
            scoringAverage: 4.632,
            description: "Par 5 with water hazard down left side"
        },
        {
            number: 12,
            par: 4,
            yardage: 358,
            handicap: 16,
            difficulty: 18,
            scoringAverage: 3.821,
            description: "Shortest and easiest par 4 on course"
        },
        {
            number: 13,
            par: 3,
            yardage: 181,
            handicap: 18,
            difficulty: 8,
            scoringAverage: 3.098,
            description: "Par 3 to large undulating green"
        },
        {
            number: 14,
            par: 4,
            yardage: 481,
            handicap: 4,
            difficulty: 4,
            scoringAverage: 4.123,
            description: "Long par 4 with water hazard"
        },
        {
            number: 15,
            par: 4,
            yardage: 449,
            handicap: 6,
            difficulty: 11,
            scoringAverage: 4.054,
            description: "Dogleg right with strategic bunkering"
        },
        {
            number: 16,
            par: 5,
            yardage: 523,
            handicap: 10,
            difficulty: 17,
            scoringAverage: 4.589,
            description: "Par 5 with water hazard protecting green"
        },
        {
            number: 17,
            par: 3,
            yardage: 137,
            handicap: 14,
            difficulty: 12,
            scoringAverage: 3.156,
            description: "World famous Island Green par 3",
            isSignature: true
        },
        {
            number: 18,
            par: 4,
            yardage: 462,
            handicap: 2,
            difficulty: 7,
            scoringAverage: 4.089,
            description: "Finishing hole with grandstand and water"
        }
    ]
};

class TpcScorecardApp {
    constructor() {
        this.players = [
            { id: '1', name: 'Player 1', scores: new Array(18).fill('') },
            { id: '2', name: 'Player 2', scores: new Array(18).fill('') }
        ];
        this.nextPlayerId = 3;
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.renderPlayers();
        this.renderHoles();
        this.setupEventListeners();
        this.updateScores();
    }

    setupEventListeners() {
        // Add player button
        document.getElementById('addPlayerBtn').addEventListener('click', () => this.addPlayer());

        // Control buttons
        document.getElementById('exportBtn').addEventListener('click', () => this.exportScorecard());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearScores());
        document.getElementById('statsBtn').addEventListener('click', () => this.showStats());

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => this.hideModal());
        document.getElementById('statsModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideModal();
        });
    }

    addPlayer() {
        if (this.players.length >= 4) {
            alert('Maximum of 4 players allowed!');
            return;
        }
        
        const newPlayer = {
            id: this.nextPlayerId.toString(),
            name: `Player ${this.nextPlayerId}`,
            scores: new Array(18).fill('')
        };
        this.players.push(newPlayer);
        this.nextPlayerId++;
        
        this.renderPlayers();
        this.renderHoles();
        this.updateScores();
        this.saveToStorage();
    }

    removePlayer(playerId) {
        if (this.players.length <= 1) {
            alert('You must have at least one player!');
            return;
        }
        
        if (confirm('Are you sure you want to remove this player?')) {
            this.players = this.players.filter(player => player.id !== playerId);
            this.renderPlayers();
            this.renderHoles();
            this.updateScores();
            this.saveToStorage();
        }
    }

    renderPlayers() {
        const playerScores = document.getElementById('playerScores');
        playerScores.innerHTML = '';

        this.players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                ${this.players.length > 1 ? `<button class="player-remove" onclick="app.removePlayer('${player.id}')">&times;</button>` : ''}
                <input type="text" 
                       class="player-name" 
                       data-player-id="${player.id}"
                       placeholder="Enter player name" 
                       value="${player.name === `Player ${player.id}` ? '' : player.name}"
                       maxlength="20">
                <div class="score-info">
                    <div class="total-score" id="player${player.id}Total">-</div>
                    <div class="to-par" id="player${player.id}ToPar">E</div>
                </div>
                <div class="player-stats">
                    <span class="stat-item">
                        <span class="stat-label">Thru</span>
                        <span class="stat-value" id="player${player.id}Thru">0</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">Out</span>
                        <span class="stat-value" id="player${player.id}Out">-</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">In</span>
                        <span class="stat-value" id="player${player.id}In">-</span>
                    </span>
                </div>
            `;
            playerScores.appendChild(playerCard);
        });

        // Update player count
        document.getElementById('playerCount').textContent = 
            `${this.players.length} Player${this.players.length > 1 ? 's' : ''}`;

        // Add event listeners to player name inputs
        document.querySelectorAll('.player-name').forEach(input => {
            input.addEventListener('input', (e) => {
                const playerId = e.target.dataset.playerId;
                const player = this.players.find(p => p.id === playerId);
                if (player) {
                    player.name = e.target.value || `Player ${playerId}`;
                    this.renderHoles(); // Update hole labels
                    this.saveToStorage();
                }
            });
        });
    }

    renderHoles() {
        const holesGrid = document.getElementById('holesGrid');
        holesGrid.innerHTML = '';

        courseData.holes.forEach((hole, holeIndex) => {
            const holeCard = document.createElement('div');
            holeCard.className = `hole-card ${hole.isSignature ? 'island-green' : ''}`;
            
            let playersHTML = '';
            this.players.forEach(player => {
                const displayName = player.name === `Player ${player.id}` ? `Player ${player.id}` : player.name;
                playersHTML += `
                    <div class="score-input-group">
                        <label class="score-label">${displayName}</label>
                        <input type="number" 
                               class="score-input" 
                               data-hole="${holeIndex}"
                               data-player-id="${player.id}"
                               value="${player.scores[holeIndex]}"
                               min="1" 
                               max="15"
                               placeholder="-">
                    </div>
                `;
            });
            
            holeCard.innerHTML = `
                <div class="hole-header">
                    <div class="hole-number">${hole.number}</div>
                    <div class="hole-info">
                        <div class="hole-par">Par ${hole.par}</div>
                        <div class="hole-yardage">${hole.yardage} yards</div>
                    </div>
                    <div class="hole-handicap">
                        <span class="handicap-label">HCP</span>
                        <span class="handicap-value">${hole.handicap}</span>
                    </div>
                </div>
                
                <div class="hole-stats">
                    <div class="hole-stat">
                        <span class="hole-stat-label">Difficulty</span>
                        <span class="hole-stat-value">#${hole.difficulty}</span>
                    </div>
                    <div class="hole-stat">
                        <span class="hole-stat-label">Tour Avg</span>
                        <span class="hole-stat-value">${hole.scoringAverage}</span>
                    </div>
                </div>
                
                <div class="hole-scores" style="grid-template-columns: repeat(${this.players.length <= 2 ? this.players.length : 2}, 1fr); ${this.players.length > 2 ? 'gap: 0.5rem;' : ''}">
                    ${playersHTML}
                </div>
                
                ${hole.isSignature ? '<div class="signature-note">🏝️ Famous Island Green - One of golf\'s most iconic holes!</div>' : ''}
            `;
            
            holesGrid.appendChild(holeCard);
        });

        // Add event listeners to score inputs
        document.querySelectorAll('.score-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateScore(
                    e.target.dataset.playerId,
                    parseInt(e.target.dataset.hole),
                    e.target.value
                );
            });
        });
    }

    updateScore(playerId, holeIndex, score) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.scores[holeIndex] = score === '' ? '' : parseInt(score);
            this.updateScores();
            this.updateScoreColors();
            this.saveToStorage();
        }
    }

    updateScores() {
        let totalHolesCompleted = 0;

        this.players.forEach(player => {
            const scores = player.scores;
            const completed = scores.filter(s => s !== '').length;
            const total = scores.reduce((sum, score) => sum + (score || 0), 0);
            
            totalHolesCompleted += completed;
            
            // Calculate front nine (holes 1-9)
            const frontNine = scores.slice(0, 9).reduce((sum, score) => sum + (score || 0), 0);
            const frontNineCompleted = scores.slice(0, 9).filter(s => s !== '').length;
            
            // Calculate back nine (holes 10-18)
            const backNine = scores.slice(9, 18).reduce((sum, score) => sum + (score || 0), 0);
            const backNineCompleted = scores.slice(9, 18).filter(s => s !== '').length;
            
            // Calculate to par
            const completedPar = scores.reduce((sum, score, index) => {
                return sum + (score !== '' ? courseData.holes[index].par : 0);
            }, 0);
            const toPar = total - completedPar;
            
            // Update display
            const totalElement = document.getElementById(`player${player.id}Total`);
            const thruElement = document.getElementById(`player${player.id}Thru`);
            const outElement = document.getElementById(`player${player.id}Out`);
            const inElement = document.getElementById(`player${player.id}In`);
            const toParElement = document.getElementById(`player${player.id}ToPar`);
            
            if (totalElement) totalElement.textContent = total || '-';
            if (thruElement) thruElement.textContent = completed;
            if (outElement) outElement.textContent = frontNineCompleted > 0 ? frontNine : '-';
            if (inElement) inElement.textContent = backNineCompleted > 0 ? backNine : '-';
            
            if (toParElement) {
                if (completed === 0) {
                    toParElement.textContent = 'E';
                    toParElement.className = 'to-par';
                } else {
                    if (toPar < 0) {
                        toParElement.textContent = toPar;
                        toParElement.className = 'to-par under';
                    } else if (toPar > 0) {
                        toParElement.textContent = `+${toPar}`;
                        toParElement.className = 'to-par over';
                    } else {
                        toParElement.textContent = 'E';
                        toParElement.className = 'to-par';
                    }
                }
            }
        });

        // Update progress bar
        const totalPossibleHoles = this.players.length * 18;
        const progressPercent = totalPossibleHoles > 0 ? (totalHolesCompleted / totalPossibleHoles) * 100 : 0;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        
        const averageCompletion = this.players.length > 0 ? Math.floor(totalHolesCompleted / this.players.length) : 0;
        document.getElementById('progressText').textContent = 
            `Average: ${averageCompletion} of 18 holes completed`;
    }

    updateScoreColors() {
        document.querySelectorAll('.score-input').forEach(input => {
            const playerId = input.dataset.playerId;
            const holeIndex = parseInt(input.dataset.hole);
            const player = this.players.find(p => p.id === playerId);
            
            if (!player) return;
            
            const score = player.scores[holeIndex];
            const par = courseData.holes[holeIndex].par;
            
            if (score === '' || score === null || score === undefined) {
                input.className = 'score-input';
                return;
            }
            
            const scoreToPar = score - par;
            let className = 'score-input';
            
            if (scoreToPar <= -2) {
                className += ' eagle';
            } else if (scoreToPar === -1) {
                className += ' birdie';
            } else if (scoreToPar === 0) {
                className += ' par';
            } else if (scoreToPar === 1) {
                className += ' bogey';
            } else if (scoreToPar >= 2) {
                className += ' double-bogey';
            }
            
            input.className = className;
        });
    }

    clearScores() {
        if (confirm('Are you sure you want to clear all scores for all players?')) {
            this.players.forEach(player => {
                player.scores = new Array(18).fill('');
                player.name = `Player ${player.id}`;
            });
            
            this.renderPlayers();
            this.renderHoles();
            this.updateScores();
            this.saveToStorage();
        }
    }

    showStats() {
        const statsContent = document.getElementById('statsContent');
        let html = '';

        this.players.forEach(player => {
            const completedScores = player.scores.filter(s => s !== '');
            
            if (completedScores.length === 0) return;

            const stats = this.calculatePlayerStats(player);
            const displayName = player.name === `Player ${player.id}` ? `Player ${player.id}` : player.name;

            html += `
                <div class="stats-section">
                    <h3 class="stats-player-name">${displayName}</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-card-label">Eagles</span>
                            <span class="stat-card-value">${stats.eagles}</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-card-label">Birdies</span>
                            <span class="stat-card-value">${stats.birdies}</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-card-label">Pars</span>
                            <span class="stat-card-value">${stats.pars}</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-card-label">Bogeys</span>
                            <span class="stat-card-value">${stats.bogeys}</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-card-label">Double+</span>
                            <span class="stat-card-value">${stats.doubles}</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-card-label">Best Hole</span>
                            <span class="stat-card-value">${stats.bestHole}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        if (html === '') {
            html = '<p>No statistics available yet. Start recording scores to see detailed statistics for each player!</p>';
        }

        statsContent.innerHTML = html;
        document.getElementById('statsModal').classList.add('show');
    }

    hideModal() {
        document.getElementById('statsModal').classList.remove('show');
    }

    calculatePlayerStats(player) {
        const scores = player.scores;
        const stats = { eagles: 0, birdies: 0, pars: 0, bogeys: 0, doubles: 0, bestHole: '-' };
        let bestScore = null;
        let bestHole = null;

        scores.forEach((score, index) => {
            if (score === '' || score === null || score === undefined) return;
            
            const par = courseData.holes[index].par;
            const scoreToPar = score - par;
            
            if (scoreToPar <= -2) stats.eagles++;
            else if (scoreToPar === -1) stats.birdies++;
            else if (scoreToPar === 0) stats.pars++;
            else if (scoreToPar === 1) stats.bogeys++;
            else if (scoreToPar >= 2) stats.doubles++;
            
            if (bestScore === null || scoreToPar < bestScore) {
                bestScore = scoreToPar;
                bestHole = index + 1;
            }
        });

        if (bestHole !== null) {
            if (bestScore <= -2) stats.bestHole = `#${bestHole} (Eagle)`;
            else if (bestScore === -1) stats.bestHole = `#${bestHole} (Birdie)`;
            else stats.bestHole = `#${bestHole}`;
        }

        return stats;
    }

    exportScorecard() {
        const printWindow = window.open('', '_blank');
        const html = this.generatePrintableScorecard();
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    generatePrintableScorecard() {
        let holesHTML = '';
        let playerColumns = '';
        let totalColumns = '';
        
        // Generate player column headers
        this.players.forEach(player => {
            const displayName = player.name === `Player ${player.id}` ? `Player ${player.id}` : player.name;
            playerColumns += `<th>${displayName}</th>`;
            
            const total = player.scores.reduce((sum, score) => sum + (score || 0), 0) || '-';
            totalColumns += `<td class="score-cell"><strong>${total}</strong></td>`;
        });
        
        // Generate hole rows
        courseData.holes.forEach((hole, index) => {
            let playerScores = '';
            this.players.forEach(player => {
                const score = player.scores[index] || '-';
                playerScores += `<td class="score-cell">${score}</td>`;
            });
            
            holesHTML += `
                <tr>
                    <td class="hole-num">${hole.number}${hole.isSignature ? ' 🏝️' : ''}</td>
                    <td>${hole.par}</td>
                    <td>${hole.yardage}</td>
                    <td>${hole.handicap}</td>
                    ${playerScores}
                </tr>
            `;
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>TPC Sawgrass Scorecard - In Pursuit of Par</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Times New Roman', serif; 
                        padding: 20px; 
                        background: #f9f9f9;
                        color: #333;
                    }
                    .scorecard {
                        background: white;
                        border: 3px solid #1a5f3f;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 2px solid #c9a96e;
                        padding-bottom: 20px;
                    }
                    .course-name { 
                        font-size: 28px; 
                        font-weight: bold; 
                        margin-bottom: 8px; 
                        color: #1a5f3f;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                    }
                    .course-subtitle { 
                        font-size: 18px; 
                        color: #c9a96e; 
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .game-info {
                        font-size: 14px;
                        color: #666;
                        font-style: italic;
                        margin-top: 10px;
                    }
                    .board-game-title {
                        font-size: 16px;
                        color: #1a5f3f;
                        font-weight: bold;
                        margin: 10px 0 5px 0;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0;
                        border: 2px solid #1a5f3f;
                    }
                    th, td { 
                        border: 1px solid #1a5f3f; 
                        padding: 8px 6px; 
                        text-align: center; 
                        vertical-align: middle;
                    }
                    th { 
                        background: linear-gradient(135deg, #1a5f3f, #0d3926); 
                        color: white;
                        font-weight: bold; 
                        font-size: 13px;
                    }
                    .hole-num { 
                        font-weight: bold; 
                        background: #f5f2e8;
                    }
                    .score-cell { 
                        font-weight: bold; 
                        font-size: 16px; 
                        background: #fafafa;
                    }
                    .totals { 
                        border-top: 3px solid #1a5f3f; 
                        background: #c9a96e;
                    }
                    .totals td, .totals th {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .course-stats {
                        display: flex;
                        justify-content: space-around;
                        margin: 20px 0;
                        background: #f5f2e8;
                        padding: 15px;
                        border-radius: 5px;
                        border: 1px solid #c9a96e;
                    }
                    .stat-item {
                        text-align: center;
                    }
                    .stat-label {
                        font-size: 12px;
                        color: #666;
                        text-transform: uppercase;
                        display: block;
                        margin-bottom: 3px;
                    }
                    .stat-value {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1a5f3f;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        padding-top: 20px;
                        border-top: 2px solid #c9a96e;
                    }
                    .board-game-credit {
                        font-size: 14px;
                        color: #1a5f3f;
                        font-weight: bold;
                        margin-bottom: 8px;
                    }
                    .board-game-details {
                        font-size: 12px;
                        color: #666;
                        font-style: italic;
                    }
                    .signature-hole {
                        background: #e8f5f0 !important;
                    }
                </style>
            </head>
            <body>
                <div class="scorecard">
                    <div class="header">
                        <div class="course-name">TPC Sawgrass</div>
                        <div class="course-subtitle">THE PLAYERS Stadium Course</div>
                        <div class="game-info">Designed by Pete & Alice Dye</div>
                        <div class="board-game-title">🎲 "In Pursuit of Par" Board Game Edition</div>
                        <div class="game-info">Tournament-Accurate Course Data • Championship-Level Challenge</div>
                    </div>
                    
                    <div class="course-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Par</span>
                            <span class="stat-value">72</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Yardage</span>
                            <span class="stat-value">6,394</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Players</span>
                            <span class="stat-value">${this.players.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Date</span>
                            <span class="stat-value">${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Hole</th>
                                <th>Par</th>
                                <th>Yards</th>
                                <th>HCP</th>
                                ${playerColumns}
                            </tr>
                        </thead>
                        <tbody>
                            ${holesHTML}
                            <tr class="totals">
                                <th>TOTAL</th>
                                <th>72</th>
                                <th>6,394</th>
                                <th>-</th>
                                ${totalColumns}
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <div class="board-game-credit">"In Pursuit of Par" Board Game (1987)</div>
                        <div class="board-game-details">
                            by Pursuit of Par Enterprises • Panama City Beach, FL<br>
                            Experience championship golf with authentic tournament statistics and strategic course management
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    saveToStorage() {
        try {
            const data = {
                players: this.players,
                nextPlayerId: this.nextPlayerId
            };
            localStorage.setItem('tpcScorecardData', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('tpcScorecardData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.players = data.players || [
                    { id: '1', name: 'Player 1', scores: new Array(18).fill('') },
                    { id: '2', name: 'Player 2', scores: new Array(18).fill('') }
                ];
                this.nextPlayerId = data.nextPlayerId || 3;
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }
}

// Make app globally accessible for remove player functionality
let app;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new TpcScorecardApp();
});