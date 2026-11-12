(() => {
    const form = document.getElementById('seller-application');
    const status = document.getElementById('seller-application-status');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        for (const field of form.querySelectorAll('[required]')) {
            field.value = field.value.trim();
        }

        if (!form.reportValidity()) return;

        const details = new FormData(form);
        const storeName = details.get('storeName').trim();
        const body = [
            'Hello Bantu Basket team,',
            '',
            'I would like to apply to sell on Bantu Basket.',
            '',
            `Contact name: ${details.get('contactName').trim()}`,
            `Store name: ${storeName}`,
            `Email: ${details.get('email').trim()}`,
            `Phone: ${details.get('phone').trim()}`,
            `Location: ${details.get('location').trim()}`,
            '',
            'About my business and products:',
            details.get('products').trim()
        ].join('\r\n');

        const subject = encodeURIComponent(`Seller application — ${storeName}`);
        window.location.href = `mailto:support@bantubasket.co.za?subject=${subject}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Send the draft in your email app to submit your application. You can also email support@bantubasket.co.za directly.';
        status.hidden = false;
    });
})();
