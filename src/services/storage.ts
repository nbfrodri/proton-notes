import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

export interface StorageService {
  saveImage(buffer: ArrayBuffer): Promise<string>;
  saveNote(note: any): Promise<boolean>;
  deleteNote(id: string): Promise<boolean>;
  loadNotes(): Promise<any[]>;
  deleteImage(fileName: string): Promise<boolean>;
  getAllImages(): Promise<string[]>;
  platform: "electron" | "web" | "ios" | "android";
}

class StorageServiceImpl implements StorageService {
  get platform() {
    // Check if running in Electron
    if (window.electronAPI) {
      return "electron";
    }
    // Check Capacitor platform
    return Capacitor.getPlatform() as "web" | "ios" | "android";
  }

  async saveImage(buffer: ArrayBuffer): Promise<string> {
    if (this.platform === "electron") {
      return await window.electronAPI.saveImage(buffer);
    }

    // Capacitor (Mobile) implementation
    try {
      // Convert buffer to base64 for Capacitor Filesystem
      const base64String = this.arrayBufferToBase64(buffer);
      const fileName = `${crypto.randomUUID()}.png`;

      // Ensure directory exists
      try {
        await Filesystem.mkdir({
          path: "images",
          directory: Directory.Data,
          recursive: true,
        });
      } catch (e) {
        // Ignore if exists
      }

      const savedFile = await Filesystem.writeFile({
        path: `images/${fileName}`,
        data: base64String,
        directory: Directory.Data,
      });

      // Return a displayable URL
      return Capacitor.convertFileSrc(savedFile.uri);
    } catch (error) {
      console.error("StorageService: Failed to save image", error);
      throw error;
    }
  }

  async saveNote(note: any): Promise<boolean> {
    if (this.platform === "electron") {
      return await window.electronAPI.saveNote(
        note.id,
        JSON.stringify(note, null, 2),
      );
    }

    // Mobile Implementation
    try {
      // Ensure directory exists
      try {
        await Filesystem.mkdir({
          path: "notes",
          directory: Directory.Data,
          recursive: true,
        });
      } catch (e) {
        // Ignore if exists
      }

      await Filesystem.writeFile({
        path: `notes/${note.id}.json`,
        data: JSON.stringify(note, null, 2),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (e) {
      console.error("Failed to save note mobile:", e);
      return false;
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    if (this.platform === "electron") {
      return await window.electronAPI.deleteNote(id);
    }

    // Mobile Implementation
    try {
      await Filesystem.deleteFile({
        path: `notes/${id}.json`,
        directory: Directory.Data,
      });
      return true;
    } catch (e) {
      console.error("Failed to delete note mobile:", e);
      return false;
    }
  }

  async loadNotes(): Promise<any[]> {
    if (this.platform === "electron") {
      return await window.electronAPI.loadNotes();
    }

    // Mobile Implementation
    try {
      // Ensure directory exists
      try {
        await Filesystem.mkdir({
          path: "notes",
          directory: Directory.Data,
          recursive: true,
        });
      } catch (e) {
        // Ignore if exists
      }

      const result = await Filesystem.readdir({
        path: "notes",
        directory: Directory.Data,
      });

      const notes = [];
      for (const file of result.files) {
        // Filesystem readdir returns FileInfo objects or strings depending on version/web
        // Assuming string filenames or checking name property.
        // Capacitor 6/Plugin 6 returns objects typically.
        // Let's handle generic case. Checks simple filename match or object name.
        const name = typeof file === "string" ? file : file.name;

        if (name.endsWith(".json")) {
          const content = await Filesystem.readFile({
            path: `notes/${name}`,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
          });
          try {
            if (typeof content.data === "string") {
              notes.push(JSON.parse(content.data));
            }
          } catch (e) {
            console.error("Failed to parse note:", name, e);
          }
        }
      }
      return notes;
    } catch (e) {
      console.error("Failed to load notes mobile:", e);
      return [];
    }
  }

  async deleteImage(fileName: string): Promise<boolean> {
    if (this.platform === "electron") {
      // Extract filename if it's a full URL
      const name = fileName.replace("media://", "");
      return await window.electronAPI.deleteImage(name);
    }

    // Mobile
    try {
      // Extract filename safely.
      // It might be a full Capacitor URL or just a filename.
      // Usually simplistic approach: get basename if it looks like a path
      let cleanName = fileName;
      if (fileName.includes("/")) {
        cleanName = fileName.substring(fileName.lastIndexOf("/") + 1);
      }
      // If query params exist
      if (cleanName.includes("?")) {
        cleanName = cleanName.split("?")[0];
      }

      await Filesystem.deleteFile({
        path: `images/${cleanName}`,
        directory: Directory.Data,
      });
      return true;
    } catch (e) {
      console.info("Failed to delete image mobile (might not exist):", e);
      return false;
    }
  }

  async getAllImages(): Promise<string[]> {
    if (this.platform === "electron") {
      return await window.electronAPI.getAllImages();
    }

    // Mobile
    try {
      try {
        await Filesystem.mkdir({
          path: "images",
          directory: Directory.Data,
          recursive: true,
        });
      } catch (e) {
        // Ignore
      }

      const result = await Filesystem.readdir({
        path: "images",
        directory: Directory.Data,
      });

      // Filter and map to simple strings
      return result.files.map((f) => (typeof f === "string" ? f : f.name));
    } catch (e) {
      console.error("Failed to list images mobile:", e);
      return [];
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export const storageService = new StorageServiceImpl();
