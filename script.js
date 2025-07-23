// Typing Animation for Hero Subtitle
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = this.txt;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Down Arrow Functionality
function initScrollDownArrow() {
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                // Add click animation
                scrollDownArrow.style.transform = 'translateX(-50%) scale(0.9)';
                
                setTimeout(() => {
                    scrollDownArrow.style.transform = 'translateX(-50%) scale(1)';
                    
                    // Smooth scroll to about section
                    aboutSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav link
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#about') {
                            link.classList.add('active');
                        }
                    });
                }, 150);
            }
        });

        // Hide arrow when scrolling past hero section
        window.addEventListener('scroll', function() {
            const heroSection = document.querySelector('.hero-section');
            const heroHeight = heroSection.offsetHeight;
            
            if (window.scrollY > heroHeight * 0.8) {
                scrollDownArrow.style.opacity = '0';
                scrollDownArrow.style.pointerEvents = 'none';
            } else {
                scrollDownArrow.style.opacity = '1';
                scrollDownArrow.style.pointerEvents = 'auto';
            }
        });
    }
}

// Fetch GitHub Projects - Updated to show only specific projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/murali2277/repos?sort=updated&per_page=50');
        const repos = await response.json();
        
        // Filter to show only the specific projects you want
        const specificProjects = ['buslive-tracking', 'vulnerabality-scanner', 'ai-assistent-for-cyber-law'];
        
        const featuredRepos = repos
            .filter(repo => !repo.fork && specificProjects.includes(repo.name.toLowerCase()))
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        if (featuredRepos.length > 0) {
            displayProjects(featuredRepos);
        } else {
            displayFallbackProjects();
        }
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        displayFallbackProjects();
    }
}

// Display Projects Function - Updated to remove HTML/Python tags
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) {
        console.error('Projects grid element not found');
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3 class="project-title">${formatProjectName(project.name)}</h3>
            <p class="project-description">${project.description || getDefaultDescription(project.name)}</p>
            <div class="project-tech">
                ${getFilteredTechTags(project)}
            </div>
            <div class="project-links">
                <a href="${project.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${project.homepage ? `<a href="${project.homepage}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>` : ''}
            </div>
        </div>
    `).join('');
}

// Get filtered tech tags (excluding HTML and Python)
function getFilteredTechTags(project) {
    let tags = [];
    
    // Add language tag if it's not HTML or Python
    if (project.language && !['HTML', 'Python'].includes(project.language)) {
        tags.push(project.language);
    }
    
    // Add relevant topic tags (excluding html and python)
    if (project.topics && project.topics.length > 0) {
        const filteredTopics = project.topics
            .filter(topic => !['html', 'python'].includes(topic.toLowerCase()))
            .slice(0, 3);
        tags = tags.concat(filteredTopics);
    }
    
    // If no tags after filtering, add project-specific tags
    if (tags.length === 0) {
        tags = getProjectSpecificTags(project.name);
    }
    
    return tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
}

// Get project-specific tags based on project name
function getProjectSpecificTags(projectName) {
    const tagMap = {
        'buslive-tracking': ['Real-time', 'GPS', 'Tracking'],
        'vulnerabality-scanner': ['Security', 'Scanner', 'Cybersecurity'],
        'ai-assistent-for-cyber-law': ['AI', 'Legal Tech', 'Assistant']
    };
    
    return tagMap[projectName.toLowerCase()] || ['Development'];
}

// Get default description based on project name
function getDefaultDescription(projectName) {
    const descriptionMap = {
        'buslive-tracking': 'Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.',
        'vulnerabality-scanner': 'Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.',
        'ai-assistent-for-cyber-law': 'AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.'
    };
    
    return descriptionMap[projectName.toLowerCase()] || 'A comprehensive project showcasing modern development practices and clean code architecture.';
}

// Display Fallback Projects - Updated with only your 3 projects
function displayFallbackProjects() {
    const fallbackProjects = [
        {
            name: "buslive-tracking",
            description: "Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.",
            language: "Real-time",
            html_url: "https://github.com/murali2277/buslive-tracking",
            topics: ["gps", "tracking", "transportation"]
        },
        {
            name: "vulnerabality-scanner",
            description: "Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.",
            language: "Security",
            html_url: "https://github.com/murali2277/vulnerabality-scanner",
            topics: ["scanner", "cybersecurity", "penetration-testing"]
        },
        {
            name: "ai-assistent-for-cyber-law",
            description: "AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.",
            language: "AI",
            html_url: "https://github.com/murali2277/ai-assistent-for-cyber-law",
            topics: ["legal-tech", "assistant", "cybersecurity"]
        }
    ];
    
    displayProjects(fallbackProjects);
}

// Format Project Name Function
function formatProjectName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Fetch GitHub User Stats
async function fetchGitHubStats() {
    try {
        // Fetch user data
        const userResponse = await fetch('https://api.github.com/users/murali2277');
        const userData = await userResponse.json();
        
        // Fetch repositories for additional stats
        const reposResponse = await fetch('https://api.github.com/users/murali2277/repos?per_page=100');
        const reposData = await reposResponse.json();
        
        // Calculate stats
        const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
        const publicRepos = userData.public_repos;
        
        // Update DOM elements
        document.getElementById('total-stars').textContent = totalStars;
        document.getElementById('total-commits').textContent = '37'; // From your GitHub stats
        document.getElementById('total-prs').textContent = '8'; // Estimate based on activity
        document.getElementById('total-issues').textContent = '0'; // From your stats
        document.getElementById('contributions').textContent = publicRepos || '1';
        
        // Animate progress bars after a delay
        setTimeout(() => {
            animateLanguageBars();
        }, 500);
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Set fallback values from your GitHub profile
        document.getElementById('total-stars').textContent = '10';
        document.getElementById('total-commits').textContent = '37';
        document.getElementById('total-prs').textContent = '8';
        document.getElementById('total-issues').textContent = '0';
        document.getElementById('contributions').textContent = '1';
        
        setTimeout(() => {
            animateLanguageBars();
        }, 500);
    }
}

// Animate language progress bars
function animateLanguageBars() {
    const progressBars = document.querySelectorAll('.language-progress');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleX(1)';
        }, index * 150);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const words = [
            'Python Developer',
            'Backend Enthusiast', 
            'Security Learner',
            'Problem Solver',
            'Code Craftsman'
        ];
        new TypeWriter(typeWriterElement, words, 2000);
    }

    // Initialize scroll down arrow
    initScrollDownArrow();

    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    }

    // Smooth scrolling and active nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                
                // Reset hamburger
                if (hamburger) {
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = '';
                }
                
                // Smooth scroll
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Fetch GitHub projects and stats
    fetchGitHubProjects();
    fetchGitHubStats();

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navbar && !navbar.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            
            if (hamburger) {
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        }
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const rate = scrolled * -0.5;
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Add smooth animations on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .skill-category, .contact-card, .stats-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.project-card, .skill-category, .contact-card, .stats-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Button click effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation CSS
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Smooth reveal for stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1
    });

    statsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        statsObserver.observe(card);
    });
});

// Initialize language bars animation
function initLanguageBars() {
    const languageBars = document.querySelectorAll('.language-progress');
    languageBars.forEach(bar => {
        bar.style.transform = 'scaleX(0)';
        bar.style.transformOrigin = 'left';
        bar.style.transition = 'transform 1s ease-in-out';
    });
}

// Call initialization
document.addEventListener('DOMContentLoaded', initLanguageBars);




// Network Background Animation
(function initNetworkBackground() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) {
        console.error('Canvas element #network-bg not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    
    // Get primary color from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim() || '#00ff88';
    
    let width, height, points = [];
    let animationId;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Create points based on screen size
        const pointCount = Math.floor((width + height) / 20);
        points = [];
        
        for (let i = 0; i < pointCount; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Update points
        points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;

            // Bounce off edges
            if (point.x < 0 || point.x > width) point.vx *= -1;
            if (point.y < 0 || point.y > height) point.vy *= -1;

            // Keep points in bounds
            point.x = Math.max(0, Math.min(width, point.x));
            point.y = Math.max(0, Math.min(height, point.y));
        });

        // Draw connections
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 120;

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    ctx.strokeStyle = hexToRgba(primaryColor, opacity);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw points
        ctx.fillStyle = primaryColor;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
    }

    function hexToRgba(hex, alpha) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgba(0, 255, 136, ${alpha})`; // fallback
    }

    // Initialize
    resize();
    animate();

    // Handle resize
    window.addEventListener('resize', resize);

    // Cleanup function
    return function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resize);
    };
})();




document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const githubUser = 'murali2277';
    const leetcodeUser = 'muralikumars';

    // --- Color Theme ---
    const titleColor = '4ecdc4'; // The accent blue from your theme
    const iconColor = '00ff88';   // The primary green from your theme
    const textColor = 'ffffff';   // White text

    /**
     * An array containing the configuration for each statistics card.
     */
    const statCards = [
        {
            id: 'github-stats-img',
            url: `https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=transparent&hide_border=true&title_color=${titleColor}&text_color=${textColor}&icon_color=${iconColor}`
        },
        {
            id: 'github-languages-img',
            url: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=transparent&hide_border=true&title_color=${titleColor}&text_color=${textColor}&bg_color=00000000`
        },
        {
            id: 'leetcode-stats-img',
            url: `https://leetcard.jacoblin.cool/${leetcodeUser}?theme=dark&font=Poppins&radius=8`
        },
        {
            id: 'leetcode-activity-img',
            url: `https://github-readme-streak-stats.herokuapp.com/?user=${leetcodeUser}&theme=dark&hide_border=true&background=00000000&stroke=${iconColor}&ring=${iconColor}&fire=${iconColor}&curr_streak_text_color=${textColor}&side_stats=false`
        }
    ];

    /**
     * A helper function to display an error message inside a card.
     * @param {HTMLElement} cardElement - The .stats-card element to update.
     */
    const handleImageError = (cardElement) => {
        // Add an 'error' class for styling (e.g., red border)
        cardElement.classList.add('error');
        
        // Clear the card's content (the broken image)
        cardElement.innerHTML = ''; 

        // Create and append the new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-fallback';
        errorDiv.innerHTML = `
            <span>!</span>
            <p>Could not load stats.</p>
        `;
        cardElement.appendChild(errorDiv);
    };

    // Loop through each card configuration, attach error handlers, and set the source
    statCards.forEach(card => {
        const imageElement = document.getElementById(card.id);

        if (imageElement) {
            // IMPORTANT: Attach the onerror event handler BEFORE setting the src.
            imageElement.onerror = () => handleImageError(imageElement.parentElement);
            
            // Now, set the image source to start loading
            imageElement.src = card.url;
            imageElement.alt = `${card.id.replace(/-/g, ' ')}`;
        } else {
            console.warn(`Element with ID '${card.id}' was not found in the HTML.`);
        }
    });
});

