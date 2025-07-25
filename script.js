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
            if (!heroSection) return;
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

// --- PROJECT FETCHING AND DISPLAY ---

// This function now fetches all 6 projects. The display order is handled by the fallback function.
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/murali2277/repos?sort=updated&per_page=100');
        const repos = await response.json();
        
        const specificProjects = [
            'vulnerabality-scanner',
            'Bus_Attendance_System',
            'bus-live-tracking', 
            'ai-assistent-for-cyber-law', 
            'EduQuiz', 
            'portfolio'
        ];
        
        const featuredRepos = repos
            .filter(repo => !repo.fork && specificProjects.map(p => p.toLowerCase()).includes(repo.name.toLowerCase()));

        if (featuredRepos.length >= specificProjects.length) {
            // Sort the found repos to match the user's specified order
            const orderedRepos = specificProjects.map(name => 
                featuredRepos.find(repo => repo.name.toLowerCase() === name.toLowerCase())
            ).filter(Boolean); // Filter out any undefined if a repo wasn't found
            displayProjects(orderedRepos);
        } else {
            console.warn('Could not find all specified repos via API. Displaying fallback list in the specified order.');
            displayFallbackProjects();
        }
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        displayFallbackProjects();
    }
}

// Display Projects Function - Renders project cards
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

// Get filtered tech tags
function getFilteredTechTags(project) {
    let tags = [];
    if (project.language && !['HTML', 'CSS'].includes(project.language)) {
        tags.push(project.language);
    }
    if (project.topics && project.topics.length > 0) {
        const filteredTopics = project.topics.filter(topic => !['html', 'css'].includes(topic.toLowerCase())).slice(0, 3);
        tags = [...new Set([...tags, ...filteredTopics])];
    }
    if (tags.length === 0) {
        tags = getProjectSpecificTags(project.name);
    }
    return tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
}

// Get project-specific tags based on project name
function getProjectSpecificTags(projectName) {
    const tagMap = {
        'vulnerabality-scanner': ['Security', 'Scanner', 'Cybersecurity'],
        'bus_attendance_system': ['Automation', 'Python', 'System'],
        'bus-live-tracking': ['GPS', 'Real-time', 'Tracking'],
        'ai-assistent-for-cyber-law': ['AI', 'Legal Tech', 'Assistant'],
        'eduquiz': ['Education', 'Quiz', 'Web App'],
        'portfolio': ['Portfolio', 'JavaScript', 'Frontend']
    };
    return tagMap[projectName.toLowerCase()] || ['Development'];
}

// Get default description based on project name
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

// Display Fallback Projects - This list is now in your specified order
function displayFallbackProjects() {
    const fallbackProjects = [
        // 1. Vulnerability Scanner
        {
            name: "vulnerabality-scanner",
            description: "Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.",
            language: "Python",
            html_url: "https://github.com/murali2277/vulnerabality-scanner",
            topics: ["Security", "Scanner", "Cybersecurity"]
        },
        // 2. Bus Attendance System
        {
            name: "Bus_Attendance_System",
            description: "An automated attendance system for buses, leveraging technology to efficiently track passenger or student presence.",
            language: "Python",
            html_url: "https://github.com/murali2277/Bus_Attendance_System",
            topics: ["Automation", "Python", "System"]
        },
        // 3. Bus Live Tracking
        {
            name: "bus-live-tracking",
            description: "Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.",
            language: "Python",
            html_url: "https://github.com/murali2277/bus-live-tracking",
            topics: ["GPS", "Real-time", "Tracking"]
        },
        // 4. AI Assistant
        {
            name: "ai-assistent-for-cyber-law",
            description: "AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.",
            language: "Python",
            html_url: "https://github.com/murali2277/ai-assistent-for-cyber-law",
            topics: ["AI", "Legal Tech", "Assistant"]
        },
        // 5. EduQuiz
        {
            name: "EduQuiz",
            description: "An educational quiz platform designed to help students learn and test their knowledge on various subjects.",
            language: "JavaScript",
            html_url: "https://github.com/murali2277/EduQuiz",
            topics: ["Education", "Quiz", "E-Learning"]
        },
        // 6. Portfolio
        {
            name: "portfolio",
            description: "The source code for this portfolio website, built with modern HTML, CSS, and dynamic JavaScript to showcase my projects and skills.",
            language: "JavaScript",
            html_url: "https://github.com/murali2277/portfolio",
            topics: ["Portfolio", "JavaScript", "Frontend"]
        }
    ];
    displayProjects(fallbackProjects);
}

// Format Project Name Function
function formatProjectName(name) {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// --- INITIALIZATION AND EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const words = ['Python Developer', 'Backend Enthusiast', 'Security Learner', 'Problem Solver', 'Code Craftsman'];
        new TypeWriter(typeWriterElement, words, 2000);
    }

    // Initialize interactive elements
    initScrollDownArrow();

    // Get DOM elements for navigation
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
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
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

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                if (navMenu.classList.contains('active')) {
                    hamburger.click();
                }
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Active link highlighting on scroll
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

    // Fetch GitHub projects
    fetchGitHubProjects();

    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
        if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.click();
        }
    });
});

// Animations on Scroll
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-card, .stats-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
});

// Button Ripple Effect
document.addEventListener('DOMContentLoaded', function() {
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
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    if (!document.querySelector('#ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.innerHTML = `.ripple-effect { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.3); transform: scale(0); animation: ripple 0.6s linear; } @keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
        document.head.appendChild(style);
    }
});

// Network Background Animation
(function initNetworkBackground() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#00ff88';
    let width, height, points = [], animationId;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        points = Array.from({ length: Math.floor((width + height) / 25) }, () => ({
            x: Math.random() * width, y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1
        }));
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        points.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = primaryColor; ctx.fill();
        });
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (dist < 120) {
                    ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = `rgba(${parseInt(primaryColor.slice(1,3),16)}, ${parseInt(primaryColor.slice(3,5),16)}, ${parseInt(primaryColor.slice(5,7),16)}, ${(1 - dist / 120) * 0.5})`;
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animate);
    };

    resize(); animate();
    window.addEventListener('resize', resize);
})();

// GitHub and LeetCode Stats Card Loading
document.addEventListener('DOMContentLoaded', () => {
    const githubUser = 'murali2277';
    const leetcodeUser = 'muralikumars';
    const titleColor = '00ff88', iconColor = '00ff88', textColor = 'ffffff';

    const statCards = [
        { id: 'github-stats-img', url: `https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=transparent&hide_border=true&title_color=${titleColor}&text_color=${textColor}&icon_color=${iconColor}` },
        { id: 'github-languages-img', url: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=transparent&hide_border=true&title_color=${titleColor}&text_color=${textColor}&bg_color=00000000` },
        { id: 'leetcode-stats-img', url: `https://leetcard.jacoblin.cool/${leetcodeUser}?theme=dark&font=Poppins&radius=8` },
        { id: 'github-streak-img', url: `https://github-readme-streak-stats.herokuapp.com/?user=${githubUser}&theme=dark&hide_border=true&background=00000000&stroke=${iconColor}&ring=${iconColor}&fire=${iconColor}&curr_streak_text_color=${textColor}&side_stats=false` }
    ];

    const handleImageError = (cardElement) => {
        cardElement.classList.add('error');
        cardElement.innerHTML = `<div class="error-fallback"><span>!</span><p>Could not load stats.</p></div>`;
    };

    statCards.forEach(card => {
        const imageElement = document.getElementById(card.id);
        if (imageElement) {
            imageElement.onerror = () => handleImageError(imageElement.parentElement);
            imageElement.src = card.url;
            imageElement.alt = `${card.id.replace(/-/g, ' ')}`;
        } else {
            console.warn(`Element with ID '${card.id}' was not found in the HTML.`);
        }
    });
});
