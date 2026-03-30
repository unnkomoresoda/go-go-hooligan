
const ASSET_VERSION = '20260330-img2';

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
    }

    init() {
        this.renderTitle();
    }

    startGame() {
        this.resetState();
        this.renderDay();
    }

    renderTitle() {
        this.gameScreen.innerHTML = `
            <div class="title-screen">
                <h1>ゴーゴーフーリガン</h1>
                <h2>Go! Go! Hooligan</h2>
                <p class="tagline">仲間との絆が、スタジアムの外での勝利を生む</p>
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
                        <span>仲間数: ${this.state.recruitedMembers.length}/${GAME_CONSTANTS.MAX_TEAM_SIZE}</span>
                        <span>昼の行動: ${this.state.dayActionTaken ? '終了' : '未実行'}</span>
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
        if (this.state.currentDay === 1) {
            return `
                <div class="tutorial">
                    <div class="character-info">
                        <img src="images/derek.jpg?v=${ASSET_VERSION}" alt="Derek Thompson" class="character-image">
                        <h3>Derek Thompson</h3>
                        <p>古参サポーター / 防御役</p>
                    </div>
                    <p>朝日が昇った。マンチスターの空気は重いが、こちらにはまだ立て直す余地がある。</p>
                    <p>Derek は、昼の行動は一度きりだと告げる。誰に会うか、どこへ向かうか、その判断が夜の流れを決める。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.advancePhase()">昼の仲間集めに向かう</button>
                        <button class="btn btn-secondary" onclick="window.game.showGameInfo()">ゲームについて詳しく知る</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="morning-scene">
                <p>新しい一日が始まった。昼に使える行動は一度だけだ。</p>
                <p>誰に会うかを見極め、夜に備えて動こう。</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.advancePhase()">昼間に向かう</button>
                </div>
            </div>
        `;
    }

    renderAfternoon() {
        const locations = [
            { id: 'pub', name: '🍺 パブ「ザ・レッドライオン」', description: '古参サポーターが群れる、煙と酒のたまり場。' },
            { id: 'park', name: '🌳 セントラルパーク', description: '若い連中がたむろする、ざわついた空気の公園。' },
            { id: 'street', name: '🏪 商店街「ハイストリート」', description: '人の流れが絶えない、噂と視線の交差点。' }
        ];

        if (this.state.dayActionTaken) {
            return `
                <div class="afternoon-scene">
                    <p>今日の昼の行動はもう終わった。ここから先は夜の時間だ。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.endAfternoonAction()">夜に進む</button>
                    </div>
                </div>
            `;
        }

        const locationButtons = locations.map(loc => {
            const locationData = GAME_DATA.locations[loc.id];
            const remaining = locationData.characters.filter(characterId => !this.state.recruitedMembers.includes(characterId)).length;
            return `
                <button class="btn btn-location" onclick="window.game.visitLocation('${loc.id}')">
                    <strong>${loc.name}</strong><br>
                    <small>${loc.description} 残り候補: ${remaining}人</small>
                </button>
            `;
        }).join('');

        return `
            <div class="afternoon-scene">
                <p>昼だ。行ける場所は多くない。今日動けるのは一度きり、訪問先を決めろ。</p>
                <div class="location-buttons">
                    ${locationButtons}
                </div>
                <div class="choices">
                    <button class="btn btn-secondary" onclick="window.game.endAfternoonAction()">今日は動かず夜に進む</button>
                </div>
            </div>
        `;
    }

    renderNight() {
        if (this.state.currentDay === GAME_CONSTANTS.MAX_DAYS) {
            return `
                <div class="night-scene">
                    <p>決戦の夜だ。敵サポーター集団が集結し、ついに Jake Hunter が前線へ姿を現した。</p>
                    <p>仲間たちは息を整え、殴り合いになる直前の緊張が張りつめている。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.startFinalBattle()">敵チームとの乱戦へ向かう</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="night-scene">
                <p>夜が訪れた。昼の選択の余韻が残る中、次の日に向けて気持ちを固める時間だ。</p>
                <p>荒事の匂いは濃くなっている。だが、明日もまた一度だけ勝負できる。</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.advanceDay()">次の日へ</button>
                </div>
            </div>
        `;
    }

    visitLocation(locationId) {
        if (this.state.dayActionTaken) {
            this.renderDay();
            return;
        }

        const location = GAME_DATA.locations[locationId];
        const characterId = location.characters.find(id => !this.state.recruitedMembers.includes(id));

        if (!characterId) {
            this.showAfternoonResult(`${location.name}を探ったが、今日は有力な仲間に出会えなかった。昼の勝負はここまでだ。`, null);
            return;
        }

        const character = GAME_DATA.characters[characterId];
        this.renderRecruitmentScene(characterId, character, location.name);
    }

    renderRecruitmentScene(characterId, character, locationName) {
        const methods = [
            { id: 'love', name: '❤️ チームへの愛情で説得する', successRate: 60 },
            { id: 'logic', name: '🧠 理屈で説得する', successRate: 50 },
            { id: 'force', name: '💪 力で押し切る', successRate: 70 }
        ];

        const methodButtons = methods.map(method =>
            `<button class="btn btn-method" onclick="window.game.recruitCharacter('${characterId}', '${method.id}')">${method.name}</button>`
        ).join('');

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
                    <div class="character-recruitment recruitment-scene">
                        <div class="character-card">
                            <img src="images/${characterId}.jpg?v=${ASSET_VERSION}" alt="${character.name}" class="character-image">
                            <h3>${character.name}</h3>
                            <p>年齢: ${character.age}歳</p>
                            <p>職業: ${character.job}</p>
                            <p>役割: ${character.role}</p>
                        </div>
                        <div class="character-story">
                            <p>${character.story}</p>
                            <p>この一度きりの接触でどう口説く？</p>
                            <div class="recruitment-methods">
                                ${methodButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    recruitCharacter(characterId, method) {
        const character = GAME_DATA.characters[characterId];
        const methodNames = {
            love: '熱いクラブ愛',
            logic: '冷静な理屈',
            force: '威圧と腕力'
        };
        const successRates = { love: 60, logic: 50, force: 70 };
        const success = Math.random() * 100 < successRates[method];

        let resultMessage;
        if (success) {
            if (!this.state.recruitedMembers.includes(characterId)) {
                this.state.recruitedMembers.push(characterId);
            }
            this.state.teamMorale = Math.min(this.state.teamMorale + 10, 100);
            resultMessage = `${character.name}は${methodNames[method]}に心を動かされ、仲間に加わった。今日の昼の成果は大きい。`;
        } else {
            this.state.teamMorale = Math.max(this.state.teamMorale - 5, 40);
            resultMessage = `${character.name}には${methodNames[method]}が刺さらなかった。だが、今日はもう一度は動けない。夜へ切り替えるしかない。`;
        }

        this.showAfternoonResult(resultMessage, characterId);
    }

    showAfternoonResult(message, characterId = null) {
        this.state.dayActionTaken = true;
        const character = characterId ? GAME_DATA.characters[characterId] : null;
        const portrait = character
            ? `<img src="images/${characterId}.jpg?v=${ASSET_VERSION}" alt="${character.name}" class="character-image">`
            : '';
        const nameBlock = character ? `<h3>${character.name}</h3>` : '<h3>昼の結果</h3>';

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
                        ${portrait}
                        ${nameBlock}
                        <p>${message}</p>
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
        this.renderDay();
    }

    advancePhase() {
        this.state.currentPhase++;
        if (this.state.currentPhase > 2) {
            this.advanceDay();
            return;
        }
        this.renderDay();
    }

    advanceDay() {
        this.state.currentDay++;
        this.state.currentPhase = 0;
        this.state.dayActionTaken = false;

        if (this.state.currentDay > GAME_CONSTANTS.MAX_DAYS) {
            this.startFinalBattle();
            return;
        }

        this.renderDay();
    }

    getRivalBoss() {
        return GAME_DATA.rivalBoss || {
            name: 'Jake Hunter',
            role: '敵ボス',
            job: '敵サポーター統率者',
            story: '敵サポーター集団を率いる危険な煽動者。乱戦の中心で暴力を統率する。',
            stats: {
                strength: 92,
                bodyFat: 26,
                happiness: 18,
                morality: 8,
                education: 32,
                assets: 900
            }
        };
    }

    calculateSocialAttackBonus(stats) {
        return Math.round(((100 - stats.happiness) + (100 - stats.morality) + (100 - stats.education)) * 0.55);
    }

    calculateBattlePowerFromStats(stats) {
        const physicalPower = (stats.strength * 1.45) + (stats.bodyFat * 0.7);
        const socialPenaltyBoost = this.calculateSocialAttackBonus(stats);
        const assetsBoost = Math.min(stats.assets / 40, 30);
        return Math.round(physicalPower + socialPenaltyBoost + assetsBoost);
    }

    calculateTeamPower() {
        const memberPower = this.state.recruitedMembers.reduce((total, memberId) => {
            const character = GAME_DATA.characters[memberId];
            return total + this.calculateBattlePowerFromStats(character.stats);
        }, 0);

        const moraleBoost = Math.round(this.state.teamMorale * 1.8);
        const unityBoost = this.state.recruitedMembers.length * 18;
        return memberPower + moraleBoost + unityBoost;
    }

    calculateEnemyPower() {
        const boss = this.getRivalBoss();
        const bossPower = this.calculateBattlePowerFromStats(boss.stats) + 90;
        const mobPower = 420;
        const dayPressure = this.state.currentDay * 12;
        return bossPower + mobPower + dayPressure;
    }

    renderFrontlineMembers() {
        const frontlineIds = this.state.recruitedMembers.slice(0, 3);
        return frontlineIds.map(memberId => {
            const character = GAME_DATA.characters[memberId];
            return `
                <div class="battle-fighter-card">
                    <img src="images/${memberId}.jpg?v=${ASSET_VERSION}" alt="${character.name}" class="battle-portrait">
                    <h4>${character.name}</h4>
                    <p>${character.role}</p>
                </div>
            `;
        }).join('');
    }

    startFinalBattle() {
        this.state.battleActive = true;
        const boss = this.getRivalBoss();
        const playerPower = this.calculateTeamPower();
        const enemyPower = this.calculateEnemyPower();

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>最終決戦</h2>
                    <div class="status">
                        <span>味方戦力: ${playerPower}</span>
                        <span>敵戦力: ${enemyPower}</span>
                    </div>
                </div>
                <div class="content">
                    <div class="battle-scene cinematic-battle">
                        <h3>マンチスター外縁、敵サポーターとの乱戦</h3>
                        <div class="battle-lineup">
                            <div class="battle-side ally-side">
                                <h4>マッドドッグス側 前線</h4>
                                <div class="battle-fighter-grid">
                                    ${this.renderFrontlineMembers()}
                                </div>
                            </div>
                            <div class="battle-versus">激突</div>
                            <div class="battle-side enemy-side">
                                <h4>敵ボス ${boss.name}</h4>
                                <div class="battle-fighter-card boss-card">
                                    <img src="images/jake.jpg?v=${ASSET_VERSION}" alt="${boss.name}" class="battle-portrait boss-portrait">
                                    <h4>${boss.name}</h4>
                                    <p>${boss.role || '敵ボス'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="battle-info battle-narrative">
                            <p>怒号が飛び、瓶が割れ、遠くでサイレンが鳴る。お前の仲間たちは敵の列へ踏み込んだ。</p>
                            <p>${boss.name} は群衆の奥から前へ出てきて、お前たちを正面から潰しにくる。</p>
                            <p>低い幸福度、低いモラル、低い学力ほど荒事に転じるこの街では、歪んだ生き様そのものが攻撃力になる。</p>
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
        const playerPower = this.calculateTeamPower();
        const enemyPower = this.calculateEnemyPower();
        const powerGap = playerPower - enemyPower;
        const victory = powerGap >= 0;

        let battleSummary;
        if (victory) {
            battleSummary = '仲間たちは散開しながら敵の隊列を崩し、最後は正面突破で Jake Hunter を退かせた。';
        } else {
            battleSummary = '敵の圧力が想定以上に強く、前線は押し返された。Jake Hunter の統率がこちらを上回った。';
        }

        this.state.finalBattleResult = {
            victory,
            playerPower,
            enemyPower,
            battleSummary
        };

        this.showEnding();
    }

    showEnding() {
        const recruitedCount = this.state.recruitedMembers.length;
        const result = this.state.finalBattleResult || {
            victory: false,
            playerPower: this.calculateTeamPower(),
            enemyPower: this.calculateEnemyPower(),
            battleSummary: '最後の乱戦はまだ記録されていない。'
        };

        let endingTitle = '';
        let endingText = '';

        if (result.victory && recruitedCount >= 8) {
            endingTitle = '完全制圧エンド';
            endingText = 'お前は街中の支持者を束ね、敵チームを完全に沈黙させた。マンチスターの夜は、しばらくお前たちのものだ。';
        } else if (result.victory) {
            endingTitle = '辛勝エンド';
            endingText = '犠牲は出たが、敵を押し返すことには成功した。集めた仲間たちが最後に差を作った。';
        } else if (recruitedCount >= 5) {
            endingTitle = '潰し切れず撤退エンド';
            endingText = '仲間は集まったが、敵ボスの圧が強すぎた。敗れはしたが、次に繋がる火は残った。';
        } else {
            endingTitle = '壊滅エンド';
            endingText = '数も勢いも足りなかった。マンチスターの夜は、まだ敵の色に染まっている。';
        }

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
                        <p>最終仲間数: ${recruitedCount}/${GAME_CONSTANTS.MAX_TEAM_SIZE}</p>
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
                        <p>7日間で仲間を集め、最後の夜に敵サポーター集団との乱戦へ挑む。</p>
                        <h3>昼の行動ルール</h3>
                        <p>昼の行動は1日1回のみ。訪問先選びと勧誘方法がその日の成果を決める。</p>
                        <h3>パラメータシステム</h3>
                        <p>筋力量、体脂肪率、幸福度、モラル、学力、資産を参照する。幸福度・モラル・学力が低いほど荒々しい攻撃力が上がる。</p>
                        <h3>最終決戦</h3>
                        <p>7日目の夜、敵ボス Jake Hunter 率いる rival supporter team と正面衝突する。</p>
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
                        <p>7日間でできるだけ多くの仲間を集め、最終夜の乱戦で敵チームを押し返す。</p>
                        <h3>1日の流れ</h3>
                        <p>1. 朝：状況確認</p>
                        <p>2. 昼：1回だけ訪問と勧誘</p>
                        <p>3. 夜：次の日へ進む、または最終日に決戦へ突入</p>
                        <h3>勧誘方法</h3>
                        <p>愛情、理屈、力の3つから1つを選ぶ。成功率も結果も異なる。</p>
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
