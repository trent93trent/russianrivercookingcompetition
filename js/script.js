document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('judgingForm');
    const criteriaInputs = ['presentation', 'taste', 'technique', 'creativity'];
    const chefGrid = document.getElementById('chefGrid');
    const selectedChefId = document.getElementById('selectedChefId');
    const selectedChefName = document.getElementById('selectedChefName');
    const selectedChefStatus = document.getElementById('selectedChefStatus');
    
    console.log('DOM Content Loaded');
    console.log('Chef Grid Element:', chefGrid);

    // Default chefs data
    const defaultChefs = [
        { id: '1', name: 'Chef Justin', image: 'justin.jpg' },
        { id: '2', name: 'Chef Marco', image: 'marco.jpg' },
        { id: '3', name: 'Chef Jun', image: 'jun.jpg' },
        { id: '4', name: 'Chef David', image: 'david.jpg' }
    ];

    // Populate chef grid
    function populateChefGrid() {
        console.log('Populating chef grid with chefs:', defaultChefs);
        if (!chefGrid) {
            console.error('Chef grid element not found!');
            return;
        }

        // Determine if we're in the pages directory or root
        const isInPagesDir = window.location.pathname.includes('/pages/');
        const imgPathPrefix = isInPagesDir ? '../' : '';

        const chefCardsHTML = defaultChefs.map(chef => `
            <div class="chef-card" data-chef-id="${chef.id}" data-chef-name="${chef.name}">
                <img src="${imgPathPrefix}images/chefs/${chef.image}" alt="${chef.name}" onerror="this.src='${imgPathPrefix}images/chefs/default-chef.jpg'">
                <h3>${chef.name}</h3>
            </div>
        `).join('');

        console.log('Generated HTML:', chefCardsHTML);
        chefGrid.innerHTML = chefCardsHTML;

        // Add click handlers to the newly created chef cards
        const cards = chefGrid.querySelectorAll('.chef-card');
        console.log('Created chef cards:', cards.length);
        attachChefCardHandlers();
    }
    
    // Display judge name if available
    const judgeName = sessionStorage.getItem('judgeName');
    if (judgeName) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.textContent = `Judge: ${judgeName}`;
        const header = document.querySelector('.header');
        if (header) {
            header.insertBefore(welcomeMessage, header.firstChild);
        } else {
            console.error('Header element not found');
        }
    }

    // Initialize the chef grid
    populateChefGrid();
    
    // Update rating values and total score when rating boxes are clicked
    criteriaInputs.forEach(criteria => {
        const ratingBoxes = document.querySelector(`[data-rating-for="${criteria}"]`);
        const input = document.getElementById(criteria);
        
        if (ratingBoxes) {
            // Handle rating box clicks
            ratingBoxes.addEventListener('click', (e) => {
                const box = e.target.closest('.rating-box');
                if (!box) return;

                // Remove selected class from all boxes in this group
                ratingBoxes.querySelectorAll('.rating-box').forEach(b => b.classList.remove('selected'));
                
                // Add selected class to clicked box
                box.classList.add('selected');
                
                // Update hidden input value
                input.value = box.dataset.value;
                
                updateTotalScore();
            });
        }
    });

    // Calculate and update total score
    function updateTotalScore() {
        const total = criteriaInputs.reduce((sum, criteria) => {
            const value = parseInt(document.getElementById(criteria).value) || 0;
            return sum + value;
        }, 0);
        
        document.getElementById('totalScore').textContent = total;
        
        // Show the final score section once ratings are being selected
        document.querySelector('.final-score').style.display = 'block';
    }

    // Handle chef selection
    function attachChefCardHandlers() {
        const chefCards = document.querySelectorAll('.chef-card');
        console.log('Found chef cards:', chefCards.length);
        
        chefCards.forEach((card, index) => {
            console.log(`Chef Card ${index}:`, {
                id: card.dataset.chefId,
                name: card.dataset.chefName
            });
            
            card.addEventListener('click', function(event) {
                console.log('Chef card clicked:', {
                    id: this.dataset.chefId,
                    name: this.dataset.chefName,
                    target: event.target
                });
                
                // Remove selection from all cards
                chefCards.forEach(c => c.classList.remove('selected'));
                
                // Add selection to clicked card
                this.classList.add('selected');
                
                // Update hidden inputs
                selectedChefId.value = this.dataset.chefId;
                selectedChefName.value = this.dataset.chefName;
                
                // Update status message
                selectedChefStatus.textContent = `Currently evaluating: ${this.dataset.chefName}`;
                selectedChefStatus.classList.add('active');
                document.body.classList.add('has-fixed-status');
                
                console.log('Selection updated:', {
                    selectedId: selectedChefId.value,
                    selectedName: selectedChefName.value
                });
            });
        });
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if a chef is selected
        if (!selectedChefId.value) {
            alert('Please select a chef before submitting.');
            return;
        }

        // Check if all criteria have been rated
        const unratedCriteria = criteriaInputs.filter(criteria => 
            !document.getElementById(criteria).value
        );

        if (unratedCriteria.length > 0) {
            alert(`Please rate the following criteria before submitting:\n${unratedCriteria.join(', ')}`);
            return;
        }

        // Create evaluation object
        const evaluation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            judgeName: sessionStorage.getItem('judgeName'),
            chefId: selectedChefId.value,
            chefName: selectedChefName.value,
            scores: {},
            notes: {},
            goldenSpoon: document.getElementById('goldenSpoon').checked,
            totalScore: document.getElementById('totalScore').textContent
        };

        // Collect scores and notes for each criteria
        criteriaInputs.forEach(criteria => {
            evaluation.scores[criteria] = document.getElementById(criteria).value;
            evaluation.notes[criteria] = document.querySelector(`textarea[name="${criteria}Notes"]`).value;
        });

        evaluation.additionalNotes = document.querySelector('textarea[name="additionalNotes"]').value;

        // Store evaluation in localStorage
        const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        evaluations.push(evaluation);
        localStorage.setItem('evaluations', JSON.stringify(evaluations));

        // Show success message
        alert('Evaluation submitted successfully!');

        // Get current judge's evaluated chefs
        const currentJudge = sessionStorage.getItem('judgeName');
        const evaluatedChefs = evaluations
            .filter(eval => eval.judgeName === currentJudge)
            .map(eval => eval.chefId);

        // Filter out already evaluated chefs
        const remainingChefs = defaultChefs.filter(chef => !evaluatedChefs.includes(chef.id));

        // If all chefs have been evaluated, show completion message
        if (remainingChefs.length === 0) {
            alert('You have evaluated all chefs! Returning to main menu.');
            window.location.href = '../index.html';
            return;
        }

        // Determine if we're in the pages directory or root
        const isInPagesDir = window.location.pathname.includes('/pages/');
        const imgPathPrefix = isInPagesDir ? '../' : '';

        // Create popup for chef selection
        const popup = document.createElement('div');
        popup.className = 'chef-selection-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Select Next Chef to Evaluate</h2>
                <p style="text-align: center; margin-bottom: 20px;">Please select the next chef you would like to evaluate</p>
                <div class="popup-chef-grid">
                    ${remainingChefs.map(chef => `
                        <div class="popup-chef-card" data-chef-id="${chef.id}" data-chef-name="${chef.name}">
                            <img src="${imgPathPrefix}images/chefs/${chef.image}" alt="${chef.name}" onerror="this.src='${imgPathPrefix}images/chefs/default-chef.jpg'">
                            <h3>${chef.name}</h3>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="return-home-btn">Return to Home</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Add event listeners to popup chef cards
        popup.querySelectorAll('.popup-chef-card').forEach(card => {
            card.addEventListener('click', () => {
                const chefId = card.dataset.chefId;
                const chefName = card.dataset.chefName;
                
                // Reset the form
                form.reset();
                document.querySelectorAll('.rating-box').forEach(box => box.classList.remove('selected'));
                document.getElementById('totalScore').textContent = '0';
                
                // Update selected chef
                const chefCards = document.querySelectorAll('.chef-card');
                chefCards.forEach(c => {
                    if (c.dataset.chefId === chefId) {
                        c.click();
                    }
                });
                
                // Remove popup
                document.body.removeChild(popup);
            });
        });

        // Add event listener to return home button
        popup.querySelector('.return-home-btn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    });

    // Add CSS for the popup
    const style = document.createElement('style');
    style.textContent = `
        .return-home-btn {
            display: inline-block;
            background-color: transparent;
            color: #8B2323;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            border: 2px solid #8B2323;
            cursor: pointer;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
        }
        
        .return-home-btn:hover {
            background-color: #8B2323;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
}); 