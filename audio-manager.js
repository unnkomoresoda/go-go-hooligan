/**
 * AudioManager - 効果音・音声管理クラス
 * 
 * 機能:
 * - 効果音・音声の再生
 * - 多重再生制御
 * - 音量制御
 * - モバイル対応
 */

class AudioManager {
    constructor() {
        // GitHub Pages 対応: ベースパスを取得
        const basePath = window.location.pathname.includes('/go-go-hooligan/') ? '/go-go-hooligan' : '';
        
        // 音声ファイルマップ
        this.audioFiles = {
            se: {
                title: `${basePath}/audio/se/title.mp3`,
                button: `${basePath}/audio/se/button.mp3`,
                recruitSuccess: `${basePath}/audio/se/recruit-success.mp3`,
                attack: `${basePath}/audio/se/attack.mp3`,
            },
            voice: {
                victory: `${basePath}/audio/voice/victory.mp3`,
                defeat: `${basePath}/audio/voice/defeat.mp3`,
            }
        };

        // 再生中の Audio 要素
        this.currentSE = null;
        this.currentVoice = null;

        // 音量設定（0-1）
        this.volumeSE = 0.5;
        this.volumeVoice = 0.8;

        // AudioContext 初期化フラグ
        this.audioContextInitialized = false;

        // モバイルフラグ
        this.isMobile = this.detectMobile();
    }

    /**
     * モバイルデバイスか判定
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * AudioContext を初期化（モバイル対応）
     * ユーザー操作後に呼び出す必要がある
     */
    initAudioContext() {
        if (this.audioContextInitialized) return;
        
        try {
            // ダミー音声を再生して AudioContext を初期化
            const dummyAudio = new Audio();
            dummyAudio.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
            dummyAudio.play().catch(() => {
                // 再生失敗時は無視
            });
            this.audioContextInitialized = true;
        } catch (e) {
            // エラー時は無視
        }
    }

    /**
     * 効果音を再生
     * @param {string} name - 効果音名（title, button, recruitSuccess, attack）
     */
    playSE(name) {
        // AudioContext 初期化
        this.initAudioContext();

        // 再生中の SE を停止
        if (this.currentSE) {
            this.currentSE.pause();
            this.currentSE.currentTime = 0;
        }

        const filePath = this.audioFiles.se[name];
        if (!filePath) {
            console.warn(`[AudioManager] SE not found: ${name}`);
            return;
        }

        try {
            const audio = new Audio(filePath);
            audio.volume = this.volumeSE;
            console.log(`[AudioManager] Playing SE: ${name} (${filePath})`);
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`[AudioManager] SE playing: ${name}`);
                    })
                    .catch((error) => {
                        console.error(`[AudioManager] Failed to play SE '${name}':`, error.name, error.message);
                    });
            }
            this.currentSE = audio;
        } catch (e) {
            console.error(`[AudioManager] Exception playing SE: ${name}`, e);
        }
    }

    /**
     * ボイスを再生
     * @param {string} name - ボイス名（victory, defeat）
     */
    playVoice(name) {
        // AudioContext 初期化
        this.initAudioContext();

        // 再生中のボイスを停止
        if (this.currentVoice) {
            this.currentVoice.pause();
            this.currentVoice.currentTime = 0;
        }

        const filePath = this.audioFiles.voice[name];
        if (!filePath) {
            console.warn(`[AudioManager] Voice not found: ${name}`);
            return;
        }

        try {
            const audio = new Audio(filePath);
            audio.volume = this.volumeVoice;
            console.log(`[AudioManager] Playing Voice: ${name} (${filePath})`);
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`[AudioManager] Voice playing: ${name}`);
                    })
                    .catch((error) => {
                        console.error(`[AudioManager] Failed to play voice '${name}':`, error.name, error.message);
                    });
            }
            this.currentVoice = audio;
        } catch (e) {
            console.error(`[AudioManager] Exception playing voice: ${name}`, e);
        }
    }

    /**
     * 音声を停止
     * @param {string} type - 停止対象（'se' | 'voice' | 'all'）
     */
    stop(type = 'all') {
        if (type === 'se' || type === 'all') {
            if (this.currentSE) {
                this.currentSE.pause();
                this.currentSE.currentTime = 0;
                this.currentSE = null;
            }
        }

        if (type === 'voice' || type === 'all') {
            if (this.currentVoice) {
                this.currentVoice.pause();
                this.currentVoice.currentTime = 0;
                this.currentVoice = null;
            }
        }
    }

    /**
     * 音量を設定
     * @param {string} type - 対象（'se' | 'voice'）
     * @param {number} volume - 音量（0-1）
     */
    setVolume(type, volume) {
        volume = Math.max(0, Math.min(1, volume)); // 0-1 に制限

        if (type === 'se') {
            this.volumeSE = volume;
            if (this.currentSE) {
                this.currentSE.volume = volume;
            }
        } else if (type === 'voice') {
            this.volumeVoice = volume;
            if (this.currentVoice) {
                this.currentVoice.volume = volume;
            }
        }
    }

    /**
     * 再生中か判定
     * @param {string} type - 対象（'se' | 'voice'）
     * @returns {boolean}
     */
    isPlaying(type) {
        if (type === 'se') {
            return this.currentSE && !this.currentSE.paused;
        } else if (type === 'voice') {
            return this.currentVoice && !this.currentVoice.paused;
        }
        return false;
    }

    /**
     * 全ての音声を停止
     */
    stopAll() {
        this.stop('all');
    }

    /**
     * 音量をリセット
     */
    resetVolume() {
        this.volumeSE = 0.5;
        this.volumeVoice = 0.8;
    }
}

// グローバルに AudioManager をエクスポート
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}
