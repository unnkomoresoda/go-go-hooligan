const TITLE_NAME = '乱暴！怒りのフーリガン！';
const TITLE_SUBTITLE = 'Rampage! Furious Hooligans!';
const FINAL_BATTLE_BGM_TITLE = '血塗れのダービー';
const FINAL_BATTLE_BGM_URL = 'https://cdn1.suno.ai/2a04cd29-a3f0-4d53-9793-2fee56ee089d.mp3';
const STORY_BGM_TITLE = 'days';
const STORY_BGM_URL = 'audio/days.mp3';

const CREATOR_DONATION_URL = 'https://qr.paypay.ne.jp/p2p01_KwOxvV3CmELTJks9';

// グローバルカウンター: 訪問者数追跡
class GlobalCounter {
    constructor() {
        this.counterKey = 'gogoHooligan_globalCounter';
        this.apiUrl = 'https://api.countapi.xyz/hit/gogoHooligan/visits';
        this.cacheKey = 'gogoHooligan_counterCache';
        this.cacheDuration = 3600000; // 1時間
        this.globalCount = 0;
        this.todayCount = 0;
    }

    async fetchCount() {
        try {
            // キャッシュを確認
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < this.cacheDuration) {
                    this.globalCount = data.globalCount || 0;
                    this.todayCount = data.todayCount || 0;
                    return;
                }
            }

            // APIを召び出してカウントを取得
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                const data = await response.json();
                this.globalCount = data.value || 0;
                
                // 本日の訪問数を推定（粗い推定）
                const today = new Date().toDateString();
                const lastDate = localStorage.getItem('gogoHooligan_lastCountDate');
                if (lastDate === today) {
                    this.todayCount = parseInt(localStorage.getItem('gogoHooligan_todayCount') || '0') + 1;
                } else {
                    this.todayCount = 1;
                    localStorage.setItem('gogoHooligan_lastCountDate', today);
                }
                localStorage.setItem('gogoHooligan_todayCount', this.todayCount.toString());

                // キャッシュに保存
                localStorage.setItem(this.cacheKey, JSON.stringify({
                    data: { globalCount: this.globalCount, todayCount: this.todayCount },
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.log('カウンター取得失敗:', error);
            this.globalCount = 0;
            this.todayCount = 0;
        }
    }

    getStats() {
        return {
            globalCount: this.globalCount,
            todayCount: this.todayCount
        };
    }
}

// 足跡機能: プレイ履歴管理
class PlayHistory {
    constructor() {
        this.storageKey = 'gogoHooligan_playHistory';
        this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        this.history = data ? JSON.parse(data) : {
            totalPlays: 0,
            totalClears: 0,
            plays: [],
            lastPlayDate: null,
            longestStreak: 0,
            currentStreak: 0
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    }

    recordPlay() {
        const now = new Date().toISOString();
        this.history.totalPlays++;
        this.history.lastPlayDate = now;
        this.history.plays.push({ date: now, result: null });
        this.save();
    }

    recordClear() {
        if (this.history.plays.length > 0) {
            this.history.plays[this.history.plays.length - 1].result = 'clear';
            this.history.totalClears++;
            this.history.currentStreak++;
            if (this.history.currentStreak > this.history.longestStreak) {
                this.history.longestStreak = this.history.currentStreak;
            }
        }
        this.save();
    }

    recordDefeat() {
        if (this.history.plays.length > 0) {
            this.history.plays[this.history.plays.length - 1].result = 'defeat';
            this.history.currentStreak = 0;
        }
        this.save();
    }

    getStats() {
        return {
            totalPlays: this.history.totalPlays,
            totalClears: this.history.totalClears,
            clearRate: this.history.totalPlays > 0 ? Math.round((this.history.totalClears / this.history.totalPlays) * 100) : 0,
            lastPlayDate: this.history.lastPlayDate,
            longestStreak: this.history.longestStreak,
            currentStreak: this.history.currentStreak,
            recentPlays: this.history.plays.slice(-10)
        };
    }

    clearHistory() {
        localStorage.removeItem(this.storageKey);
        this.load();
    }
}

class GoGoHooligan {
    constructor() {
        this.gameScreen = document.getElementById('game-screen');
        this.battleBgm = null;
        this.battleBgmFadeTimer = null;
        this.themeBgm = null;
        this.themeBgmPlaying = false;
        this.themeBgmCreatedCount = 0;  // Audio 生成回数（singleton 検出用）
        this.playHistory = new PlayHistory();
        this.globalCounter = new GlobalCounter();
        this.resetState();
        this.initAsync();
    }

    async initAsync() {
        await this.globalCounter.fetchCount(); // ページ読み込み時にカウント取得
        this.init();
    }

    resetState() {
        this.stopBattleBgm({ reset: true, immediate: true });
        this.state = JSON.parse(JSON.stringify(gameState));
        this.state.currentDay = 1;
        this.state.currentPhase = 0;
        this.state.dayActionTaken = false;
        this.state.battleActive = false;
        this.state.finalBattleResult = null;
        this.state.currentEncounterId = null;
        this.state.currentLocationId = null;
        this.state.nightConversationIds = [];
        this.state.nightConversationId = null;
        this.state.lastNightSpeakerIds = [];
        this.state.lastNightSpeakerId = null;
        this.state.finalEnemyIds = [];
        this.state.lastRecruitedId = null;
        this.state.matchHistory = [];
        this.state.latestMatch = null;
        this.state.enemyCrowdLevel = 0;
        this.state.nightPreparedDay = null;
        this.state.nightRecruitEncounterId = null;
        this.state.nightEncounterResolved = false;
        this.state.nightEncounterResult = null;
        this.state.finalBattleLog = [];
        this.state.finalBattleHighlights = [];
        this.state.finalAllyRoster = [];
        this.state.finalBattleState = null;
        this.state.finalBattleBgmBlocked = false;
    }

    init() {
        document.title = TITLE_NAME;
        this.setupUserInteractionListener();
        this.renderTitle();
    }

    setupUserInteractionListener() {
        // タイトル画面では音楽なし
    }

    scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (this.gameScreen) {
            this.gameScreen.scrollTop = 0;
        }
    }

    setScreen(html) {
        this.closeCharacterPopup();
        this.gameScreen.innerHTML = `
            <div class="page-top-utility">
                <a href="${CREATOR_DONATION_URL}" class="btn btn-donate btn-donate-small" target="_blank" rel="noopener noreferrer">オレはこの才能に投資する！！<br>次回作「ドキドキメモリアル」<br>リリース時期:資金次第</a>
            </div>
            ${html}
        `;
        this.scrollToTop();
    }

    startGame() {
        this.stopThemeMusic();
        this.playHistory.recordPlay();
        this.resetState();
        this.renderPrologue(0);
    }

    beginMainGame() {
        this.stopThemeMusic();
        this.renderDay();
    }

    getAllCharacterIds() {
        return Object.keys(GAME_DATA.characters);
    }

    getNeutralCharacterIds(exclude = []) {
        return this.getAllCharacterIds().filter(id => !this.state.recruitedMembers.includes(id) && !exclude.includes(id));
    }

    getMaxTeamSize() {
        return this.getAllCharacterIds().length;
    }

    getCharacter(characterId) {
        return GAME_DATA.characters[characterId];
    }

    getCharacterImage(characterId) {
        return `images/${characterId}.jpg?v=${ASSET_VERSION}`;
    }

    getTitleArtImage() {
        return `images/title-furious-hooligan.jpg?v=${ASSET_VERSION}`;
    }

    getVictoryEndingVideoSrc() {
        return `media/victory-ending.mp4?v=${ASSET_VERSION}`;
    }

    getPrologueImageSrc(sceneIndex) {
        const prologueImages = [
            'epilogue-01-suffering.png',
            'epilogue-02-beer.png',
            'epilogue-03-resolve.png'
        ];
        return `media/epilogue/${prologueImages[sceneIndex]}?v=${ASSET_VERSION}`;
    }

    getLocationCards() {
        return [
            { id: 'pub', icon: '🍺' },
            { id: 'park', icon: '🌳' },
            { id: 'street', icon: '🏪' }
        ];
    }

    shuffle(array) {
        const cloned = [...array];
        for (let i = cloned.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
        }
        return cloned;
    }

    randomChoice(array) {
        if (!array || !array.length) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    pick(array, count) {
        return this.shuffle(array).slice(0, count);
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            auto: '自動加入級',
            easy: '易しい',
            medium: '普通',
            hard: '難しい'
        };
        return labels[difficulty] || '普通';
    }

    getRoleBadge(skillType) {
        const labels = {
            attack: '攻撃',
            defense: '防御',
            debuff: '妨害',
            heal: '回復',
            buff: '強化'
        };
        return labels[skillType] || '特殊';
    }

    normalizeQuote(text) {
        if (!text) {
            return '「……」';
        }
        return text.startsWith('「') ? text : `「${text}」`;
    }

    renderMiniStats(stats) {
        return `
            <div class="mini-stats">
                <span>筋力 ${stats.strength}</span>
                <span>体脂肪 ${stats.bodyFat}</span>
                <span>幸福 ${stats.happiness}</span>
                <span>モラル ${stats.morality}</span>
                <span>学力 ${stats.education}</span>
                <span>資産 ${stats.assets}</span>
            </div>
        `;
    }

    renderStatsGrid(stats) {
        return `
            <div class="stats-grid">
                <div class="stat-card"><span class="stat-label">筋力</span><strong>${stats.strength}</strong></div>
                <div class="stat-card"><span class="stat-label">体脂肪</span><strong>${stats.bodyFat}</strong></div>
                <div class="stat-card"><span class="stat-label">幸福度</span><strong>${stats.happiness}</strong></div>
                <div class="stat-card"><span class="stat-label">モラル</span><strong>${stats.morality}</strong></div>
                <div class="stat-card"><span class="stat-label">学力</span><strong>${stats.education}</strong></div>
                <div class="stat-card"><span class="stat-label">資産</span><strong>${stats.assets}</strong></div>
            </div>
        `;
    }

    renderCharacterPanel(characterId, options = {}) {
        const character = this.getCharacter(characterId);
        const showStory = options.showStory ?? false;
        const showDialogue = options.showDialogue ?? false;
        const dialogueText = options.dialogueText || '';
        const panelClass = options.panelClass || 'character-profile-panel';
        const extraMeta = options.extraMeta || '';

        return `
            <div class="${panelClass}">
                <div class="character-portrait-column">
                    <button type="button" class="character-image-button" onclick="window.game.openCharacterPopup('${characterId}')" aria-label="${character.name} の詳細パラメータを表示">
                        <div class="character-image-frame">
                            <img src="${this.getCharacterImage(characterId)}" alt="${character.name}" class="character-image" onerror="this.onerror=null;this.src='images/derek.jpg?v=${ASSET_VERSION}'">
                        </div>
                        <span class="image-tap-hint">画像をタップしてパラメータを見る</span>
                    </button>
                </div>
                <div class="character-detail-column">
                    <div class="character-info">
                        <h3>${character.name}</h3>
                        <p>年齢: ${character.age}歳</p>
                        <p>職業: ${character.job}</p>
                        <p>役割: ${character.role}</p>
                        <p>勧誘難度: ${this.getDifficultyLabel(character.recruitDifficulty)}</p>
                        ${extraMeta}
                    </div>
                    <div class="character-peek-note">
                        <p><strong>詳細表示:</strong> 画像を押すと、筋力・体脂肪・幸福度・モラル・学力・資産をポップアップで確認できる。</p>
                    </div>
                    <div class="skill-box">
                        <p><strong>スキル:</strong> ${character.skill.name}</p>
                        <p><strong>効果:</strong> ${character.skill.description}</p>
                        <p><strong>分類:</strong> ${this.getRoleBadge(character.skill.type)}</p>
                    </div>
                    ${showStory ? `<div class="character-story"><p>${character.story}</p></div>` : ''}
                    ${showDialogue ? `<div class="dialogue-box"><p>${this.normalizeQuote(dialogueText)}</p></div>` : ''}
                </div>
            </div>
        `;
    }

    renderCharacterPopupContent(characterId) {
        const character = this.getCharacter(characterId);
        return `
            <div class="character-modal-card" role="dialog" aria-modal="true" aria-labelledby="character-modal-title-${characterId}">
                <button type="button" class="character-modal-close" onclick="window.game.closeCharacterPopup()" aria-label="閉じる">×</button>
                <div class="character-modal-body">
                    <div class="character-modal-portrait-column">
                        <div class="character-image-frame character-modal-image-frame">
                            <img src="${this.getCharacterImage(characterId)}" alt="${character.name}" class="character-image character-modal-image" onerror="this.onerror=null;this.src='images/derek.jpg?v=${ASSET_VERSION}'">
                        </div>
                    </div>
                    <div class="character-modal-detail-column">
                        <div class="character-info character-modal-info">
                            <h3 id="character-modal-title-${characterId}">${character.name}</h3>
                            <p>年齢: ${character.age}歳</p>
                            <p>職業: ${character.job}</p>
                            <p>役割: ${character.role}</p>
                            <p>勧誘難度: ${this.getDifficultyLabel(character.recruitDifficulty)}</p>
                        </div>
                        ${this.renderStatsGrid(character.stats)}
                        <div class="skill-box">
                            <p><strong>スキル:</strong> ${character.skill.name}</p>
                            <p><strong>効果:</strong> ${character.skill.description}</p>
                            <p><strong>分類:</strong> ${this.getRoleBadge(character.skill.type)}</p>
                        </div>
                        <div class="character-story"><p>${character.story}</p></div>
                    </div>
                </div>
            </div>
        `;
    }

    openCharacterPopup(characterId) {
        this.closeCharacterPopup();
        const overlay = document.createElement('div');
        overlay.className = 'character-modal-overlay';
        overlay.innerHTML = this.renderCharacterPopupContent(characterId);
        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                this.closeCharacterPopup();
            }
        });
        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');
    }

    closeCharacterPopup() {
        document.querySelectorAll('.character-modal-overlay').forEach(element => element.remove());
        document.body.classList.remove('modal-open');
    }

    ensureThemeBgm() {
        if (!this.themeBgm) {
            const audio = new Audio(THEME_BGM_URL);
            audio.loop = false;
            audio.preload = 'auto';
            audio.volume = 0.4;
            this.themeBgm = audio;
        }
        return this.themeBgm;
    }

    ensureStoryBgm() {
        if (!this.storyBgm) {
            const audio = new Audio(STORY_BGM_URL);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.35;
            this.storyBgm = audio;
        }
        return this.storyBgm;
    }

    ensureBattleBgm() {
        if (!this.battleBgm) {
            const audio = new Audio(FINAL_BATTLE_BGM_URL);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.42;
            this.battleBgm = audio;
        }
        return this.battleBgm;
    }

    startThemeBgm() {
        this.stopThemeBgm();
        const audio = this.ensureThemeBgm();
        if (!audio) {
            return;
        }
        audio.volume = 0.4;
        if (audio.paused) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    console.log('Theme BGM play blocked by browser');
                });
            }
        }
    }

    stopThemeBgm(options = {}) {
        const { reset = false, immediate = false } = options;
        if (!this.themeBgm) {
            return;
        }
        const audio = this.themeBgm;
        if (immediate || !audio.paused) {
            audio.pause();
            if (reset) {
                audio.currentTime = 0;
            }
        }
    }

    startStoryBgm() {
        this.stopStoryBgm();
        const audio = this.ensureStoryBgm();
        if (!audio) {
            return;
        }
        audio.volume = 0.35;
        if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    console.log('Story BGM play blocked by browser');
                });
            }
        }
    }

    stopStoryBgm(options = {}) {
        const { reset = false, immediate = false } = options;
        if (this.storyBgmFadeTimer) {
            clearInterval(this.storyBgmFadeTimer);
            this.storyBgmFadeTimer = null;
        }
        if (!this.storyBgm) {
            return;
        }
        const audio = this.storyBgm;
        if (immediate || !audio.paused) {
            audio.pause();
            if (reset) {
                audio.currentTime = 0;
            }
        }
    }

    startBattleBgm() {
        this.stopStoryBgm({ reset: true });
        const audio = this.ensureBattleBgm();
        if (!audio) {
            return;
        }
        if (this.battleBgmFadeTimer) {
            clearInterval(this.battleBgmFadeTimer);
            this.battleBgmFadeTimer = null;
        }
        audio.volume = 0.42;
        this.state.finalBattleBgmBlocked = false;
        if (!audio.paused) {
            return;
        }
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                this.state.finalBattleBgmBlocked = true;
                if (this.state.battleActive) {
                    this.renderFinalBattleScene();
                }
            });
        }
    }

    stopBattleBgm(options = {}) {
        const { reset = false, immediate = false } = options;
        if (this.battleBgmFadeTimer) {
            clearInterval(this.battleBgmFadeTimer);
            this.battleBgmFadeTimer = null;
        }
        if (!this.battleBgm) {
            return;
        }
        const audio = this.battleBgm;
        const finalizeStop = () => {
            audio.pause();
            if (reset) {
                audio.currentTime = 0;
            }
            audio.volume = 0.42;
        };

        if (immediate || audio.paused) {
            finalizeStop();
            return;
        }

        const step = Math.max(0.05, audio.volume / 6);
        this.battleBgmFadeTimer = setInterval(() => {
            audio.volume = Math.max(0, audio.volume - step);
            if (audio.volume <= 0.01) {
                clearInterval(this.battleBgmFadeTimer);
                this.battleBgmFadeTimer = null;
                finalizeStop();
            }
        }, 90);
    }

    ensureThemeMusicAudio() {
        if (!this.themeBgm) {
            this.themeBgmCreatedCount++;
            if (this.themeBgmCreatedCount > 1) {
                console.error(`[TitleBGM] 二重警告: ${this.themeBgmCreatedCount}個目の Audio インスタンスを生成しようとしています。スタックトレース:`, new Error().stack);
            }
            const audio = new Audio('audio/gogo-hooligan-theme.mp3');
            audio.loop = false;
            audio.volume = 0.3;
            this.themeBgm = audio;
        }
        return this.themeBgm;
    }

    toggleTitleBgm(buttonEl) {
        const audio = this.ensureThemeMusicAudio();
        if (!audio) return;

        if (this.themeBgmPlaying && !audio.paused) {
            audio.pause();
            this.themeBgmPlaying = false;
            if (buttonEl) buttonEl.textContent = '🎵 テーマ曲を再生';
        } else {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.themeBgmPlaying = true;
                        if (buttonEl) buttonEl.textContent = '⏸ テーマ曲を停止';
                    })
                    .catch(error => {
                        console.log('テーマ曲の再生に失敗:', error);
                        this.themeBgmPlaying = false;
                    });
            } else {
                this.themeBgmPlaying = true;
                if (buttonEl) buttonEl.textContent = '⏸ テーマ曲を停止';
            }
        }
    }

    // 後方互換性のため
    toggleThemeMusic() {
        const btn = document.getElementById('theme-music-btn');
        this.toggleTitleBgm(btn);
    }

    stopThemeMusic() {
        if (this.themeBgm) {
            this.themeBgm.pause();
            this.themeBgm.currentTime = 0;
            this.themeBgmPlaying = false;
        }
    }

    checkTitleBgmState() {
        const playingCount = this.themeBgm && !this.themeBgm.paused ? 1 : 0;
        const state = {
            createdCount: this.themeBgmCreatedCount,
            playingCount: playingCount,
            duplicated: this.themeBgmCreatedCount > 1
        };
        if (state.duplicated) {
            console.error('[TitleBGM] 二重警告:', state);
        }
        return state;
    }

    renderTitle() {
        this.setScreen(`
            <div class="title-screen furious-title-screen">
                <div class="title-art-wrap">
                    <img src="${this.getTitleArtImage()}" alt="${TITLE_NAME}" class="title-art" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                    <div class="title-fallback" style="display:none;">
                        <h1>${TITLE_NAME}</h1>
                    </div>
                </div>
                <h1 class="screen-reader-title">${TITLE_NAME}</h1>
                <h2>${TITLE_SUBTITLE}</h2>
                <p class="tagline">昼に拾った縁、夜に交わした本音、そしてスタンドの怒号が、最後の3対3乱闘を血の色に染める。</p>
                <div class="buttons">
                    <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                    <button class="btn btn-secondary" onclick="window.game.showHelp()">ヘルプ</button>
                    <button class="btn btn-music" id="theme-music-btn" onclick="window.game.toggleThemeMusic()">🎵 テーマ曲を再生</button>
                </div>
            </div>
        `);
    }

    renderPrologue(sceneIndex = 0) {
        if (sceneIndex === 0 && !this.state.prologueBgmStarted) {
            this.state.prologueBgmStarted = true;
            this.stopThemeBgm({ reset: true });
            this.startStoryBgm();
        }
        const prologueScenes = [
            {
                label: 'PROLOGUE I',
                title: '苦悩する',
                text: '雨に濡れたピッチの脇で、監督は額を押さえたまま動けずにいた。ひとつの夜を勝ち抜いても、街の奥ではさらに巨大な敵意が脈を打っている。その気配だけが、胸の底に重く沈んでいる。',
                quote: '「ここで息を止めたら、次に来る波に街ごと呑まれる」'
            },
            {
                label: 'PROLOGUE II',
                title: 'ビールを飲む',
                text: '冷えた缶をあおり、喉を焼く苦味で迷いを押し流す。歓声の残響も自己弁護も、その一口ごとに削ぎ落とされていく。残るのは、次の夜に何を背負うべきかという裸の問いだけだ。',
                quote: '「酔うためじゃない。立ち向かう理由を、もう一度はっきりさせるためだ」'
            },
            {
                label: 'PROLOGUE III',
                title: '決意する',
                text: 'やがて彼は顔を上げ、拳を固く握る。視線の先にあるのは勝利の余韻ではない。この街の呼吸を奪おうとする、まだ姿を見せきっていない強大な敵だ。ここから始まるのは、歓喜の続きではなく次の戦いへの行軍である。',
                quote: '「来るなら来い。次は俺たちが、あの巨大な闇へ踏み込む」'
            }
        ];

        const currentScene = prologueScenes[sceneIndex];
        const isLastScene = sceneIndex === prologueScenes.length - 1;
        const progressHtml = prologueScenes.map((scene, index) => `
            <span class="prologue-progress-dot ${index === sceneIndex ? 'active' : ''}" aria-hidden="true"></span>
        `).join('');
        const previousButtonHtml = sceneIndex > 0
            ? `<button class="btn btn-secondary" onclick="window.game.renderPrologue(${sceneIndex - 1})">前の場面へ</button>`
            : `<button class="btn btn-secondary" onclick="window.game.renderTitle()">タイトルに戻る</button>`;
        const nextButtonLabel = isLastScene ? 'プロローグを終えて本編へ' : '次の場面へ';
        const nextButtonAction = isLastScene ? 'window.game.beginMainGame()' : `window.game.renderPrologue(${sceneIndex + 1})`;

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>プロローグ</h2>
                </div>
                <div class="content">
                    <div class="ending cinematic-ending emotional-ending prologue-screen">
                        <div class="ending-kicker">Opening Prologue</div>
                        <h3>強大な敵の気配</h3>
                        <p class="ending-lead">歓喜の夜は終わっていない。それでも、次に来る戦いはもう始まっている。</p>
                        <div class="prologue-progress" aria-label="プロローグ進行状況">
                            ${progressHtml}
                        </div>
                        <article class="prologue-scene-panel">
                            <div class="prologue-scene-media">
                                <img src="${this.getPrologueImageSrc(sceneIndex)}" alt="${currentScene.title}" class="prologue-scene-image" onerror="this.onerror=null;this.src='${this.getTitleArtImage()}';">
                            </div>
                            <div class="prologue-scene-copy">
                                <span class="prologue-scene-label">${currentScene.label}</span>
                                <h4>${currentScene.title}</h4>
                                <p>${currentScene.text}</p>
                                <p class="prologue-scene-quote">${currentScene.quote}</p>
                                ${isLastScene ? '<div class="prologue-threat-note"><strong>NEXT FOE</strong><span>雨の向こうでは、これまでとは格の違う強大な敵がこちらを待ち受けている。</span></div>' : ''}
                            </div>
                        </article>
                        <div class="choices">
                            ${previousButtonHtml}
                            <button class="btn btn-primary" onclick="${nextButtonAction}">${nextButtonLabel}</button>
                            <button class="btn btn-secondary" onclick="window.game.beginMainGame()">スキップして本編へ</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    renderDay() {
        if (this.state.currentPhase === 2) {
            this.renderNight();
            return;
        }

        const phaseNames = ['朝', '昼', '夜'];
        const phaseName = phaseNames[this.state.currentPhase];

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 ${phaseName}</h2>
                    <div class="status">
                        <span>チーム士気: ${this.state.teamMorale}%</span>
                        <span>仲間数: ${this.state.recruitedMembers.length}/${this.getMaxTeamSize()}</span>
                        <span>敵増援圧: ${this.state.enemyCrowdLevel}</span>
                    </div>
                </div>
                <div class="content">
                    ${this.renderPhaseContent()}
                </div>
            </div>
        `);
    }

    renderPhaseContent() {
        if (this.state.currentPhase === 0) {
            return this.renderMorning();
        }
        if (this.state.currentPhase === 1) {
            return this.renderAfternoon();
        }
        if (this.state.currentPhase === 2) {
            return this.renderNight();
        }
        return '';
    }

    renderMorning() {
        const lastRecruit = this.state.lastRecruitedId ? this.getCharacter(this.state.lastRecruitedId) : null;

        if (this.state.currentDay === 1) {
            return `
                <div class="morning-scene">
                    <div class="message">
                        <p>朝日が濁った窓を叩き、街はもう試合前のざわめきで満ちている。まだ誰が肩を並べ、誰が石を投げてくるのかも分からない。</p>
                        <p>Derek は低い声で告げる。昼に動けるのはたった一度きりだ。その一手で誰かの心をこちらへ傾け、夜になれば仲間たちの本音を拾い、稀に思いがけない乱入者すら巻き込んでいく。</p>
                        <p>そして毎夜、試合結果が街の温度を決める。勝敗も点差も、スタンドから溢れた熱狂も、最後の乱闘で向かい合う敵の数にまで食い込んでくる。</p>
                    </div>
                    ${this.renderCharacterPanel('derek', {
                        showDialogue: true,
                        dialogueText: this.getCharacter('derek').dialogue.intro,
                        extraMeta: '<p>立場: 初期メンバー</p><p>初期戦術: 昼は1回、夜は会話と試合確認</p>'
                    })}
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.advancePhase()">昼の仲間集めに向かう</button>
                        <button class="btn btn-secondary" onclick="window.game.showGameInfo()">ゲームについて詳しく知る</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="morning-scene">
                <p>新しい一日が始まった。空気は少し冷えているのに、胸の奥だけは昨夜の熱をまだ引きずっている。昼に動けるのは、やはり一度だけだ。</p>
                <p>${lastRecruit ? `${lastRecruit.name} を引き入れたことで、昨夜まで他人だった空気に確かな結び目が生まれた。` : '昨夜の会話と試合の余熱が、まだ通りの隅々に沈殿している。'}</p>
                <p>今日どの顔と向き合うかで、夜に交わされる言葉も、最後の決戦で背中を預けられる相手もまた変わっていく。</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.advancePhase()">昼の仲間集めへ</button>
                </div>
            </div>
        `;
    }

    renderAfternoon() {
        if (this.state.dayActionTaken) {
            return `
                <div class="afternoon-scene">
                    <p>今日の昼の一手はもう使い切った。これ以上こちらから誰かの懐へ踏み込むことはできない。</p>
                    <p>あとは夜を待つだけだ。仲間たちの口から本音が零れ、運が良ければ、あるいは悪ければ、別の誰かが会話の輪へ割り込んでくるかもしれない。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.endAfternoonAction()">夜に進む</button>
                    </div>
                </div>
            `;
        }

        const locationButtons = this.getLocationCards().map(({ id, icon }) => {
            const locationData = GAME_DATA.locations[id];
            const remaining = locationData.characters.filter(characterId => !this.state.recruitedMembers.includes(characterId)).length;
            return `
                <button class="btn btn-location" onclick="window.game.visitLocation('${id}')">
                    <strong>${icon} ${locationData.name}</strong><br>
                    <small>${locationData.description}</small><br>
                    <small>候補プール: ${remaining}人 / 傾向: ${locationData.recruitmentTopic}</small>
                </button>
            `;
        }).join('');

        return `
            <div class="afternoon-scene">
                <p>昼だ。ここから先は一度きりの勝負になる。訪問先を決めれば、その場所に染みついた匂いや噂に引かれるように、誰かひとりが姿を現す。</p>
                <p>現れた人物は、次の夜には肩を組む相手かもしれないし、最後の決戦で睨み合う敵になるかもしれない。画像をタップすれば、表情の奥に隠れた全パラメータも見抜ける。</p>
                <div class="location-buttons">
                    ${locationButtons}
                </div>
                <div class="choices">
                    <button class="btn btn-secondary" onclick="window.game.endAfternoonAction()">今日は動かず夜に進む</button>
                </div>
            </div>
        `;
    }

    selectNightSpeakers() {
        if (this.state.nightConversationIds && this.state.nightConversationIds.length) {
            return this.state.nightConversationIds;
        }

        const recruited = [...this.state.recruitedMembers];
        const previous = this.state.lastNightSpeakerIds || [];
        const freshCandidates = recruited.filter(id => !previous.includes(id));
        const pool = freshCandidates.length ? freshCandidates : recruited;
        const speakerCount = Math.min(Math.max(1, recruited.length >= 4 ? 2 : 1), pool.length || 1);
        const selected = this.pick(pool, speakerCount);

        this.state.nightConversationIds = selected;
        this.state.nightConversationId = selected[0] || null;
        this.state.lastNightSpeakerIds = selected;
        this.state.lastNightSpeakerId = selected[0] || null;
        return selected;
    }

    buildNightConversationPanels() {
        const speakerIds = this.state.nightConversationIds && this.state.nightConversationIds.length
            ? this.state.nightConversationIds
            : this.selectNightSpeakers();

        return speakerIds.map((speakerId, index) => {
            const speaker = this.getCharacter(speakerId);
            const line = this.randomChoice(speaker.dialogue.night) || '明日に備えろ。';
            return `
                <div class="night-conversation-card">
                    <h3>${index === 0 ? '今夜の会話' : '続けて語る仲間'}</h3>
                    ${this.renderCharacterPanel(speakerId, {
                        showDialogue: true,
                        dialogueText: line,
                        extraMeta: `<p>今夜の会話相手: ${speaker.name}</p><p>この会話はチームの士気を整える。</p>`
                    })}
                </div>
            `;
        }).join('');
    }

    prepareNightState() {
        if (this.state.nightPreparedDay === this.state.currentDay) {
            return;
        }
        this.selectNightSpeakers();
        this.state.latestMatch = this.simulateSoccerMatch();
        this.state.nightRecruitEncounterId = this.maybeCreateNightEncounter();
        this.state.nightEncounterResolved = !this.state.nightRecruitEncounterId;
        this.state.nightEncounterResult = null;
        this.state.nightPreparedDay = this.state.currentDay;
    }

    getMatchMomentumText(resultLabel, scoreDiff) {
        if (resultLabel === '引き分け') {
            return '決着はつかなかったが、互いの苛立ちだけが夜気に残り、路地裏の空気は鉛のように沈んだ。';
        }
        if (scoreDiff >= 3) {
            return '大差の決着が街をそのまま火薬庫に変え、敵側の過激派は歓声に押し出されるように一気に膨れ上がる。';
        }
        if (scoreDiff === 2) {
            return 'はっきりした差がつき、敵の群れは勝敗を錦の御旗にして、通りの奥から次々と姿を増していく。';
        }
        return '僅差でも火種としては十分だ。勝敗の余熱は消えず、敵の数をじわじわと押し上げていく。';
    }

    simulateSoccerMatch() {
        const allyPower = this.state.recruitedMembers.reduce((sum, id) => sum + this.calculateCharacterPower(id, 'ally'), 0);
        const neutralIds = this.getNeutralCharacterIds();
        const rivalPower = neutralIds.reduce((sum, id) => sum + this.calculateCharacterPower(id, 'enemy'), 0) || 300;
        const clubEdge = ((allyPower / Math.max(this.state.recruitedMembers.length, 1)) * 0.05) + (this.state.teamMorale * 0.35) + (this.state.teamExperience * 0.2);
        const rivalEdge = ((rivalPower / Math.max(neutralIds.length, 1)) * 0.05) + (this.state.currentDay * 9);
        const allyScore = this.clamp(Math.round((clubEdge - rivalEdge) / 28 + Math.random() * 2.2 + 1), 0, 5);
        const rivalScore = this.clamp(Math.round((rivalEdge - clubEdge) / 28 + Math.random() * 2.2 + 1), 0, 5);
        const scoreDiff = Math.abs(allyScore - rivalScore);
        const crowdIncrease = this.clamp(scoreDiff / 2, 0, 1.5);
        this.state.enemyCrowdLevel = this.clamp((this.state.enemyCrowdLevel || 0) + crowdIncrease, 0, 6);

        let resultLabel = '引き分け';
        if (allyScore > rivalScore) {
            resultLabel = '味方クラブ勝利';
        } else if (allyScore < rivalScore) {
            resultLabel = '敵クラブ勝利';
        }

        const momentumText = this.getMatchMomentumText(resultLabel, scoreDiff);
        const summary = allyScore === rivalScore
            ? `試合は ${allyScore}-${rivalScore} の引き分け。${momentumText}`
            : `試合は ${allyScore}-${rivalScore} で ${resultLabel}。${scoreDiff}点差により敵増援圧が ${crowdIncrease} 上がった。${momentumText}`;

        const report = {
            day: this.state.currentDay,
            allyScore,
            rivalScore,
            scoreDiff,
            crowdIncrease,
            enemyCrowdLevel: this.state.enemyCrowdLevel,
            resultLabel,
            momentumText,
            summary
        };

        this.state.matchHistory.push(report);
        return report;
    }

    maybeCreateNightEncounter() {
        if (this.state.currentDay === GAME_CONSTANTS.MAX_DAYS) {
            return null;
        }
        const excludeIds = this.state.nightConversationIds && this.state.nightConversationIds.length
            ? this.state.nightConversationIds
            : [this.state.nightConversationId].filter(Boolean);
        const candidates = this.getNeutralCharacterIds(excludeIds);
        if (!candidates.length) {
            return null;
        }
        const chance = 0.2;
        return Math.random() < chance ? this.randomChoice(candidates) : null;
    }

    renderMatchReport() {
        const match = this.state.latestMatch;
        if (!match) {
            return '';
        }
        const crowdLabel = match.scoreDiff >= 3 ? '暴発寸前' : match.scoreDiff === 2 ? '危険' : match.scoreDiff === 1 ? 'ざわつき' : '膠着';
        return `
            <div class="match-report-card">
                <h3>今夜の試合結果</h3>
                <p class="match-score">味方クラブ ${match.allyScore} - ${match.rivalScore} 敵クラブ</p>
                <p><strong>判定:</strong> ${match.resultLabel}</p>
                <p><strong>街の空気:</strong> ${crowdLabel}</p>
                <p>${match.summary}</p>
                <p>累計敵増援圧: ${match.enemyCrowdLevel} / 最終決戦の敵総数に反映</p>
            </div>
        `;
    }

    renderNightRecruitEvent() {
        const characterId = this.state.nightRecruitEncounterId;
        if (!characterId) {
            return '';
        }
        const character = this.getCharacter(characterId);
        const methods = this.getRecruitmentMethods(character, 'night');
        const methodButtons = methods.map(method => `
            <button class="btn btn-method" onclick="window.game.recruitNightVisitor('${characterId}', '${method.id}')">
                <strong>${method.name}</strong><br>
                <small>${method.hint} / 成功期待値: ${method.rate}%</small>
            </button>
        `).join('');

        return `
            <div class="night-encounter-panel">
                <h3>夜の飛び入り勧誘</h3>
                <p>仲間たちとの会話が温まりきった頃、輪の外から別の人物が静かに顔を出した。ここで引き込めれば、明日の空気も最後の布陣も大きく変わる。</p>
                ${this.renderCharacterPanel(characterId, {
                    showStory: true,
                    showDialogue: true,
                    dialogueText: character.dialogue.intro,
                    extraMeta: '<p>出現種別: 夜の乱入</p><p>稀な追加勧誘チャンス</p>'
                })}
                <div class="recruitment-methods">
                    ${methodButtons}
                </div>
                <div class="choices">
                    <button class="btn btn-secondary" onclick="window.game.declineNightVisitor()">今夜は見送る</button>
                </div>
            </div>
        `;
    }

    renderNight() {
        this.prepareNightState();

        const isFinalNight = this.state.currentDay === GAME_CONSTANTS.MAX_DAYS;
        const resultPanel = this.state.nightEncounterResult
            ? `
                <div class="night-recruit-result">
                    <h3>${this.state.nightEncounterResult.success ? '夜の勧誘成功' : '夜の勧誘見送り / 失敗'}</h3>
                    <p>${this.state.nightEncounterResult.message}</p>
                    ${this.state.nightEncounterResult.characterId ? this.renderCharacterPanel(this.state.nightEncounterResult.characterId, {
                        showDialogue: true,
                        dialogueText: this.state.nightEncounterResult.quote,
                        extraMeta: `<p>夜勧誘成功率: ${this.state.nightEncounterResult.successRate}%</p><p>判定: ${this.state.nightEncounterResult.success ? '味方に加入' : '今夜は動かず'}</p>`
                    }) : ''}
                </div>
            `
            : '';

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 夜</h2>
                    <div class="status">
                        <span>仲間数: ${this.state.recruitedMembers.length}/${this.getMaxTeamSize()}</span>
                        <span>敵増援圧: ${this.state.enemyCrowdLevel}</span>
                    </div>
                </div>
                <div class="content">
                    <div class="night-scene">
                        <div class="message">
                            <p>夜だ。昼に飲み込んだ言葉が、ようやく仲間たちの口から少しずつ零れ始める。短い会話でも、その一言が隊列の温度を変える。</p>
                            <p>やがて試合結果が届き、歓声と罵声の残響が街へ流れ込む。点差が大きいほど敵の群れは膨れ上がり、最後の夜に立ちはだかる影も濃くなる。</p>
                        </div>
                        <div class="night-conversation-stack">
                            ${this.buildNightConversationPanels()}
                        </div>
                        ${this.renderMatchReport()}
                        ${this.state.nightRecruitEncounterId && !this.state.nightEncounterResolved ? this.renderNightRecruitEvent() : ''}
                        ${resultPanel}
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.${isFinalNight ? 'startFinalBattle()' : 'advanceDay()'}" ${this.state.nightRecruitEncounterId && !this.state.nightEncounterResolved ? 'disabled' : ''}>${isFinalNight ? '最終決戦へ向かう' : '次の日へ進む'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    getEncounterCandidates(locationId) {
        const location = GAME_DATA.locations[locationId];
        return this.shuffle(location.characters.filter(id => !this.state.recruitedMembers.includes(id)));
    }

    visitLocation(locationId) {
        if (this.state.dayActionTaken) {
            this.renderDay();
            return;
        }

        const location = GAME_DATA.locations[locationId];
        const candidates = this.getEncounterCandidates(locationId);
        const characterId = candidates[0] || null;

        this.state.currentLocationId = locationId;
        this.state.currentEncounterId = characterId;

        if (!characterId) {
            this.showAfternoonResult({
                characterId: null,
                success: false,
                message: `${location.name} を探ったが、今日は決定的な縁に届かなかった。人波は確かにあったのに、こちらへ足を止める者はいない。昼の一手はここで終わりだ。`,
                quote: '気配だけは濃かった。だが今日は、まだ名前を呼び合う距離じゃなかった。'
            });
            return;
        }

        this.renderRecruitmentScene(characterId, this.getCharacter(characterId), location.name);
    }

    getRecruitmentMethods(character, context = 'day') {
        const bonus = context === 'night' ? 6 : 0;
        const rates = {
            love: this.clamp(this.calculateRecruitmentChance(character, 'love') + bonus, 15, 98),
            logic: this.clamp(this.calculateRecruitmentChance(character, 'logic') + bonus, 15, 98),
            force: this.clamp(this.calculateRecruitmentChance(character, 'force') + bonus, 15, 98)
        };

        return [
            { id: 'love', name: '❤️ チームへの愛情で説得する', rate: rates.love, hint: '感情と絆で口説く' },
            { id: 'logic', name: '🧠 理屈で説得する', rate: rates.logic, hint: '目的と勝算を示す' },
            { id: 'force', name: '💪 力と迫力で押し切る', rate: rates.force, hint: '胆力と圧で引き込む' }
        ];
    }

    renderRecruitmentScene(characterId, character, locationName) {
        const methods = this.getRecruitmentMethods(character, 'day');
        const methodButtons = methods.map(method => `
            <button class="btn btn-method" onclick="window.game.recruitCharacter('${characterId}', '${method.id}')">
                <strong>${method.name}</strong><br>
                <small>${method.hint} / 成功期待値: ${method.rate}%</small>
            </button>
        `).join('');

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                    <div class="status">
                        <span>訪問先: ${locationName}</span>
                        <span>本日の行動: 1/1</span>
                    </div>
                </div>
                <div class="content">
                    <div class="recruitment-scene">
                        ${this.renderCharacterPanel(characterId, {
                            showStory: true,
                            showDialogue: true,
                            dialogueText: character.dialogue.intro,
                            extraMeta: '<p>会敵状態: まだ中立</p><p>この人物は味方にも敵にもなり得る。</p>'
                        })}
                        <div class="recruitment-choices">
                            <h4>この一度きりの接触で、どう心を揺らす？</h4>
                            <div class="message">
                                <p>相手の声色、滲む苛立ち、視線の逃げ方まで見極めろ。画像をタップすれば、表には出ない全パラメータも読み取れる。</p>
                                <p>ここで言葉を誤れば、その人物は最後の夜にこちらへ背を向け、敵の列の中から睨み返してくるかもしれない。</p>
                            </div>
                            <div class="recruitment-methods">
                                ${methodButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    calculateRecruitmentChance(character, method) {
        if (character.recruitDifficulty === 'auto') {
            return 100;
        }

        const stats = character.stats;
        let rate = 42;

        if (method === character.preferredMethod) {
            rate += 24;
        } else if (method === character.secondaryMethod) {
            rate += 12;
        }

        if (character.recruitDifficulty === 'easy') {
            rate += 10;
        } else if (character.recruitDifficulty === 'hard') {
            rate -= 12;
        }

        if (method === 'love') {
            rate += Math.round(((stats.happiness + stats.morality) - 100) / 8);
        }
        if (method === 'logic') {
            rate += Math.round((stats.education - 50) / 4);
        }
        if (method === 'force') {
            rate += Math.round((stats.strength + (100 - stats.morality) - 100) / 6);
        }

        return this.clamp(rate, 15, 95);
    }

    resolveRecruitmentAttempt(characterId, method, context = 'day') {
        const character = this.getCharacter(characterId);
        const contextBonus = context === 'night' ? 6 : 0;
        const successRate = this.clamp(this.calculateRecruitmentChance(character, method) + contextBonus, 15, 98);
        const success = Math.random() * 100 < successRate;

        let message = '';
        let quote = '';

        if (success) {
            if (!this.state.recruitedMembers.includes(characterId)) {
                this.state.recruitedMembers.push(characterId);
            }
            this.state.lastRecruitedId = characterId;
            this.state.teamMorale = this.clamp(this.state.teamMorale + (context === 'night' ? 5 : 8), 0, 100);
            this.state.teamExperience += context === 'night' ? 6 : 10;
            message = context === 'night'
                ? `${character.name} は夜の誘いに小さくうなずき、そのまま味方の輪へ歩み入った。眠っていた街の空気まで、ほんの少しこちらへ傾く。`
                : `${character.name} はお前の言葉を受け止め、ついに味方の列へ並んだ。昼の一手で掴んだのは、ただの人数ではなく確かな背中だ。`;
            quote = character.dialogue.success[method] || '……悪くない。';
        } else {
            this.state.teamMorale = this.clamp(this.state.teamMorale - (context === 'night' ? 2 : 4), 0, 100);
            this.state.teamExperience += context === 'night' ? 2 : 3;
            message = context === 'night'
                ? `${character.name} は今夜は首を縦に振らなかった。だが、交わした視線までは消えない。その沈黙自体が次の火種になる。`
                : `${character.name} は最後まで首を縦に振らなかった。今日の昼に再挑戦はできない。残った言葉の重みを抱えたまま、夜へ切り替えるしかない。`;
            quote = character.dialogue.failure[method] || '今は違う。';
        }

        return { characterId, success, message, quote, successRate };
    }

    recruitCharacter(characterId, method) {
        const result = this.resolveRecruitmentAttempt(characterId, method, 'day');
        this.showAfternoonResult(result);
    }

    recruitNightVisitor(characterId, method) {
        const result = this.resolveRecruitmentAttempt(characterId, method, 'night');
        this.state.nightEncounterResolved = true;
        this.state.nightEncounterResult = result;
        this.renderNight();
    }

    declineNightVisitor() {
        const characterId = this.state.nightRecruitEncounterId;
        const character = characterId ? this.getCharacter(characterId) : null;
        this.state.nightEncounterResolved = true;
        this.state.nightEncounterResult = {
            characterId,
            success: false,
            successRate: 0,
            message: character ? `${character.name} は夜風に紛れるように去っていった。追えば届いたかもしれないが、今夜はあえて呼び止めない。勧誘は見送りだ。` : '今夜の勧誘は見送りだ。',
            quote: character ? (character.dialogue.failure.logic || '今夜はまだ、その名前を呼ばれたくない。') : 'また今度だ。'
        };
        this.renderNight();
    }

    showAfternoonResult({ characterId = null, success = false, message, quote = '', successRate = null }) {
        this.state.dayActionTaken = true;
        this.state.currentEncounterId = null;

        const characterBlock = characterId
            ? this.renderCharacterPanel(characterId, {
                showDialogue: true,
                dialogueText: quote,
                extraMeta: `${successRate !== null ? `<p>今回の説得成功率: ${successRate}%</p>` : ''}<p>結果: ${success ? '味方に加入' : '今回は見送り'}</p>`
            })
            : '<div class="message"><p>今回は接触対象なし。</p></div>';

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                    <div class="status">
                        <span>本日の行動: 完了</span>
                        <span>次の時間帯: 夜</span>
                    </div>
                </div>
                <div class="content">
                    <div class="recruitment-result">
                        <h3>${success ? '勧誘成功' : '勧誘失敗'}</h3>
                        <p>${message}</p>
                        ${characterBlock}
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.endAfternoonAction()">夜に進む</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    endAfternoonAction() {
        this.state.currentPhase = 2;
        this.state.nightConversationIds = [];
        this.state.nightConversationId = null;
        this.state.nightPreparedDay = null;
        this.renderDay();
    }

    advancePhase() {
        this.state.currentPhase += 1;
        if (this.state.currentPhase > 2) {
            this.advanceDay();
            return;
        }
        if (this.state.currentPhase === 2) {
            this.state.nightConversationIds = [];
            this.state.nightConversationId = null;
            this.state.nightPreparedDay = null;
        }
        this.renderDay();
    }

    advanceDay() {
        this.state.currentDay += 1;
        this.state.currentPhase = 0;
        this.state.dayActionTaken = false;
        this.state.currentEncounterId = null;
        this.state.currentLocationId = null;
        this.state.nightConversationIds = [];
        this.state.nightConversationId = null;
        this.state.nightPreparedDay = null;
        this.state.nightRecruitEncounterId = null;
        this.state.nightEncounterResolved = false;
        this.state.nightEncounterResult = null;

        if (this.state.currentDay > GAME_CONSTANTS.MAX_DAYS) {
            this.startFinalBattle();
            return;
        }

        if (!this.storyBgm || this.storyBgm.paused) {
            this.startStoryBgm();
        }

        this.renderDay();
    }

    calculateSocialAttackBonus(stats) {
        return Math.round(((100 - stats.happiness) + (100 - stats.morality) + (100 - stats.education)) * 0.55);
    }

    calculateBattlePowerFromStats(stats) {
        const physicalPower = (stats.strength * 1.45) + (stats.bodyFat * 0.7);
        const socialPenaltyBoost = this.calculateSocialAttackBonus(stats);
        const assetsBoost = Math.min(stats.assets / 40, 34);
        return Math.round(physicalPower + socialPenaltyBoost + assetsBoost);
    }

    calculateCharacterPower(characterId, mode = 'ally') {
        const character = this.getCharacter(characterId);
        const basePower = this.calculateBattlePowerFromStats(character.stats);
        const skillBonus = character.skill.type === 'attack' ? 18 : 10;
        const threatBonus = mode === 'enemy' ? Math.round((character.enemyThreat || 50) * 0.45) : 0;
        return basePower + skillBonus + threatBonus;
    }

    getFrontlineAllyIds() {
        return [...this.state.recruitedMembers]
            .sort((a, b) => this.calculateCharacterPower(b, 'ally') - this.calculateCharacterPower(a, 'ally'))
            .slice(0, 3);
    }

    buildFinalEnemyLineup() {
        if (this.state.finalEnemyIds && this.state.finalEnemyIds.length) {
            return this.state.finalEnemyIds;
        }

        const available = this.getAllCharacterIds()
            .filter(id => !this.state.recruitedMembers.includes(id))
            .sort((a, b) => (this.getCharacter(b).enemyThreat || 0) - (this.getCharacter(a).enemyThreat || 0));

        const totalCount = Math.max(3, Math.min(available.length, 3 + (this.state.enemyCrowdLevel || 0)));
        this.state.finalEnemyIds = available.slice(0, totalCount);
        return this.state.finalEnemyIds;
    }

    calculateTeamPower() {
        const allyIds = this.state.recruitedMembers;
        const memberPower = allyIds.reduce((total, memberId) => total + this.calculateCharacterPower(memberId, 'ally'), 0);
        const moraleBoost = Math.round(this.state.teamMorale * 1.9);
        const unityBoost = allyIds.length * 16;
        return memberPower + moraleBoost + unityBoost;
    }

    calculateEnemyParityTuning(enemyCount = null, allyCount = null) {
        const normalizedEnemyCount = enemyCount ?? this.buildFinalEnemyLineup().length;
        const normalizedAllyCount = allyCount ?? this.state.recruitedMembers.length;
        const countGap = normalizedEnemyCount - normalizedAllyCount;

        if (countGap <= 0) {
            return {
                powerMultiplier: 0.82,
                attackMultiplier: 0.8,
                skillMeterGain: 34,
                skillTriggerChance: 0.3,
                label: '同数以下のため、敵の数的補正は大きく弱まっている'
            };
        }
        if (countGap === 1) {
            return {
                powerMultiplier: 0.89,
                attackMultiplier: 0.8,
                skillMeterGain: 40,
                skillTriggerChance: 0.36,
                label: 'ほぼ同数のため、敵の数的補正はかなり抑えられている'
            };
        }
        if (countGap === 2) {
            return {
                powerMultiplier: 0.95,
                attackMultiplier: 0.8,
                skillMeterGain: 46,
                skillTriggerChance: 0.46,
                label: '敵がやや多いが、補正は軽めに調整されている'
            };
        }
        return {
            powerMultiplier: 1,
            attackMultiplier: 0.8,
            skillMeterGain: 52,
            skillTriggerChance: 0.56,
            label: '人数差どおりの圧力が敵側に乗っている'
        };
    }

    calculateEnemyPower(enemyIds = null, allyCount = null) {
        const resolvedEnemyIds = enemyIds || this.buildFinalEnemyLineup();
        const enemyPower = resolvedEnemyIds.reduce((total, enemyId) => total + this.calculateCharacterPower(enemyId, 'enemy'), 0);
        const mobPower = 180 + ((this.state.enemyCrowdLevel || 0) * 34);
        const dayPressure = this.state.currentDay * 14;
        const tuning = this.calculateEnemyParityTuning(resolvedEnemyIds.length, allyCount ?? this.state.recruitedMembers.length);
        return Math.round((enemyPower + mobPower + dayPressure) * tuning.powerMultiplier);
    }

    renderBattleFighterCard(characterId, mode = 'ally') {
        const character = this.getCharacter(characterId);
        return `
            <div class="battle-fighter-card ${mode === 'enemy' ? 'enemy-fighter-card' : ''}">
                <button type="button" class="battle-portrait-button" onclick="window.game.openCharacterPopup('${characterId}')" aria-label="${character.name} の詳細パラメータを表示">
                    <div class="battle-portrait-frame">
                        <img src="${this.getCharacterImage(characterId)}" alt="${character.name}" class="battle-portrait ${mode === 'enemy' ? 'boss-portrait' : ''}" onerror="this.onerror=null;this.src='images/derek.jpg?v=${ASSET_VERSION}'">
                    </div>
                    <span class="image-tap-hint">画像をタップして詳細を見る</span>
                </button>
                <h4>${character.name}</h4>
                <p>${character.role}</p>
                <p><strong>必殺:</strong> ${character.skill.name}</p>
            </div>
        `;
    }

    renderBattleUnitCard(unit, mode = 'ally') {
        if (!unit) {
            return this.renderBattleEmptySlot(mode === 'enemy' ? '敵前衛' : '味方前衛');
        }

        const hpRate = unit.maxHp ? this.clamp(Math.round((unit.hp / unit.maxHp) * 100), 0, 100) : 0;
        const effectiveAttack = Math.max(0, unit.attack + unit.attackBuff - unit.attackDebuff);
        const effectiveDefense = Math.max(0, unit.defense + unit.defenseBuff);
        return `
            <div class="battle-fighter-card battle-unit-card ${unit.side === 'enemy' ? 'enemy-fighter-card' : ''} ${unit.knockedOut ? 'knocked-out-card' : ''}">
                <button type="button" class="battle-portrait-button" onclick="window.game.openCharacterPopup('${unit.id}')" aria-label="${unit.name} の詳細パラメータを表示">
                    <div class="battle-portrait-frame">
                        <img src="${this.getCharacterImage(unit.id)}" alt="${unit.name}" class="battle-portrait ${unit.side === 'enemy' ? 'boss-portrait' : ''}" onerror="this.onerror=null;this.src='images/derek.jpg?v=${ASSET_VERSION}'">
                    </div>
                    <span class="image-tap-hint">画像をタップして詳細を見る</span>
                </button>
                <h4>${unit.name}</h4>
                <p>${unit.role}</p>
                <div class="battle-hp-row">
                    <span>HP</span>
                    <strong>${Math.max(0, unit.hp)}/${unit.maxHp}</strong>
                </div>
                <div class="battle-hp-bar"><span style="width:${hpRate}%"></span></div>
                <div class="battle-unit-metrics">
                    <span>攻 ${effectiveAttack}</span>
                    <span>守 ${effectiveDefense}</span>
                    <span>技 ${Math.min(100, unit.skillMeter)}%</span>
                </div>
                <p><strong>必殺:</strong> ${unit.skillName}</p>
            </div>
        `;
    }

    renderBattleEmptySlot(label) {
        return `
            <div class="battle-fighter-card battle-empty-slot">
                <div class="battle-empty-mark">—</div>
                <p>${label}</p>
                <p>交代要員待ち</p>
            </div>
        `;
    }

    renderBattleReserveSummary(reserveUnits) {
        const names = reserveUnits
            .filter(unit => unit && !unit.knockedOut && unit.hp > 0)
            .map(unit => unit.name);
        return names.join(' / ') || 'なし';
    }

    startFinalBattle() {
        this.state.battleActive = true;
        this.state.finalBattleResult = null;
        this.state.finalBattleLog = [];
        this.state.finalBattleHighlights = [];
        this.state.finalBattleState = this.initializeFinalBattleState();
        this.startBattleBgm();
        this.renderFinalBattleScene();
    }

    initializeFinalBattleState() {
        const enemyIds = this.buildFinalEnemyLineup();
        const allyRosterIds = [...this.state.recruitedMembers]
            .sort((a, b) => this.calculateCharacterPower(b, 'ally') - this.calculateCharacterPower(a, 'ally'));
        const enemyRosterIds = [...enemyIds];
        const enemyBalanceTuning = this.calculateEnemyParityTuning(enemyIds.length, allyRosterIds.length);
        const allyUnits = allyRosterIds.map(id => this.createBattleUnit(id, 'ally'));
        const enemyUnits = enemyRosterIds.map(id => this.createBattleUnit(id, 'enemy', enemyBalanceTuning));

        return {
            enemyIds,
            bossId: enemyIds[0] || null,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(enemyIds, allyRosterIds.length),
            allyRosterIds,
            enemyRosterIds,
            enemyBalanceTuning,
            allyUnits,
            enemyUnits,
            allyActive: allyUnits.slice(0, 3),
            allyReserve: allyUnits.slice(3),
            enemyActive: enemyUnits.slice(0, 3),
            enemyReserve: enemyUnits.slice(3),
            battleLog: [],
            sceneLog: [
                '実況: 試合後の熱気がそのまま路地へ流れ込み、先発3対3は一歩も引かないまま真正面から火花を散らす。',
                '実況: 画像をタップすれば、それぞれの抱えた力と欠落をいつでも見抜ける。',
                `実況: ラストバトルBGM「${FINAL_BATTLE_BGM_TITLE}」が鳴り始め、通り全体の鼓動が乱闘のカウントを刻み出す。`
            ],
            round: 0,
            actionCount: 0,
            criticalMoments: 0,
            finished: false,
            victory: null,
            summary: '',
            turnQueue: []
        };
    }

    renderFinalBattleScene() {
        const battleState = this.state.finalBattleState || this.initializeFinalBattleState();
        this.state.finalBattleState = battleState;
        const boss = battleState.bossId ? this.getCharacter(battleState.bossId) : null;
        const allyCards = battleState.allyActive.map(unit => this.renderBattleUnitCard(unit, 'ally')).join('');
        const enemyCards = battleState.enemyActive.map(unit => this.renderBattleUnitCard(unit, unit && unit.side === 'enemy' ? 'enemy' : 'ally')).join('');
        const sceneLog = (battleState.sceneLog || ['実況: 群衆が息を呑み、次の攻防を待っている。'])
            .map(line => `<li>${line}</li>`)
            .join('');
        const recentBattleLog = (battleState.battleLog || [])
            .slice(-12)
            .map(line => `<li>${line}</li>`)
            .join('');
        const actionLabel = battleState.finished
            ? '決着を見る'
            : (battleState.actionCount === 0 ? '乱闘を始める' : '次の攻防へ');
        const matchScore = this.state.latestMatch
            ? `${this.state.latestMatch.allyScore}-${this.state.latestMatch.rivalScore}`
            : '未計測';
        const allyRemaining = this.countLivingBattleUnits(battleState.allyActive, battleState.allyReserve);
        const enemyRemaining = this.countLivingBattleUnits(battleState.enemyActive, battleState.enemyReserve);
        const currentEnemyTuning = this.getCurrentEnemyBattleTuning(battleState);
        const turnBanner = battleState.finished
            ? (battleState.victory ? '決着: 味方が押し切った' : '決着: 敵の圧力に飲まれた')
            : (battleState.actionCount > 0 ? `${battleState.actionCount}回目の攻防 / 第${Math.max(1, battleState.round)}ラウンド` : '開戦前');
        const bgmStatusLabel = this.state.finalBattleBgmBlocked
            ? 'BGMはブラウザ制限で停止中。攻防ボタンでもう一度再生を試みる。'
            : `ラストバトルBGM: ${FINAL_BATTLE_BGM_TITLE}`;
        const enemyBalanceNote = `${currentEnemyTuning.label}。敵必殺の発動率は ${Math.round(currentEnemyTuning.skillTriggerChance * 100)}% に抑えられている。`;
        const showBattleNarrative = battleState.actionCount === 0 && !battleState.finished;
        const battleLiveGridStyle = showBattleNarrative ? '' : 'style="grid-template-columns: minmax(0, 1fr);"';

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>最終決戦 3対3チームバトル</h2>
                    <div class="status">
                        <span>味方残存: ${allyRemaining}</span>
                        <span>敵残存: ${enemyRemaining}</span>
                        <span>クリティカル: ${battleState.criticalMoments}</span>
                    </div>
                </div>
                <div class="content">
                    <div class="battle-scene cinematic-battle live-battle-scene">
                        <div class="battle-turn-banner">${turnBanner}</div>
                        <h3>試合後の街はついに決壊し、3対3の先発乱闘が火蓋を切る</h3>
                        <div class="battle-lineup">
                            <div class="battle-side ally-side">
                                <h4>味方先発3人</h4>
                                <div class="battle-fighter-grid">
                                    ${allyCards || this.renderBattleEmptySlot('味方前衛')}
                                </div>
                                <p>控え: ${this.renderBattleReserveSummary(battleState.allyReserve)}</p>
                            </div>
                            <div class="battle-versus">激突</div>
                            <div class="battle-side enemy-side">
                                <h4>敵先発3人</h4>
                                <div class="battle-fighter-grid">
                                    ${enemyCards || this.renderBattleEmptySlot('敵前衛')}
                                </div>
                                <p>敵増援: ${this.renderBattleReserveSummary(battleState.enemyReserve)}</p>
                            </div>
                        </div>
                        <div class="battle-live-grid" ${battleLiveGridStyle}>
                            ${showBattleNarrative ? `
                            <div class="battle-info battle-narrative">
                                <p>今夜の試合結果は ${matchScore}。その点差に煽られた群衆が雪崩れ込み、敵の総数は ${battleState.enemyIds.length} 人まで膨れ上がっている。</p>
                                <p><strong>${bgmStatusLabel}</strong></p>
                                <p>${boss ? `${boss.name} が前線で喉を震わせる。${boss.dialogue.enemy}` : '敵チームの前線が無言のまま間合いを詰め、靴底だけが地面を鳴らしている。'}</p>
                                <p>${battleState.finished ? battleState.summary : 'ボタンを押すたびに、一手ごとの攻防と実況が積み上がる。倒れた者は即座に交代し、ごく稀に流れそのものをひっくり返すクリティカルヒットが炸裂する。'}</p>
                                <p>初期戦力比較: 味方 ${battleState.playerPower} / 敵 ${battleState.enemyPower}</p>
                                <p>${enemyBalanceNote}</p>
                            </div>
                            ` : ''}
                            <div class="battle-live-side">
                                <div class="choices battle-advance-choices">
                                    <button class="btn btn-primary" onclick="window.game.advanceFinalBattle()">${actionLabel}</button>
                                </div>
                                <div class="battle-live-panel">
                                    <h4>直近の実況</h4>
                                    <ul class="battle-live-list">
                                        ${sceneLog}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="battle-log-panel">
                            <h4>${battleState.finished ? '最終決戦ログ' : '累積実況ログ'}</h4>
                            <ul class="battle-log-list">
                                ${recentBattleLog || '<li>まだ乱闘は始まっていない。</li>'}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    resolveBattle() {
        this.advanceFinalBattle();
    }

    advanceFinalBattle() {
        const battleState = this.state.finalBattleState || this.initializeFinalBattleState();
        this.state.finalBattleState = battleState;
        this.startBattleBgm();

        if (battleState.finished) {
            this.showEnding();
            return;
        }

        const sceneLog = [];

        if (!battleState.turnQueue.length) {
            battleState.round += 1;
            battleState.turnQueue = this.buildBattleTurnQueue(battleState.allyActive, battleState.enemyActive);
            this.recordBattleLog(battleState, sceneLog, `実況: 第${battleState.round}ラウンド。肩と肩がぶつかり、誰も退かないまま前線だけが半歩ずつ地獄へ近づく。`);
        }

        const firstActor = this.pullNextBattleUnit(battleState.turnQueue);
        if (firstActor) {
            this.executeBattleTurn(firstActor, battleState, sceneLog);
        }

        if (!this.isFinalBattleFinished(battleState)) {
            const counterActor = this.pullNextBattleUnit(
                battleState.turnQueue,
                firstActor && firstActor.side === 'ally' ? 'enemy' : 'ally'
            );
            if (counterActor) {
                this.executeBattleTurn(counterActor, battleState, sceneLog);
            }
        }

        battleState.turnQueue = battleState.turnQueue.filter(unit => unit && !unit.knockedOut && unit.hp > 0);

        if (!battleState.turnQueue.length && !this.isFinalBattleFinished(battleState)) {
            this.decayBattleEffects([...battleState.allyActive, ...battleState.enemyActive]);
            this.fillVacancies(battleState.allyActive, battleState.allyReserve, '味方', battleState, sceneLog);
            this.fillVacancies(battleState.enemyActive, battleState.enemyReserve, '敵', battleState, sceneLog);
            this.recordBattleLog(battleState, sceneLog, `実況: 第${battleState.round}ラウンド終了。両陣営とも息を荒げ、次の激突へ備える。`);
        }

        battleState.actionCount += 1;
        battleState.sceneLog = sceneLog.length ? sceneLog : ['実況: 一瞬の間が生まれ、誰もが次の突撃をうかがっている。'];

        if (this.isFinalBattleFinished(battleState) || (battleState.round >= 18 && !battleState.turnQueue.length)) {
            this.finalizeFinalBattleState(battleState);
        }

        this.renderFinalBattleScene();
    }

    buildBattleTurnQueue(allyActive, enemyActive) {
        return this.getLivingUnits([...allyActive, ...enemyActive])
            .sort((a, b) => (b.initiative + Math.random() * 12) - (a.initiative + Math.random() * 12));
    }

    pullNextBattleUnit(queue, preferredSide = null) {
        if (!queue || !queue.length) {
            return null;
        }

        let index = -1;
        if (preferredSide) {
            index = queue.findIndex(unit => unit && unit.side === preferredSide && !unit.knockedOut && unit.hp > 0);
        }
        if (index === -1) {
            index = queue.findIndex(unit => unit && !unit.knockedOut && unit.hp > 0);
        }
        if (index === -1) {
            return null;
        }
        return queue.splice(index, 1)[0];
    }

    countLivingBattleUnits(activeUnits, reserveUnits) {
        return [...activeUnits, ...reserveUnits].filter(unit => unit && !unit.knockedOut && unit.hp > 0).length;
    }

    getCurrentEnemyBattleTuning(battleState) {
        return this.calculateEnemyParityTuning(
            this.countLivingBattleUnits(battleState.enemyActive, battleState.enemyReserve),
            this.countLivingBattleUnits(battleState.allyActive, battleState.allyReserve)
        );
    }

    isFinalBattleFinished(battleState) {
        return this.countLivingBattleUnits(battleState.allyActive, battleState.allyReserve) === 0
            || this.countLivingBattleUnits(battleState.enemyActive, battleState.enemyReserve) === 0;
    }

    recordBattleLog(battleState, sceneLog, message) {
        battleState.battleLog.push(message);
        sceneLog.push(message);
    }

    createBattleUnit(characterId, side = 'ally', tuning = null) {
        const character = this.getCharacter(characterId);
        const basePower = this.calculateCharacterPower(characterId, side);
        const sidePowerMultiplier = side === 'enemy' ? (tuning?.powerMultiplier || 1) : 1;
        const attackMultiplier = side === 'enemy'
            ? sidePowerMultiplier * (tuning?.attackMultiplier || 1)
            : 1;
        const baseHp = 120 + (character.stats.strength * 1.7) + (character.stats.bodyFat * 1.1);
        return {
            id: characterId,
            side,
            name: character.name,
            role: character.role,
            skillName: character.skill.name,
            skillType: character.skill.type,
            skillDescription: character.skill.description,
            maxHp: Math.round(baseHp * sidePowerMultiplier),
            hp: Math.round(baseHp * sidePowerMultiplier),
            attack: Math.max(14, Math.round(basePower * 0.36 * attackMultiplier)),
            defense: Math.max(10, Math.round(((character.stats.bodyFat * 0.65) + (character.stats.education * 0.18) + (character.skill.type === 'defense' ? 16 : 0)) * sidePowerMultiplier)),
            initiative: character.stats.happiness + (character.stats.education * 0.4) + (character.skill.type === 'attack' ? 10 : 0),
            attackBuff: 0,
            defenseBuff: 0,
            attackDebuff: 0,
            skillMeter: 0,
            knockedOut: false,
            criticalHits: 0
        };
    }

    getLivingUnits(units) {
        return units.filter(unit => unit && !unit.knockedOut && unit.hp > 0);
    }

    getLowestHpUnit(units) {
        const living = this.getLivingUnits(units);
        return living.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0] || null;
    }

    getRandomTarget(units) {
        const living = this.getLivingUnits(units);
        return this.randomChoice(living);
    }

    rollCriticalHit() {
        return Math.random() < 0.01;
    }

    applyDamage(attacker, target, rawDamage, options = {}) {
        if (!target) {
            return { damage: 0, knockedOut: false };
        }
        const defenseValue = options.ignoreDefense
            ? Math.round((target.defense + target.defenseBuff) * 0.16)
            : Math.round((target.defense + target.defenseBuff) * 0.32);
        const mitigated = Math.max(16, Math.round((rawDamage - defenseValue) * 2));
        target.hp = Math.max(0, target.hp - mitigated);
        const knockedOut = target.hp <= 0 && !target.knockedOut;
        if (knockedOut) {
            target.knockedOut = true;
        }
        return { damage: mitigated, knockedOut };
    }

    fillVacancies(activeUnits, reserveUnits, sideLabel, battleState, sceneLog) {
        for (let i = 0; i < activeUnits.length; i += 1) {
            const unit = activeUnits[i];
            if (!unit || unit.knockedOut || unit.hp <= 0) {
                const substitute = reserveUnits.shift() || null;
                activeUnits[i] = substitute;
                if (substitute) {
                    this.recordBattleLog(battleState, sceneLog, `実況: ${sideLabel}交代。${substitute.name} が雪崩れ込むように前線へ飛び出した。`);
                }
            }
        }
    }

    decayBattleEffects(units) {
        units.forEach(unit => {
            if (!unit) {
                return;
            }
            unit.attackBuff = Math.max(0, unit.attackBuff - 5);
            unit.defenseBuff = Math.max(0, unit.defenseBuff - 5);
            unit.attackDebuff = Math.max(0, unit.attackDebuff - 4);
        });
    }

    performBasicAttack(unit, enemies, battleState, sceneLog) {
        const target = this.getRandomTarget(enemies);
        if (!target) {
            return;
        }

        const isCritical = this.rollCriticalHit();
        const rawDamage = Math.round(((unit.attack + unit.attackBuff - unit.attackDebuff) * (0.92 + Math.random() * 0.36)) + (unit.initiative * 0.08));
        const adjustedDamage = isCritical ? Math.round(rawDamage * 2.25) : rawDamage;
        const outcome = this.applyDamage(unit, target, adjustedDamage, { ignoreDefense: isCritical });

        if (isCritical) {
            unit.criticalHits += 1;
            battleState.criticalMoments += 1;
            this.recordBattleLog(
                battleState,
                sceneLog,
                `実況: ${unit.name} の一撃が完璧な角度で突き刺さった。クリティカルヒット！ ${target.name} に ${outcome.damage} ダメージ。${outcome.knockedOut ? ` ${target.name} は声もなくその場に崩れ落ちた。` : ''}`
            );
            return;
        }

        this.recordBattleLog(
            battleState,
            sceneLog,
            `実況: ${unit.name} が息を殺して踏み込み、${target.name} を打ち抜く。${outcome.damage} ダメージ。${outcome.knockedOut ? `${target.name} は前線で膝をつき、ついに視線を落とした。` : 'それでもまだ踏みとどまる。'}`
        );
    }

    performSkillAction(unit, allies, enemies, battleState, sceneLog) {
        const livingAllies = this.getLivingUnits(allies);
        const livingEnemies = this.getLivingUnits(enemies);
        const effectiveAttack = Math.max(12, unit.attack + unit.attackBuff - unit.attackDebuff);

        if (unit.skillType === 'attack') {
            const targets = /全体|2連撃/.test(unit.skillDescription) && livingEnemies.length > 1
                ? livingEnemies.slice(0, 3)
                : [livingEnemies.sort((a, b) => a.hp - b.hp)[0]];

            targets.forEach(target => {
                if (!target) {
                    return;
                }
                const isCritical = this.rollCriticalHit();
                const rawDamage = targets.length > 1 ? Math.round(effectiveAttack * 0.9) : Math.round(effectiveAttack * 1.65);
                const outcome = this.applyDamage(unit, target, isCritical ? Math.round(rawDamage * 2.1) : rawDamage, { ignoreDefense: isCritical });
                if (isCritical) {
                    unit.criticalHits += 1;
                    battleState.criticalMoments += 1;
                    this.recordBattleLog(
                        battleState,
                        sceneLog,
                        `実況: ${unit.name} の ${unit.skillName} が炸裂。しかもクリティカル！ ${target.name} に ${outcome.damage} ダメージ。${outcome.knockedOut ? ` ${target.name} は吹き飛ばされた。` : ''}`
                    );
                } else {
                    this.recordBattleLog(
                        battleState,
                        sceneLog,
                        `実況: ${unit.name} の ${unit.skillName}。${target.name} に ${outcome.damage} ダメージ。${outcome.knockedOut ? `${target.name} は耐え切れない。` : '隊列が大きく揺らぐ。'}`
                    );
                }
            });
            return;
        }

        if (unit.skillType === 'heal') {
            const target = this.getLowestHpUnit(allies) || unit;
            const healAmount = Math.round((target.maxHp * 0.28) + (effectiveAttack * 0.2));
            target.hp = Math.min(target.maxHp, target.hp + healAmount);
            livingAllies.forEach(ally => {
                ally.attackBuff += 4;
            });
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。${target.name} を ${healAmount} 回復し、崩れかけた味方前線へもう一度立ち上がる理由を注ぎ込む。`);
            return;
        }

        if (unit.skillType === 'buff') {
            livingAllies.forEach(ally => {
                ally.attackBuff += 14;
                ally.defenseBuff += 8;
            });
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。味方全体の肩が上がり、押し込みの圧が目に見えて一段増した。`);
            return;
        }

        if (unit.skillType === 'defense') {
            livingAllies.forEach(ally => {
                ally.defenseBuff += 16;
            });
            const target = this.getRandomTarget(enemies);
            if (target) {
                target.attackDebuff += 10;
            }
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。味方の守りは一枚岩のように締まり、敵の踏み込みが露骨に鈍る。`);
            return;
        }

        if (unit.skillType === 'debuff') {
            livingEnemies.forEach(enemy => {
                enemy.attackDebuff += 12;
                enemy.defenseBuff = Math.max(0, enemy.defenseBuff - 8);
            });
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。敵陣の呼吸が乱れ、揃っていた隊列が見る間にばらけていく。`);
            return;
        }

        this.performBasicAttack(unit, enemies, battleState, sceneLog);
    }

    executeBattleTurn(unit, battleState, sceneLog) {
        const isAlly = unit.side === 'ally';
        const ownActive = isAlly ? battleState.allyActive : battleState.enemyActive;
        const enemyLine = isAlly ? battleState.enemyActive : battleState.allyActive;
        const ownReserve = isAlly ? battleState.allyReserve : battleState.enemyReserve;

        if (unit.knockedOut || unit.hp <= 0 || !this.getLivingUnits(enemyLine).length) {
            return;
        }

        const enemyTuning = this.getCurrentEnemyBattleTuning(battleState);
        unit.skillMeter += isAlly ? 55 : enemyTuning.skillMeterGain;
        const skillReady = unit.skillMeter >= 100;
        let useSkill = skillReady;
        let enemySkillSuppressed = false;

        if (!isAlly && skillReady && Math.random() > enemyTuning.skillTriggerChance) {
            useSkill = false;
            enemySkillSuppressed = true;
        }

        this.recordBattleLog(
            battleState,
            sceneLog,
            `実況: ${unit.name} が前へ出る。${useSkill ? '空気が変わる。必殺の間合いだ。' : enemySkillSuppressed ? '必殺の構えに入ったが、味方の圧と視線が踏み込みを鈍らせた。' : '拳と体重、覚悟まで乗せて踏み込む。'}`
        );

        if (useSkill) {
            unit.skillMeter = 0;
            this.performSkillAction(unit, ownActive, enemyLine, battleState, sceneLog);
        } else {
            if (!isAlly && enemySkillSuppressed) {
                unit.skillMeter = 72;
            }
            this.performBasicAttack(unit, enemyLine, battleState, sceneLog);
        }

        this.fillVacancies(enemyLine, isAlly ? battleState.enemyReserve : battleState.allyReserve, isAlly ? '敵' : '味方', battleState, sceneLog);
        this.fillVacancies(ownActive, ownReserve, isAlly ? '味方' : '敵', battleState, sceneLog);
    }

    finalizeFinalBattleState(battleState) {
        const allyRemainingUnits = [...battleState.allyActive, ...battleState.allyReserve].filter(unit => unit && !unit.knockedOut && unit.hp > 0);
        const enemyRemainingUnits = [...battleState.enemyActive, ...battleState.enemyReserve].filter(unit => unit && !unit.knockedOut && unit.hp > 0);
        let victory = false;

        if (!enemyRemainingUnits.length && allyRemainingUnits.length) {
            victory = true;
        } else if (!allyRemainingUnits.length && enemyRemainingUnits.length) {
            victory = false;
        } else {
            const allyHp = allyRemainingUnits.reduce((sum, unit) => sum + unit.hp, 0);
            const enemyHp = enemyRemainingUnits.reduce((sum, unit) => sum + unit.hp, 0);
            victory = allyHp >= enemyHp;
        }

        const boss = battleState.bossId ? this.getCharacter(battleState.bossId) : null;
        const aceUnit = [...battleState.allyUnits].sort((a, b) => (b.criticalHits || 0) - (a.criticalHits || 0) || b.attack - a.attack)[0] || null;
        const criticalText = battleState.criticalMoments > 0
            ? ` 乱戦の中ではクリティカルが ${battleState.criticalMoments} 回炸裂し、歓声が一気に傾いた。`
            : '';
        const battleSummary = victory
            ? `${aceUnit ? aceUnit.name : '味方前線'} が最後の押し込みを通し、${boss ? boss.name : '敵前線'} 側の隊列を真っ二つに裂いた。背中を預け合って積み上げた一手一手が、ついに街の流れそのものをひっくり返した。${criticalText}`
            : `${boss ? boss.name : '敵前線'} 側の圧力と増援に押し切られた。交代を重ねても前線を取り戻せず、最後は人数差と疲弊がじわじわと響いた。だが倒れたあとにも、仲間たちの視線はまだ次の朝を探していた。${criticalText}`;

        battleState.finished = true;
        battleState.victory = victory;
        battleState.summary = battleSummary;
        if (victory) {
            this.playHistory.recordClear();
        } else {
            this.playHistory.recordDefeat();
        }
        battleState.sceneLog = [
            victory
                ? '実況: 最後の押し合いを制し、味方が乱闘の流れそのものをひっくり返した。'
                : '実況: 最後の踏ん張りも及ばず、敵の圧が前線をのみ込み、夜の勝敗を刻みつけた。',
            `実況: 総攻防回数は ${battleState.actionCount} 回。決着まで一手ずつ積み上げた。`
        ];

        this.state.finalBattleLog = battleState.battleLog;
        this.state.finalBattleHighlights = battleState.battleLog.slice(-18);
        this.state.finalBattleResult = {
            victory,
            playerPower: battleState.playerPower,
            enemyPower: battleState.enemyPower,
            battleSummary,
            bossId: battleState.bossId,
            enemyIds: battleState.enemyIds,
            aceId: aceUnit ? aceUnit.id : null,
            rounds: battleState.round,
            actionCount: battleState.actionCount,
            criticalMoments: battleState.criticalMoments,
            allyRosterIds: battleState.allyRosterIds,
            enemyRosterIds: battleState.enemyRosterIds,
            allyRemaining: allyRemainingUnits.length,
            enemyRemaining: enemyRemainingUnits.length
        };
        this.state.finalBattleState = battleState;
    }

    showEnding() {
        this.state.battleActive = false;
        this.stopBattleBgm({ reset: false });
        const recruitedCount = this.state.recruitedMembers.length;
        const result = this.state.finalBattleResult || {
            victory: false,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(),
            battleSummary: '最後の乱戦はまだ記録されていない。',
            bossId: null,
            enemyIds: [],
            actionCount: 0,
            criticalMoments: 0,
            aceId: null,
            allyRemaining: 0,
            enemyRemaining: 0
        };
        const boss = result.bossId ? this.getCharacter(result.bossId) : null;
        const ace = result.aceId ? this.getCharacter(result.aceId) : null;
        const anchorMember = this.state.recruitedMembers[0] ? this.getCharacter(this.state.recruitedMembers[0]) : null;

        let endingTitle = '';
        let endingText = '';

        if (result.victory && recruitedCount >= 8) {
            endingTitle = '夜明け奪還エンド';
            endingText = '昼に差し出した手も、夜更けに交わした本音も、最後には街そのものの呼吸を変えた。勝利の朝焼けの中で、もう誰ひとり孤立していなかった。';
        } else if (result.victory) {
            endingTitle = '薄明の勝利エンド';
            endingText = '倒れかけるたびに誰かが肩を貸し、誰かが叫び、誰かが前へ出た。一手ずつつないだ未来の先にあったのは、傷だらけでも確かな勝利だった。';
        } else if (recruitedCount >= 5) {
            endingTitle = '再起の誓いエンド';
            endingText = '今夜は押し切れなかった。それでも最後まで手を離さなかった仲間たちの背中には、敗北よりも強い火が残った。その火は、次の夜明けを必ず呼び寄せる。';
        } else {
            endingTitle = '残り火エンド';
            endingText = '人数は足りず、前線も耐え切れなかった。それでも路地裏に残った悔しさは消えない。潰えきらなかったその残り火が、いつか次の反撃の導火線になる。';
        }

        const enemySummary = result.enemyIds.map(id => this.getCharacter(id).name).join(' / ');
        const battleHighlights = (this.state.finalBattleHighlights || []).map(line => `<li>${line}</li>`).join('');
        const cutsceneScenes = [
            {
                label: 'CUT 1',
                title: '試合後の静寂',
                text: result.victory
                    ? '怒号が引いた路地に、荒い息と遠ざかるサイレンだけが残る。倒れた看板の向こうで、仲間たちは勝利の重さをようやく自分の骨で理解し始める。'
                    : '怒号が遠のいたあと、路地には靴音と息遣いだけが残る。敗北の重さは確かにある。それでも、誰も地面に顔を伏せたまま終わろうとはしなかった。',
                quote: result.victory
                    ? '「終わったんじゃない。俺たちは、ここから街を取り戻していくんだ」'
                    : '「まだ終わってない。次に立つ時は、今日より少しでも前へ出る」'
            },
            {
                label: 'CUT 2',
                title: '差し出された手',
                text: result.victory
                    ? `${ace ? ace.name : '先頭に立った仲間'} が最初に手を差し出す。その手を、倒れかけた仲間がひとりずつ握り返し、ばらばらだった輪はようやく本当のチームの形を手に入れる。`
                    : `${anchorMember ? anchorMember.name : '仲間たち'} は倒れた者を肩で支え合う。勝てなかった夜でも、誰ひとり置いていかないという約束だけは、むしろ前より強く固まっていく。`,
                quote: result.victory
                    ? '「今日ここにいた全員で勝ったんだ。誰かひとりの武勇じゃない」'
                    : '「負けても仲間は減らさない。それが次の勝ち筋になる」'
            },
            {
                label: 'CUT 3',
                title: '朝焼けの約束',
                text: result.victory
                    ? `${boss ? boss.name : '敵の前線'} がいた方角を見つめながら、誰かが小さく笑う。悲鳴も歓声も消えたあとの街に、ようやく人が人として話す声が戻ってくる。`
                    : `${boss ? boss.name : '敵の前線'} が去った通りを見つめながら、誰かが拳を握り直す。夜はまだ明けきらない。それでも次の一日を諦める空気だけは、もうどこにも残っていない。`,
                quote: result.victory
                    ? '「また昼が来る。その時はもう、誰もひとりで歩かせない」'
                    : '「次の朝は、今日より多い仲間で迎える。絶対に」'
            }
        ];
        const cutsceneHtml = cutsceneScenes.map((scene, index) => `
            <article class="ending-scene-card ending-scene-${index + 1}">
                <span class="ending-scene-label">${scene.label}</span>
                <h4>${scene.title}</h4>
                <p>${scene.text}</p>
                <p class="ending-scene-quote">${scene.quote}</p>
            </article>
        `).join('');
        const victoryEndingVideoHtml = result.victory ? `
            <section class="ending-video-panel">
                <div class="ending-video-copy">
                    <span class="ending-video-kicker">Victory Ending Movie</span>
                    <h4>歓喜の勝利</h4>
                    <p>乱戦をくぐり抜けた夜の熱狂を、約30秒の勝利エンディング映像として再生できます。</p>
                    <p id="ending-video-autoplay-note" class="ending-video-note">読み込み後に自動再生を試みます。再生が止まる場合はプレーヤーの再生ボタンを押してください。</p>
                </div>
                <video id="victory-ending-video" class="ending-video-player" controls playsinline preload="metadata">
                    <source src="${this.getVictoryEndingVideoSrc()}" type="video/mp4">
                    お使いのブラウザは動画再生に対応していません。
                </video>
            </section>
        ` : '';

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>ゲーム終了</h2>
                </div>
                <div class="content">
                    <div class="ending cinematic-ending emotional-ending">
                        <div class="ending-kicker">Final Cutscene</div>
                        <h3>${endingTitle}</h3>
                        <p class="ending-lead">${endingText}</p>
                        <p>${result.battleSummary}</p>
                        <p class="ending-bgm-credit"><strong>ラストバトルBGM:</strong> <a href="https://suno.com/s/pdLMR2MzXY7GQPnv" target="_blank" rel="noopener noreferrer">${FINAL_BATTLE_BGM_TITLE}</a></p>
                        ${victoryEndingVideoHtml}
                        <div class="ending-filmstrip">
                            ${cutsceneHtml}
                        </div>
                        <div class="ending-summary-grid">
                            <div class="ending-summary-card"><strong>最終戦力</strong><span>味方 ${result.playerPower} / 敵 ${result.enemyPower}</span></div>
                            <div class="ending-summary-card"><strong>最終仲間数</strong><span>${recruitedCount}/${this.getMaxTeamSize()}</span></div>
                            <div class="ending-summary-card"><strong>試合で膨らんだ敵総数</strong><span>${result.enemyIds.length}人</span></div>
                            <div class="ending-summary-card"><strong>最終敵ボス</strong><span>${boss ? boss.name : '不明'}</span></div>
                            <div class="ending-summary-card"><strong>攻防回数</strong><span>${result.actionCount}回</span></div>
                            <div class="ending-summary-card"><strong>クリティカル</strong><span>${result.criticalMoments}回</span></div>
                        </div>
                        <p>敵前線と増援: ${enemySummary || '未確定'}</p>
                        <div class="battle-log-panel">
                            <h4>最終決戦ハイライト</h4>
                            <ul class="battle-log-list">
                                ${battleHighlights || '<li>戦闘ログなし</li>'}
                            </ul>
                        </div>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        if (result.victory) {
            const endingVideo = document.getElementById('victory-ending-video');
            const autoplayNote = document.getElementById('ending-video-autoplay-note');

            if (endingVideo) {
                endingVideo.currentTime = 0;
                const autoplayPromise = endingVideo.play();

                if (autoplayPromise && typeof autoplayPromise.then === 'function') {
                    autoplayPromise.then(() => {
                        if (autoplayNote) {
                            autoplayNote.textContent = '勝利エンディング映像を再生中です。音量はプレーヤーから調整できます。';
                        }
                    }).catch(() => {
                        if (autoplayNote) {
                            autoplayNote.textContent = 'ブラウザの仕様で自動再生が止まる場合があります。再生ボタンを押すと音声付きで再生できます。';
                        }
                    });
                }
            }
        }
    }

    showGameInfo() {
        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>ゲームについて</h2>
                </div>
                <div class="content">
                    <div class="game-info">
                        <h3>ゲーム概要</h3>
                        <p>7日間で仲間を増やし、夜ごとに本音を拾い、試合結果で膨れ上がる街の熱をくぐり抜け、最後は一手ずつ進む3対3の交代制乱戦へ挑む物語だ。</p>
                        <h3>昼の行動ルール</h3>
                        <p>昼の行動は1日1回のみ。場所を選ぶと、その場に縁のある候補者の中から誰か1人がランダムに現れ、その一度きりの対話で運命が分かれる。</p>
                        <h3>夜の会話と追加勧誘</h3>
                        <p>夜は複数の仲間との会話が発生し、彼らの本音や覚悟が少しずつ見えてくる。稀に別のキャラクターが乱入し、運命を変える追加勧誘へつながることもある。</p>
                        <h3>サッカー試合</h3>
                        <p>毎夜、試合結果が表示される。どちらが勝ったか、どれほど差がついたか、その余熱までもが街に流れ込み、点差が大きいほど敵人数は増えていく。</p>
                        <h3>最終決戦</h3>
                        <p>最終戦は3対3のチームバトル。ボタンを押すごとに攻防が進み、実況描写の中で通常攻撃・必殺技・交代が一手ずつ積み上がる。ごく稀にクリティカルヒットが炸裂し、流れそのものをひっくり返す。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    showHelp() {
        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>ヘルプ</h2>
                </div>
                <div class="content">
                    <div class="help-content">
                        <h3>ゲームの目的</h3>
                        <p>7日間でできるだけ多くの人物を味方へ引き込み、昼の縁と夜の対話を積み重ねながら、試合後に膨れ上がる敵集団を3対3の交代乱戦で押し返すことが目的だ。</p>
                        <h3>1日の流れ</h3>
                        <p>1. 朝: 状況確認</p>
                        <p>2. 昼: 1回だけ訪問し、ランダムに現れた人物の心を揺らして勧誘</p>
                        <p>3. 夜: 仲間たちと会話して本音を拾い、試合結果を確認。稀に別人物を追加勧誘</p>
                        <h3>勧誘時の表示</h3>
                        <p>画像が表示される場面では、画像をタップすると筋力・体脂肪・幸福度・モラル・学力・資産がポップアップで表示される。見た目だけでは読めない相手の輪郭を、そこで掴める。</p>
                        <h3>スクロール</h3>
                        <p>ページが切り替わるたび、表示位置は自動的に一番上へ戻る。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}

let game;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        game = new GoGoHooligan();
        window.game = game;
        window.__checkTitleBgmState = () => game.checkTitleBgmState();
    });
} else {
    game = new GoGoHooligan();
    window.game = game;
    window.__checkTitleBgmState = () => game.checkTitleBgmState();
}
