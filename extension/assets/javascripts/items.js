/**
 * item handling for steempunknet
 *
 * @author www.pcsg.de (Henning Leutz)
 */
if (typeof window.SteempunkNet === 'undefined') {
    window.SteempunkNet = {};
}

window.SteempunkNet.Items = {
    init: function () {
        var self = this;

        window.addEventListener('changestate', function () {
            self.clearAllItema();
        });

    },

    /**
     *
     * @param data
     */
    createItem: function (data) {
        if (!data.length) {
            data = [data];
        }

        var i, len, Item, randomPos;

        var itemClick = function () {
            window.SteempunkNet.Plugin.postMessage({
                type  : 'STEEMPUNK-ITEM-ADD',
                itemid: this.getAttribute('data-itemid')
            });

            this.parentNode.removeChild(this);
        };

        var getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        var randomPosition = function () {
            var body = document.body,
                html = document.documentElement;

            var height = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );

            var width = Math.max(
                body.scrollWidth,
                body.offsetWidth,
                html.clientWidth,
                html.scrollWidth,
                html.offsetWidth
            );

            return {
                top : getRandomInt(0, height - 150),
                left: getRandomInt(0, width - 150)
            };
        };

        for (i = 0, len = data.length; i < len; i++) {
            Item = document.createElement('div');
            Item.classList.add('sp-item');

            randomPos = randomPosition();

            // debug
            Item.style.cursor     = 'pointer';
            Item.style.position   = 'absolute';
            Item.style.top        = randomPos.top + 'px';
            Item.style.left       = randomPos.left + 'px';
            Item.style.width      = '150px';
            Item.style.height     = '150px';
            Item.style.zIndex     = 10;
            Item.style.background = "url('https://steemitimages.com/DQmfG9nnrTYp212tPsS9YUDZkroh7AHg8YLQhxrPYjyLHhr/chest.png')";

            Item.setAttribute('data-itemid', data[i].id);
            Item.addEventListener('click', itemClick);

            document.body.appendChild(Item);
        }
    },

    /**
     * Delete all chests
     */
    clearAllItema: function () {
        var items = document.querySelectorAll('.sp-item');
        for (var i = 0, len = items.length; i < len; i++) {
            items[i].parentNode.removeChild(items[i]);
        }
    }
};

// loading / init
if (typeof document.body === 'undefined') {
    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        window.SteempunkNet.Items.init();
    }, false);
} else {
    window.SteempunkNet.Items.init();
}
