var SteempunkNet = {
    init: function () {
        var Frame = document.createElement('iframe');

        Frame.classList.add('steempunk-net');
        Frame.src = 'https://www.steempunk.net';

        document.body.appendChild(Frame);
    }
};

if (typeof document.body === 'undefined') {
    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        SteempunkNet.init();
    }, false);
} else {
    SteempunkNet.init();
}
