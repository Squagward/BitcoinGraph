/// <reference types="../CTAutocomplete/index" />
/// <reference lib="es2015" />

import { request } from "../requestV2";
import { ScatterPlot } from "./dist";

const Color = Java.type("java.awt.Color");

const plot = new ScatterPlot(300, 300, new Color(0.8, 0.8, 0.8, 1));
let points = [];

register("renderOverlay", (e) => {
  plot.draw();
});

register("command", () => {
  plot.open();
}).setName("plot");

const today = new Date();
const month =
  today.getMonth() < 9 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

request({
  url: "https://api.coindesk.com/v1/bpi/historical/close.json",
  qs: {
    start: "2013-09-01",
    end: `${today.getFullYear()}-${month}-${day}`
  },
  timeout: 10000,
  json: true
})
  .then(({ bpi }) => {
    for (let key in bpi) {
      if (typeof bpi[key] === "string" || typeof bpi[key] === "object") {
        continue;
      }
      points.push([key, bpi[key]]);
    }
    plot.addPlotPoints(points);

    new Message(
      new TextComponent(
        ChatLib.getCenteredText("Bitcoin Graph by Squagward\n")
      ),
      new TextComponent(ChatLib.getCenteredText("Powered by CoinDesk"))
        .setHover("show_text", "Visit their website here!")
        .setClick("open_url", "https://www.coindesk.com/price/bitcoin")
    ).chat();
  })
  .catch((e) => console.log(JSON.stringify(e)));

// TODO LIST

// low priority right now
// 2. start working on the settings system
