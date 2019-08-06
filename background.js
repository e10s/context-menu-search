"use strict";

browser.search.get().then(engines => {
    for (const engine of engines) {
        browser.menus.create({
            id: engine.name,
            title: engine.name,
            contexts: ["selection"],
            icons: engine.favIconUrl && {
                "32": engine.favIconUrl
            }
        });
    }
});
