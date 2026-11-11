(() => {
    const slides = [
        ['A taste of <span>home,</span><br>delivered to your<br>doorstep.', 'Shop African groceries, drinks, snacks and everyday essentials from trusted local vendors.'],
        ['Your favourite<br><span>flavours,</span><br>closer to home.', 'Discover familiar staples, favourite snacks and something special for your next family meal.'],
        ['Local stores.<br><span>Familiar tastes.</span><br>One basket.', 'Explore African grocery stores and the ingredients that bring us together.']
    ];
    let current = 0;
    const dots = [...document.querySelectorAll('[data-slide]')];
    function show(index) {
        current = (index + slides.length) % slides.length;
        document.getElementById('hero-title').innerHTML = slides[current][0];
        document.getElementById('hero-description').textContent = slides[current][1];
        dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
    }
    document.getElementById('hero-previous').addEventListener('click', () => show(current - 1));
    document.getElementById('hero-next').addEventListener('click', () => show(current + 1));
    dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.slide))));
})();
