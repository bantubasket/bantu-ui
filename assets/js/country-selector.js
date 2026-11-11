
let countries = [];
let stores = [];

const modal = document.getElementById("country-modal");
const selector = document.getElementById("country-selector");
const closeButton = document.getElementById("close-country-modal");
const grid = document.getElementById("country-modal-grid");

let selectedCountry = localStorage.getItem("selectedCountry") || "Malawi";

async function loadCountrySelector() {
    try {
        const [countriesResponse, storesResponse] = await Promise.all([
            fetch("./json/countries.json"),
            fetch("./json/stores.json")
        ]);

        if (!countriesResponse.ok || !storesResponse.ok) {
            throw new Error("Failed to load country or store data");
        }

        const countriesData = await countriesResponse.json();
        const storesData = await storesResponse.json();

        countries = countriesData.countries;
        stores = Array.isArray(storesData)
            ? storesData
            : storesData.stores || [];

        // Support previously saved lowercase country selections.
        const matchingCountry = countries.find(
            (country) =>
                country.name.toLowerCase() === selectedCountry.toLowerCase()
        );

        selectedCountry = matchingCountry
            ? matchingCountry.name
            : "Malawi";

        renderCountries();
        updateHeader();

    } catch (error) {
        console.error("Error loading country selector:", error);
        grid.textContent = "Countries could not be loaded.";
    }
}

function getStoreCount(countryName) {
    return stores.filter((store) => {
        const storeCountry = store.country_focus || store.country;

        if (typeof storeCountry === "string") {
            return storeCountry.toLowerCase() === countryName.toLowerCase();
        }

        return storeCountry?.name?.toLowerCase() === countryName.toLowerCase();
    }).length;
}

function renderCountries() {
    grid.innerHTML = countries.map((country) => {
        const isSelected = selectedCountry === country.name;
        const storeCount = getStoreCount(country.name);

        return `
            <button
                type="button"
                data-country="${country.name}"
                aria-pressed="${isSelected}"
                class="group relative flex min-h-[132px] flex-col items-center justify-center
                       gap-2 rounded-2xl border px-3 py-4 text-center
                       transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9a080] hover:shadow-[0_8px_20px_#39291912]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2
                       ${isSelected
                           ? "border-brand bg-[#fff4e9] shadow-[0_8px_24px_#b65c3b14]"
                           : "border-[#eee4dc] bg-white"}"
            >
                ${isSelected ? `
                    <span class="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white" aria-hidden="true">
                        <svg viewBox="0 0 20 20" fill="none" class="h-3 w-3" stroke="currentColor" stroke-width="2.5">
                            <path d="m4 10 4 4 8-8"></path>
                        </svg>
                    </span>
                ` : ""}
                <img
                    src="${country.flag_url}"
                    alt="${country.name} flag"
                    class="h-12 w-12 rounded-full border-[3px] border-white object-cover shadow-sm ring-1 ring-[#eee4dc] transition group-hover:ring-brand/30"
                />

                <span class="text-[13px] font-bold leading-tight text-[#29382f]">
                    ${country.name}
                </span>

                <span class="rounded-full bg-[#f7f3ef] px-2.5 py-1 text-[10px] font-medium text-[#736b63]">
                    ${storeCount} ${storeCount === 1 ? "store" : "stores"}
                </span>
            </button>
        `;
    }).join("");

    grid.querySelectorAll("[data-country]").forEach((button) => {
        button.addEventListener("click", () => {
            selectCountry(button.dataset.country);
        });
    });
}

function updateHeader() {
    const country = countries.find(
        (item) => item.name === selectedCountry
    );

    if (!country) return;

    document.getElementById("selected-country-name").textContent = country.name;

    const flag = document.getElementById("selected-country-flag");

    flag.src = country.flag_url;
    flag.alt = `${country.name} flag`;
}

function openCountryModal() {
    renderCountries();

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    selector.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");

    closeButton.focus();
}

function closeCountryModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    selector.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");

    selector.focus();
}

function selectCountry(countryName) {
    const country = countries.find(
        (item) => item.name === countryName
    );

    if (!country) return;

    selectedCountry = country.name;

    localStorage.setItem("selectedCountry", selectedCountry);

    updateHeader();
    closeCountryModal();

    window.dispatchEvent(
        new CustomEvent("countryChanged", {
            detail: {
                country: selectedCountry
            }
        })
    );
}

selector.addEventListener("click", openCountryModal);
closeButton.addEventListener("click", closeCountryModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeCountryModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeCountryModal();
    }
});

loadCountrySelector();
