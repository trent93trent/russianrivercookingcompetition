document.addEventListener('DOMContentLoaded', () => {
    const evaluationsGrid = document.getElementById('evaluationsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterChef = document.getElementById('filterChef');
    const filterJudge = document.getElementById('filterJudge');
    const sortBy = document.getElementById('sortBy');

    let evaluations = [];
    let chefs = new Set();
    let judges = new Set();

    // Load and initialize data
    function loadData() {
        evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        
        // Collect unique chefs and judges
        evaluations.forEach(eval => {
            chefs.add(eval.chefName);
            judges.add(eval.judgeName);
        });

        // Populate filter dropdowns
        populateDropdowns();
        
        // Initial display
        displayEvaluations();
    }

    // Populate filter dropdowns
    function populateDropdowns() {
        // Sort chefs and judges alphabetically
        const sortedChefs = Array.from(chefs).sort();
        const sortedJudges = Array.from(judges).sort();

        // Populate chef filter
        sortedChefs.forEach(chef => {
            const option = document.createElement('option');
            option.value = chef;
            option.textContent = chef;
            filterChef.appendChild(option);
        });

        // Populate judge filter
        sortedJudges.forEach(judge => {
            const option = document.createElement('option');
            option.value = judge;
            option.textContent = judge;
            filterJudge.appendChild(option);
        });
    }

    // Display evaluations with current filters and sort
    function displayEvaluations() {
        let filtered = [...evaluations];

        // Apply chef filter
        if (filterChef.value) {
            filtered = filtered.filter(eval => eval.chefName === filterChef.value);
        }

        // Apply judge filter
        if (filterJudge.value) {
            filtered = filtered.filter(eval => eval.judgeName === filterJudge.value);
        }

        // Apply search
        if (searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(eval => 
                eval.chefName.toLowerCase().includes(searchTerm) ||
                eval.judgeName.toLowerCase().includes(searchTerm) ||
                (eval.comments && eval.comments.toLowerCase().includes(searchTerm))
            );
        }

        // Apply sorting
        switch(sortBy.value) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'score-desc':
                filtered.sort((a, b) => b.totalScore - a.totalScore);
                break;
            case 'score-asc':
                filtered.sort((a, b) => a.totalScore - b.totalScore);
                break;
        }

        // Generate HTML for evaluations
        evaluationsGrid.innerHTML = filtered.map(eval => {
            // Get all possible comments
            const comments = [];
            if (eval.comments && eval.comments.trim()) {
                comments.push(eval.comments.trim());
            }
            if (eval.notes) {
                if (typeof eval.notes === 'object') {
                    Object.entries(eval.notes).forEach(([criteria, note]) => {
                        if (note && note.trim()) {
                            comments.push(`${criteria}: ${note.trim()}`);
                        }
                    });
                } else if (typeof eval.notes === 'string' && eval.notes.trim()) {
                    comments.push(eval.notes.trim());
                }
            }
            if (eval.additionalNotes && eval.additionalNotes.trim()) {
                comments.push(eval.additionalNotes.trim());
            }

            return `
                <div class="evaluation-card ${eval.goldenSpoon ? 'golden-spoon' : ''}">
                    <div class="eval-header">
                        <div class="eval-chef">
                            <img src="images/chefs/${getChefImage(eval.chefId)}.jpg" 
                                 alt="Chef ${eval.chefName}"
                                 onerror="this.src='images/chefs/default-chef.jpg'"
                                 loading="lazy">
                            <h3>${eval.chefName}</h3>
                        </div>
                        <div class="eval-meta">
                            <div class="judge-info">
                                <span class="judge-name">Judge: ${eval.judgeName}</span>
                            </div>
                            <div class="total-score ${eval.goldenSpoon ? 'golden' : ''}">
                                ${eval.totalScore}
                                ${eval.goldenSpoon ? '<span class="golden-icon">🥄</span>' : ''}
                            </div>
                        </div>
                    </div>

                    <div class="criteria-scores">
                        ${Object.entries(eval.scores || {}).map(([criteria, score]) => `
                            <div class="criteria-item">
                                <div class="criteria-label">${criteria.charAt(0).toUpperCase() + criteria.slice(1)}</div>
                                <div class="criteria-bar">
                                    <div class="criteria-fill" style="width: ${(score / 10) * 100}%"></div>
                                </div>
                                <div class="criteria-value">${score}</div>
                            </div>
                        `).join('')}
                    </div>

                    ${comments.length > 0 ? `
                        <div class="eval-comments">
                            ${comments.map(comment => `
                                <p>${comment}</p>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // Helper function to get chef image filename
    function getChefImage(id) {
        id = id.toString().toLowerCase();
        if (id === 'john doe' || id === '1') return 'justin';
        if (id === 'jane smith' || id === '2') return 'marco';
        if (id === 'mike johnson' || id === '3') return 'jun';
        if (id === '4') return 'david';
        return id;
    }

    // Event listeners for filters and search
    searchInput.addEventListener('input', displayEvaluations);
    filterChef.addEventListener('change', displayEvaluations);
    filterJudge.addEventListener('change', displayEvaluations);
    sortBy.addEventListener('change', displayEvaluations);

    // Initialize the page
    loadData();
}); 