window.addEventListener('message', function (event) {
    var Frame = document.querySelector('iframe');

    if (typeof Frame === 'undefined') {
        return;
    }

    if (typeof Frame.contentWindow === 'undefined') {
        return;
    }

    Frame.contentWindow.postMessage({
        orgin    : event.origin,
        data     : event.data,
        type     : event.type,
        timeStamp: event.timeStamp
    }, '*');
});
