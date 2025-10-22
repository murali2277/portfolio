import anime from "https://esm.sh/animejs@3.2.1";

// Manual safe splitter that targets the About Me paragraph
function splitTextIntoChars(element) {
    const text = element.textContent || '';
    element.innerHTML = '';
    const spans = [];
    for (const ch of text) {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        element.appendChild(span);
        spans.push(span);
    }
    return spans;
}

const radius = 40;
const rects = [];
const animations = [];
let pointerX = 0;
let pointerY = 0;

const getRect = ($c, i) => rects[i] = $c.getBoundingClientRect();

export function initSplitterNow() {
    // The paragraph in the HTML has id 'about-me'
    const aboutMeParagraph = document.querySelector('#about-me');
    if (!aboutMeParagraph) {
        console.error("Splitter Target: About me paragraph not found!");
        return false;
    }

    const chars = splitTextIntoChars(aboutMeParagraph);

    const animateChar = ($c, i) => {
        const anim = animations[i];
        if (anim && anim.completed === false) return;
        const rect = rects[i];
        if (!rect) return;
        const dx = pointerX - (rect.left + (rect.width * 0.5));
        const dy = pointerY - (rect.top + (rect.height * 0.5));
        const distanceSquared = dx * dx + dy * dy;
        const intersect = distanceSquared <= radius * radius;
        if (intersect) {
            const randomX = (Math.random() - 0.5) * radius * 2;
            const randomY = (Math.random() - 0.5) * radius * 2;
            animations[i] = anime({
                targets: $c,
                translateX: [randomX, 0],
                translateY: [randomY, 0],
                duration: 1000,
                delay: 200,
                easing: 'easeInOutQuad'
            });
        }
    };

    document.addEventListener('pointermove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
    });

    function loop() {
        chars.forEach(animateChar);
        requestAnimationFrame(loop);
    }
    loop();

    chars.forEach(getRect);
    window.addEventListener('resize', () => chars.forEach(getRect));
    console.log('Splitter initialized with', chars.length, 'chars');
    return true;
}
