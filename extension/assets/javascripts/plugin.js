/**
 * Steempunk integration into www.steemit.com
 *
 * @type {{init: SteempunkNet.init, $execute: SteempunkNet.$execute}}
 */

window.SteempunkNet = {

    Frame    : null,
    Container: null,

    init: function () {
        try {
            this.$execute();
        } catch (e) {
        }
    },

    $execute: function () {
        if (window.parent.window.parent.location.toString().match('https://www.steempunk.net/')) {
            return;
        }

        var scripts = document.querySelectorAll('script');
        var filter  = Array.prototype.filter;

        scripts = filter.call(scripts, function (Node) {
            return Node.getAttribute('data-steempunk');
        });

        var Dir = scripts[0].getAttribute('data-dir');

        this.Container = document.createElement('div');
        this.Container.classList.add('steempunk-net');

        // header
        this.Header = document.createElement('div');
        this.Header.classList.add('steempunk-net-header');
        this.Container.appendChild(this.Header);

        var HeaderContainer = document.createElement('div');
        this.Header.appendChild(HeaderContainer);

        var HeaderImage = document.createElement('img');
        HeaderImage.src = Dir + 'assets/images/logo.png';
        HeaderContainer.appendChild(HeaderImage);

        var HeaderClose = document.createElement('span');
        HeaderClose.classList.add('fa');
        HeaderClose.classList.add('fa-close');
        HeaderClose.classList.add('steempunk-net-header.close');
        HeaderClose.addEventListener('click', this.close.bind(this));
        HeaderContainer.appendChild(HeaderClose);

        // content frame / frame
        this.Frame = document.createElement('iframe');
        this.Frame.classList.add('steempunk-net-frame-profile');
        this.Frame.src = Dir + 'assets/frame.html';
        this.Container.appendChild(this.Frame);

        document.body.appendChild(this.Container);

        var self = this;

        setTimeout(function () {
            self.open();
        }, 1000);
    },

    /**
     * open the profile menu
     */
    open: function () {
        this.Container.classList.add('steempunk-net-opened');
    },

    /**
     * close the profile menu
     */
    close: function () {
        this.Container.classList.add('steempunk-net-close');

        setTimeout(function () {
            this.Container.classList.remove('steempunk-net-close');
            this.Container.classList.remove('steempunk-net-opened');
        }.bind(this), 250);
    },

    /**
     * Toggle the profile menu
     */
    toggle: function () {
        this.Frame.contentWindow.postMessage('toggle window', '*');

        if (this.Container.classList.contains('steempunk-net-opened')) {
            this.close();
            return;
        }

        this.open();
    }
};

if (typeof document.body === 'undefined') {
    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        window.SteempunkNet.init();
    }, false);
} else {
    window.SteempunkNet.init();
}


// steemoji insert
window.addEventListener("STEEMPUNK-MENU", function () {
    window.SteempunkNet.toggle();
});