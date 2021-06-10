import { request } from "../../requestV2";
import * as moment from "../../moment";
import { StartDates } from "./constants";
import { BitcoinGraph } from "./graph";
import { formatDate, loopFromStart, Range } from "./utils";
import Settings from "../dist/settings";
register("command", () => Settings.openGUI()).setName("btc");
let points = [];
const graph = new BitcoinGraph(300, 300);
register("renderOverlay", (e) => {
    graph.draw();
});
register("step", (steps) => {
    if (!Settings.reopen || !points.length)
        return;
    Settings.reopen = false;
    graph.open();
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
        graph.addPlotPoints(points.sort((a, b) => a.date.localeCompare(b.date)));
        graph.setGraphRange(ranges[Settings.rangeIndex]);
        graph.open();
    })
        .catch((e) => {
        Client.currentGui.close();
        new Message("§cError loading the data :(").chat();
        console.log(e.message);
    });
});
