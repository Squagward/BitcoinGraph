/// <reference types="../CTAutocomplete/index" />
/// <reference lib="es2015" />
export * from "./dist";
import Settings from "./dist/settings";

const CTSettings = Java.type(
  "com.chattriggers.ctjs.minecraft.wrappers.Settings"
);
const SettingsGui = Java.type(
  "com.chattriggers.sk1er.vigilance.gui.SettingsGui"
);

const prevScale = CTSettings.video.getGuiScale();
register("command", () => {
  CTSettings.video.setGuiScale(2);
  Settings.openGUI();
}).setName("mycommand");

const guis = [null, Client.currentGui.get()];
register("guiOpened", (e) => {
  guis[0] = guis[1];
  guis[1] = Client.currentGui.get();
  if (!guis[1] && guis[0] instanceof SettingsGui) {
    CTSettings.video.setGuiScale(prevScale);
  }
});

// TODO LIST
// 1. date & price tracker @ mouse coords

// low priority right now
// 2. start working on the settings system
