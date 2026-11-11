(() => {
    const grid = document.getElementById('products-grid');
    const count = document.getElementById('product-count');
    const empty = document.getElementById('products-empty');
    const form = document.getElementById('product-filters');
    const search = document.getElementById('search');
    const sort = document.getElementById('product-sort');
    const priceSlider = document.getElementById('price-range');
    const priceOutput = document.getElementById('price-range-value');
    priceSlider.addEventListener('input', () => { priceOutput.textContent = `R${priceSlider.value}`; });
    let products = [];
    let categories = [];
    let seller = '';
    let priceRange = '';
    let currency = 'ZAR';
    const ranges = [[0, 50], [50, 100], [100, 150], [150, 250], [250, Infinity]];
    const textElement = (tag, className, text) => {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    };
    const hasPrice = (product) => typeof product.price === 'number' && Number.isFinite(product.price);
    const sellerName = (product) => typeof product.seller === 'string' ? product.seller : product.seller?.name;
    function render() {
        const query = search.value.trim().toLowerCase();
        const shown = products.filter((product) => {
            const matchesText = [product.name, product.description, product.category, ...(product.tags || [])].join(' ').toLowerCase().includes(query);
            const range = priceRange === '' ? null : ranges[Number(priceRange)];
            return matchesText && (!categories.length || categories.includes(product.category)) &&
                (!seller || sellerName(product) === seller) &&
                (!range || (hasPrice(product) && product.price >= range[0] && product.price < range[1]));
        });
        if (sort.value.startsWith('name')) shown.sort((a, b) => a.name.localeCompare(b.name) * (sort.value === 'name-desc' ? -1 : 1));
        if (sort.value.startsWith('price')) shown.sort((a, b) => {
            if (!hasPrice(a)) return hasPrice(b) ? 1 : 0;
            if (!hasPrice(b)) return -1;
            return (a.price - b.price) * (sort.value === 'price-desc' ? -1 : 1);
        });
        grid.replaceChildren(...shown.map((product) => {
            const card = textElement('a', 'block [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:leading-[1.45] group-data-[view=list]/products:grid group-data-[view=list]/products:grid-cols-[125px_1fr] group-data-[view=list]/products:gap-5 group-data-[view=list]/products:border-b group-data-[view=list]/products:border-[#e5d8ce] group-data-[view=list]/products:pb-[18px]', '');
            card.href = `product.html?id=${encodeURIComponent(product.id)}`;
            const frame = textElement('div', 'aspect-square overflow-hidden rounded-[15px] border border-[#e0d1c5] bg-cream [&_img]:h-full [&_img]:w-full [&_img]:object-cover', '');
            const image = document.createElement('img');
            image.src = 'assets/img/placeholder.png';
            image.alt = `Placeholder for ${product.name}`;
            image.loading = 'lazy';
            frame.append(image);
            const details = document.createElement('div');
            details.append(textElement('h2', '', product.name),
                textElement('p', 'mt-[5px] text-base font-semibold text-brand', hasPrice(product) ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(product.price) : 'Price unavailable'),
                textElement('p', 'mt-[7px] hidden text-sm text-[#6e716b] group-data-[view=list]/products:block', product.description || ''));
            card.append(frame, details);
            return card;
        }));
        count.textContent = `${shown.length} Product${shown.length === 1 ? '' : 's'} Found`;
        empty.hidden = shown.length > 0;
    }
    function option(container, type, name, value, label) {
        const wrapper = document.createElement('label');
        const input = document.createElement('input');
        Object.assign(input, { type, name, value });
        wrapper.append(input, document.createTextNode(label));
        container.append(wrapper);
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        categories = data.getAll('category');
        seller = data.get('seller') || '';
        priceRange = data.get('price') || '';
        render();
    });
    document.getElementById('clear-filters').addEventListener('click', () => {
        form.reset();
        priceOutput.textContent = `R${priceSlider.value}`;
        categories = [];
        seller = priceRange = search.value = '';
        sort.value = 'default';
        render();
    });
    search.addEventListener('input', render);
    sort.addEventListener('change', render);
    ['grid', 'list'].forEach((view) => {
        document.getElementById(`${view}-view`).addEventListener('click', () => {
            grid.dataset.view = view;
            ['grid', 'list'].forEach((name) => {
                const button = document.getElementById(`${name}-view`);
                button.setAttribute('aria-pressed', String(name === view));
            });
        });
    });
    fetch('json/products.json').then((response) => {
        if (!response.ok) throw new Error('Product request failed');
        return response.json();
    }).then((data) => {
        products = Array.isArray(data) ? data : data.products;
        if (!Array.isArray(products)) throw new Error('Invalid product catalog');
        currency = data.currency || 'ZAR';
        [...new Set(products.map((product) => product.category).filter(Boolean))].forEach((category) => option(document.getElementById('category-options'), 'checkbox', 'category', category, category));
        render();
    }).catch((error) => {
        count.textContent = 'Products could not be loaded. Please refresh to try again.';
        console.error(error);
    });
})();
