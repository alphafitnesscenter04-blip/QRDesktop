const { contextBridge, ipcMain } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => ipcMain.invoke("ping"),
});
