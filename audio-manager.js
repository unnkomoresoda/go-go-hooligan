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
        // GitHub Pages 対応: <base> タグがある場合は相対パスを使用
        // <base> タグがない場合は、ベースパスを付与
        this.hasBaseTag = !!document.querySelector('base');
        
        // 音声ファイルマップ（相対パスのみ）
        this.audioFiles = {
            se: {
                title: 'audio/se/title.mp3',
                button: 'audio/se/button.mp3',
                battleButton: 'audio/se/battle-button.mp3',
                recruitSuccess: 'audio/se/recruit-success.mp3',
                attack: 'audio/se/attack.mp3',
            },
            voice: {
                victory: 'audio/voice/victory.mp3',
                defeat: 'audio/voice/defeat.mp3',
            }
        };

        console.log('[AudioManager] Initialized');
        console.log('[AudioManager] Has <base> tag:', this.hasBaseTag);
        if (!this.hasBaseTag) {
            console.log('[AudioManager] Will use absolute paths with base path detection');
        }

        // 再生中の Audio 要素
        this.currentSE = null;
        this.currentVoice = null;
        this.battleButtonSe = null;

        // 音量設定（0-1）
        this.volumeSE = 0.5;
        this.volumeVoice = 0.8;

        // AudioContext 初期化フラグ
        this.audioContextInitialized = false;

        // モバイルフラグ
        this.isMobile = this.detectMobile();
    }

    /**
     * ファイルパスを取得（<base> タグの有無に応じて処理）
     * @param {string} relativePath - 相対パス（例: 'audio/se/button.mp3'）
     * @returns {string} 最終的なパス
     */
    getFilePath(relativePath) {
        if (this.hasBaseTag) {
            // <base> タグがあれば、相対パスをそのまま返す
            // ブラウザが <base> を基準に解決する
            return relativePath;
        } else {
            // <base> タグがなければ、ベースパスを付与
            const basePath = this.getBasePath();
            return basePath ? `${basePath}/${relativePath}` : relativePath;
        }
    }

    /**
     * ベースパスを取得（<base> タグがない場合のみ）
     * @returns {string} ベースパス（例: '/go-go-hooligan'）
     */
    getBasePath() {
        const pathname = window.location.pathname;
        console.log('[AudioManager] Current pathname:', pathname);
        
        if (pathname.includes('/go-go-hooligan')) {
            const match = pathname.match(/^(\/go-go-hooligan)/);
            if (match) {
                console.log('[AudioManager] Base path detected:', match[1]);
                return match[1];
            }
        }

        console.log('[AudioManager] Using empty base path');
        return '';
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

        const relativePath = this.audioFiles.se[name];
        if (!relativePath) {
            console.warn(`[AudioManager] SE not found: ${name}`);
            return;
        }

        const filePath = this.getFilePath(relativePath);

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

        const relativePath = this.audioFiles.voice[name];
        if (!relativePath) {
            console.warn(`[AudioManager] Voice not found: ${name}`);
            return;
        }

        const filePath = this.getFilePath(relativePath);

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
     * バトルボタン効果音を再生
     * 最終決戦画面用の重い / 硬い音
     */
    playBattleButtonSE() {
        console.log('[battle-se] playBattleButtonSE entered');
        // AudioContext 初期化
        this.initAudioContext();

        // バトルボタン SE を初期化（再利用）
        if (!this.battleButtonSe) {
            console.log('[battle-se] initializing battleButtonSe');
            const relativePath = this.audioFiles.se.battleButton;
            console.log('[battle-se] relativePath:', relativePath);
            if (!relativePath) {
                console.warn('[battle-se] Battle button SE not found in audioFiles');
                return;
            }
            const filePath = this.getFilePath(relativePath);
            console.log('[battle-se] filePath:', filePath);
            this.battleButtonSe = new Audio(filePath);
            this.battleButtonSe.volume = 0.65; // ストーリー用より少し大きい
            this.battleButtonSe.preload = 'auto';
            console.log('[battle-se] Audio created, src:', this.battleButtonSe.src, 'volume:', this.battleButtonSe.volume);
        } else {
            console.log('[battle-se] reusing existing battleButtonSe, src:', this.battleButtonSe.src);
        }

        try {
            // 短い SE なので currentTime をリセット
            this.battleButtonSe.currentTime = 0;
            console.log('[battle-se] about to play, src:', this.battleButtonSe?.src);
            const playPromise = this.battleButtonSe.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('[battle-se] play success');
                    })
                    .catch((error) => {
                        console.error('[battle-se] play failed', error.name, error.message, 'src:', this.battleButtonSe?.src);
                    });
            } else {
                console.log('[battle-se] play() returned undefined');
            }
        } catch (e) {
            console.error('[battle-se] runtime error', e);
        }
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
