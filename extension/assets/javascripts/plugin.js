/**
 * Steempunk integration into www.steemit.com
 *
 * @author www.pcsg.de (Henning Leutz)
 */

if (typeof window.SteempunkNet === 'undefined') {
    window.SteempunkNet = {};
}

/**
 * main plugin functionality
 *
 * @type {{
 *     Frame: null,
 *     Container: null,
 *     init: SteempunkNet.Plugin.init,
 *     $execute: SteempunkNet.Plugin.$execute,
 *     open: SteempunkNet.Plugin.open,
 *     close: SteempunkNet.Plugin.close,
 *     toggle: SteempunkNet.Plugin.toggle,
 *     postMessage: SteempunkNet.Plugin.postMessage
 * }}
 */
window.SteempunkNet.Plugin = {

    Frame    : null,
    Container: null,
    directory: null,

    init: function () {
        // location change listener
        window.addEventListener('changestate', function () {
            window.SteempunkNet.Plugin.postMessage({
                type  : 'STEEMPUNK-GET-URL-CHANGE',
                result: window.location.toString()
            });
        }, false);

        // STEEMPUNK-NET menu listener
        window.addEventListener("STEEMPUNK-MENU", function () {
            window.SteempunkNet.Plugin.toggle();
        }, false);

        // debug message
        // setTimeout(function () {
        //     window.SteempunkNet.Messages.showMessage({
        //         title  : 'Waffen bereit, Schilde hoch!',
        //         content: 'Dein Interface meldet das du angegriffen wirst. Mach dich bereit!!'
        //     });
        // }, 5000);

        try {
            this.$execute();
        } catch (e) {
        }
    },

    /**
     * Return the chrome plugin directory
     *
     * @return {String}
     */
    getPluginDirectory: function () {
        if (this.directory === null) {
            var scripts = document.querySelectorAll('script'),
                filter  = Array.prototype.filter;

            scripts = filter.call(scripts, function (Node) {
                return Node.getAttribute('data-steempunk');
            });

            this.directory = scripts[0].getAttribute('data-dir');
        }

        return this.directory;
    },

    /**
     * Execute the frame initialization
     */
    $execute: function () {
        if (window.parent.window.parent.location.toString().match('https://profile.steempunk.net/')) {
            return;
        }

        var Dir = this.getPluginDirectory();

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
        this.Frame.src     = Dir + 'assets/frame.html';
        this.Frame.sandbox = "allow-same-origin allow-scripts allow-forms";
        this.Container.appendChild(this.Frame);

        document.body.appendChild(this.Container);

        window.SteempunkNet.Plugin.postMessage({
            type  : 'STEEMPUNK-GET-URL-LOAD',
            result: window.location.toString()
        });

        // setTimeout(function () {
        //     self.open();
        // }, 1000);
    },

    /**
     * opens the steempunk menu
     */
    open: function () {
        this.Container.classList.add('steempunk-net-opened');
    },

    /**
     * opens the steempunk menu in the welcome mode
     */
    welcome: function () {
        this.Container.classList.add('steempunk-net-welcome');
    },

    /**
     * close the steempunk menu
     */
    close: function () {
        this.Container.classList.add('steempunk-net-close');

        setTimeout(function () {
            this.Container.classList.remove('steempunk-net-close');
            this.Container.classList.remove('steempunk-net-opened');
            this.Container.classList.remove('steempunk-net-welcome');
        }.bind(this), 250);
    },

    /**
     * toggle the steempunk menu
     */
    toggle: function () {
        this.Frame.contentWindow.postMessage('toggle window', '*');

        if (this.Container.classList.contains('steempunk-net-opened')) {
            this.close();
            return;
        }

        this.open();
    },

    /**
     * posts messages -> messages through the frames
     */
    postMessage: function (data) {
        this.Frame.contentWindow.postMessage(data, '*');
    }
};

// loading / init
if (typeof document.body === 'undefined') {
    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        window.SteempunkNet.Plugin.init();
    }, false);
} else {
    window.SteempunkNet.Plugin.init();
}
