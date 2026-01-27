// ========================================
// Markdown Parser (Simple)
// ========================================

function parseMarkdown(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');
    
    // Code blocks
    html = html.replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Line breaks and paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h1><\/p>/g, '</h1>');
    html = html.replace(/<\/h2><\/p>/g, '</h2>');
    html = html.replace(/<\/h3><\/p>/g, '</h3>');
    html = html.replace(/<p><pre>/g, '<pre>');
    html = html.replace(/<\/pre><\/p>/g, '</pre>');
    html = html.replace(/<p><blockquote>/g, '<blockquote>');
    html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');
    
    return html;
}

// ========================================
// Load Markdown Content
// ========================================

async function loadMarkdownContent() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    
    // Find the directory where HTML file is located
    const htmlFileName = pathParts[pathParts.length - 1];
    const postDir = pathParts.slice(0, -1).join('/');
    
    // Construct paths to markdown files
    const enPath = `${postDir}/en.md`;
    const bnPath = `${postDir}/bn.md`;
    
    try {
        // Load English content
        const enResponse = await fetch(enPath);
        if (enResponse.ok) {
            const enMarkdown = await enResponse.text();
            const enHtml = parseMarkdown(enMarkdown);
            document.getElementById('english-content').innerHTML = enHtml;
        }
        
        // Load Bengali content
        const bnResponse = await fetch(bnPath);
        if (bnResponse.ok) {
            const bnMarkdown = await bnResponse.text();
            const bnHtml = parseMarkdown(bnMarkdown);
            document.getElementById('bengali-content').innerHTML = bnHtml;
        }
    } catch (error) {
        console.log('Using default content - Markdown files not found');
        // Default content is already in HTML, so no action needed
    }
}

// Load content when page loads
if (document.getElementById('english-content')) {
    loadMarkdownContent();
}

// ========================================
// Enhanced Language Toggle
// ========================================

const langToggleBtn = document.querySelector('.lang-toggle');
const englishContent = document.querySelector('.content-english');
const bengaliContent = document.querySelector('.content-bengali');

if (langToggleBtn && englishContent && bengaliContent) {
    // Set initial state
    let currentLang = 'en';
    bengaliContent.style.display = 'none';
    englishContent.style.display = 'block';
    
    langToggleBtn.addEventListener('click', () => {
        if (currentLang === 'en') {
            // Switch to Bengali
            englishContent.style.opacity = '0';
            
            setTimeout(() => {
                englishContent.style.display = 'none';
                bengaliContent.style.display = 'block';
                bengaliContent.style.opacity = '0';
                
                setTimeout(() => {
                    bengaliContent.style.opacity = '1';
                }, 50);
            }, 300);
            
            langToggleBtn.textContent = 'English';
            currentLang = 'bn';
            
        } else {
            // Switch to English
            bengaliContent.style.opacity = '0';
            
            setTimeout(() => {
                bengaliContent.style.display = 'none';
                englishContent.style.display = 'block';
                englishContent.style.opacity = '0';
                
                setTimeout(() => {
                    englishContent.style.opacity = '1';
                }, 50);
            }, 300);
            
            langToggleBtn.textContent = 'বাংলা';
            currentLang = 'en';
        }
    });
}

// Add smooth transition CSS
if (englishContent && bengaliContent) {
    englishContent.style.transition = 'opacity 0.3s ease';
    bengaliContent.style.transition = 'opacity 0.3s ease';
}

// ========================================
// Enhanced Reading Time Calculator
// ========================================

function calculateReadingTime() {
    const englishArticle = document.getElementById('english-content');
    const bengaliArticle = document.getElementById('bengali-content');
    
    if (englishArticle) {
        const text = englishArticle.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        const readingTimeElement = document.querySelector('.reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `⏱️ ${readingTime} min read`;
        }
    }
}

// Calculate reading time after content is loaded
setTimeout(calculateReadingTime, 500);

// ========================================
// Enhanced Share Functions
// ========================================

const shareButtonsEnhanced = document.querySelectorAll('.share-btn');

shareButtonsEnhanced.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const platform = button.getAttribute('data-platform');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.querySelector('.post-title-main').textContent);
        
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
        
        // Visual feedback
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    });
});

// ========================================
// Enhanced Copy Link
// ========================================

const copyLinkButton = document.querySelector('.copy-link-btn');

if (copyLinkButton) {
    copyLinkButton.addEventListener('click', async () => {
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            
            // Success feedback
            const originalText = copyLinkButton.textContent;
            const originalBg = copyLinkButton.style.background;
            
            copyLinkButton.textContent = '✓ Copied!';
            copyLinkButton.style.background = '#27ae60';
            copyLinkButton.style.color = 'white';
            
            setTimeout(() => {
                copyLinkButton.textContent = originalText;
                copyLinkButton.style.background = originalBg;
                copyLinkButton.style.color = '';
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                copyLinkButton.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyLinkButton.textContent = '🔗 Copy Link';
                }, 2000);
            } catch (err) {
                alert('Please copy manually: ' + url);
            }
            
            document.body.removeChild(textArea);
        }
    });
}

// ========================================
// Reading Progress Bar
// ========================================

const progressBar = document.getElementById('progress-bar');

if (progressBar) {
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initial call
}

// ========================================
// Smooth Scroll to Anchors (for TOC)
// ========================================

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// ========================================
// Print Function
// ========================================

function printArticle() {
    window.print();
}

// Add print button if needed
const printBtn = document.querySelector('.print-btn');
if (printBtn) {
    printBtn.addEventListener('click', printArticle);
}

// ========================================
// Auto-highlight Code Blocks
// ========================================

function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        block.classList.add('highlighted');
    });
}

// Highlight after content loads
setTimeout(highlightCodeBlocks, 600);

// ========================================
// Lazy Load Images
// ========================================

const lazyImages = document.querySelectorAll('img[data-src]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// Initialize Everything on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog post page loaded successfully!');
    
    // Add reading indicator to body
    document.body.classList.add('blog-post-page');
    
    // Smooth reveal animation for content
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        articleContent.style.opacity = '0';
        setTimeout(() => {
            articleContent.style.transition = 'opacity 0.5s ease';
            articleContent.style.opacity = '1';
        }, 100);
    }
});