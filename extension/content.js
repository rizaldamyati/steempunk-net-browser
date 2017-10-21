(function (window, document) {
    var urls = [
        'https://steemit.com/',
        'steemit.com'
    ];

    var loc = window.location.host;

    if (urls.indexOf(loc) === -1) {
        return;
    }

    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.extension.getURL('/assets/javascripts/history-events.js'));
    s.setAttribute('data-dir', chrome.extension.getURL('/'));
    document.body.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.extension.getURL('/assets/javascripts/plugin.js'));
    s.setAttribute('data-dir', chrome.extension.getURL('/'));
    s.setAttribute('data-steempunk', '1');
    document.body.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.extension.getURL('/assets/javascripts/messages.js'));
    s.setAttribute('data-dir', chrome.extension.getURL('/'));
    document.body.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.extension.getURL('/assets/javascripts/items.js'));
    s.setAttribute('data-dir', chrome.extension.getURL('/'));
    document.body.appendChild(s);

    s = document.createElement('link');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('href', chrome.extension.getURL('/assets/css/plugin.css'));
    document.body.appendChild(s);

    function inIFrame() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    var messageListener = function (msg, sender, sendResponse) {
        if (inIFrame()) {
            return;
        }

        var event;

        if (msg.action === 'STEEMPUNK-CLOSE') {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent("STEEMPUNK-CLOSE", true, true, {});
            window.dispatchEvent(event);
            return;
        }

        if (msg.action === 'STEEMPUNK-MENU') {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent("STEEMPUNK-MENU", true, true, {});
            window.dispatchEvent(event);
        }
    };

    if (typeof chrome !== 'undefined'
        && typeof chrome.extension !== 'undefined'
        && typeof chrome.extension.onMessage !== 'undefined'
    ) {
        chrome.extension.onMessage.addListener(messageListener);
    } else if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
        browser.runtime.onMessage.addListener(messageListener);
    }
})(window, document);
