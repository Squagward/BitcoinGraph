import Settings from "../../dist/settings";
import { data, entries, liveDisplay, liveGui, URI, WebSocketClient } from "../constants";
const displaySocket = new JavaAdapter(WebSocketClient, {
    onMessage(message) {
        const { product_id, price, open_24h } = JSON.parse(message);
        if (price === undefined)
            return;
        const decimalPlaces = price.split(".")[1].length;
        const priceRange = Number(price) - Number(open_24h);
        const pricePercentDiff = (priceRange / Number(open_24h)) * 100;
        const currentSymbol = priceRange > 0 ? "§a▲" : "§c▼";
        liveDisplay
            .setLine(0, new DisplayLine(product_id).setAlign(DisplayHandler.Align.CENTER))
            .setLine(1, `Open: $${Number(open_24h).toFixed(decimalPlaces)}`)
            .setLine(2, `Price: $${Number(price).toFixed(decimalPlaces)}`)
            .setLine(3, `24h Change: ${currentSymbol} ${priceRange.toFixed(4)} (${pricePercentDiff.toFixed(4)} %)`);
    }
}, new URI("wss://ws-feed.pro.coinbase.com"));
register("step", () => {
    liveDisplay.setShouldRender(Settings.toggleDailyDisplay);
    if (!Settings.sendDisplayRequest)
        return;
    Settings.sendDisplayRequest = false;
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
    Client.currentGui.close();
});
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
