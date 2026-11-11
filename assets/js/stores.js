const popularStoresGrid = document.getElementById("popular-stores-grid");
const recentStoresGrid = document.getElementById("recent-stores-grid");
const countriesGrid = document.getElementById("countries-grid");

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function createRatingElement(store, className) {
    if (!store.rating || !Number.isFinite(store.rating.score)) {
        return null;
    }

    const rating = document.createElement("p");
    rating.className = className;
    rating.appendChild(createTextElement("span", "text-amber-500", "★"));
    rating.append(` ${store.rating.score.toFixed(1)}`);
    if (Number.isFinite(store.rating.review_count)) {
        rating.appendChild(createTextElement(
            "span",
            "text-slate-500",
            ` (${store.rating.review_count} reviews)`
        ));
    }
    return rating;
}

function createPopularStoreCard(store) {
    const card = document.createElement("a");
    card.href = "products.html";
    card.className = "group block rounded-xl border border-slate-200 p-3 transition hover:border-brand";

    const imageFrame = document.createElement("div");
    imageFrame.className = "relative aspect-[1.7] overflow-hidden rounded-[11px]";

    const image = document.createElement("img");
    image.src = store.logo_url;
    image.alt = `${store.name} logo`;
    image.loading = "lazy";
    image.className = "h-full w-full object-cover transition duration-300 group-hover:scale-105";
    imageFrame.appendChild(image);

    if (store.promotion && store.promotion.description) {
        const promotion = createTextElement(
            "span",
            "absolute left-1.5 top-1.5 max-w-[calc(100%-45px)] rounded-full bg-brand px-2.5 py-[5px] text-[11px] font-semibold text-white",
            store.promotion.description
        );
        imageFrame.appendChild(promotion);
    }

    card.appendChild(imageFrame);
    card.appendChild(createTextElement("h3", "mt-3 font-bold", store.name));

    const rating = createRatingElement(store, "mt-1 text-sm");
    if (rating) {
        card.appendChild(rating);
    }

    const wrapper = document.createElement("article");
    wrapper.className = "relative rounded-2xl border border-[#e3e5eb] bg-gradient-to-br from-white to-[#fdfbfa] p-[9px] transition hover:border-[#c7a38a] hover:shadow-[0_4px_15px_#a85c3e0d] [&>a]:block [&_h3]:mx-[9px] [&_h3]:mb-0 [&_h3]:mt-[9px] [&_h3]:text-[15px] [&_h3]:leading-tight [&>a>p]:mx-[9px] [&>a>p]:mb-0.5 [&>a>p]:mt-1.5 [&>a>p]:text-[13px]";
    card.className = "block";
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "absolute right-[14px] top-[14px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#20513b] shadow-[0_2px_5px_#00000010] [&_svg]:h-5 [&_svg]:w-5 [&[aria-pressed=true]_svg]:fill-[#20513b]";
    favorite.setAttribute("aria-label", `Save ${store.name} to wishlist`);
    favorite.setAttribute("aria-pressed", "false");
    favorite.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
    favorite.addEventListener("click", () => {
        const selected = favorite.getAttribute("aria-pressed") !== "true";
        favorite.setAttribute("aria-pressed", String(selected));
        favorite.setAttribute("aria-label", `${selected ? "Remove" : "Save"} ${store.name} ${selected ? "from" : "to"} wishlist`);
    });
    wrapper.append(card, favorite);
    return wrapper;
}

function createRecentStoreCard(store) {
    const card = document.createElement("a");
    card.href = "products.html";
    card.className = "flex items-center gap-4 rounded-xl border border-[#e3e5eb] bg-[#fcfaf8] px-[15px] py-2.5 transition hover:border-brand";

    const imageFrame = document.createElement("div");
    imageFrame.className = "h-[46px] w-14 shrink-0 overflow-hidden rounded-lg";

    const image = document.createElement("img");
    image.src = store.logo_url;
    image.alt = `${store.name} logo`;
    image.loading = "lazy";
    image.className = "h-full w-full object-cover";
    imageFrame.appendChild(image);
    card.appendChild(imageFrame);

    const details = document.createElement("div");
    details.appendChild(createTextElement("h3", "text-[13px] font-bold", store.name));
    const rating = createRatingElement(store, "mt-1 text-[11px]");
    if (rating) {
        details.appendChild(rating);
    }
    card.appendChild(details);
    card.appendChild(createTextElement("span", "ml-auto text-brand", "→"));

    return card;
}

function createCountryCard(country) {
    const card = document.createElement("a");
    card.href = "stores.html";
    card.addEventListener("click", () => localStorage.setItem("selectedCountry", country.name));
    card.className = "group flex items-center gap-[15px] rounded-[22px] border border-b-2 border-[#e3e5eb] bg-[#fcfaf8] px-[18px] py-2.5 text-left max-[1100px]:gap-2 max-[1100px]:px-2.5 max-md:flex-col max-md:px-[5px] max-md:py-3";

    const imageFrame = document.createElement("div");
    imageFrame.className = "flex justify-center";

    const image = document.createElement("img");
    image.src = country.flag_url;
    image.alt = `${country.name} flag`;
    image.loading = "lazy";
    image.className = "h-[43px] w-[43px] rounded-full object-cover transition group-hover:ring-2 ring-brand/40";
    imageFrame.appendChild(image);
    card.appendChild(imageFrame);
    card.appendChild(createTextElement("p", "text-[13px] font-semibold text-[#151c29] max-[1100px]:text-[11px]", country.name));

    return card;
}

function showStoreLoadError(message, error) {
    console.error(message, error);
    popularStoresGrid.textContent = "Stores could not be loaded.";
    recentStoresGrid.textContent = "Stores could not be loaded.";
}

function showCountryLoadError(message, error) {
    console.error(message, error);
    countriesGrid.textContent = "Countries could not be loaded.";
}

async function displayStores() {
    let data;
    try {
        const response = await fetch("./json/stores.json");
        if (!response.ok) {
            throw new Error(`Store data request failed with status ${response.status}.`);
        }
        data = await response.json();
    } catch (error) {
        showStoreLoadError("Unable to load stores from json/stores.json.", error);
        return;
    }

    if (!data || !Array.isArray(data.stores)) {
        showStoreLoadError("Store data does not contain a valid stores list.", new Error("Invalid stores data."));
        return;
    }

    const malawiStores = data.stores.filter((store) => store.country_focus === "Malawi");
    if (!malawiStores.length) {
        showStoreLoadError("No Malawi stores were found in json/stores.json.", new Error("No matching stores."));
        return;
    }

    popularStoresGrid.replaceChildren(...malawiStores.slice(0, 4).map(createPopularStoreCard));
    recentStoresGrid.replaceChildren(...malawiStores.slice(0, 3).map(createRecentStoreCard));
}

async function displayCountries() {
    let data;
    try {
        const response = await fetch("./json/countries.json");
        if (!response.ok) {
            throw new Error(`Country data request failed with status ${response.status}.`);
        }
        data = await response.json();
    } catch (error) {
        showCountryLoadError("Unable to load countries from json/countries.json.", error);
        return;
    }

    if (!data || !Array.isArray(data.countries)) {
        showCountryLoadError(
            "Country data does not contain a valid countries list.",
            new Error("Invalid countries data.")
        );
        return;
    }

    countriesGrid.replaceChildren(...data.countries.map(createCountryCard));
}

displayStores();
displayCountries();
