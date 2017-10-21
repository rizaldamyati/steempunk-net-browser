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
        // cleanup
        window.addEventListener('changestate', function () {
            var items = document.querySelectorAll('.sp-item');
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].parentNode.removeChild(items[i]);
            }
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

        var i, len, Item;

        var itemClick = function () {
            window.SteempunkNet.Plugin.postMessage({
                type  : 'STEEMPUNK-ITEM-ADD',
                itemid: this.getAttribute('data-itemid')
            });

            this.parentNode.removeChild(this);
        };

        for (i = 0, len = data.length; i < len; i++) {
            Item = document.createElement('div');
            Item.classList.add('sp-item');

            // debug
            Item.style.cursor     = 'pointer';
            Item.style.position   = 'absolute';
            Item.style.top        = '100px';
            Item.style.left       = '100px';
            Item.style.width      = '100px';
            Item.style.height     = '100px';
            Item.style.zIndex     = 10;
            Item.style.background = 'red';

            Item.setAttribute('data-itemid', data[i].id);
            Item.addEventListener('click', itemClick);

            document.body.appendChild(Item);
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
