// ========================================
// Dark Mode Toggle
// ========================================

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save preference
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // 80px for fixed header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========================================
// Reading Progress Bar (for blog posts)
// ========================================

const progressBar = document.getElementById('progress-bar');

if (progressBar) {
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ========================================
// Language Toggle (for blog posts)
// ========================================

const langToggle = document.querySelector('.lang-toggle');
const englishContent = document.querySelector('.content-english');
const bengaliContent = document.querySelector('.content-bengali');

if (langToggle && englishContent && bengaliContent) {
    // Default: Show English, Hide Bengali
    bengaliContent.style.display = 'none';
    
    langToggle.addEventListener('click', () => {
        const currentLang = langToggle.getAttribute('data-lang');
        
        if (currentLang === 'en') {
            // Switch to Bengali
            englishContent.style.display = 'none';
            bengaliContent.style.display = 'block';
            langToggle.setAttribute('data-lang', 'bn');
            langToggle.textContent = 'English';
        } else {
            // Switch to English
            englishContent.style.display = 'block';
            bengaliContent.style.display = 'none';
            langToggle.setAttribute('data-lang', 'en');
            langToggle.textContent = 'বাংলা';
        }
    });
}

// ========================================
// Estimate Reading Time
// ========================================

function calculateReadingTime() {
    const article = document.querySelector('.article-content');
    
    if (article) {
        const text = article.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        const readingTimeElement = document.querySelector('.reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `${readingTime} min read`;
        }
    }
}

// Calculate on page load
if (document.querySelector('.article-content')) {
    calculateReadingTime();
}

// ========================================
// Share Buttons Functionality
// ========================================

const shareButtons = document.querySelectorAll('.share-btn');

shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const platform = button.getAttribute('data-platform');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        let shareUrl = '';
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

// ========================================
// Copy Link Button
// ========================================

const copyLinkBtn = document.querySelector('.copy-link-btn');

if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        const url = window.location.href;
        
        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Show feedback
            const originalText = copyLinkBtn.textContent;
            copyLinkBtn.textContent = 'Copied! ✓';
            copyLinkBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                copyLinkBtn.textContent = originalText;
                copyLinkBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy link');
        });
    });
}

// ========================================
// Lazy Load Images (Performance)
// ========================================

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========================================
// Scroll to Top Button (Optional)
// ========================================

const scrollTopBtn = document.querySelector('.scroll-top-btn');

if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Print Article Function (for blog posts)
// ========================================

const printBtn = document.querySelector('.print-btn');

if (printBtn) {
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

// ========================================
// Initialize on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');
    
    // Add animation class to elements when they come into view
    const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateOnScroll.forEach(el => scrollObserver.observe(el));
});