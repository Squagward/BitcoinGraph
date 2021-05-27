import {
  findDayOfYear,
  findMonthsAgo,
  findYearsAgo,
  getDaysBetween
} from "./utils";

const today = Date.now();

export const Range: Record<string, number> = {
  "5d": 5,
  "1m": getDaysBetween(findMonthsAgo(1), today),
  "3m": getDaysBetween(findMonthsAgo(3), today),
  "6m": getDaysBetween(findMonthsAgo(6), today),
  "ytd": findDayOfYear(),
  "1y": getDaysBetween(findYearsAgo(1), today),
  "2y": getDaysBetween(findYearsAgo(2), today),
  "5y": getDaysBetween(findYearsAgo(5), today)
};

export const Colors = {
  TEXT: Renderer.color(214, 200, 49),
  TEXT_BACKGROUND: Renderer.color(77, 77, 77),
  AXES: [235 / 255, 64 / 255, 52 / 255],
  POINTS: [52 / 255, 168 / 255, 235 / 255],
  INTERSECT_LINES: [52 / 255, 235 / 255, 101 / 255],
  GRAPH_BACKGROUND: [77 / 255, 77 / 255, 77 / 255]
};

export const showHelpMessage = () => {
  return new Message(
    new TextComponent(ChatLib.getCenteredText("§9BitcoinGraph by Squagward\n")),
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
};
