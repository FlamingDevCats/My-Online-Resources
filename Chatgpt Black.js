// ==UserScript==
// @name         Chatgpt Black
// @version      None
// @description  Makes the Chatgpt Website/App Fully Black.
// @author       Chatgpt
// @match        https://chatgpt.com/*
// ==/UserScript==

(function () {
    const html = document.documentElement;

    const apply = () => {
        if (!html.hasAttribute('data-oled')) {
            html.setAttribute('data-oled', '');
        }
    };

    // Run once
    apply();

    // Only react when the attribute actually changes
    new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'data-oled') {
                if (!html.hasAttribute('data-oled')) {
                    html.setAttribute('data-oled', '');
                }
            }
        }
    }).observe(html, {
        attributes: true,
        attributeFilter: ['data-oled']
    });
})();