/// <reference types="../CTAutocomplete/index" />
/// <reference lib="es2015" />
export * from "./dist";
import Settings from "./dist/settings";

const CTSettings = Java.type("com.chattriggers.ctjs.minecraft.wrappers.Settings");

const prevScale = CTSettings.video.getGuiScale();
register("command", () => {
  CTSettings.video.setGuiScale(2);
  Settings.openGUI();
}).setName("mycommand");

const guis = [null, Client.currentGui.get()];
register("guiOpened", (e) => {
  guis[0] = guis[1];
  guis[1] = Client.currentGui.get();
  if (!guis[1] && guis[0] instanceof com.chattriggers.sk1er.vigilance.gui.SettingsGui) {
    CTSettings.video.setGuiScale(prevScale);
  }
});

// TODO LIST
// high priority
// 1. lines with x following cursor and y following appropriate price


// low priority right now
// 2. start working on the settings system