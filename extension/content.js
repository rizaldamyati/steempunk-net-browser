var url = '';

if (window.location.toString().match(url)) {

    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.extension.getURL('/assets/javascripts/plugin.js'));
    document.body.appendChild(s);

    s = document.createElement('link');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('href', chrome.extension.getURL('/assets/css/plugin.css'));
    document.body.appendChild(s);

    var messageListener = function () {

    };

    if (typeof chrome !== 'undefined'
        && typeof chrome.extension !== 'undefined'
        && typeof chrome.extension.onMessage !== 'undefined'
    ) {
        chrome.extension.onMessage.addListener(messageListener);
    } else if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
        browser.runtime.onMessage.addListener(messageListener);
    }
}
