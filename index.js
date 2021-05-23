/// <reference types="../CTAutocomplete/index" />
/// <reference lib="esnext" />

import { addCustomCompletion } from "../CustomTabCompletions";
import { request } from "../requestV2";
import { ScatterPlot, Range } from "./dist";

const plot = new ScatterPlot(300, 300, Renderer.color(100, 100, 100));
let points = [];

register("renderOverlay", (e) => {
  plot.draw();
});

const command = register("command", (type) => {
  if (
    !Object.keys(Range).includes(type?.toLowerCase()) &&
    type?.toLowerCase() !== "max"
  ) {
    return new Message(
      new TextComponent(
        ChatLib.getCenteredText("§9BitcoinGraph by Squagward\n")
      ),
      new TextComponent(ChatLib.getCenteredText("Powered by §6CoinDesk\n\n"))
        .setHover("show_text", "Visit their website here!")
        .setClick("open_url", "https://www.coindesk.com/price/bitcoin"),
      new TextComponent("Allowed Data Ranges:\n"),
      new TextComponent("‣ 5d: data from the last 5 days\n"),
      new TextComponent("‣ 1m: data from the last 30 days\n"),
      new TextComponent("‣ 6m: data from the last 6 months\n"),
      new TextComponent("‣ ytd: data since January 1st\n"),
      new TextComponent("‣ 1y: data from the past year\n"),
      new TextComponent("‣ 5y: data from the past 5 years\n"),
      new TextComponent("‣ max: data from the beginning of CoinDesk's api\n\n"),
      new TextComponent(
        "Zoom by scrolling with your mouse wheel, and drag to pan around.\n"
      ),
      new TextComponent(
        "If you have any questions, feel free to contact me through Discord in dm's or ping me in the "
      ),
      new TextComponent("§5ChatTriggers Discord")
        .setHover("show_text", "Join the Discord here!")
        .setClick("open_url", "https://discord.gg/chattriggers"),
      new TextComponent("!")
    ).chat();
  }

  plot.setGraphRange(type);
  plot.open();
}).setName("btc");

addCustomCompletion(command, (args) => {
  if (args.length === 1) return [...Object.keys(Range), "max"];
  return "";
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

      points.push([key, bpi[key]]);
    }
    plot.addPlotPoints(points);
  })
  .catch((e) => console.log(JSON.stringify(e)));
