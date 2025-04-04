"use strict";

const storageKey = "items";

/* Convenience functions */
function onError(error) {
	console.log(`Error: ${error}`);
}

function peekStorage() {
	browser.storage.session.get(storageKey).then((a) => console.log(a[storageKey]), onError);
}
/* */

browser.storage.onChanged.addListener(changes => {
	if (storageKey in changes) {
		browser.menus.removeAll().then(() => {
			createContextMenu(changes[storageKey].newValue);
		});
	}
});

function createContextMenu(engines) {
	for (const engine of engines) {
		engine["contexts"] = ["selection"];
		browser.menus.create(engine);
		browser.menus.refresh();
	}
}

function initialze() {
	browser.search.get().then(engines => {
		const items = engines.map(engine => ({
			id: engine.name,
			title: engine.name,
			icons: engine.favIconUrl && {
				"32": engine.favIconUrl
			}
		}));

		browser.storage.session.set(
			{ [storageKey]: items }
		);
	});
}

browser.runtime.onInstalled.addListener(initialze);
browser.runtime.onStartup.addListener(initialze);

browser.menus.onClicked.addListener(info => {
	browser.search.search({
		query: info.selectionText, engine: info.menuItemId
	});
});

browser.menus.onShown.addListener((info, tab) => {
	browser.search.get().then(engines => {
		const items = engines.map(engine => ({
			id: engine.name,
			title: engine.name,
			icons: engine.favIconUrl && {
				"32": engine.favIconUrl
			}
		}));

		browser.storage.session.get(storageKey).then(storedData => {
			if (JSON.stringify(storedData[storageKey]) !== JSON.stringify(items)) {
				browser.storage.session.set(
					{ [storageKey]: items }
				);
			}
		});
	});
});
