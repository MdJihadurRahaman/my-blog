// ========================================
// Category Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Get all post cards
    const postsGrid = document.getElementById('postsGrid');
    const emptyState = document.getElementById('emptyState');
    const postsCount = document.getElementById('postsCount');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (!postsGrid) return;
    
    let allPosts = Array.from(postsGrid.querySelectorAll('.category-post-card'));
    
    // Update posts count
    function updatePostsCount() {
        const visiblePosts = allPosts.filter(post => post.style.display !== 'none');
        const count = visiblePosts.length;
        
        if (postsCount) {
            postsCount.textContent = count;
        }
        
        // Show/hide empty state
        if (emptyState) {
            if (count === 0) {
                postsGrid.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                postsGrid.style.display = 'grid';
                emptyState.style.display = 'none';
            }
        }
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            allPosts.forEach(post => {
                const title = post.querySelector('.post-title a').textContent.toLowerCase();
                const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    post.style.display = 'block';
                    // Add fade in animation
                    post.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    post.style.display = 'none';
                }
            });
            
            updatePostsCount();
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortType = e.target.value;
            
            // Get posts with their dates
            const postsWithDates = allPosts.map(post => {
                const dateText = post.querySelector('.post-date').textContent;
                return {
                    element: post,
                    date: new Date(dateText)
                };
            });
            
            // Sort posts
            let sortedPosts;
            switch(sortType) {
                case 'newest':
                    sortedPosts = postsWithDates.sort((a, b) => b.date - a.date);
                    break;
                case 'oldest':
                    sortedPosts = postsWithDates.sort((a, b) => a.date - b.date);
                    break;
                case 'popular':
                    // For now, keep original order (you can add view count later)
                    sortedPosts = postsWithDates;
                    break;
                default:
                    sortedPosts = postsWithDates;
            }
            
            // Re-append posts in new order
            sortedPosts.forEach(({element}) => {
                postsGrid.appendChild(element);
            });
            
            // Update allPosts array
            allPosts = sortedPosts.map(({element}) => element);
        });
    }
    
    // Initial count update
    updatePostsCount();
    
    // Animate posts on load
    allPosts.forEach((post, index) => {
        post.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s backwards`;
    });
});

// ========================================
// Smooth Scroll for Category Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Keyboard Shortcuts
// ========================================

document.addEventListener('keydown', (e) => {
    const searchInput = document.getElementById('searchInput');
    
    // Press '/' to focus search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Press 'Escape' to clear search
    if (e.key === 'Escape') {
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    }
});

// ========================================
// Add Animation CSS if not present
// ========================================

if (!document.querySelector('#category-animations')) {
    const style = document.createElement('style');
    style.id = 'category-animations';
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .category-post-card {
            animation: fadeInUp 0.6s ease backwards;
        }
    `;
    document.head.appendChild(style);
}