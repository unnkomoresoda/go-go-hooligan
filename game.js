const TITLE_NAME = '乱暴！怒りのフーリガン！';
const TITLE_SUBTITLE = 'Rampage! Furious Hooligans!';

class GoGoHooligan {
    constructor() {
        this.gameScreen = document.getElementById('game-screen');
        this.resetState();
        this.init();
    }

    resetState() {
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
    }

    init() {
        document.title = TITLE_NAME;
        this.renderTitle();
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
        this.gameScreen.innerHTML = html;
        this.scrollToTop();
    }

    startGame() {
        this.resetState();
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
                <p class="tagline">昼の一手、夜の会話、試合の点差が、最後の3対3乱闘を決める。</p>
                <div class="buttons">
                    <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                    <button class="btn btn-secondary" onclick="window.game.showHelp()">ヘルプ</button>
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
                        <p>朝日が昇った。街は試合前から騒がしく、誰が味方で誰が敵になるかはまだ決まっていない。</p>
                        <p>Derek が告げる。昼に使える行動は一度きり。夜は仲間たちと話し、稀に別の顔が現れて新たな勧誘の機会にもなる。</p>
                        <p>さらに夜には試合結果が出る。勝敗と点差は群衆の熱量を左右し、最後の敵人数すら増減させる。</p>
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
                <p>新しい一日が始まった。昼に動けるのは一度だけだ。</p>
                <p>${lastRecruit ? `${lastRecruit.name} を引き入れたことで夜の空気が変わった。` : '昨夜の会話と試合の熱がまだ残っている。'}</p>
                <p>今日誰を味方にするかで、夜の会話と最終決戦の顔ぶれはまた変わる。</p>
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
                    <p>今日の昼の行動はもう終わった。これ以上の接触はできない。</p>
                    <p>夜になれば仲間たちとの会話が始まり、稀に別の人物が割り込んでくることもある。</p>
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
                <p>昼だ。動けるのは1回だけ。訪問先を決めると、その場所にいる誰かがランダムに現れる。</p>
                <p>現れた人物は味方にも敵にもなり得る。画像をタップすれば、全パラメータがポップアップで確認できる。</p>
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
            return '互いの怒りだけが残り、路地裏の空気は重く沈んだ。';
        }
        if (scoreDiff >= 3) {
            return '大差の決着が街を火薬庫に変え、敵側の過激派が一気に膨れ上がる。';
        }
        if (scoreDiff === 2) {
            return 'はっきりした差がつき、敵の群れは勝敗を口実に勢いを増した。';
        }
        return '僅差でも火種は十分だ。勝敗の余熱が敵の数をじわりと押し上げる。';
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
        const crowdIncrease = this.clamp(scoreDiff, 0, 3);
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
                <p>仲間たちとの会話の最中、別の人物が顔を出した。ここで引き込めれば、明日の空気が変わる。</p>
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
                            <p>夜だ。昼の一手は終わり、仲間たちがそれぞれ短く本音を漏らす。</p>
                            <p>その後には試合結果が届き、点差が大きいほど敵の群れは膨れ上がる。</p>
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
                message: `${location.name} を探ったが、今日は有力な人物を見つけられなかった。昼の一手はここで終わりだ。`,
                quote: '人の流れはあったが、こちらを向く視線はなかった。'
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
                            <h4>この一度きりの接触でどう口説く？</h4>
                            <div class="message">
                                <p>文字だけでなく、相手本人のセリフと表情を見たうえで、画像タップから全パラメータも確認できる。</p>
                                <p>説得に失敗すれば、その人物は最後の夜に敵側へ回る可能性が高まる。</p>
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
                ? `${character.name} は夜の誘いに応じ、そのまま味方へ加わった。眠っていた街の空気が一段こちらへ傾く。`
                : `${character.name} はお前の誘いに応じ、味方として列へ加わった。昼の一手は成功だ。`;
            quote = character.dialogue.success[method] || '……悪くない。';
        } else {
            this.state.teamMorale = this.clamp(this.state.teamMorale - (context === 'night' ? 2 : 4), 0, 100);
            this.state.teamExperience += context === 'night' ? 2 : 3;
            message = context === 'night'
                ? `${character.name} は今夜は首を縦に振らなかった。だが、会えたこと自体が次の火種になる。`
                : `${character.name} は今回は首を縦に振らなかった。今日の昼に再挑戦はできない。夜へ切り替えるしかない。`;
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
            message: character ? `${character.name} は夜風に紛れて去っていった。今夜の勧誘は見送りだ。` : '今夜の勧誘は見送りだ。',
            quote: character ? (character.dialogue.failure.logic || 'また今度だ。') : 'また今度だ。'
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

    calculateEnemyPower() {
        const enemyIds = this.buildFinalEnemyLineup();
        const enemyPower = enemyIds.reduce((total, enemyId) => total + this.calculateCharacterPower(enemyId, 'enemy'), 0);
        const mobPower = 180 + ((this.state.enemyCrowdLevel || 0) * 34);
        const dayPressure = this.state.currentDay * 14;
        return enemyPower + mobPower + dayPressure;
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
        this.renderFinalBattleScene();
    }

    initializeFinalBattleState() {
        const enemyIds = this.buildFinalEnemyLineup();
        const allyRosterIds = [...this.state.recruitedMembers]
            .sort((a, b) => this.calculateCharacterPower(b, 'ally') - this.calculateCharacterPower(a, 'ally'));
        const enemyRosterIds = [...enemyIds];
        const allyUnits = allyRosterIds.map(id => this.createBattleUnit(id, 'ally'));
        const enemyUnits = enemyRosterIds.map(id => this.createBattleUnit(id, 'enemy'));

        return {
            enemyIds,
            bossId: enemyIds[0] || null,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(),
            allyRosterIds,
            enemyRosterIds,
            allyUnits,
            enemyUnits,
            allyActive: allyUnits.slice(0, 3),
            allyReserve: allyUnits.slice(3),
            enemyActive: enemyUnits.slice(0, 3),
            enemyReserve: enemyUnits.slice(3),
            battleLog: [],
            sceneLog: [
                '実況: 試合後の熱気がそのまま乱闘へなだれ込み、先発3対3が真正面からにらみ合う。',
                '実況: 画像をタップすれば、各人物のパラメータをいつでも確認できる。'
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
        const turnBanner = battleState.finished
            ? (battleState.victory ? '決着: 味方が押し切った' : '決着: 敵の圧力に飲まれた')
            : (battleState.actionCount > 0 ? `${battleState.actionCount}回目の攻防 / 第${Math.max(1, battleState.round)}ラウンド` : '開戦前');

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
                        <h3>試合後の街が爆発し、3対3の先発乱闘が始まる</h3>
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
                        <div class="battle-live-grid">
                            <div class="battle-info battle-narrative">
                                <p>今夜の試合結果は ${matchScore}。点差で膨れた群衆が、敵の総数を ${battleState.enemyIds.length} 人まで押し上げている。</p>
                                <p>${boss ? `${boss.name} が前線で吠える。${boss.dialogue.enemy}` : '敵チームの前線が黙って間合いを詰めてくる。'}</p>
                                <p>${battleState.finished ? battleState.summary : 'ボタンを押すたびに一手ごとの攻防が進む。倒れた者は即交代し、極稀にクリティカルヒットが炸裂する。'}</p>
                                <p>初期戦力比較: 味方 ${battleState.playerPower} / 敵 ${battleState.enemyPower}</p>
                            </div>
                            <div class="battle-live-panel">
                                <h4>直近の実況</h4>
                                <ul class="battle-live-list">
                                    ${sceneLog}
                                </ul>
                            </div>
                        </div>
                        <div class="battle-log-panel">
                            <h4>${battleState.finished ? '最終決戦ログ' : '累積実況ログ'}</h4>
                            <ul class="battle-log-list">
                                ${recentBattleLog || '<li>まだ乱闘は始まっていない。</li>'}
                            </ul>
                        </div>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.advanceFinalBattle()">${actionLabel}</button>
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

        if (battleState.finished) {
            this.showEnding();
            return;
        }

        const sceneLog = [];

        if (!battleState.turnQueue.length) {
            battleState.round += 1;
            battleState.turnQueue = this.buildBattleTurnQueue(battleState.allyActive, battleState.enemyActive);
            this.recordBattleLog(battleState, sceneLog, `実況: 第${battleState.round}ラウンド。肩がぶつかり合い、前線がもう一段前へ詰まった。`);
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

    isFinalBattleFinished(battleState) {
        return this.countLivingBattleUnits(battleState.allyActive, battleState.allyReserve) === 0
            || this.countLivingBattleUnits(battleState.enemyActive, battleState.enemyReserve) === 0;
    }

    recordBattleLog(battleState, sceneLog, message) {
        battleState.battleLog.push(message);
        sceneLog.push(message);
    }

    createBattleUnit(characterId, side = 'ally') {
        const character = this.getCharacter(characterId);
        const basePower = this.calculateCharacterPower(characterId, side);
        return {
            id: characterId,
            side,
            name: character.name,
            role: character.role,
            skillName: character.skill.name,
            skillType: character.skill.type,
            skillDescription: character.skill.description,
            maxHp: Math.round(120 + (character.stats.strength * 1.7) + (character.stats.bodyFat * 1.1)),
            hp: Math.round(120 + (character.stats.strength * 1.7) + (character.stats.bodyFat * 1.1)),
            attack: Math.round(basePower * 0.36),
            defense: Math.round((character.stats.bodyFat * 0.65) + (character.stats.education * 0.18) + (character.skill.type === 'defense' ? 16 : 0)),
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
        const mitigated = Math.max(8, Math.round(rawDamage - defenseValue));
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
                `実況: ${unit.name} の一撃が完璧に入った。クリティカルヒット！ ${target.name} に ${outcome.damage} ダメージ。${outcome.knockedOut ? ` ${target.name} はその場で崩れ落ちた。` : ''}`
            );
            return;
        }

        this.recordBattleLog(
            battleState,
            sceneLog,
            `実況: ${unit.name} が踏み込み、${target.name} を打ち抜く。${outcome.damage} ダメージ。${outcome.knockedOut ? `${target.name} は前線で膝をついた。` : 'まだ踏みとどまる。'}`
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
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。${target.name} を ${healAmount} 回復し、味方前線に押し返す力が戻る。`);
            return;
        }

        if (unit.skillType === 'buff') {
            livingAllies.forEach(ally => {
                ally.attackBuff += 14;
                ally.defenseBuff += 8;
            });
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。味方全体の肩が上がり、押し込みが一段強くなる。`);
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
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。味方の守りが締まり、敵の踏み込みが鈍る。`);
            return;
        }

        if (unit.skillType === 'debuff') {
            livingEnemies.forEach(enemy => {
                enemy.attackDebuff += 12;
                enemy.defenseBuff = Math.max(0, enemy.defenseBuff - 8);
            });
            this.recordBattleLog(battleState, sceneLog, `実況: ${unit.name} の ${unit.skillName}。敵陣の呼吸が乱れ、隊列が明らかに崩れた。`);
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

        unit.skillMeter += 55;
        const useSkill = unit.skillMeter >= 100;
        this.recordBattleLog(
            battleState,
            sceneLog,
            `実況: ${unit.name} が前へ出る。${useSkill ? '必殺の間合いだ。' : '拳と体重を乗せて踏み込む。'}`
        );

        if (useSkill) {
            unit.skillMeter = 0;
            this.performSkillAction(unit, ownActive, enemyLine, battleState, sceneLog);
        } else {
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
            ? `${aceUnit ? aceUnit.name : '味方前線'} が最後の押し込みを通し、${boss ? boss.name : '敵前線'} 側の隊列を切り裂いた。${criticalText}`
            : `${boss ? boss.name : '敵前線'} 側の圧力と増援に押し切られた。交代を重ねても前線を取り戻せず、最後は人数差が響いた。${criticalText}`;

        battleState.finished = true;
        battleState.victory = victory;
        battleState.summary = battleSummary;
        battleState.sceneLog = [
            victory
                ? '実況: 最後の押し合いを制し、味方が乱闘をひっくり返した。'
                : '実況: 最後の踏ん張りも及ばず、敵の圧が前線をのみ込んだ。',
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
        const recruitedCount = this.state.recruitedMembers.length;
        const result = this.state.finalBattleResult || {
            victory: false,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(),
            battleSummary: '最後の乱戦はまだ記録されていない。',
            bossId: null,
            enemyIds: [],
            actionCount: 0,
            criticalMoments: 0
        };
        const boss = result.bossId ? this.getCharacter(result.bossId) : null;

        let endingTitle = '';
        let endingText = '';

        if (result.victory && recruitedCount >= 8) {
            endingTitle = '完全制圧エンド';
            endingText = '昼の一手、夜の会話、試合の熱量、そのすべてを味方につけて街の空気をひっくり返した。';
        } else if (result.victory) {
            endingTitle = '辛勝エンド';
            endingText = '一手ごとの攻防を積み上げ、3対3の交代乱戦をギリギリで制した。';
        } else if (recruitedCount >= 5) {
            endingTitle = '撤退エンド';
            endingText = '善戦したが、試合の点差で膨れ上がった敵勢に飲まれた。だが、街に火種は残った。';
        } else {
            endingTitle = '壊滅エンド';
            endingText = '仲間が足りず、交代要員も尽きた。誰を口説けなかったか、その差が最後に牙をむいた。';
        }

        const enemySummary = result.enemyIds.map(id => this.getCharacter(id).name).join(' / ');
        const battleHighlights = (this.state.finalBattleHighlights || []).map(line => `<li>${line}</li>`).join('');

        this.setScreen(`
            <div class="game-screen">
                <div class="header">
                    <h2>ゲーム終了</h2>
                </div>
                <div class="content">
                    <div class="ending cinematic-ending">
                        <h3>${endingTitle}</h3>
                        <p>${endingText}</p>
                        <p>${result.battleSummary}</p>
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
                        <p>7日間で仲間を増やし、夜の会話と試合結果を経て、最後は一手ずつ進む3対3の交代制乱戦へ挑む。</p>
                        <h3>昼の行動ルール</h3>
                        <p>昼の行動は1日1回のみ。場所を選ぶと、その場所の候補者の中から誰か1人がランダムに現れる。</p>
                        <h3>夜の会話と追加勧誘</h3>
                        <p>夜は複数の仲間との会話が発生し、稀に別のキャラクターが乱入して追加勧誘できる。</p>
                        <h3>サッカー試合</h3>
                        <p>毎夜、試合結果が表示される。どちらが勝ったかと点差が示され、点差が大きいほど敵人数が増える。</p>
                        <h3>最終決戦</h3>
                        <p>最終戦は3対3のチームバトル。ボタンを押すごとに攻防が進み、実況描写の中で通常攻撃・必殺技・交代が一手ずつ積み上がる。稀にクリティカルヒットも出る。</p>
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
                        <p>7日間でできるだけ多くの人物を味方へ引き込み、試合後に膨れ上がる敵集団を3対3の交代乱戦で押し返す。</p>
                        <h3>1日の流れ</h3>
                        <p>1. 朝: 状況確認</p>
                        <p>2. 昼: 1回だけ訪問し、ランダムに現れた人物を勧誘</p>
                        <p>3. 夜: 仲間たちと会話し、試合結果を確認。稀に別人物を追加勧誘</p>
                        <h3>勧誘時の表示</h3>
                        <p>画像が表示される場面では、画像をタップすると筋力・体脂肪・幸福度・モラル・学力・資産がポップアップで表示される。</p>
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
    });
} else {
    game = new GoGoHooligan();
    window.game = game;
}
