import Settings from "../../dist/settings";
import { data, entries, liveDisplay, liveGui, URI, WebSocketClient } from "../constants";
import { addCommas, findDecimalPlaces } from "../utils/format";
const SettingsGui = Java.type("com.chattriggers.sk1er.vigilance.gui.SettingsGui");
let lastPrice;
const displaySocket = new JavaAdapter(WebSocketClient, {
    onMessage(message) {
        const { product_id, price, open_24h } = JSON.parse(message);
        if (price === undefined)
            return;
        const priceRange = Number(price) - Number(open_24h);
        const pricePercentDiff = (priceRange / Number(open_24h)) * 100;
        const currentSymbol = priceRange > 0 ? "§a▲" : "§c▼";
        liveDisplay
            .setLine(0, new DisplayLine(product_id).setAlign(DisplayHandler.Align.CENTER))
            .setLine(1, `Open: $${addCommas(Number(open_24h))}`)
            .setLine(2, `Price: ${Number(price) >= lastPrice ? "§a" : "§c"}$${addCommas(Number(price))}`)
            .setLine(3, `24h Change: ${currentSymbol} ${addCommas(priceRange, findDecimalPlaces(Number(price)))} (${pricePercentDiff.toFixed(4)}%)`);
        lastPrice = Number(price);
    }
}, new URI("wss://ws-feed.pro.coinbase.com"));
register("step", () => {
    if (!Settings.sendDisplayRequest)
        return;
    Settings.sendDisplayRequest = false;
    Client.currentGui.close();
    displaySocket.reconnectBlocking();
    displaySocket.send(JSON.stringify({
        type: "subscribe",
        channels: [
            {
                name: "ticker",
                product_ids: [`${entries[Settings.coinIndex][0]}-USD`]
            }
        ]
    }));
}).setFps(2);
register("step", () => {
    if (liveGui.isOpen()) {
        if (displaySocket.isOpen())
            displaySocket.closeBlocking();
        liveDisplay
            .setLine(0, new DisplayLine("Sample").setAlign(DisplayHandler.Align.CENTER))
            .setLine(1, `Open:`)
            .setLine(2, `Price:`)
            .setLine(3, `24h Change: %`);
    }
    liveDisplay.setShouldRender((Settings.toggleDailyDisplay && displaySocket.isOpen()) || liveGui.isOpen());
}).setFps(20);
register("dragged", (dx, dy) => {
    if (!liveGui.isOpen())
        return;
    data.x += dx;
    data.y += dy;
    liveDisplay
        .setLine(0, new DisplayLine("Sample").setAlign(DisplayHandler.Align.CENTER))
        .setLine(1, `Open:`)
        .setLine(2, `Price:`)
        .setLine(3, `24h Change: %`)
        .setRenderLoc(data.x, data.y);
});
displaySocket.connectBlocking();
displaySocket.closeBlocking();
