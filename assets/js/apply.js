(() => {
    const form = document.getElementById('seller-application-form');
    const steps = [...form.querySelectorAll('[data-application-step]')];
    const next = document.getElementById('application-next');
    const previous = document.getElementById('application-previous');
    const progress = document.getElementById('application-progress');
    const progressFill = document.getElementById('application-progress-fill');
    const progressLabel = document.getElementById('application-progress-label');
    const status = document.getElementById('application-status');
    const sameContact = document.getElementById('same-contact');
    const vatNumber = document.getElementById('vatNumber');
    const categories = [...form.querySelectorAll('[name="categories"]')];
    const legalDocuments = document.getElementById('legalDocuments');
    const progressWidths = ['w-1/4', 'w-1/2', 'w-3/4', 'w-full'];
    const contactPairs = [
        ['firstName', 'ownerFirstName'],
        ['lastName', 'ownerLastName'],
        ['email', 'ownerEmail'],
        ['mobile', 'ownerMobile']
    ];
    const sections = [
        {
            title: 'Company details', step: 0,
            fields: [
                ['storeName', 'Store / trading name'], ['legalName', 'Registered business name'],
                ['registrationNumber', 'Registration number'],
                ['street', 'Street address'], ['addressLine2', 'Address line 2'],
                ['city', 'City'], ['region', 'Province / region'],
                ['postalCode', 'Postal code'], ['country', 'Country'],
                ['legalDocuments', 'Business legal documents']
            ]
        },
        {
            title: 'Contact and owner details', step: 1,
            fields: [
                ['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email'],
                ['mobile', 'Mobile'], ['landline', 'Landline'],
                ['ownerFirstName', 'Owner first name'], ['ownerLastName', 'Owner last name'],
                ['ownerEmail', 'Owner email'], ['ownerMobile', 'Owner mobile'],
                ['vatRegistered', 'VAT registered'], ['vatNumber', 'VAT number']
            ]
        },
        {
            title: 'Products and fulfilment', step: 2,
            fields: [
                ['categories', 'Categories'],
                ['fulfilment', 'Fulfilment'], ['productDetails', 'Products and store']
            ]
        }
    ];
    let currentStep = 0;

    function copyContact() {
        contactPairs.forEach(([contactId, ownerId]) => {
            const owner = document.getElementById(ownerId);
            owner.readOnly = sameContact.checked;
            if (sameContact.checked) owner.value = document.getElementById(contactId).value;
        });
    }

    function collectDetails() {
        const values = new FormData(form);
        return sections.map(section => ({
            ...section,
            rows: section.fields.map(([name, label]) => ({
                label,
                value: values.getAll(name)
                    .map(value => typeof value === 'string' ? value.trim() : value.name)
                    .filter(Boolean)
                    .join(', ')
            })).filter(row => row.value)
        }));
    }

    function renderReview() {
        const review = document.getElementById('application-review');
        review.replaceChildren();
        collectDetails().forEach(section => {
            const card = document.createElement('section');
            card.className = 'rounded-xl border border-[#e8dcd2] p-4';
            const heading = document.createElement('div');
            heading.className = 'mb-3 flex items-center justify-between gap-4';
            const title = document.createElement('h2');
            title.className = 'text-sm font-semibold text-[#493428]';
            title.textContent = section.title;
            const edit = document.createElement('button');
            edit.type = 'button';
            edit.className = 'text-xs font-medium text-brand underline underline-offset-2';
            edit.textContent = 'Edit';
            edit.setAttribute('aria-label', `Edit ${section.title.toLowerCase()}`);
            edit.addEventListener('click', () => showStep(section.step));
            heading.append(title, edit);
            const list = document.createElement('dl');
            list.className = 'grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-[140px_minmax(0,1fr)]';
            section.rows.forEach(row => {
                const label = document.createElement('dt');
                label.className = 'text-[#9a8c80]';
                label.textContent = row.label;
                const value = document.createElement('dd');
                value.className = 'mb-2 whitespace-pre-wrap break-words text-[#54463c] sm:mb-0';
                value.textContent = row.value;
                list.append(label, value);
            });
            card.append(heading, list);
            review.append(card);
        });
    }

    function showStep(index) {
        currentStep = index;
        steps.forEach((step, position) => { step.hidden = position !== index; });
        progressLabel.textContent = `${index + 1} / ${steps.length}`;
        progress.setAttribute('aria-valuenow', String(index + 1));
        progressFill.classList.remove(...progressWidths);
        progressFill.classList.add(progressWidths[index]);
        document.querySelectorAll('[data-step-label]').forEach((label, position) => {
            if (position === index) label.setAttribute('aria-current', 'step');
            else label.removeAttribute('aria-current');
        });
        previous.hidden = index === 0;
        next.textContent = index === steps.length - 1 ? 'Create application email' : 'Next';
        status.hidden = true;
        if (index === steps.length - 1) renderReview();
        steps[index].querySelector('legend').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function validateStep(index) {
        if (index === 1) copyContact();
        if (index === 2) {
            categories[0].setCustomValidity(categories.some(input => input.checked) ? '' : 'Select at least one product category.');
        }
        for (const field of steps[index].querySelectorAll('input, select, textarea')) {
            if (field.disabled) continue;
            if (field.required && !['radio', 'checkbox', 'file'].includes(field.type)) field.value = field.value.trim();
            if (!field.checkValidity()) {
                showStep(index);
                field.reportValidity();
                return false;
            }
        }
        return true;
    }

    sameContact.addEventListener('change', copyContact);
    contactPairs.forEach(([contactId]) => document.getElementById(contactId).addEventListener('input', copyContact));
    form.querySelectorAll('[name="vatRegistered"]').forEach(input => {
        input.addEventListener('change', () => {
            const registered = form.querySelector('[name="vatRegistered"]:checked')?.value === 'Yes';
            document.getElementById('vat-number-field').hidden = !registered;
            vatNumber.disabled = !registered;
            vatNumber.required = registered;
        });
    });
    categories.forEach(input => input.addEventListener('change', () => categories[0].setCustomValidity('')));
    legalDocuments.addEventListener('change', () => {
        const list = document.getElementById('legal-documents-list');
        list.replaceChildren();
        for (const file of legalDocuments.files) {
            const item = document.createElement('li');
            item.className = 'break-words';
            item.textContent = file.name;
            list.append(item);
        }
        list.hidden = legalDocuments.files.length === 0;
    });
    previous.addEventListener('click', () => showStep(currentStep - 1));

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (currentStep < steps.length - 1) {
            if (validateStep(currentStep)) showStep(currentStep + 1);
            return;
        }
        for (let index = 0; index < steps.length - 1; index++) {
            if (!validateStep(index)) return;
        }
        const details = collectDetails();
        const body = [
            'Hello Bantu Basket team,', '',
            'I would like to apply to sell on Bantu Basket.', '',
            ...details.flatMap(section => [section.title, ...section.rows.map(row => `${row.label}: ${row.value}`), '']),
            'Please attach the selected business legal documents before sending this email.'
        ].join('\r\n');
        const storeName = document.getElementById('storeName').value.trim();
        const subject = encodeURIComponent(`Seller application - ${storeName}`);
        window.location.href = `mailto:support@bantubasket.co.za?subject=${subject}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Attach your selected legal documents to the draft in your email app, then send it to submit your application.';
        status.hidden = false;
    });
})();
