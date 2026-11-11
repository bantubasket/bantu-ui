(() => {
    const status = document.getElementById('product-load-status');
    const feedback = document.getElementById('product-action-status');
    const quantity = document.getElementById('product-quantity');
    const samplePrices = [55, 85, 65, 75, 60];
    const normalizeQuantity = () => {
        quantity.value = String(Math.max(1, Math.min(99, Math.floor(Number(quantity.value) || 1))));
        return Number(quantity.value);
    };
    document.getElementById('quantity-minus').addEventListener('click', () => { quantity.value = Math.max(1, normalizeQuantity() - 1); });
    document.getElementById('quantity-plus').addEventListener('click', () => { quantity.value = Math.min(99, normalizeQuantity() + 1); });
    quantity.addEventListener('change', normalizeQuantity);
    const tabs = ['description', 'specification'];
    function selectTab(name) {
        tabs.forEach((tab) => {
            const button = document.getElementById(`${tab}-tab`);
            button.setAttribute('aria-selected', String(tab === name));
            button.tabIndex = tab === name ? 0 : -1;
            document.getElementById(`${tab}-panel`).hidden = tab !== name;
        });
    }
    tabs.forEach((name) => {
        const button = document.getElementById(`${name}-tab`);
        button.addEventListener('click', () => selectTab(name));
        button.addEventListener('keydown', (event) => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[1] : tabs.find((tab) => tab !== name);
                selectTab(target);
                document.getElementById(`${target}-tab`).focus();
            }
        });
    });
    document.getElementById('copy-product-link').addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(location.href); feedback.textContent = 'Product link copied.'; }
        catch { feedback.textContent = 'Copy the page address from your browser to share this product.'; }
    });
    fetch('json/products.json').then((response) => {
        if (!response.ok) throw new Error('Unable to load product');
        return response.json();
    }).then((catalog) => {
        const products = Array.isArray(catalog) ? catalog : catalog.products;
        const id = new URLSearchParams(location.search).get('id');
        const product = id ? products.find((item) => item.id === id) : products[0];
        if (!product) throw new Error('Product not found');
        const price = Number.isFinite(product.price) ? product.price : samplePrices[products.indexOf(product) % samplePrices.length];
        ['product-name', 'product-banner-name', 'product-crumb'].forEach((name) => { document.getElementById(name).textContent = product.name; });
        document.title = `${product.name} | Bantu Basket`;
        document.getElementById('product-code').textContent = product.id;
        document.getElementById('product-photo').alt = `Placeholder for ${product.name}`;
        document.getElementById('single-price').textContent = `R${price.toFixed(2)}`;
        document.getElementById('product-pack').textContent = product.unit || 'Standard pack';
        document.getElementById('description-panel').textContent = product.description || 'Discover a taste of home with Bantu Basket.';
        const specs = document.getElementById('product-specifications');
        Object.entries({ 'Product code': product.id, Category: product.category, 'Pack size': product.unit, Origin: catalog.origin_focus || 'Africa' }).forEach(([label, value]) => {
            const term = document.createElement('dt'); term.textContent = label;
            const detail = document.createElement('dd'); detail.textContent = value || '—';
            specs.append(term, detail);
        });
        document.getElementById('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${product.name} ${location.href}`)}`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`;
        document.getElementById('product-wishlist').addEventListener('click', (event) => {
            const button = event.currentTarget;
            const selected = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(selected));
            button.querySelector('span').textContent = selected ? 'Added to Wishlist' : 'Add to Wishlist';
            feedback.textContent = selected ? 'Added to your wishlist for this preview.' : 'Removed from your wishlist.';
        });
        document.getElementById('add-product-cart').addEventListener('click', () => {
            const amount = normalizeQuantity();
            const cart = document.querySelector('header button[aria-label^="View cart"]');
            if (cart) {
                const badge = cart.querySelector('.absolute');
                const total = cart.querySelector('strong');
                const items = (Number(badge?.textContent) || 0) + amount;
                if (badge) badge.textContent = String(items);
                if (total) total.textContent = `R${((Number(total.textContent.replace(/[^0-9.]/g, '')) || 0) + price * amount).toFixed(2)}`;
                cart.setAttribute('aria-label', `View cart, ${items} items`);
            }
            feedback.textContent = `${amount} × ${product.name} added to cart for this preview.`;
        });
        status.hidden = true;
        document.getElementById('product-content').hidden = false;
    }).catch((error) => {
        status.textContent = `${error.message}. Please return to the products page.`;
    });
})();
