/**
 * Context menu
 */
chrome.contextMenus.create({
    title   : 'STEEMPUNK-NET',
    contexts: ['all'],
    onclick : function (info, tab) {
        chrome.tabs.query({
            active       : true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "STEEMPUNK-MENU"
            }, function (response) {
            });
        });
    }
});
