import { useReducer, useCallback, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { checkForAppUpdates } from "./utils/updater.utils";
import { getVersion } from "@tauri-apps/api/app";
import { check } from "@tauri-apps/plugin-updater";

interface AppState {
    version: string;
    update: boolean;
    isLoading: boolean;
    lastChecked: Date | null;
    message: string;
}

type AppAction =
    | { type: "SET_VERSION"; payload: string }
    | { type: "SET_UPDATE"; payload: boolean }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_LAST_CHECKED"; payload: Date }
    | { type: "SET_MESSAGE"; payload: string }
    | { type: "UPDATE_CHECK_START" }
    | { type: "UPDATE_CHECK_SUCCESS"; payload: { hasUpdate: boolean } }
    | { type: "UPDATE_CHECK_ERROR"; payload: string }
    | { type: "UPDATE_START" }
    | { type: "UPDATE_ERROR"; payload: string };

const initialState: AppState = {
    version: "",
    update: false,
    isLoading: false,
    lastChecked: null,
    message: "",
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case "SET_VERSION":
            return { ...state, version: action.payload };
        case "SET_UPDATE":
            return { ...state, update: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_LAST_CHECKED":
            return { ...state, lastChecked: action.payload };
        case "SET_MESSAGE":
            return { ...state, message: action.payload };
        case "UPDATE_CHECK_START":
            return {
                ...state,
                isLoading: true,
                message: "Güncellemeler kontrol ediliyor...",
            };
        case "UPDATE_CHECK_SUCCESS":
            return {
                ...state,
                isLoading: false,
                update: action.payload.hasUpdate,
                lastChecked: new Date(),
                message: action.payload.hasUpdate
                    ? "🎉 Yeni güncelleme bulundu!"
                    : "✅ Uygulama güncel!",
            };
        case "UPDATE_CHECK_ERROR":
            return {
                ...state,
                isLoading: false,
                message: "❌ Güncelleme kontrolü başarısız oldu",
            };
        case "UPDATE_START":
            return {
                ...state,
                isLoading: true,
                message: "Güncelleme başlatılıyor...",
            };
        case "UPDATE_ERROR":
            return {
                ...state,
                isLoading: false,
                message: "❌ Güncelleme başarısız oldu",
            };
        default:
            return state;
    }
}

function App() {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const handleVersion = useCallback(async () => {
        const v = await getVersion();
        dispatch({ type: "SET_VERSION", payload: v });
    }, []);

    const handleCheckUpdates = useCallback(async () => {
        dispatch({ type: "UPDATE_CHECK_START" });

        try {
            const updateResult = await check();
            dispatch({
                type: "UPDATE_CHECK_SUCCESS",
                payload: { hasUpdate: !!updateResult },
            });
        } catch (error) {
            dispatch({
                type: "UPDATE_CHECK_ERROR",
                payload: "Güncelleme kontrolü başarısız oldu",
            });
            console.error("Update check failed:", error);
        }
    }, []);

    const handleUpdate = useCallback(async () => {
        dispatch({ type: "UPDATE_START" });

        try {
            await checkForAppUpdates();
        } catch (error) {
            dispatch({
                type: "UPDATE_ERROR",
                payload: "Güncelleme başarısız oldu",
            });
            console.error("Update failed:", error);
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
            <div className='header-section'>
                <h1 className='app-title'>🚀 Tauri Updater Demo</h1>
                <div className='version-badge'>v{state.version}</div>
            </div>

            <div className='logo-section'>
                <a
                    href='https://vite.dev'
                    target='_blank'
                    className='logo-link'
                >
                    <img
                        src='/vite.svg'
                        className='logo vite'
                        alt='Vite logo'
                    />
                </a>
                <a
                    href='https://tauri.app'
                    target='_blank'
                    className='logo-link'
                >
                    <img
                        src='/tauri.svg'
                        className='logo tauri'
                        alt='Tauri logo'
                    />
                </a>
                <a
                    href='https://react.dev'
                    target='_blank'
                    className='logo-link'
                >
                    <img
                        src={reactLogo}
                        className='logo react'
                        alt='React logo'
                    />
                </a>
            </div>

            <p className='subtitle'>
                Modern Tauri uygulaması ile otomatik güncelleme sistemi
            </p>

            <div className='update-card'>
                <div className='status-section'>
                    <div
                        className={`status-indicator ${
                            state.update ? "update-available" : "up-to-date"
                        }`}
                    >
                        {state.update ? "🔄" : "✅"}
                    </div>
                    <div className='status-text'>
                        <h3>
                            {state.update
                                ? "Güncelleme Mevcut"
                                : "Güncel Versiyon"}
                        </h3>
                        <p className='version-text'>
                            Versiyon: {state.version}
                        </p>
                        {state.lastChecked && (
                            <p className='last-checked'>
                                Son kontrol:{" "}
                                {state.lastChecked.toLocaleTimeString("tr-TR")}
                            </p>
                        )}
                    </div>
                </div>

                {state.message && (
                    <div
                        className={`message ${
                            state.isLoading ? "loading" : ""
                        }`}
                    >
                        {state.isLoading && <div className='spinner'></div>}
                        {state.message}
                    </div>
                )}

                <div className='button-section'>
                    <button
                        onClick={handleCheckUpdates}
                        disabled={state.isLoading}
                        className='btn btn-secondary'
                    >
                        {state.isLoading ? "⏳" : "🔍"} Kontrol Et
                    </button>

                    {state.update && (
                        <button
                            onClick={handleUpdate}
                            disabled={state.isLoading}
                            className='btn btn-primary'
                        >
                            {state.isLoading ? "⏳" : "⬇️"} Güncelle
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;
