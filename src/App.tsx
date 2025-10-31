import { useState, useCallback, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { checkForAppUpdates } from "./utils/updater.utils";
import { getVersion } from "@tauri-apps/api/app";
import { check } from "@tauri-apps/plugin-updater";

function App() {
    const [version, setVersion] = useState<string>("");
    const [update, setUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleVersion = useCallback(async () => {
        const v = await getVersion();
        setVersion(v);
    }, []);

    const handleCheckUpdates = useCallback(async () => {
        setIsLoading(true);
        setMessage("Güncellemeler kontrol ediliyor...");
        
        try {
            const update = await check();
            setUpdate(!!update);
            setLastChecked(new Date());
            
            if (update) {
                setMessage("🎉 Yeni güncelleme bulundu!");
            } else {
                setMessage("✅ Uygulama güncel!");
            }
        } catch (error) {
            setMessage("❌ Güncelleme kontrolü başarısız oldu");
            console.error("Update check failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUpdate = useCallback(async () => {
        setIsLoading(true);
        setMessage("Güncelleme başlatılıyor...");
        
        try {
            await checkForAppUpdates();
        } catch (error) {
            setMessage("❌ Güncelleme başarısız oldu");
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void handleVersion();
    }, [handleVersion]);

    useEffect(() => {
        void handleCheckUpdates();
    }, [handleCheckUpdates]);

    return (
        <main className='container'>
            <div className="header-section">
                <h1 className="app-title">🚀 Tauri Updater Demo</h1>
                <div className="version-badge">v{version}</div>
            </div>

            <div className='logo-section'>
                <a href='https://vite.dev' target='_blank' className="logo-link">
                    <img
                        src='/vite.svg'
                        className='logo vite'
                        alt='Vite logo'
                    />
                </a>
                <a href='https://tauri.app' target='_blank' className="logo-link">
                    <img
                        src='/tauri.svg'
                        className='logo tauri'
                        alt='Tauri logo'
                    />
                </a>
                <a href='https://react.dev' target='_blank' className="logo-link">
                    <img
                        src={reactLogo}
                        className='logo react'
                        alt='React logo'
                    />
                </a>
            </div>
            
            <p className="subtitle">Modern Tauri uygulaması ile otomatik güncelleme sistemi</p>

            <div className="update-card">
                <div className="status-section">
                    <div className={`status-indicator ${update ? 'update-available' : 'up-to-date'}`}>
                        {update ? '🔄' : '✅'}
                    </div>
                    <div className="status-text">
                        <h3>{update ? 'Güncelleme Mevcut' : 'Güncel Versiyon'}</h3>
                        <p className="version-text">Versiyon: {version}</p>
                        {lastChecked && (
                            <p className="last-checked">
                                Son kontrol: {lastChecked.toLocaleTimeString('tr-TR')}
                            </p>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`message ${isLoading ? 'loading' : ''}`}>
                        {isLoading && <div className="spinner"></div>}
                        {message}
                    </div>
                )}

                <div className="button-section">
                    <button
                        onClick={handleCheckUpdates}
                        disabled={isLoading}
                        className="btn btn-secondary"
                    >
                        {isLoading ? '⏳' : '🔍'} Kontrol Et
                    </button>
                    
                    {update && (
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? '⏳' : '⬇️'} Güncelle
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;
