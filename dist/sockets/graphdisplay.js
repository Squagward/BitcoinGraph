import { request } from "../../../requestV2";
import Settings from "../../dist/settings";
import { entries, Range, URI, WebSocketClient } from "../constants";
import { BitcoinGraph } from "../graph";
import { formatDate, formatTime } from "../utils/format";
import { getDatesForLooping } from "../utils/index";
const graph = new BitcoinGraph();
const today = formatDate(Date.now());
const ranges = Object.keys(Range);
let points = [];
register("renderOverlay", () => {
    switch (graph.pointCollection.mode) {
        case 0: {
            graph.draw(`${entries[Settings.coinIndex][0]} - ${ranges[Settings.rangeIndex]}`);
            break;
        }
        case 1: {
            graph.drawLive(`${entries[Settings.coinIndex][0]} - Live Price`);
            break;
        }
    }
});
register("step", () => {
    var _a, _b;
    if (!Settings.clicked)
        return;
    Settings.clicked = false;
    points = [];
    const times = getDatesForLooping(entries[Settings.coinIndex][1]);
    const promises = [];
    while (times.length > 0) {
        promises.push(request({
            url: `https://api.pro.coinbase.com/products/${entries[Settings.coinIndex][0]}-USD/candles`,
            qs: {
                granularity: 86400,
                start: (_a = times.shift()) !== null && _a !== void 0 ? _a : today,
                end: (_b = times.shift()) !== null && _b !== void 0 ? _b : today
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            timeout: 10000,
            json: true
        }));
    }
    Promise.all(promises)
        .then((datas) => {
        datas.forEach((res) => {
            let date;
            let price;
            for ([date, , price] of res) {
                points.push({
                    date: formatDate(date * 1000),
                    price
                });
            }
        });
        graph.pointCollection.setPlotPoints(points.sort((a, b) => a.date.localeCompare(b.date)));
        graph.pointCollection.setGraphRange(Range[ranges[Settings.rangeIndex]]);
        graph.open(0);
    })
        .catch((e) => {
        Client.currentGui.close();
        new Message("§cError loading the data :(").chat();
        console.log(e.message);
    });
});
const graphSocket = new JavaAdapter(WebSocketClient, {
    onMessage(message) {
        const { time, price } = JSON.parse(message);
        if (time === undefined || price === undefined)
            return;
        points.push({
            date: formatTime(time),
            price: Number(price)
        });
        graph.pointCollection.setPlotPoints(points);
        graph.pointCollection.setGraphRange(Range.max);
    }
}, new URI("wss://ws-feed.pro.coinbase.com"));
register("step", () => {
    if (!Settings.liveFeed)
        return;
    Settings.liveFeed = false;
    points = [];
    graphSocket.send(JSON.stringify({
        type: "subscribe",
        channels: [
            {
                name: "ticker",
                product_ids: [`${entries[Settings.coinIndex][0]}-USD`]
            }
        ]
    }));
    graph.open(1);
}).setFps(2);
register("messageSent", (msg) => {
    if (msg.toLowerCase().startsWith("/btc")) {
        graphSocket.send(JSON.stringify({
            type: "unsubscribe",
            channels: ["ticker"]
        }));
    }
});
graphSocket.connectBlocking();
