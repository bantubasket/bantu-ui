(() => {
    const heading = document.getElementById('about-greeting');
    const greetings = ['Mbote!', 'Madii!', 'Sawubona!', 'Moni!','Salaan!','Dumela'];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let deleting = true;
    let timer;

    function tick() {
        const greeting = greetings[index];
        if (deleting) {
            heading.textContent = heading.textContent.slice(0, -1);
            if (!heading.textContent) {
                deleting = false;
                index = (index + 1) % greetings.length;
                timer = setTimeout(tick, 250);
                return;
            }
        } else {
            heading.textContent = greeting.slice(0, heading.textContent.length + 1);
            if (heading.textContent === greeting) {
                deleting = true;
                timer = setTimeout(tick, 1800);
                return;
            }
        }
        timer = setTimeout(tick, deleting ? 65 : 120);
    }

    function start() {
        clearTimeout(timer);
        index = 0;
        deleting = true;
        heading.textContent = greetings[0];
        if (!motion.matches) timer = setTimeout(tick, 1800);
    }

    motion.addEventListener('change', start);
    start();
})();
