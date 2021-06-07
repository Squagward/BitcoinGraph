/// <reference types="../CTAutocomplete/index" />
/// <reference lib="esnext" />

import { request } from "../requestV2";
import { Promise } from "../PromiseV2";
import * as moment from "../moment";
import Settings from "./dist/settings";
import {
  BitcoinGraph,
  Colors,
  formatDate,
  loopFromStart,
  StartDates,
  Range
} from "./dist";

register("command", () => Settings.openGUI()).setName("btc");

let points = [];
const plot = new BitcoinGraph(
  300,
  300,
  Renderer.color(...Colors.GRAPH_OUT_OF_BOUNDS)
);

register("renderOverlay", (e) => {
  plot.draw();
});

register("step", (steps) => {
  if (!Settings.reopen || !points.length) return;
  Settings.reopen = false;
  plot.open();
}).setDelay(1);

register("step", (steps) => {
  if (!Settings.clicked) return;
  Settings.clicked = false;
  points = [];

  const times = loopFromStart(Object.values(StartDates)[Settings.coinIndex]);
  const promises = [];

  while (times.length) {
    promises.push(
      request({
        url: `https://api.pro.coinbase.com/products/${
          Object.keys(StartDates)[Settings.coinIndex]
        }-USD/candles`,
        qs: {
          granularity: 86400,
          start: times.shift() ?? formatDate(moment().valueOf()),
          end: times.shift() ?? formatDate(moment().valueOf())
        },
        headers: {
          "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        timeout: 10000,
        json: true
      })
    );
  }

  Promise.all(promises)
    .then((datas) => {
      datas.forEach((res) => {
        for ([date, , price] of res) {
          points.push({ date: formatDate(date * 1000), price });
        }
      });

      plot.addPlotPoints(points.sort((a, b) => a.date.localeCompare(b.date)));
      plot.setGraphRange(Object.keys(Range)[Settings.rangeIndex] ?? "max");
      plot.open();
    })
    .catch((e) => {
      Client.currentGui.close();
      new Message("§cError loading the data :(").chat();
      console.log(JSON.stringify(e));
    });
}).setDelay(1);
