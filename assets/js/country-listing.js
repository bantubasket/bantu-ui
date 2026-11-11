(() => {
    const grid = document.getElementById('country-listing');
    Promise.all(['json/countries.json', 'json/stores.json'].map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Countries could not be loaded');
        return response.json();
    })).then(([data, catalog]) => {
        data.countries.forEach((country) => {
            const link = document.createElement('a');
            link.href = 'stores.html';
            link.className = 'flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-all hover:border-brand hover:bg-sand';
            link.addEventListener('click', () => localStorage.setItem('selectedCountry', country.name));
            const flag = document.createElement('img');
            flag.src = country.flag_url;
            flag.alt = `${country.name} flag`;
            flag.className = 'h-12 w-16 rounded-md object-cover';
            const name = document.createElement('span');
            name.textContent = country.name;
            name.className = 'text-sm font-bold';
            const count = document.createElement('span');
            const storeCount = (catalog.stores || []).filter((store) => (store.country_focus || store.country || '').toLowerCase() === country.name.toLowerCase()).length;
            count.className = 'text-xs text-cocoa';
            count.textContent = `${storeCount} ${storeCount === 1 ? 'store' : 'stores'}`;
            link.append(flag, name, count);
            grid.append(link);
        });
    }).catch(() => { grid.textContent = 'Countries could not be loaded. Please refresh to try again.'; });
})();
