import { useState, useCallback, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { getVersion } from "@tauri-apps/api/app";
import "./App.css";

import { checkForAppUpdates } from "./utils/updater.utils";

function App() {
    const [version, setVersion] = useState<string>("");

    const handleVersion = useCallback(async () => {
        const v = await getVersion();
        setVersion(v);
    }, []);

    useEffect(() => {
        void handleVersion();
    }, [handleVersion]);

    return (
        <main className='container'>
            <h1>🚀 Tauri Updater Demo - v0.1.2</h1>

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

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                <p style={{fontSize: '18px', fontWeight: 'bold', color: '#4CAF50'}}>
                    🎉 Güncel Versiyon: {version} - YENİ GÜNCELLEME! 
                </p>
                <button 
                    onClick={checkForAppUpdates}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🔄 Güncelleme Kontrol Et
                </button>
            </div>
        </main>
    );
}

export default App;
