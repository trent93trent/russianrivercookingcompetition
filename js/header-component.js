// Header Component
class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Determine if we're in the pages directory or root
    const path = window.location.pathname;
    const isInPagesDir = path.includes('/pages/');
    const rootPrefix = isInPagesDir ? '../' : './';
    
    this.innerHTML = `
      <header class="global-header">
        <a href="${rootPrefix}index.html" class="header-logo">
          <h1>RRCC</h1>
        </a>
        
        <button id="mobileMenuBtn" class="mobile-menu-btn">☰</button>
        
        <nav class="header-nav">
          <a href="${rootPrefix}pages/about.html" class="nav-item">About</a>
          <div class="dropdown">
            <a href="#" class="nav-item dropdown-toggle">Previous Years</a>
            <div class="dropdown-content">
              <a href="${rootPrefix}pages/rrcc2024.html" class="dropdown-item">RRCC 2024</a>
            </div>
          </div>
          <a href="${isInPagesDir ? 'chefs.html' : 'pages/chefs.html'}" class="nav-item">Chefs</a>
          <a href="${isInPagesDir ? 'support.html' : 'pages/support.html'}" class="nav-item">Support</a>
          <a href="#" class="nav-item evaluation-portal">Evaluation Portal</a>
        </nav>
      </header>
      
      <!-- Portal Access Modal -->
      <div id="portalAccessModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Judge Evaluation Portal</h2>
          <p>Please enter the password to access the evaluation portal:</p>
          <input type="password" id="portalPassword" placeholder="Enter password">
          <button id="submitPassword">Submit</button>
          <p id="passwordError" class="error-message"></p>
        </div>
      </div>
      
      <!-- Portal Options Modal -->
      <div id="portalOptionsModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Welcome, Judge</h2>
          <p>Please select an option:</p>
          <div class="portal-options">
            <a href="${rootPrefix}pages/assessment.html" class="portal-option">
              <div class="option-icon">📋</div>
              <div class="option-text">
                <h3>Chef Evaluation</h3>
                <p>Evaluate chef performances</p>
              </div>
            </a>
            <a href="${rootPrefix}pages/results.html" class="portal-option">
              <div class="option-icon">📊</div>
              <div class="option-text">
                <h3>View Results</h3>
                <p>See current standings</p>
              </div>
            </a>
          </div>
          <div class="judge-name-container">
            <label for="judgeName">Your Name:</label>
            <input type="text" id="judgeName" placeholder="Enter your name">
            <button id="saveJudgeName">Save</button>
          </div>
        </div>
      </div>
    `;

    // Add event listener for mobile menu button
    const mobileMenuBtn = this.querySelector('#mobileMenuBtn');
    const headerNav = this.querySelector('.header-nav');
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        headerNav.classList.toggle('active');
        mobileMenuBtn.textContent = headerNav.classList.contains('active') ? '✕' : '☰';
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target) && headerNav.classList.contains('active')) {
        headerNav.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      }
    });

    // Handle dropdowns
    const dropdowns = this.querySelectorAll('.dropdown');
    let dropdownTimeout;

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const content = dropdown.querySelector('.dropdown-content');
      
      // Handle mouse events with delay
      if (toggle && content) {
        toggle.addEventListener('mouseenter', () => {
          clearTimeout(dropdownTimeout);
          
          // Close other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown && d.classList.contains('active')) {
              d.classList.remove('active');
              d.querySelector('.dropdown-content').style.display = 'none';
            }
          });
          
          dropdown.classList.add('active');
          content.style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', () => {
          dropdownTimeout = setTimeout(() => {
            dropdown.classList.remove('active');
            content.style.display = '';
            
            // Close other dropdowns
            dropdowns.forEach(d => {
              if (d !== dropdown && d.classList.contains('active')) {
                d.classList.remove('active');
                d.querySelector('.dropdown-content').style.display = '';
              }
            });
          }, 300);
        });
        
        // Handle click for touch devices
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          
          const isActive = dropdown.classList.contains('active');
          
          // Close all dropdowns
          dropdowns.forEach(d => {
            d.classList.remove('active');
            const c = d.querySelector('.dropdown-content');
            if (c) c.style.display = '';
          });
          
          // Toggle current dropdown
          if (!isActive) {
            dropdown.classList.add('active');
            content.style.display = 'block';
          }
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target) || !event.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          const content = dropdown.querySelector('.dropdown-content');
          if (content) content.style.display = '';
        });
      }
    });

    // Set active class for current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = this.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
      }
    });

    // Handle evaluation portal access
    const evaluationPortalLink = this.querySelector('.evaluation-portal');
    const portalAccessModal = this.querySelector('#portalAccessModal');
    const portalOptionsModal = this.querySelector('#portalOptionsModal');
    
    if (evaluationPortalLink && portalAccessModal) {
      evaluationPortalLink.addEventListener('click', (e) => {
        e.preventDefault();
        portalAccessModal.classList.add('active');
        this.querySelector('#portalPassword').focus();
      });
    }
    
    // Close modals when clicking on X
    const closeButtons = this.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        portalAccessModal.classList.remove('active');
        portalOptionsModal.classList.remove('active');
      });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === portalAccessModal) {
        portalAccessModal.classList.remove('active');
      }
      if (event.target === portalOptionsModal) {
        portalOptionsModal.classList.remove('active');
      }
    });
    
    // Handle password submission
    const submitPasswordButton = this.querySelector('#submitPassword');
    if (submitPasswordButton) {
      submitPasswordButton.addEventListener('click', () => {
        const password = this.querySelector('#portalPassword').value;
        const errorElement = this.querySelector('#passwordError');
        
        if (password === 'casatranquilo') {
          portalAccessModal.classList.remove('active');
          portalOptionsModal.classList.add('active');
          this.querySelector('#judgeName').focus();
          errorElement.textContent = '';
        } else {
          errorElement.textContent = 'Incorrect password. Please try again.';
        }
      });
    }
    
    // Handle judge name saving
    const saveJudgeNameButton = this.querySelector('#saveJudgeName');
    if (saveJudgeNameButton) {
      saveJudgeNameButton.addEventListener('click', () => {
        const judgeName = this.querySelector('#judgeName').value;
        if (judgeName.trim() !== '') {
          sessionStorage.setItem('judgeName', judgeName);
          alert(`Welcome, ${judgeName}! You can now access the evaluation tools.`);
        } else {
          alert('Please enter your name before proceeding.');
        }
      });
    }
  }
}

// Define the custom element
customElements.define('header-component', HeaderComponent); 