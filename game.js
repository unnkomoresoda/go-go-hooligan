const ASSET_VERSION = '20260330-roster3';

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
        this.state.nightConversationId = null;
        this.state.lastNightSpeakerId = null;
        this.state.finalEnemyIds = [];
        this.state.lastRecruitedId = null;
    }

    init() {
        this.renderTitle();
    }

    startGame() {
        this.resetState();
        this.renderDay();
    }

    getAllCharacterIds() {
        return Object.keys(GAME_DATA.characters);
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

    getLocationCards() {
        return [
            { id: 'pub', icon: '🍺' },
            { id: 'park', icon: '🌳' },
            { id: 'street', icon: '🏪' }
        ];
    }

    shuffle(array) {
        const cloned = [...array];
        for (let i = cloned.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
        }
        return cloned;
    }

    randomChoice(array) {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
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
                    <img src="${this.getCharacterImage(characterId)}" alt="${character.name}" class="character-image">
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
                    ${this.renderStatsGrid(character.stats)}
                    <div class="skill-box">
                        <p><strong>スキル:</strong> ${character.skill.name}</p>
                        <p><strong>効果:</strong> ${character.skill.description}</p>
                        <p><strong>分類:</strong> ${this.getRoleBadge(character.skill.type)}</p>
                    </div>
                    ${showStory ? `<div class="character-story"><p>${character.story}</p></div>` : ''}
                    ${showDialogue ? `<div class="dialogue-box"><p>${dialogueText}</p></div>` : ''}
                </div>
            </div>
        `;
    }

    renderTitle() {
        this.gameScreen.innerHTML = `
            <div class="title-screen">
                <h1>ゴーゴーフーリガン</h1>
                <h2>Go! Go! Hooligan</h2>
                <p class="tagline">誰もが味方にも敵にもなる街で、昼の一手と夜の会話が最後の乱戦を決める</p>
                <div class="buttons">
                    <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                    <button class="btn btn-secondary" onclick="window.game.showHelp()">ヘルプ</button>
                </div>
            </div>
        `;
    }

    renderDay() {
        const phaseNames = ['朝', '昼', '夜'];
        const phaseName = phaseNames[this.state.currentPhase];

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 ${phaseName}</h2>
                    <div class="status">
                        <span>チーム士気: ${this.state.teamMorale}%</span>
                        <span>仲間数: ${this.state.recruitedMembers.length}/${this.getMaxTeamSize()}</span>
                        <span>昼の行動: ${this.state.dayActionTaken ? '完了' : '未実行'}</span>
                    </div>
                </div>
                <div class="content">
                    ${this.renderPhaseContent()}
                </div>
            </div>
        `;
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
                        <p>朝日が昇った。マンチスターの空気はざらつき、誰が味方で誰が敵になるかはまだ決まっていない。</p>
                        <p>Derek が低い声で告げる。昼に使える行動は一度だけ。その一手で、夜に誰と語り、最後に誰と殴り合うかまで変わる。</p>
                    </div>
                    ${this.renderCharacterPanel('derek', {
                        showDialogue: true,
                        dialogueText: this.getCharacter('derek').dialogue.intro,
                        extraMeta: '<p>立場: 初期メンバー</p>'
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
                <p>${lastRecruit ? `${lastRecruit.name} を仲間にした余韻がまだ残っている。` : '昨夜の会話を胸に、次の接触先を決める時間だ。'}</p>
                <p>誰を味方に引き込むかで、残った連中はそのまま敵にもなる。</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.advancePhase()">昼間に向かう</button>
                </div>
            </div>
        `;
    }

    renderAfternoon() {
        if (this.state.dayActionTaken) {
            return `
                <div class="afternoon-scene">
                    <p>今日の昼の行動はもう終わった。これ以上の接触はできない。</p>
                    <p>夜になれば、今いる仲間の誰かと話す時間が来る。</p>
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
                <p>昼だ。動けるのは一回だけ。訪問先を決めると、その場所にいる誰かがランダムに現れる。</p>
                <p>会えなかった連中は、最後の夜に敵へ回るかもしれない。</p>
                <div class="location-buttons">
                    ${locationButtons}
                </div>
                <div class="choices">
                    <button class="btn btn-secondary" onclick="window.game.endAfternoonAction()">今日は動かず夜に進む</button>
                </div>
            </div>
        `;
    }

    selectNightSpeaker() {
        if (this.state.nightConversationId) {
            return this.state.nightConversationId;
        }

        const candidates = this.state.recruitedMembers.filter(id => id !== this.state.lastNightSpeakerId);
        const selected = this.randomChoice(candidates.length ? candidates : this.state.recruitedMembers) || 'derek';
        this.state.nightConversationId = selected;
        this.state.lastNightSpeakerId = selected;
        return selected;
    }

    renderNight() {
        const speakerId = this.selectNightSpeaker();
        const speaker = this.getCharacter(speakerId);
        const nightLine = this.randomChoice(speaker.dialogue.night) || '「明日に備えろ。」';
        const isFinalNight = this.state.currentDay === GAME_CONSTANTS.MAX_DAYS;

        return `
            <div class="night-scene">
                <p>夜だ。昼の一手は終わり、仲間のひとりが静かに口を開く。</p>
                <p>今いる仲間との会話が、次の昼と最後の乱戦への温度を決める。</p>
                ${this.renderCharacterPanel(speakerId, {
                    showDialogue: true,
                    dialogueText: `「${nightLine.replace(/^「|」$/g, '')}」`,
                    extraMeta: `<p>今夜の会話相手: ${speaker.name}</p>`
                })}
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.${isFinalNight ? 'startFinalBattle()' : 'advanceDay()'}">${isFinalNight ? '敵チームとの乱戦へ向かう' : '次の日へ進む'}</button>
                </div>
            </div>
        `;
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

    getRecruitmentMethods(character) {
        const rates = {
            love: this.calculateRecruitmentChance(character, 'love'),
            logic: this.calculateRecruitmentChance(character, 'logic'),
            force: this.calculateRecruitmentChance(character, 'force')
        };

        return [
            { id: 'love', name: '❤️ チームへの愛情で説得する', rate: rates.love, hint: '感情と絆で口説く' },
            { id: 'logic', name: '🧠 理屈で説得する', rate: rates.logic, hint: '目的と勝算を示す' },
            { id: 'force', name: '💪 力と迫力で押し切る', rate: rates.force, hint: '胆力と圧で引き込む' }
        ];
    }

    renderRecruitmentScene(characterId, character, locationName) {
        const methods = this.getRecruitmentMethods(character);
        const methodButtons = methods.map(method => `
            <button class="btn btn-method" onclick="window.game.recruitCharacter('${characterId}', '${method.id}')">
                <strong>${method.name}</strong><br>
                <small>${method.hint} / 成功期待値: ${method.rate}%</small>
            </button>
        `).join('');

        this.gameScreen.innerHTML = `
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
                            extraMeta: `<p>会敵状態: まだ中立</p><p>この人物は味方にも敵にもなり得る。</p>`
                        })}
                        <div class="recruitment-choices">
                            <h4>この一度きりの接触でどう口説く？</h4>
                            <div class="message">
                                <p>画像と一緒に、筋力・体脂肪・幸福度・モラル・学力・資産を確認できる。</p>
                                <p>説得に失敗すれば、その人物は最後の夜に敵側へ回る可能性が高まる。</p>
                            </div>
                            <div class="recruitment-methods">
                                ${methodButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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

    recruitCharacter(characterId, method) {
        const character = this.getCharacter(characterId);
        const successRate = this.calculateRecruitmentChance(character, method);
        const success = Math.random() * 100 < successRate;

        let message = '';
        let quote = '';

        if (success) {
            if (!this.state.recruitedMembers.includes(characterId)) {
                this.state.recruitedMembers.push(characterId);
            }
            this.state.lastRecruitedId = characterId;
            this.state.teamMorale = this.clamp(this.state.teamMorale + 8, 0, 100);
            this.state.teamExperience += 10;
            message = `${character.name} はお前の誘いに応じ、味方として列へ加わった。昼の一手は成功だ。`;
            quote = character.dialogue.success[method] || '「……悪くない。」';
        } else {
            this.state.teamMorale = this.clamp(this.state.teamMorale - 4, 0, 100);
            this.state.teamExperience += 3;
            message = `${character.name} は今回は首を縦に振らなかった。今日の昼に再挑戦はできない。夜へ切り替えるしかない。`;
            quote = character.dialogue.failure[method] || '「今は違う。」';
        }

        this.showAfternoonResult({
            characterId,
            success,
            message,
            quote,
            successRate
        });
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

        this.gameScreen.innerHTML = `
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
        `;
    }

    endAfternoonAction() {
        this.state.currentPhase = 2;
        this.state.nightConversationId = null;
        this.renderDay();
    }

    advancePhase() {
        this.state.currentPhase += 1;
        if (this.state.currentPhase > 2) {
            this.advanceDay();
            return;
        }
        if (this.state.currentPhase === 2) {
            this.state.nightConversationId = null;
        }
        this.renderDay();
    }

    advanceDay() {
        this.state.currentDay += 1;
        this.state.currentPhase = 0;
        this.state.dayActionTaken = false;
        this.state.currentEncounterId = null;
        this.state.currentLocationId = null;
        this.state.nightConversationId = null;

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
        const skillBonus = this.getRoleBadge(character.skill.type) === '攻撃' ? 18 : 10;
        const threatBonus = mode === 'enemy' ? Math.round((character.enemyThreat || 50) * 0.45) : 0;
        return basePower + skillBonus + threatBonus;
    }

    getFrontlineAllyIds() {
        return [...this.state.recruitedMembers]
            .sort((a, b) => this.calculateCharacterPower(b) - this.calculateCharacterPower(a))
            .slice(0, 4);
    }

    buildFinalEnemyLineup() {
        if (this.state.finalEnemyIds && this.state.finalEnemyIds.length) {
            return this.state.finalEnemyIds;
        }

        const available = this.getAllCharacterIds()
            .filter(id => !this.state.recruitedMembers.includes(id))
            .sort((a, b) => (this.getCharacter(b).enemyThreat || 0) - (this.getCharacter(a).enemyThreat || 0));

        if (!available.length) {
            this.state.finalEnemyIds = [];
            return [];
        }

        const bossId = available[0];
        const supportIds = this.shuffle(available.slice(1)).slice(0, GAME_CONSTANTS.ENEMY_LINEUP_SIZE - 1);
        this.state.finalEnemyIds = [bossId, ...supportIds];
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
        const mobPower = 260;
        const dayPressure = this.state.currentDay * 14;
        return enemyPower + mobPower + dayPressure;
    }

    renderBattleFighterCard(characterId, mode = 'ally') {
        const character = this.getCharacter(characterId);
        return `
            <div class="battle-fighter-card ${mode === 'enemy' ? 'enemy-fighter-card' : ''}">
                <img src="${this.getCharacterImage(characterId)}" alt="${character.name}" class="battle-portrait ${mode === 'enemy' ? 'boss-portrait' : ''}">
                <h4>${character.name}</h4>
                <p>${character.role}</p>
                ${this.renderMiniStats(character.stats)}
            </div>
        `;
    }

    startFinalBattle() {
        this.state.battleActive = true;
        const enemyIds = this.buildFinalEnemyLineup();
        const bossId = enemyIds[0];
        const boss = bossId ? this.getCharacter(bossId) : null;
        const playerPower = this.calculateTeamPower();
        const enemyPower = this.calculateEnemyPower();
        const allyCards = this.getFrontlineAllyIds().map(id => this.renderBattleFighterCard(id, 'ally')).join('');
        const enemyCards = enemyIds.map((id, index) => this.renderBattleFighterCard(id, index === 0 ? 'enemy' : 'ally')).join('');

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>最終決戦</h2>
                    <div class="status">
                        <span>味方戦力: ${playerPower}</span>
                        <span>敵戦力: ${enemyPower}</span>
                        <span>敵ボス: ${boss ? boss.name : '不明'}</span>
                    </div>
                </div>
                <div class="content">
                    <div class="battle-scene cinematic-battle">
                        <h3>マンチスター外縁、敵チームとの乱戦</h3>
                        <div class="battle-lineup">
                            <div class="battle-side ally-side">
                                <h4>お前の前線メンバー</h4>
                                <div class="battle-fighter-grid">
                                    ${allyCards}
                                </div>
                            </div>
                            <div class="battle-versus">激突</div>
                            <div class="battle-side enemy-side">
                                <h4>敵チーム前線</h4>
                                <div class="battle-fighter-grid">
                                    ${enemyCards}
                                </div>
                            </div>
                        </div>
                        <div class="battle-info battle-narrative">
                            <p>怒号が飛び、瓶が割れ、遠くでサイレンが鳴る。敵も味方も、元を辿れば昼に会えたかもしれない顔ぶれだ。</p>
                            <p>${boss ? `${boss.name} が最前列へ出てきて吐き捨てる。${boss.dialogue.enemy}` : '敵の統率者が前へ出てきた。'}</p>
                            <p>筋力、体脂肪、幸福度、モラル、学力、資産。積み重ねた生き方そのものが、この乱戦では戦力として可視化される。</p>
                        </div>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.resolveBattle()">乱戦を解決する</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    resolveBattle() {
        const enemyIds = this.buildFinalEnemyLineup();
        const bossId = enemyIds[0];
        const boss = bossId ? this.getCharacter(bossId) : null;
        const playerPower = this.calculateTeamPower();
        const enemyPower = this.calculateEnemyPower();
        const powerGap = playerPower - enemyPower;
        const victory = powerGap >= 0;
        const frontline = this.getFrontlineAllyIds();
        const aceId = frontline[0] || this.state.recruitedMembers[0];
        const ace = aceId ? this.getCharacter(aceId) : null;

        let battleSummary = '';
        if (victory) {
            battleSummary = `${ace ? ace.name : '前線の仲間'} が突破口を開き、${boss ? boss.name : '敵ボス'} の隊列を崩した。最後は数と士気で押し切り、夜の主導権を奪い返した。`;
        } else {
            battleSummary = `${boss ? boss.name : '敵ボス'} の統率がこちらを上回り、味方は散らされた。昼に取りこぼした顔ぶれが、最後の夜に牙をむいた。`;
        }

        this.state.finalBattleResult = {
            victory,
            playerPower,
            enemyPower,
            battleSummary,
            bossId,
            enemyIds,
            aceId
        };

        this.showEnding();
    }

    showEnding() {
        const recruitedCount = this.state.recruitedMembers.length;
        const result = this.state.finalBattleResult || {
            victory: false,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(),
            battleSummary: '最後の乱戦はまだ記録されていない。',
            bossId: null,
            enemyIds: []
        };
        const boss = result.bossId ? this.getCharacter(result.bossId) : null;

        let endingTitle = '';
        let endingText = '';

        if (result.victory && recruitedCount >= 8) {
            endingTitle = '完全制圧エンド';
            endingText = 'お前は街中の支持者を束ね、敵チームを完全に押し返した。昼の一手と夜の会話が、最後に街の空気そのものを塗り替えた。';
        } else if (result.victory) {
            endingTitle = '辛勝エンド';
            endingText = '綱渡りの勝利だったが、最後に立っていたのはお前たちだった。仲間にした顔ぶれが確かに差を作った。';
        } else if (recruitedCount >= 5) {
            endingTitle = '撤退エンド';
            endingText = '仲間は集めたが、敵側に回った顔ぶれの圧が強すぎた。街の夜は取れなかったが、火種は残った。';
        } else {
            endingTitle = '壊滅エンド';
            endingText = '味方に引き込めた数が足りず、最後の夜は敵の熱に飲まれた。誰を口説き損ねたか、その差が結果になった。';
        }

        const enemySummary = result.enemyIds.map(id => this.getCharacter(id).name).join(' / ');

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>ゲーム終了</h2>
                </div>
                <div class="content">
                    <div class="ending">
                        <h3>${endingTitle}</h3>
                        <p>${endingText}</p>
                        <p>${result.battleSummary}</p>
                        <p>最終戦力: 味方 ${result.playerPower} / 敵 ${result.enemyPower}</p>
                        <p>最終仲間数: ${recruitedCount}/${this.getMaxTeamSize()}</p>
                        <p>最終敵ボス: ${boss ? boss.name : '不明'}</p>
                        <p>敵前線: ${enemySummary || '未確定'}</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showGameInfo() {
        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>ゲームについて</h2>
                </div>
                <div class="content">
                    <div class="game-info">
                        <h3>ゲーム概要</h3>
                        <p>7日間で仲間を増やし、最後の夜に敵チームとの乱戦へ挑む。</p>
                        <h3>昼の行動ルール</h3>
                        <p>昼の行動は1日1回のみ。場所を選ぶと、その場所の候補者の中から誰か1人がランダムに現れる。</p>
                        <h3>敵味方共通ルール</h3>
                        <p>全キャラクターは味方にも敵にもなり得る。昼に味方へ引き込めなかった人物は、最終夜に敵側の前線へ回る可能性がある。</p>
                        <h3>夜の会話</h3>
                        <p>夜になると、仲間になったキャラクターのひとりが会話相手として現れる。画像と各種パラメータも確認できる。</p>
                        <h3>パラメータシステム</h3>
                        <p>筋力、体脂肪、幸福度、モラル、学力、資産を表示し、勧誘や最終戦力の演出に反映する。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showHelp() {
        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>ヘルプ</h2>
                </div>
                <div class="content">
                    <div class="help-content">
                        <h3>ゲームの目的</h3>
                        <p>7日間でできるだけ多くの人物を味方へ引き込み、最後の夜の乱戦で敵チームを押し返す。</p>
                        <h3>1日の流れ</h3>
                        <p>1. 朝: 状況確認</p>
                        <p>2. 昼: 1回だけ訪問し、ランダムに現れた人物を勧誘</p>
                        <p>3. 夜: 仲間との会話を経て、次の日または最終決戦へ進む</p>
                        <h3>勧誘方法</h3>
                        <p>愛情、理屈、力の3つから1つを選ぶ。相手の性格とパラメータ次第で成功率が変わる。</p>
                        <h3>画像と能力値</h3>
                        <p>画像が表示される場面では、モラルや体脂肪を含む全パラメータも確認できる。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
