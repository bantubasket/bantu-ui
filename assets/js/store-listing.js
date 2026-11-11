(() => {
    const grid = document.getElementById('store-listing-grid');
    const search = document.getElementById('search');
    const empty = document.getElementById('stores-empty');
    const error = document.getElementById('store-error');
    let stores = [];
    let countries = [];
    const requestedCountry = new URLSearchParams(window.location.search).get('country');
    let selectedCountries = requestedCountry ? [requestedCountry] : [];
    const el = (tag, className, text) => {
        const element = document.createElement(tag);
        element.className = className;
        if (text != null) element.textContent = text;
        return element;
    };
    function card(store) {
        const article = el('a', 'group flex h-full flex-col overflow-hidden rounded-[14px] border border-[#e8dcd4] bg-white p-[5px] transition-colors hover:border-[#d5a78b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 [&_h2]:text-[14px] [&_h2]:font-bold [&_h2]:leading-tight');
        article.href = 'products.html';
        const frame = el('div', 'relative aspect-[5/3] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#fcf0e2] [&_img]:h-full [&_img]:w-full [&_img]:object-cover');
        const image = document.createElement('img');
        image.alt = `${store.name} store`;
        image.loading = 'lazy';
        image.addEventListener('error', () => { image.src = 'assets/img/placeholder.png'; }, { once: true });
        image.src = store.logo_url || 'assets/img/placeholder.png';
        frame.append(image);
        if (store.promotion?.description) {
            frame.append(el('p', 'absolute left-2.5 top-2.5 max-w-[calc(100%-20px)] rounded-md bg-[#b75e3b] px-2 py-1 text-[9px] font-semibold leading-tight text-white', store.promotion.description));
        }
        const details = el('div', 'flex flex-1 flex-col px-2 pt-2 pb-[3px]');
        details.append(el('h2', '', store.name));
        if (Number.isFinite(store.rating?.score)) {
            const rating = el('p', 'mt-[5px] flex items-center gap-1 text-[11px] leading-tight text-[#45414a]');
            rating.append(el('span', 'text-[15px] leading-none text-[#e87700]', '★'), document.createTextNode(`${store.rating.score.toFixed(1)}${Number.isFinite(store.rating.review_count) ? ` (${store.rating.review_count} reviews)` : ''}`));
            details.append(rating);
        }
        if (store.country_focus) {
            const country = countries.find((item) => item.name.toLowerCase() === store.country_focus.toLowerCase());
            const origin = el('div', 'mt-[8px] flex items-center gap-[7px] border-t border-[#eee3dc] pt-[7px] text-[11px] text-[#24523c] [&_img]:h-[11px] [&_img]:w-4 [&_img]:rounded-sm [&_img]:object-cover');
            if (country?.flag_url) {
                const flag = document.createElement('img');
                flag.src = country.flag_url;
                flag.alt = '';
                flag.width = 16;
                flag.height = 11;
                origin.append(flag);
            }
            origin.append(document.createTextNode(store.country_focus));
            origin.append(el('span', 'ml-auto flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-[#fff0df] text-[19px] leading-none text-[#c45f30]', '→'));
            details.append(origin);
        }
        article.append(frame, details);
        return article;
    }
    function render() {
        const query = search.value.trim().toLowerCase();
        const visible = stores.filter((store) => {
            const terms = [store.name, store.country_focus, store.area, store.city, ...(store.categories || []), ...(store.featured_products || [])].join(' ').toLowerCase();
            return terms.includes(query) && (!selectedCountries.length || selectedCountries.includes(store.country_focus));
        });
        grid.replaceChildren(...visible.map(card));
        empty.hidden = visible.length > 0;
    }
    search.addEventListener('input', render);
    window.addEventListener('countryChanged', (event) => {
        selectedCountries = [event.detail.country];
        render();
    });
    async function load() {
        error.hidden = true;
        empty.hidden = true;
        try {
            const [response, countriesResponse] = await Promise.all([
                fetch('json/stores.json'), fetch('json/countries.json')
            ]);
            if (!response.ok || !countriesResponse.ok) throw new Error('Could not load stores');
            const [data, countryData] = await Promise.all([response.json(), countriesResponse.json()]);
            countries = countryData.countries || [];
            stores = Array.isArray(data) ? data : data.stores;
            if (!Array.isArray(stores)) throw new Error('Invalid store catalog');
            render();
        } catch (problem) {
            error.hidden = false;
            console.error(problem);
        }
    }
    document.getElementById('retry-stores').addEventListener('click', load);
    load();
})();
