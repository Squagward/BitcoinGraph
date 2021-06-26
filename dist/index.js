import Settings from "../dist/settings";
import "./sockets/graphdisplay";
import "./sockets/huddisplay";
register("command", () => Settings.openGUI()).setName("btc");
