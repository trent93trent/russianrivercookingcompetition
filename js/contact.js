document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill out all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll simulate a successful submission
            
            // Simulate form submission with a delay
            showFormMessage('Sending your message...', 'info');
            
            setTimeout(function() {
                // Simulate successful submission
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                
                // In a real application, you would use fetch or XMLHttpRequest to send the data
                console.log('Form submitted with the following data:');
                console.log({
                    name,
                    email,
                    subject,
                    message
                });
            }, 1500);
        });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert message before the submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        contactForm.insertBefore(messageElement, submitBtn);
        
        // Auto-remove success and info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(function() {
                messageElement.remove();
            }, 5000);
        }
    }
    
    // Add styles for form messages
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .form-message.error {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ef9a9a;
        }
        
        .form-message.success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #a5d6a7;
        }
        
        .form-message.info {
            background-color: #e3f2fd;
            color: #1565c0;
            border: 1px solid #90caf9;
        }
    `;
    document.head.appendChild(style);
}); 