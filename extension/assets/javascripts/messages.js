/**
 * Messages handling for steempunknet
 *
 * @author www.pcsg.de (Henning Leutz)
 */
if (typeof window.SteempunkNet === 'undefined') {
    window.SteempunkNet = {};
}

window.SteempunkNet.Messages = {
    init: function () {
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
                    window.SteempunkNet.Plugin.postMessage({
                        type  : 'STEEMPUNK-GET-URL-RESULT',
                        result: window.location.toString()
                    });
                    break;

                case'STEEMPUNK-CREATE-ITEM':
                    try {
                        window.SteempunkNet.Items.createItem(JSON.parse(data.data));
                    } catch (e) {
                        console.warn(data);
                        console.warn(e);
                    }

                    break;

                case'STEEMPUNK-CREATE-USER-MESSAGE':
                    window.SteempunkNet.Messages.showMessage(data);
                    break;
            }
        }, false);

        // message delay
        var update = function () {
            window.SteempunkNet.Plugin.postMessage({
                type  : 'STEEMPUNK-GET-UPDATE',
                result: window.location.toString()
            });

            setTimeout(update, 10000);
        };

        setTimeout(update, 10000);
    },

    /**
     * Show a message
     *
     * @param data
     * @return Promise
     */
    showMessage: function (data) {
        var self = this,
            dir  = window.SteempunkNet.Plugin.getPluginDirectory();

        if (typeof data.title === 'undefined' || typeof data.content === 'undefined') {
            return Promise.reject({
                err : 'Missing params',
                data: data
            });
        }

        var title   = data.title;
        var content = data.content;
        var icon    = data.icon || false;

        // DOM Element
        var Message = document.createElement('div');
        Message.classList.add('sp-message');
        Message.style.backgroundImage = "url('" + dir + "assets/images/messageBackground.jpg')";

        var Close = document.createElement('span');
        Close.classList.add('sp-message-close');
        Close.classList.add('fa');
        Close.classList.add('fa-close');
        Close.addEventListener('click', function () {
            self.closeMessage(Message);
        }, false);

        Message.appendChild(Close);

        var MessageTitle       = document.createElement('span');
        MessageTitle.innerText = title;
        MessageTitle.classList.add('sp-message-title');
        Message.appendChild(MessageTitle);

        if (icon) {
            var Icon = document.createElement('span');
            Icon.classList.add('sp-message-icon');
            Icon.classList.add('fa');
            Icon.classList.add(icon);
            Message.appendChild(Icon);
        }

        var MessageText = document.createElement('span');
        MessageText.classList.add('sp-message-text');
        MessageText.innerText = content;
        Message.appendChild(MessageText);

        document.body.appendChild(Message);

        setTimeout(function () {
            Message.classList.add('sp-message-opening');
        }, 100);
    },

    /**
     * Close a message
     *
     * @param Message
     * @return Promise
     */
    closeMessage: function (Message) {
        return new Promise(function (resolve) {
            Message.classList.remove('sp-message-opening');

            setTimeout(function () {
                Message.parentNode.removeChild(Message);
                resolve();
            }, 1000);
        });
    }
};

// loading / init
if (typeof document.body === 'undefined') {
    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        window.SteempunkNet.Messages.init();
    }, false);
} else {
    window.SteempunkNet.Messages.init();
}
