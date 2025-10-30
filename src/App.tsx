import { useState, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", { name }));
    }

    const update = useCallback(async () => {
        const result = await check();
        if (result) {
            console.log(
                `found update ${result.version} from ${result.date} with notes ${result.body}`
            );
            let downloaded = 0;
            let contentLength = 0;

            await result.downloadAndInstall((event) => {
                switch (event.event) {
                    case "Started":
                        contentLength = event.data.contentLength ?? 0;
                        console.log(
                            `started downloading ${event.data.contentLength} bytes`
                        );
                        break;
                    case "Progress":
                        downloaded += event.data.chunkLength;
                        console.log(
                            `downloaded ${downloaded} from ${contentLength}`
                        );
                        break;
                    case "Finished":
                        console.log("download finished");
                        break;
                }
            });

            console.log("update installed");
            await relaunch();
        }
    }, []);

    return (
        <main className='container'>
            <h1>Welcome to Tauri + React</h1>

            <div className='row'>
                <a href='https://vite.dev' target='_blank'>
                    <img
                        src='/vite.svg'
                        className='logo vite'
                        alt='Vite logo'
                    />
                </a>
                <a href='https://tauri.app' target='_blank'>
                    <img
                        src='/tauri.svg'
                        className='logo tauri'
                        alt='Tauri logo'
                    />
                </a>
                <a href='https://react.dev' target='_blank'>
                    <img
                        src={reactLogo}
                        className='logo react'
                        alt='React logo'
                    />
                </a>
            </div>
            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <button onClick={update}>update</button>

            <form
                className='row'
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id='greet-input'
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder='Enter a name...'
                />
                <button type='submit'>Greet</button>
            </form>
            <p>{greetMsg}</p>
        </main>
    );
}

export default App;
