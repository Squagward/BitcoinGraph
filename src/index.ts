/// <reference types="../../CTAutocomplete/index" />
/// <reference lib="esnext" />

// @ts-ignore
import Settings from "../dist/settings";
import "./sockets/graphdisplay";
import "./sockets/huddisplay";

register("command", () => Settings.openGUI()).setName("btc");
