// ========================================
// MODERN NAVIGATION SYSTEM
// ========================================

// Navigation Handler with Smooth Transitions
const API_BASE_URL = 'https://restaurant-backend-lf21.onrender.com'; 
(function() {
    'use strict';
    
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Set active state on page load
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        // Handle navigation clicks with smooth transition
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if it's a page link or hash link
                if (!href.startsWith('#')) {
                    e.preventDefault(); // Prevent immediate navigation
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Add transition class
                    document.body.classList.add('page-transitioning');
                    
                    // Navigate after transition
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                } else {
                    // Hash link - smooth scroll
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Hamburger Menu Toggle
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || 
                                    hamburger.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('mobile-active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation(); // Your existing function
    initHamburgerMenu(); // New hamburger function
});
    
    // Fade in when page loads
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('loginModal');
            closeModal('signupModal');
        }
    });
});
// Book Table button handler
document.addEventListener('DOMContentLoaded', function() {
    const bookTableBtn = document.querySelector('.book-table-btn');
    if (bookTableBtn) {
        bookTableBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const bookingSection = document.querySelector('.booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Order Now button handler
document.addEventListener('DOMContentLoaded', function() {
    const orderNowBtn = document.querySelector('.order-now-btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            showNotification('Redirecting to menu...', 'success');
        });
    }
});



// Submit booking form
function submitBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests')
    };
    
    showNotification('Table booked successfully! We will contact you shortly.', 'success');
    closeBookingModal();
    
    console.log('Booking Data:', bookingData);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="closeNotification(this)" class="notification-close">&times;</button>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.innerHTML = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 500px;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #4CAF50, #45a049);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #f4a623, #e6941f);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 4000);
}

// Close notification
function closeNotification(button) {
    const notification = button.parentNode;
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Smooth animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-item, .discount-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    const dateInput = document.querySelector('#date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    const mainFoodImage = document.querySelector('.food-img');
    const sauceBowls = document.querySelectorAll('.sauce-bowl');
    
    if (mainFoodImage) {
        mainFoodImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        mainFoodImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    sauceBowls.forEach(bowl => {
        bowl.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        bowl.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});


// Menu Data


let menuItems = [];

// Fetch menu items from backend API
async function fetchMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_BASE_URL}/api/menu`);
        const data = await response.json();
        
        if (data.success) {
            // Transform API data to match frontend format
            menuItems = data.data.menuItems.map(item => ({
                id: item._id,
                name: item.name,
                category: item.category.toLowerCase(),
                price: item.price,
                image: item.image,
                description: item.description,
                isAvailable: item.isAvailable,
                discount: item.discount
            }));
            
            // Display menu items after loading
            displayMenuItems('all');
        } else {
            console.error('Failed to load menu items');
            showNotification('Failed to load menu items', 'info');
        }
    } catch (error) {
        console.error('Error fetching menu items:', error);
        showNotification('Error loading menu. Please refresh the page.', 'info');
    }
}

let cart = [];
let currentTestimonialIndex = 0;
let testimonialInterval;

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMenu();
    initializeCart();
    initializeButtons();
    initializeTestimonials();
    initializeNewsletter();
    initializeFooter();
});

function initializeNewsletter() {
    const newsletterInput = document.querySelector('.newsletter-input');
    if (newsletterInput) {
        newsletterInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
}

async function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('.newsletter-input');
    const submitBtn = form.querySelector('.newsletter-btn');
    const checkbox = form.querySelector('input[type="checkbox"]');
    
    const email = emailInput.value.trim();
    
    if (!validateEmail(email)) {
        emailInput.style.borderColor = '#ff4444';
        showNotification('Please enter a valid email address', 'info');
        return;
    }
    
    if (checkbox && !checkbox.checked) {
        showNotification('Please agree to receive promotional emails', 'info');
        return;
    }
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            showNotification(data.message, 'success');
            form.reset();
        } else {
            showNotification(data.message || 'Subscription failed', 'info');
        }
    } catch (error) {
        console.error('Error subscribing:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification('Error subscribing. Please try again.', 'info');
    }
}

function initializeFooter() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
    
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            showNotification(`${linkText} page coming soon!`, 'info');
        });
    });
    
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('aria-label');
            showNotification(`Opening ${platform} page...`, 'info');
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function openDirections() {
    const address = "123 Food Street, Culinary District, City 12345";
    showNotification('Opening Google Maps...', 'info');
    console.log('Opening directions to:', address);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initializeTestimonials() {
    startTestimonialAutoPlay();
    initializeReviewForm();
}

function startTestimonialAutoPlay() {
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function stopTestimonialAutoPlay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (cards[index]) {
        cards[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    currentTestimonialIndex = index;
}

function nextTestimonial() {
    const totalTestimonials = document.querySelectorAll('.testimonial-card').length;
    const nextIndex = (currentTestimonialIndex + 1) % totalTestimonials;
    showTestimonial(nextIndex);
}

function previousTestimonial() {
    const totalTestimonials = document.querySelectorAll('.testimonial-card').length;
    const prevIndex = (currentTestimonialIndex - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(prevIndex);
}

function currentTestimonial(index) {
    stopTestimonialAutoPlay();
    showTestimonial(index);
    
    setTimeout(() => {
        startTestimonialAutoPlay();
    }, 10000);
}

function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        const form = modal.querySelector('.review-form');
        if (form) {
            form.reset();
            const stars = modal.querySelectorAll('.star-input');
            stars.forEach(star => star.classList.remove('active'));
        }
    }
}

function initializeReviewForm() {
    const starInputs = document.querySelectorAll('.star-input');
    let selectedRating = 0;
    
    starInputs.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            starInputs.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#f4a623';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            starInputs.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    const starRating = document.getElementById('starRating');
    if (starRating) {
        starRating.addEventListener('mouseleave', function() {
            starInputs.forEach((star, index) => {
                if (index < selectedRating) {
                    star.style.color = '#f4a623';
                } else {
                    star.style.color = '#ddd';
                }
            });
        });
    }
}

async function submitReview(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const starInputs = document.querySelectorAll('.star-input.active');
    
    if (starInputs.length === 0) {
        showNotification('Please select a star rating', 'info');
        return;
    }
    
    const reviewData = {
        name: formData.get('name'),
        email: formData.get('email'),
        review: formData.get('review'),
        rating: starInputs.length
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Thank you for your review! It will be published after moderation.', 'success');
            closeReviewModal();
        } else {
            showNotification(data.error || 'Failed to submit review', 'info');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Error submitting review. Please try again.', 'info');
    }
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            showNotification(`Navigating to ${this.textContent}...`, 'info');
        });
    });
}

function initializeMenu() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuGrid = document.getElementById('menuGrid');
    
    if (!menuGrid) return;
    
    fetchMenuItems();
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            menuTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            displayMenuItems(category);
        });
    });
}

function displayMenuItems(category) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    let filteredItems = menuItems;
    
    if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
    }
    
    menuGrid.innerHTML = '';
    
    filteredItems.forEach((item, index) => {
        const menuItemElement = createMenuItemElement(item, index);
        menuGrid.appendChild(menuItemElement);
    });
}

function createMenuItemElement(item, index) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.style.animationDelay = `${index * 0.1}s`;
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-item-content">
            <h3 class="menu-item-title">${item.name}</h3>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-footer">
                <span class="menu-item-price">$${item.price}</span>
                <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">Add to Cart</button>
            </div>
        </div>
    `;
    
    return menuItem;
}

function initializeCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    
    if (!cartIcon) return;
    
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            cart = [];
        }
    }
    
    cartIcon.addEventListener('click', openCart);
    
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        showCheckoutModal();
    });
}
}

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    
    updateCartUI();
    
    showNotification(`${item.name} added to cart!`, 'success');
    
    openCart();
    setTimeout(closeCart, 2000);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('show', totalItems > 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some delicious items from our menu!</p>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => createCartItemElement(item)).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function createCartItemElement(item) {
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove item">×</button>
            </div>
        </div>
    `;
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    updateCartUI();
    
    if (item) {
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

function openCart() {
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartPanel && cartOverlay) {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartPanel && cartOverlay) {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initializeButtons() {
    const bookTableBtn = document.querySelector('.book-table-btn');
    if (bookTableBtn) {
        bookTableBtn.addEventListener('click', function() {
            const bookingSection = document.querySelector('.booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                showBookingModal();
            }
        });
    }
    
    const orderNowBtn = document.querySelector('.order-now-btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            const menuSection = document.querySelector('.menu');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    initializeBookingForm();
}

function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingDate = document.getElementById('bookingDate');
    
    if (!bookingForm) return;
    
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
        
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        bookingDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
    
    const inputs = bookingForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const fieldName = field.name;
    const value = field.value.trim();
    
    formGroup.classList.remove('error', 'success');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;
            
        case 'guests':
            if (!value) {
                errorMessage = 'Please select party size';
                isValid = false;
            }
            break;
            
        case 'date':
            if (!value) {
                errorMessage = 'Please select a date';
                isValid = false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errorMessage = 'Date cannot be in the past';
                    isValid = false;
                }
            }
            break;
            
        case 'time':
            if (!value) {
                errorMessage = 'Please select a time';
                isValid = false;
            }
            break;
    }
    
    if (isValid) {
        formGroup.classList.add('success');
    } else {
        formGroup.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = errorMessage;
        formGroup.appendChild(errorSpan);
    }
    
    return isValid;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
}

async function submitTableBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.booking-submit-btn');
    const inputs = form.querySelectorAll('input, select');
    
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors above', 'info');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.textContent = '';
    
    const formData = new FormData(form);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        partySize: parseInt(formData.get('guests')),
        date: formData.get('date'),
        time: formData.get('time')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'BOOK NOW';
        
        if (data.success) {
            showBookingConfirmation(bookingData);
            form.reset();
            inputs.forEach(input => {
                const formGroup = input.closest('.form-group');
                formGroup.classList.remove('success', 'error');
            });
        } else {
            showNotification(data.error || 'Booking failed. Please try again.', 'info');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'BOOK NOW';
        showNotification('Error submitting booking. Please try again.', 'info');
    }
}
function showBookingConfirmation(bookingData) {
    const modal = document.getElementById('bookingConfirmationModal');
    const detailsContainer = document.getElementById('confirmationDetails');
    
    const date = new Date(bookingData.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeOptions = {
        '11:00': '11:00 AM',
        '11:30': '11:30 AM',
        '12:00': '12:00 PM',
        '12:30': '12:30 PM',
        '13:00': '1:00 PM',
        '13:30': '1:30 PM',
        '14:00': '2:00 PM',
        '18:00': '6:00 PM',
        '18:30': '6:30 PM',
        '19:00': '7:00 PM',
        '19:30': '7:30 PM',
        '20:00': '8:00 PM',
        '20:30': '8:30 PM',
        '21:00': '9:00 PM'
    };
    
    detailsContainer.innerHTML = `
        <div><strong>Name:</strong> ${bookingData.name}</div>
        <div><strong>Phone:</strong> ${bookingData.phone}</div>
        <div><strong>Party Size:</strong> ${bookingData.partySize} ${bookingData.partySize === 1 ? 'Person' : 'People'}</div>
        <div><strong>Date:</strong> ${formattedDate}</div>
        <div><strong>Time:</strong> ${timeOptions[bookingData.time] || bookingData.time}</div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingConfirmation() {
    const modal = document.getElementById('bookingConfirmationModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Add floating animation to ingredients
document.addEventListener('DOMContentLoaded', function() {
    const ingredients = document.querySelectorAll('.ingredient');
    
    ingredients.forEach((ingredient, index) => {
        const delay = index * 0.5;
        const duration = 3 + (index * 0.3);
        
        ingredient.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    if (!document.querySelector('#ingredient-animations')) {
        const style = document.createElement('style');
        style.id = 'ingredient-animations';
        style.textContent = `
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg); 
                }
                25% { 
                    transform: translateY(-10px) rotate(5deg); 
                }
                50% { 
                    transform: translateY(-15px) rotate(0deg); 
                }
                75% { 
                    transform: translateY(-8px) rotate(-5deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// MODAL SYSTEM - Clean Implementation
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Get buttons
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        // Add click listeners
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openLoginModal();
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openSignupModal();
            });
        }
        
        // Setup close listeners
        setupModalListeners();
    });
    
    function openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function openSignupModal() {
        const modal = document.getElementById('signupModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function setupModalListeners() {
        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this.id);
                }
            });
        });
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal('loginModal');
                closeModal('signupModal');
            }
        });
    }
    
    // Make functions global
    window.openLoginModal = openLoginModal;
    window.openSignupModal = openSignupModal;
    window.closeModal = closeModal;
    
    window.switchToSignup = function() {
        closeModal('loginModal');
        setTimeout(openSignupModal, 100);
    };
    
    window.switchToLogin = function() {
        closeModal('signupModal');
        setTimeout(openLoginModal, 100);
    };
    
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const button = input.nextElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    };
    
    window.handleLogin = async function(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user data and token
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            showNotification(`Welcome back, ${data.user.name}!`, 'success');
            closeModal('loginModal');
            
            // Update UI to show logged-in user
            updateUserUI();
        } else {
            showNotification(data.message || 'Login failed. Please check your credentials.', 'info');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error during login. Please try again.', 'info');
    }
};
    window.handleSignup = async function(event) {
    event.preventDefault();
    
    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'info');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'info');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: 'user'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Signup successful! You can now login.', 'success');
            closeModal('signupModal');
            setTimeout(() => {
                openLoginModal();
            }, 1000);
        } else {
            showNotification(data.error || 'Signup failed. Please try again.', 'info');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Error during signup. Please try again.', 'info');
    }
};
// Update UI when user logs in
function updateUserUI() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (userData.name) {
        // User is logged in
        if (loginBtn) {
            loginBtn.textContent = userData.name;
            loginBtn.style.cursor = 'default';
            loginBtn.onclick = null;
        }
        
        if (signupBtn) {
            signupBtn.textContent = 'Logout';
            signupBtn.onclick = function(e) {
                e.preventDefault();
                handleLogout();
            };
        }
    }
}

// Logout function
function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    showNotification('Logged out successfully!', 'success');
    
    // Reset buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.style.cursor = 'pointer';
        loginBtn.onclick = function(e) {
            e.preventDefault();
            openLoginModal();
        };
    }
    
    if (signupBtn) {
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = function(e) {
            e.preventDefault();
            openSignupModal();
        };
    }
}

// Checking if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserUI();
});
// Checkout Modal
function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal') || createCheckoutModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update order summary
    updateCheckoutSummary();
}

function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 600px;">
            <button class="close-modal" onclick="closeCheckoutModal()">&times;</button>
            <h2 class="modal-title">Complete Your Order</h2>
            
            <form id="checkoutForm" onsubmit="placeOrder(event)">
                <div class="form-group">
                    <input type="text" class="form-input" id="checkoutName" placeholder="Full Name" required>
                </div>
                
                <div class="form-group">
                    <input type="email" class="form-input" id="checkoutEmail" placeholder="Email" required>
                </div>
                
                <div class="form-group">
                    <input type="tel" class="form-input" id="checkoutPhone" placeholder="Phone Number" required>
                </div>
                
                <div class="form-group">
                    <textarea class="form-input" id="checkoutAddress" placeholder="Delivery Address" required style="min-height: 80px; resize: vertical;"></textarea>
                </div>
                
                <div class="form-group">
                    <select class="form-input" id="paymentMethod" required>
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="card">Card on Delivery</option>
                        <option value="online">Online Payment</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <textarea class="form-input" id="orderNotes" placeholder="Special instructions (optional)" style="min-height: 60px; resize: vertical;"></textarea>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-bottom: 10px; font-size: 16px;">Order Summary</h3>
                    <div id="checkoutSummary"></div>
                    <div style="border-top: 2px solid #ddd; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                        <span>Total:</span>
                        <span id="checkoutTotal">$0.00</span>
                    </div>
                </div>
                
                <button type="submit" class="submit-btn" style="width: 100%;">Place Order</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function updateCheckoutSummary() {
    const summaryDiv = document.getElementById('checkoutSummary');
    const totalDiv = document.getElementById('checkoutTotal');
    
    if (!summaryDiv || !totalDiv) return;
    
    summaryDiv.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalDiv.textContent = `$${total.toFixed(2)}`;
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

async function placeOrder(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'info');
        return;
    }
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const orderData = {
        customer: {
            name: document.getElementById('checkoutName').value,
            email: document.getElementById('checkoutEmail').value,
            phone: document.getElementById('checkoutPhone').value,
            address: document.getElementById('checkoutAddress').value
        },
        items: cart.map(item => ({
            menuItem: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: document.getElementById('paymentMethod').value,
        notes: document.getElementById('orderNotes').value
    };
    
    submitBtn.textContent = 'Placing Order...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`Order placed successfully! Order #${data.data.orderNumber}`, 'success');
            
            // Clear cart
            cart = [];
            localStorage.removeItem('restaurantCart');
            updateCartUI();
            
            closeCheckoutModal();
            closeCart();
            
            // Reset form
            form.reset();
        } else {
            showNotification(data.message || 'Failed to place order', 'info');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order. Please try again.', 'info');
    } finally {
        submitBtn.textContent = 'Place Order';
        submitBtn.disabled = false;
    }
}

// Make functions global
window.showCheckoutModal = showCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.placeOrder = placeOrder;

})();

