document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const chefCards = document.getElementById('chefCards');

    // Initialize data from localStorage
    let data = JSON.parse(localStorage.getItem('evaluations') || '[]');
    if (!data) {
        data = [];
        localStorage.setItem('evaluations', JSON.stringify(data));
    }

    // Calculate chef statistics
    function calculateChefStats() {
        const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        
        const chefStats = {};
        const highestScores = {
            presentation: -1,
            taste: -1,
            technique: -1,
            creativity: -1
        };

        // First pass: Calculate total scores for each chef
        evaluations.forEach(eval => {
            const chefId = eval.chefId.toString().toLowerCase();
            const displayName = chefId === 'john doe' || chefId === '1' ? 'Chef Justin' :
                              chefId === 'jane smith' || chefId === '2' ? 'Chef Marco' :
                              chefId === 'mike johnson' || chefId === '3' ? 'Chef Jun' :
                              chefId === '4' ? 'Chef David' :
                              eval.chefName;

            if (!chefStats[chefId]) {
                chefStats[chefId] = {
                    id: chefId,
                    name: displayName,
                    totalPoints: 0,
                    evaluationCount: 0,
                    goldenSpoons: 0,
                    criteria: {
                        presentation: 0,
                        taste: 0,
                        technique: 0,
                        creativity: 0
                    },
                    recentComments: []
                };
            }

            const stats = chefStats[chefId];
            stats.totalPoints += parseInt(eval.totalScore || 0);
            stats.evaluationCount++;
            if (eval.goldenSpoon) stats.goldenSpoons++;

            // Track comments if they exist
            let longestComment = '';
            
            if (eval.comments && eval.comments.trim()) {
                longestComment = eval.comments.trim();
            } else if (eval.notes && typeof eval.notes === 'object') {
                Object.values(eval.notes)
                    .filter(note => note && note.trim())
                    .forEach(note => {
                        if (note.trim().length > longestComment.length) {
                            longestComment = note.trim();
                        }
                    });
            } else if (eval.notes && typeof eval.notes === 'string' && eval.notes.trim()) {
                longestComment = eval.notes.trim();
            } else if (eval.additionalNotes && eval.additionalNotes.trim()) {
                longestComment = eval.additionalNotes.trim();
            }

            if (longestComment) {
                stats.recentComments.push({
                    text: longestComment,
                    judgeName: eval.judgeName || 'Anonymous Judge',
                    date: eval.date || eval.timestamp || new Date().toISOString(),
                    length: longestComment.length
                });
            }

            // Sum up criteria scores
            const scores = eval.scores || eval.criteria || {};
            Object.entries(scores).forEach(([criteria, score]) => {
                stats.criteria[criteria] += parseInt(score || 0);
            });
        });

        // Sort comments by length (longest first) and keep only the 3 longest
        Object.values(chefStats).forEach(chef => {
            chef.recentComments.sort((a, b) => b.length - a.length);
            chef.recentComments = chef.recentComments.slice(0, 3);
        });

        // Second pass: Find highest scores
        Object.values(chefStats).forEach(chef => {
            Object.entries(chef.criteria).forEach(([criteria, score]) => {
                if (score > highestScores[criteria]) {
                    highestScores[criteria] = score;
                }
            });
        });

        // Third pass: Mark highest scores
        Object.values(chefStats).forEach(chef => {
            Object.entries(chef.criteria).forEach(([criteria, score]) => {
                chef.criteria[criteria] = {
                    score: score,
                    isHighest: score > 0 && score === highestScores[criteria]
                };
            });
        });

        return chefStats;
    }

    // Update chef summary cards
    function updateChefCards() {
        const chefStats = calculateChefStats();
        const chefs = Object.values(chefStats);

        // Sort chefs by total points (highest first)
        chefs.sort((a, b) => b.totalPoints - a.totalPoints);

        // Create chef cards
        chefCards.innerHTML = chefs.map(chef => {
            // Get correct image filename
            const getImageName = (id) => {
                id = id.toString().toLowerCase();
                if (id === 'john doe' || id === '1') return 'justin';
                if (id === 'jane smith' || id === '2') return 'marco';
                if (id === 'mike johnson' || id === '3') return 'jun';
                if (id === '4') return 'david';
                return id;
            };

            const commentsSection = chef.recentComments.length > 0 
                ? `
                    <div class="judge-comments-section">
                        <button class="comments-toggle">
                            <span class="toggle-text">See what the judges had to say</span>
                            <span class="toggle-icon">▼</span>
                        </button>
                        <div class="comments-carousel">
                            ${chef.recentComments.map(comment => `
                                <div class="comment-card">
                                    <div class="comment-text">"${comment.text}" - ${comment.judgeName}</div>
                                    <div class="comment-meta">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `
                : '';
            
            return `
            <div class="chef-summary-card">
                <div class="chef-header">
                    <img src="images/chefs/${getImageName(chef.id)}.jpg" 
                         alt="Chef ${chef.name}"
                         onerror="this.src='images/chefs/default-chef.jpg'"
                         loading="lazy">
                    <div class="chef-info">
                        <div class="chef-name-section">
                            <div class="chef-name">${chef.name}</div>
                        </div>
                        <div class="chef-stats">
                            <div class="stat-item">
                                <div class="stat-label">Total Score</div>
                                <div class="stat-value highlight">${chef.totalPoints}</div>
                            </div>
                            ${chef.goldenSpoons > 0 ? `
                            <div class="stat-item golden-stat">
                                <div class="stat-label">Golden Spoons</div>
                                <div class="stat-value">${chef.goldenSpoons}</div>
                            </div>
                            ` : `
                            <div class="stat-item">
                                <div class="stat-label">Golden Spoons</div>
                                <div class="stat-value">0</div>
                            </div>
                            `}
                        </div>
                    </div>
                </div>

                <div class="criteria-breakdown">
                    ${Object.entries(chef.criteria).map(([criteria, data]) => `
                        <div class="criteria-item ${data.isHighest ? 'highest-score' : ''}">
                            <div class="criteria-label">${criteria.charAt(0).toUpperCase() + criteria.slice(1)}</div>
                            <div class="criteria-bar">
                                <div class="criteria-fill" style="width: ${(data.score / (chef.evaluationCount * 10)) * 100}%"></div>
                            </div>
                            <div class="criteria-value">${data.score}</div>
                        </div>
                    `).join('')}
                </div>

                ${commentsSection}
            </div>
            `;
        }).join('');

        // Add click handlers for comment toggles
        document.querySelectorAll('.comments-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const section = button.closest('.judge-comments-section');
                const carousel = section.querySelector('.comments-carousel');
                const icon = button.querySelector('.toggle-icon');
                const text = button.querySelector('.toggle-text');
                
                if (carousel.classList.contains('expanded')) {
                    carousel.classList.remove('expanded');
                    icon.style.transform = 'rotate(0deg)';
                    text.textContent = 'See what the judges had to say';
                } else {
                    carousel.classList.add('expanded');
                    icon.style.transform = 'rotate(180deg)';
                    text.textContent = 'Hide judges\' comments';
                }
            });
        });
    }

    // Event listeners
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all evaluations? This cannot be undone.')) {
            localStorage.removeItem('evaluations');
            updateChefCards();
        }
    });

    // Initial load
    updateChefCards();
}); 