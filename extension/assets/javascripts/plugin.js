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
        if (window.parent.window.parent.location.toString().match('https://profile.steempunk.net/')) {
            return;
        }

        var self    = this,
            scripts = document.querySelectorAll('script'),
            filter  = Array.prototype.filter;

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

        // global messages
        window.addEventListener('message', function (event) {
            var data = event.data;

            if (typeof data === 'undefined') {
                return;
            }

            if (typeof data.event === 'undefined') {
                return;
            }

            if (data.event !== "STEEMPUNK-EVENT") {
                return;
            }

            switch (data.type) {
                case'STEEMPUNK-GET-URL':
                    self.postMessage({
                        type  : 'STEEMPUNK-GET-URL-RESULT',
                        result: window.location.toString()
                    });
                    break;
            }
        });

        window.SteempunkNet.postMessage({
            type  : 'STEEMPUNK-GET-URL-LOAD',
            result: window.location.toString()
        });

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
    },

    /**
     * Send a message to the steempunk frame
     * @param data
     */
    postMessage: function (data) {
        this.Frame.contentWindow.postMessage(data, '*');
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

// location change listener (bad workaround)
var steempunkHistoryListener = function () {
    window.SteempunkNet.postMessage({
        type  : 'STEEMPUNK-GET-URL-CHANGE',
        result: window.location.toString()
    });
};

window.addEventListener('pushstate', steempunkHistoryListener);
window.addEventListener('popstate', steempunkHistoryListener);
window.addEventListener('hashchange', steempunkHistoryListener);

// STEEMPUNK-NET menu listener
window.addEventListener("STEEMPUNK-MENU", function () {
    window.SteempunkNet.toggle();
});