// =================================================================
// ==  1. CLASS AND HELPER FUNCTION DEFINITIONS
// =================================================================

class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        this.isDeleting ? this.txt = fullTxt.substring(0, this.txt.length - 1) : this.txt = fullTxt.substring(0, this.txt.length + 1);
        this.txtElement.innerHTML = this.txt;
        let typeSpeed = this.isDeleting ? 50 : 100;
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        setTimeout(() => this.type(), typeSpeed);
    }
}

const handleImageError = (cardElement) => {
    cardElement.classList.add('error');
    cardElement.innerHTML = `<div class="error-fallback"><span>!</span><p>Could not load stats.</p></div>`;
};

// =================================================================
// ==  2. MAIN INITIALIZATION SCRIPT (Runs once when DOM is ready)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Loading Screen ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const lottieContainer = document.getElementById('lottie-animation');
    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'loader-animation.json' // Path to your JSON file (must be in the same folder)
        });
    }
    // Hide the loading screen once the entire page (including images, if any) is loaded
    window.onload = () => {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500); // Matches CSS transition duration
        }
    };

    // --- Initialize Core Features ---
    // Typing Animation for Hero Section
    if (document.getElementById('typewriter-text')) {
        new TypeWriter(document.getElementById('typewriter-text'), ['Python Developer', 'Backend Enthusiast', 'Security Learner'], 2000);
    }

    // Initialize all other features
    fetchGitHubProjects();
    initStatsCards();
    initNavbar();
    initScrollDownArrow(); // The scroll down arrow
    initScrollAnimations(); // General elements animating on scroll
    initNetworkBackground(); // Canvas background animation
    initButtonRipples(); // Button click effects

    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
        const navbar = document.getElementById('navbar');
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (navbar && !navbar.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
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

// =================================================================
// ==  3. FEATURE-SPECIFIC INITIALIZATION AND LOGIC FUNCTIONS
// =================================================================

function initStatsCards() {
    const githubUser = 'murali2277';
    const leetcodeUser = 'muralikumars';
    const theme = { title: '4ecdc4', icon: '00ff88', text: 'ffffff', bg: '00000000' };

    const statCards = [
        { id: 'github-stats-img', url: `https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=transparent&hide_border=true&title_color=${theme.title}&text_color=${theme.text}&icon_color=${theme.icon}` },
        { id: 'github-languages-img', url: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=transparent&hide_border=true&title_color=${theme.title}&text_color=${theme.text}&bg_color=${theme.bg}` },
        { id: 'leetcode-stats-img', url: `https://leetcard.jacoblin.cool/${leetcodeUser}?theme=dark&font=Poppins&radius=8` },
        { id: 'github-streak-img', url: `https://streak-stats.demolab.com/?user=${githubUser}&theme=transparent&hide_border=true&background=${theme.bg}&stroke=${theme.icon}&ring=${theme.icon}&fire=${theme.icon}&curr_streak_text_color=${theme.text}&side_stats=false` }
    ];

    statCards.forEach(card => {
        const imgElement = document.getElementById(card.id);
        if (imgElement) {
            imgElement.onerror = () => handleImageError(imgElement.parentElement);
            imgElement.src = card.url;
        } else {
            console.warn(`Stats card with ID '${card.id}' not found.`);
        }
    });
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });
    sections.forEach(section => observer.observe(section));
}

function initScrollDownArrow() {
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                scrollDownArrow.style.transform = 'translateX(-50%) scale(0.9)';
                setTimeout(() => {
                    scrollDownArrow.style.transform = 'translateX(-50%) scale(1)';
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#about') {
                            link.classList.add('active');
                        }
                    });
                }, 150);
            }
        });
        window.addEventListener('scroll', function() {
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection) return;
            const heroHeight = heroSection.offsetHeight;
            scrollDownArrow.style.opacity = (window.scrollY > heroHeight * 0.8) ? '0' : '1';
            scrollDownArrow.style.pointerEvents = (window.scrollY > heroHeight * 0.8) ? 'none' : 'auto';
        });
    }
}


function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-card, .stats-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

function initNetworkBackground() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#00ff88';
    let points = [];
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = Array.from({ length: Math.floor((canvas.width + canvas.height) / 25) }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1
        }));
    };
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        ctx.fillStyle = `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)}, 0.8)`;
        points.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); });
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)}, ${1 - dist / 120})`;
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };
    window.addEventListener('resize', resize);
    resize();
    animate();
}

function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}


// --- PROJECT FETCHING LOGIC ---
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/murali2277/repos?sort=updated&per_page=100');
        const repos = await response.json();
        
        // Define the exact order of projects you want to display
        const projectOrder = [
            'vulnerabality-scanner',
            'Bus_Attendance_System',
            'bus-live-tracking',
            'ai-assistent-for-cyber-law',
            'EduQuiz',
            'portfolio'
        ];

        // Filter and reorder repositories based on projectOrder
        const featuredRepos = projectOrder.map(name => 
            repos.find(repo => repo.name.toLowerCase() === name.toLowerCase() && !repo.fork)
        ).filter(Boolean); // Filter out any undefined if a repo wasn't found or was a fork

        if (featuredRepos.length === projectOrder.length) {
            displayProjects(featuredRepos);
        } else {
            console.warn('Could not find all specified repos via GitHub API. Falling back to hardcoded list.');
            displayFallbackProjects(); // Use the hardcoded fallback if API doesn't return all
        }
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        displayFallbackProjects(); // Fallback in case of API fetch error
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        console.error('Projects grid element not found.');
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3 class="project-title">${formatProjectName(project.name)}</h3>
            <p class="project-description">${project.description || getDefaultDescription(project.name)}</p>
            <div class="project-tech">${getProjectSpecificTags(project.name).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}</div>
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

// Fallback projects with live links
function displayFallbackProjects() {
    const fallbackProjects = [
        {
            name: "vulnerabality-scanner",
            description: "Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.",
            html_url: "https://github.com/murali2277/vulnerabality-scanner",
            homepage: "https://vulnerabality-scanner-2.onrender.com/",
            language: "Python", // Adding language for consistency if needed by getFilteredTechTags
            topics: ["Security", "Scanner", "Cybersecurity"]
        },
        {
            name: "Bus_Attendance_System",
            description: "An automated attendance system for buses, leveraging technology to efficiently track passenger or student presence.",
            html_url: "https://github.com/murali2277/Bus_Attendance_System",
            homepage: "https://bus-attendance-system.vercel.app/",
            language: "Python",
            topics: ["Automation", "Python", "System"]
        },
        {
            name: "bus-live-tracking",
            description: "Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.",
            html_url: "https://github.com/murali2277/bus-live-tracking",
            homepage: "https://bus-live-tracking.vercel.app/",
            language: "Python",
            topics: ["GPS", "Real-time", "Tracking"]
        },
        {
            name: "ai-assistent-for-cyber-law",
            description: "AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.",
            html_url: "https://github.com/murali2277/ai-assistent-for-cyber-law",
            language: "Python",
            topics: ["AI", "Legal Tech", "Assistant"]
        },
        {
            name: "EduQuiz",
            description: "An educational quiz platform designed to help students learn and test their knowledge on various subjects.",
            html_url: "https://github.com/murali2277/EduQuiz",
            language: "JavaScript",
            topics: ["Education", "Quiz", "E-Learning"]
        },
        {
            name: "portfolio",
            description: "The source code for this portfolio website, built with modern HTML, CSS, and dynamic JavaScript to showcase my projects and skills.",
            html_url: "https://github.com/murali2277/portfolio",
            language: "JavaScript",
            topics: ["Portfolio", "JavaScript", "Frontend"]
        }
    ];
    displayProjects(fallbackProjects);
}


function formatProjectName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getDefaultDescription(projectName) {
    const descriptionMap = {
        'vulnerabality-scanner': 'Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.',
        'bus_attendance_system': 'An automated attendance system for buses, leveraging technology to efficiently track passenger or student presence.',
        'bus-live-tracking': 'Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.',
        'ai-assistent-for-cyber-law': 'AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.',
        'eduquiz': 'An educational quiz platform designed to help students learn and test their knowledge on various subjects.',
        'portfolio': 'The source code for this portfolio website, built with modern HTML, CSS, and dynamic JavaScript to showcase my projects and skills.'
    };
    return descriptionMap[projectName.toLowerCase()] || 'A comprehensive project showcasing modern development practices.';
}

function getProjectSpecificTags(projectName) {
    const tagMap = {
        'vulnerabality-scanner': ['Security', 'Scanner', 'Cybersecurity'],
        'bus_attendance_system': ['Automation', 'Python', 'System'],
        'bus-live-tracking': ['GPS', 'Real-time', 'Tracking'],
        'ai-assistent-for-cyber-law': ['AI', 'Legal Tech', 'Assistant'],
        'eduquiz': ['Education', 'Quiz', 'Web App'],
        'portfolio': ['Portfolio', 'JavaScript', 'Frontend']
    };
    // Prioritize specific tags, otherwise use generic for languages or topics
    return tagMap[projectName.toLowerCase()] || []; // Ensure it returns an array
}

