(() => {
    const trigger = document.getElementById("delivery-selector");
    const dialog = document.getElementById("delivery-modal");
    const close = document.getElementById("close-delivery-modal");
    let wasScrollLocked;

    trigger.addEventListener("click", () => {
        wasScrollLocked = document.body.classList.contains('overflow-hidden');
        dialog.showModal();
        document.body.classList.add('overflow-hidden');
        trigger.setAttribute("aria-expanded", "true");
    });

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (
            event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom
        )) dialog.close();
    });

    dialog.addEventListener("close", () => {
        document.body.classList.toggle('overflow-hidden', wasScrollLocked);
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
    });
})();
