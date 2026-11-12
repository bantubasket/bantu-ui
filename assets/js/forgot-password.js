(() => {
    const form = document.getElementById('seller-reset-form');
    const email = document.getElementById('seller-reset-email');
    const status = document.getElementById('seller-reset-status');

    form.addEventListener('submit', event => {
        event.preventDefault();
        email.value = email.value.trim();
        if (!form.reportValidity()) return;

        status.textContent = 'Password reset is not connected yet. Please contact our seller team for help accessing your account.';
        status.hidden = false;
    });

    email.addEventListener('input', () => { status.hidden = true; });
})();
