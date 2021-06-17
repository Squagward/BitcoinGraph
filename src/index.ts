/// <reference types="../../CTAutocomplete/index" />
/// <reference lib="esnext" />

// @ts-ignore
import { request } from "../../requestV2";
// @ts-ignore
import * as moment from "../../moment";

import { StartDates } from "./constants";
import { BitcoinGraph } from "./graph";
import { formatDate, loopFromStart, Range } from "./utils";
import type { DataPoint, DataEntry } from "./types";
// @ts-ignore
import Settings from "../dist/settings";

const URI = Java.type("java.net.URI");
const WebSocketClient = Java.type("org.java_websocket.client.WebSocketClient");

let points: DataPoint[] = [];
const graph = new BitcoinGraph(300, 300);

register("command", () => Settings.openGUI()).setName("btc");

register("renderOverlay", (e) => {
  if (graph.mode === "HISTORICAL")
    graph.draw(
      `${entries[Settings.coinIndex][0]} - ${ranges[Settings.rangeIndex]}`
    );
  if (graph.mode === "LIVE")
    graph.drawLive(`${entries[Settings.coinIndex][0]} - Live Price`);
});

const entries = Object.entries(StartDates);
const today = formatDate(moment().utc().valueOf());
const ranges = [...Object.keys(Range), "max"];

register("step", (steps) => {
  if (!Settings.clicked) return;
  Settings.clicked = false;
  points = [];

  const times = loopFromStart(entries[Settings.coinIndex][1]);
  const promises: DataEntry[][] = [];

  while (times.length) {
    promises.push(
      request({
        url: `https://api.pro.coinbase.com/products/${
          entries[Settings.coinIndex][0]
        }-USD/candles`,
        qs: {
          granularity: 86400,
          start: times.shift() ?? today,
          end: times.shift() ?? today
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
    .catch((e: Error) => {
      Client.currentGui.close();
      new Message("§cError loading the data :(").chat();
      console.log(e.message);
    });
});

// @ts-ignore
const mySocket = new JavaAdapter(
  WebSocketClient,
  {
    onMessage: function (message: string) {
      const { time, price }: { time: string; price: string } =
        JSON.parse(message);
      if (!time) return;
      points.push({
        date: moment(time).format("HH:mm:ss"),
        price: Number(price)
      });
      graph.setPlotPoints(points);
      graph.currentPlotPoints = points;
    }
  },
  new URI("wss://ws-feed.pro.coinbase.com")
);

//TODO
// add hud option w/ daily change tracking for live

/*{
  type: "ticker",
  sequence: 26483366972,
  product_id: "BTC-USD",
  price: "37515.21",
  open_24h: "38527.52",
  volume_24h: "15284.00634995",
  low_24h: "37432.1",
  high_24h: "39554.98",
  volume_30d: "811797.97456377",
  best_bid: "37515.20",
  best_ask: "37515.21",
  side: "buy",
  time: "2021-06-17T20:04:22.129159Z",
  trade_id: 187061212,
  last_size: "0.00058407"
};*/

register("step", () => {
  if (!Settings.liveFeed) return;
  Settings.liveFeed = false;
  points = [];

  mySocket.reconnectBlocking();

  mySocket.send(
    JSON.stringify({
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: [`${entries[Settings.coinIndex][0]}-USD`]
        }
      ]
    })
  );
  graph.open("LIVE");
});

const guis: { previous: any; current: any } = {
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
