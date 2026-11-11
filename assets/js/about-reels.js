(() => {
    const track = document.getElementById('reels-track');
    const previous = document.getElementById('reels-previous');
    const next = document.getElementById('reels-next');
    function update() {
        previous.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    previous.addEventListener('click', () => track.scrollBy({ left: -(track.clientWidth + 12) }));
    next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth + 12 }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
