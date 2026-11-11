// Shared palette and motion tokens for the buildless Tailwind pages.
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: { DEFAULT: '#a85c3e', dark: '#914c32' },
                cocoa: '#252722',
                cream: '#f8ebd5',
                sand: '#f7f1eb',
                secondary: { DEFAULT: '#285440', soft: '#edf5ee', border: '#aac4af' }
            },
            fontFamily: { sans: ['Outfit', 'ui-sans-serif', 'system-ui'] },
            keyframes: {
                'phone-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '.85' },
                    '50%': { transform: 'scale(1.1)', opacity: '1' }
                },
                'greeting-blink': { '50%': { opacity: '0' } }
            },
            animation: {
                'phone-pulse': 'phone-pulse 4s ease-in-out infinite',
                'greeting-blink': 'greeting-blink 1s step-end infinite'
            }
        }
    }
};
