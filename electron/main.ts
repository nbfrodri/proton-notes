import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cjsRequire = createRequire(import.meta.url);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (cjsRequire("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0f172a",
      symbolColor: "#ffffff",
    },
    backgroundColor: "#0f172a", // Prevent white flash
  });

  // Load the app
  const devUrl = "http://localhost:5173";

  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl).catch((err) => {
      console.error("Failed to load dev URL:", err);
    });
    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// IPC Handlers
ipcMain.handle("save-image", async (_event, arrayBuffer: ArrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${crypto.randomUUID()}.png`;
  const userDataPath = app.getPath("userData");
  const imagesDir = path.join(userDataPath, "images");

  await fs.mkdir(imagesDir, { recursive: true });
  const filePath = path.join(imagesDir, fileName);
  await fs.writeFile(filePath, buffer);

  // Return media:// URL
  return `media://${fileName}`;
});

// Register scheme as privileged
protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      standard: true,
      bypassCSP: true,
      stream: true,
    },
  },
]);

app.whenReady().then(() => {
  // Register 'media' protocol to serve files from userData/images
  protocol.handle("media", (request) => {
    // request.url is like "media://filename.png" or "media://host/filename.png"
    // We expect simple filenames, so we can strip everything up to the last slash or just replacing the start
    let url = request.url.replace("media://", "");

    // In case of any leading slashes or host (e.g. media:///file.png -> /file.png)
    if (url.startsWith("/")) {
      url = url.substring(1);
    }

    const userDataPath = app.getPath("userData");
    const filePath = path.join(userDataPath, "images", url);
    const fileUrl = pathToFileURL(filePath).toString();
    console.log("Serving media:", request.url, "->", filePath);
    return net.fetch(fileUrl);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
