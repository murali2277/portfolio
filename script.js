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

// --- Particle Text Effect Logic (Adapted from provided React component) ---

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;

    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

const ParticleTextEffect = (canvasId, words = ["Hi","It'z Me MK"]) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let animationFrameId;
  let particles = [];
  let currentWordIndex = 0;
  let animationCompleteCallback = null;
  let wordTransitioning = false; // New flag

  const pixelSteps = 6;
  const drawAsPoints = true;

  const generateRandomPos = (x, y, mag) => {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  };

  const nextWord = (word) => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    offscreenCtx.fillStyle = "white";
    offscreenCtx.font = "bold 100px Arial";
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const newColor = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    };

    let particleIndex = 0;
    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 0) {
        const x = (pixelIndex / 4) % canvas.width;
        const y = Math.floor(pixelIndex / 4 / canvas.width);

        let particle;

        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;

          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  const animate = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let allParticlesSettled = true;
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      // Check if particle is close to its target
      const distance = Math.sqrt(Math.pow(particle.pos.x - particle.target.x, 2) + Math.pow(particle.pos.y - particle.target.y, 2));
      if (distance > 5) { // Threshold for "settled"
        allParticlesSettled = false;
      }

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1);
        }
      }
    }

    if (allParticlesSettled && particles.length > 0 && !wordTransitioning) { // Added !wordTransitioning
      // All particles for the current word have settled
      if (currentWordIndex < words.length - 1) {
        wordTransitioning = true; // Set flag when transitioning to next word
        currentWordIndex++;
        setTimeout(() => {
          nextWord(words[currentWordIndex]);
          wordTransitioning = false; // Reset flag after next word starts
        }, 1000); // Delay before next word
      } else if (animationCompleteCallback) {
        // Last word has settled, trigger completion
        cleanup();
        animationCompleteCallback();
        animationCompleteCallback = null; // Ensure it's only called once
        return;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  const init = (callback) => {
    canvas.width = 1000;
    canvas.height = 500;
    animationCompleteCallback = callback;
    wordTransitioning = false; // Ensure it's false on init
    nextWord(words[currentWordIndex]);
    animate();
  };

  const cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  return { init, cleanup };
};


document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const particleCanvas = document.getElementById('particle-canvas');

    let particleEffectInstance;

    if (particleCanvas) {
        particleEffectInstance = ParticleTextEffect('particle-canvas');
        particleEffectInstance.init(() => {
            // This callback runs when the particle animation sequence is complete
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 1s ease-out';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        mainContent.style.opacity = '0';
                        mainContent.style.transition = 'opacity 1s ease-in';
                        setTimeout(() => {
                            mainContent.style.opacity = '1';
                            document.documentElement.style.overflow = ''; // Re-enable scrolling
                        }, 50); // Small delay to ensure display:block takes effect before transition
                    }
                }, 1000); // Matches loadingScreen transition duration
            }
        });
    } else {
        // If no particle canvas, just show main content
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        document.documentElement.style.overflow = ''; // Re-enable scrolling
    }


    // --- Initialize Core Features ---
    // Typing Animation for Hero Section
    if (document.getElementById('typewriter-text')) {
        new TypeWriter(document.getElementById('typewriter-text'), ['Full Stack Developer', 'Python Developer', 'Backend Enthusiast', 'Security Learner'], 2000);
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

function initStatsCards() {
    const githubUser = 'murali2277';
    const leetcodeUser = 'muralikumars';
    const theme = { title: '4ecdc4', icon: '00ff88', text: 'ffffff', bg: '00000000' };

    const statCards = [
        { id: 'github-stats-img', url: `https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=transparent&hide_border=true&title_color=${theme.title}&text_color=${theme.text}&icon_color=${theme.icon}` },
        { id: 'github-languages-img', url: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=transparent&hide_border=true&title_color=${theme.title}&text_color=${theme.text}&bg_color=${theme.bg}` },
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
            'LAN_Auto_Install',
            '6-axis', // Keep original name for API fetch
            'Bus_Attendance_System',
            'vulnerabality-scanner',
            'clyra',
            'bus-live-tracking',
            'travel_webpage', // Keep original name for API fetch
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
            name: "LAN_Auto_Install",
            description: "Automated LAN installation system for network devices and software deployment.",
            html_url: "https://github.com/murali2277/LAN_Auto_Install",
            homepage: "https://nova-net.netlify.app/",
            language: "Python",
            topics: ["Network Automation", "Deployment", "System Administration"],
            displayName: "novanet"
        },
        {
            name: "6-axis",
            description: "A project demonstrating control over a 6-axis robotic arm, focusing on precision movement and automation.",
            html_url: "https://github.com/murali2277/6-axis",
            homepage: "https://six-axis-frontend.onrender.com/",
            language: "C++",
            topics: ["Robotics", "Automation", "Control Systems"],
            displayName: "Robotic Arm Control System" // New display name
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
            name: "vulnerabality-scanner",
            description: "Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.",
            html_url: "https://github.com/murali2277/vulnerabality-scanner",
            homepage: "https://vulnerabality-scanner-2.onrender.com/",
            language: "Python", // Adding language for consistency if needed by getFilteredTechTags
            topics: ["Security", "Scanner", "Cybersecurity"]
        },
        {
            name: "clyra",
            description: "CLyra is a secure, low-latency WebRTC peer-to-peer communication app with a Node.js backend and a React frontend.",
            html_url: "https://github.com/murali2277/clyra",
            homepage: "https://clyra-eta.vercel.app/",
            language: "JavaScript",
            topics: ["WebRTC", "React", "Node.js", "Peer-to-Peer"]
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
            name: "travel_webpage",
            description: "A dynamic travel website showcasing various destinations, travel packages, and booking functionalities.",
            html_url: "https://github.com/murali2277/travel_webpage",
            homepage: "https://msktravels.onrender.com",
            language: "HTML",
            topics: ["Web Development", "Travel", "Frontend"],
            displayName: "Dynamic Travel Portal" // New display name
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
            topics: ["Portfolio", "JavaScript','React.js','Node.js", "Frontend"]
        }
    ];
    displayProjects(fallbackProjects);
}


function formatProjectName(name) {
    // Check for a custom display name first
    const customNames = {
        '6-axis': 'Robotic Arm Control System',
        'travel_webpage': 'Dynamic Travel Portal',
        'lan_auto_install': 'NovaNet',
        'clyra': 'Clyra',
    };
    if (customNames[name.toLowerCase()]) {
        return customNames[name.toLowerCase()];
    }
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getDefaultDescription(projectName) {
    const descriptionMap = {
        'lan_auto_install': 'Automated LAN installation system for network devices and software deployment.',
        'vulnerabality-scanner': 'Advanced vulnerability scanning tool designed to identify security weaknesses in web applications and networks.',
        'bus_attendance_system': 'An automated attendance system for buses, leveraging technology to efficiently track passenger or student presence.',
        'bus-live-tracking': 'Real-time bus tracking system with GPS integration for monitoring public transportation routes and schedules.',
        '6-axis': 'A project demonstrating control over a 6-axis robotic arm, focusing on precision movement and automation.',
        'travel_webpage': 'A dynamic travel website showcasing various destinations, travel packages, and booking functionalities.',
        'ai-assistent-for-cyber-law': 'AI-powered assistant specialized in cyber law consultation and legal guidance for cybersecurity matters.',
        'eduquiz': 'An educational quiz platform designed to help students learn and test their knowledge on various subjects.',
        'portfolio': 'The source code for this portfolio website, built with modern HTML, CSS, and dynamic JavaScript to showcase my projects and skills.'
    };
    return descriptionMap[projectName.toLowerCase()] || 'A comprehensive project showcasing modern development practices.';
}

function getProjectSpecificTags(projectName) {
    const tagMap = {
        'lan_auto_install': ['Network Automation', 'Deployment', 'System Administration'],
        'vulnerabality-scanner': ['Security', 'Scanner', 'Cybersecurity'],
        'bus_attendance_system': ['Automation', 'Python', 'System'],
        'bus-live-tracking': ['GPS', 'Real-time', 'Tracking'],
        'clyra': ['WebRTC', 'React', 'Node.js'],
        '6-axis': ['Robotics', 'Automation', 'Control Systems'],
        'travel_webpage': ['Web Development', 'Travel', 'Frontend'],
        'ai-assistent-for-cyber-law': ['AI', 'Legal Tech', 'Assistant'],
        'eduquiz': ['Education', 'Quiz', 'Web App'],
        'portfolio': ['Portfolio', 'JavaScript','Frontend']
    };
    // Prioritize specific tags, otherwise use generic for languages or topics
    return tagMap[projectName.toLowerCase()] || []; // Ensure it returns an array
}
