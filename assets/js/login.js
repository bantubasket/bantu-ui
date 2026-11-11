(() => {
    const trigger = document.getElementById("login-selector");
    const dialog = document.getElementById("login-modal");
    const password = document.getElementById("login-password");
    const toggle = document.getElementById("toggle-login-password");
    const status = document.getElementById("login-status");
    let wasScrollLocked;

    trigger.addEventListener("click", () => {
        wasScrollLocked = document.body.classList.contains('overflow-hidden');
        status.hidden = true;
        dialog.showModal();
        document.body.classList.add('overflow-hidden');
        trigger.setAttribute("aria-expanded", "true");
        document.getElementById("login-identity").focus();
    });
    document.getElementById("close-login-modal").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener("close", () => {
        document.body.classList.toggle('overflow-hidden', wasScrollLocked);
        trigger.setAttribute("aria-expanded", "false");
        password.value = "";
        password.type = "password";
        toggle.setAttribute("aria-label", "Show password");
        toggle.setAttribute("aria-pressed", "false");
        trigger.focus();
    });
    toggle.addEventListener("click", () => {
        const show = password.type === "password";
        password.type = show ? "text" : "password";
        toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
        toggle.setAttribute("aria-pressed", String(show));
    });
    const showStatus = (message) => {
        status.textContent = message;
        status.hidden = false;
    };
    document.getElementById("login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        showStatus("Login is not available yet. Please try again once account services are connected.");
    });
    const messages = {
        reset: "Password reset is not available yet.",
        register: "Account registration is not available yet.",
        google: "Google sign-in is not available yet.",
        terms: "Terms of Service will be available here soon.",
        privacy: "The privacy policy will be available here soon."
    };
    dialog.querySelectorAll("[data-login-action]").forEach((button) => {
        button.addEventListener("click", () => showStatus(messages[button.dataset.loginAction]));
    });
})();
