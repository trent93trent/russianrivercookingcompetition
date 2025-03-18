document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const merchBtns = document.querySelectorAll('.merch-btn');
    
    let cart = [];
    
    // Merchandise buttons
    if (merchBtns.length > 0) {
        merchBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const merchItem = this.closest('.merch-item');
                const itemName = merchItem.querySelector('h3').textContent;
                const itemPrice = merchItem.querySelector('.merch-price').textContent;
                
                // Add to cart (in a real app, this would update a cart UI)
                cart.push({
                    name: itemName,
                    price: itemPrice
                });
                
                // Show confirmation
                alert(`${itemName} added to cart!`);
                
                // Log cart (in a real app, this would update a cart UI)
                console.log('Cart:', cart);
            });
        });
    }
}); 