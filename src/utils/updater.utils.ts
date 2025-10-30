import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForAppUpdates() {
    try {
        await message("Checking for updates...", { title: "Updater", kind: "info" });

        const update = await check();

        if (!update) {
            await message("You're already using the latest version.", {
                title: "No Update Found",
                kind: "info",
            });
            return;
        }

        const confirm = await ask(
            `Update to ${update.version} is available!\n\n${update.body || "No release notes."}`,
            {
                title: "Update Available",
                kind: "info",
                okLabel: "Update",
                cancelLabel: "Cancel",
            }
        );

        if (!confirm) {
            await message("Update cancelled.", { title: "Updater", kind: "warning" });
            return;
        }

        await message("Downloading update...", { title: "Updater", kind: "info" });

        await update.downloadAndInstall(event => {
            if (event.event === "Progress") {
                console.log(`Downloaded ${event.data.chunkLength} bytes`);
            }
        });

        await message("Update installed! The app will restart.", {
            title: "Updater",
            kind: "info",
        });

        await relaunch();
    } catch (err) {
        console.error("Update check failed:", err);
        await message(`Error while checking for updates:\n${String(err)}`, {
            title: "Updater Error",
            kind: "error",
        });
    }
}
