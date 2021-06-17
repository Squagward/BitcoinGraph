import { request } from "../../requestV2";
import * as moment from "../../moment";
import { URI, WebSocketClient } from "../../WebSocket";
import { StartDates } from "./constants";
import { BitcoinGraph } from "./graph";
import { formatDate, loopFromStart, Range } from "./utils";
import Settings from "../dist/settings";
let points = [];
const graph = new BitcoinGraph(300, 300);
register("command", () => Settings.openGUI()).setName("btc");
register("renderOverlay", (e) => {
    if (graph.mode === "HISTORICAL")
        graph.draw(`${entries[Settings.coinIndex][0]} - ${ranges[Settings.rangeIndex]}`);
    if (graph.mode === "LIVE")
        graph.drawLive(`${entries[Settings.coinIndex][0]} - Live Price`);
});
const entries = Object.entries(StartDates);
const today = formatDate(moment().utc().valueOf());
const ranges = [...Object.keys(Range), "max"];
register("step", (steps) => {
    var _a, _b;
    if (!Settings.clicked)
        return;
    Settings.clicked = false;
    points = [];
    const times = loopFromStart(entries[Settings.coinIndex][1]);
    const promises = [];
    while (times.length) {
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
            for (let i = 0; i < res.length; i++) {
                points.push({
                    date: formatDate(res[i][0] * 1000),
                    price: res[i][2]
                });
            }
        });
        graph.setPlotPoints(points.sort((a, b) => a.date.localeCompare(b.date)));
        graph.setGraphRange(ranges[Settings.rangeIndex]);
        graph.open("HISTORICAL");
    })
        .catch((e) => {
        Client.currentGui.close();
        new Message("§cError loading the data :(").chat();
        console.log(e.message);
    });
});
const mySocket = new JavaAdapter(WebSocketClient, {
    onMessage: function (message) {
        const { time, price } = JSON.parse(message);
        if (!time)
            return;
        points.push({
            date: moment(time).format("HH:mm:ss"),
            price: Number(price)
        });
        graph.setPlotPoints(points);
        graph.currentPlotPoints = points;
    }
}, new URI("wss://ws-feed.pro.coinbase.com"));
register("step", () => {
    if (!Settings.liveFeed)
        return;
    Settings.liveFeed = false;
    points = [];
    mySocket.reconnectBlocking();
    mySocket.send(JSON.stringify({
        type: "subscribe",
        channels: [
            {
                name: "ticker",
                product_ids: [`${entries[Settings.coinIndex][0]}-USD`]
            }
        ]
    }));
    graph.open("LIVE");
});
const guis = {
    previous: null,
    current: Client.currentGui.get()
};
register("guiOpened", (e) => {
    guis.previous = guis.current;
    guis.current = Client.currentGui.get();
    if (guis.current === null && guis.previous instanceof Gui) {
        mySocket.closeBlocking();
    }
});
mySocket.connectBlocking();
mySocket.closeBlocking();
