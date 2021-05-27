/// <reference types="../CTAutocomplete/index" />
/// <reference lib="esnext" />

import { addCustomCompletion } from "../CustomTabCompletions";
import { request } from "../requestV2";
import { BitcoinGraph, Colors, showHelpMessage, Range } from "./dist";

const plot = new BitcoinGraph(300, 300, Colors.GRAPH_OUT_OF_BOUNDS);
const points = [];

register("renderOverlay", (e) => {
  plot.draw();
});

const command = register("command", (type) => {
  const lowerType = type?.toLowerCase() ?? type;
  if (!Object.keys(Range).includes(lowerType) && lowerType !== "max") {
    return showHelpMessage();
  }

  plot.setGraphRange(lowerType);
  plot.open();
}).setName("btc");

addCustomCompletion(command, (args) => {
  return args.length === 1 ? [...Object.keys(Range), "max"] : "";
});

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
      if (typeof bpi[key] !== "number") continue;

      points.push({ date: key, price: bpi[key] });
    }
    plot.addPlotPoints(points);
  })
  .catch((e) => {
    new Message("§cError loading the data :(").chat();
    console.log(JSON.stringify(e));
  });
