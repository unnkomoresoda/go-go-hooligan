// ゴーゴーフーリガン - ゲームメインロジック

class GoGoHooligan {
    constructor() {
        this.state = JSON.parse(JSON.stringify(gameState));
        this.gameScreen = document.getElementById('game-screen');
        this.init();
    }

    init() {
        this.renderTitle();
    }

    renderTitle() {
        this.gameScreen.innerHTML = `
            <div class="title-screen">
                <h1>ゴーゴーフーリガン</h1>
                <h2>Go! Go! Hooligan</h2>
                <p class="tagline">仲間との絆が、スタジアムの外での勝利を生む</p>
                <div class="buttons">
                    <button class="btn btn-primary" onclick="game.startGame()">ゲーム開始</button>
                    <button class="btn btn-secondary" onclick="game.showHelp()">ヘルプ</button>
                </div>
            </div>
        `;
    }

    startGame() {
        this.state.currentDay = 1;
        this.state.currentPhase = 0;
        this.renderDay();
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
                    </div>
                </div>
                <div class="content">
                    ${this.renderPhaseContent()}
                </div>
            </div>
        `;
    }

    renderPhaseContent() {
        if (this.state.currentDay === 1 && this.state.currentPhase === 0) {
            return this.renderTutorial();
        } else if (this.state.currentPhase === 0) {
            return this.renderMorning();
        } else if (this.state.currentPhase === 1) {
            return this.renderAfternoon();
        } else {
            return this.renderEvening();
        }
    }

    renderTutorial() {
        return `
            <div class="tutorial">
                <div class="character-message">
                    <div class="character-name">Derek Thompson</div>
                    <div class="message">
                        <p>よぉ、ボス。聞いてくれ。</p>
                        <p>FCマッドドッグスは今、ピンチだ。</p>
                        <p>日曜日の試合までに、仲間を集めて、敵チームのサポーターを圧倒しなきゃならん。</p>
                        <p>お前なら、できるはずだ。</p>
                    </div>
                </div>
                <div class="choices">
                    <button class="btn btn-primary" onclick="game.nextPhase()">了解した。仲間を集めよう。</button>
                    <button class="btn btn-secondary" onclick="game.showGameInfo()">ゲームについて詳しく知りたい</button>
                </div>
            </div>
        `;
    }

    renderMorning() {
        return `
            <div class="morning-phase">
                <p>朝が来た。新しい一日の始まりだ。</p>
                <p>どうする？</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="game.goToExploration()">街に出て仲間を探す</button>
                    <button class="btn btn-secondary" onclick="game.restAtHome()">家で休む</button>
                </div>
            </div>
        `;
    }

    renderAfternoon() {
        return `
            <div class="afternoon-phase">
                <p>昼間だ。街は活気に満ちている。</p>
                <p>どこに行く？</p>
                <div class="location-buttons">
                    <button class="btn btn-location" onclick="game.visitLocation('pub')">
                        🍺 パブ「ザ・レッドライオン」
                    </button>
                    <button class="btn btn-location" onclick="game.visitLocation('park')">
                        🌳 セントラルパーク
                    </button>
                    <button class="btn btn-location" onclick="game.visitLocation('street')">
                        🏪 商店街「ハイストリート」
                    </button>
                </div>
            </div>
        `;
    }

    renderEvening() {
        return `
            <div class="evening-phase">
                <p>夜が来た。チームと作戦会議をしよう。</p>
                <div class="team-info">
                    <h3>現在のチームメンバー</h3>
                    <div class="member-list">
                        ${this.state.recruitedMembers.map(memberId => {
                            const member = GAME_DATA.characters[memberId];
                            return `
                                <div class="member-card">
                                    <div class="member-name">${member.name}</div>
                                    <div class="member-role">${member.role}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="choices">
                    <button class="btn btn-primary" onclick="game.nextDay()">寝る（次の日へ）</button>
                </div>
            </div>
        `;
    }

    visitLocation(locationId) {
        const location = GAME_DATA.locations[locationId];
        const availableCharacters = location.characters.filter(
            charId => !this.state.recruitedMembers.includes(charId)
        );

        if (availableCharacters.length === 0) {
            this.gameScreen.innerHTML = `
                <div class="game-screen">
                    <div class="header">
                        <h2>${this.state.currentDay}日目 昼</h2>
                    </div>
                    <div class="content">
                        <p>${location.name}に着いた。</p>
                        <p>ここには、もう仲間にしたい人がいないようだ。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.renderDay()">戻る</button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const character = GAME_DATA.characters[availableCharacters[0]];
        this.renderRecruitmentScene(character, location);
    }

    renderRecruitmentScene(character, location) {
        const characterId = Object.keys(GAME_DATA.characters).find(k => GAME_DATA.characters[k] === character);
        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                </div>
                <div class="content">
                    <div class="recruitment-scene">
                        <div class="character-display">
                            <img src="images/${characterId}.jpg" alt="${character.name}" class="character-image">
                        </div>
                        <div class="character-info">
                            <h3>${character.name}</h3>
                            <p><strong>年齢:</strong> ${character.age}歳</p>
                            <p><strong>職業:</strong> ${character.job}</p>
                            <p><strong>役割:</strong> ${character.role}</p>
                        </div>
                        <div class="character-story">
                            <p>${character.story}</p>
                        </div>
                        <div class="recruitment-choices">
                            <h4>どうやって勧誘する？</h4>
                            <button class="btn btn-choice" onclick="game.recruitCharacter('${Object.keys(GAME_DATA.characters).find(k => GAME_DATA.characters[k] === character)}', 'love')">
                                ❤️ チームへの愛情で説得する
                            </button>
                            <button class="btn btn-choice" onclick="game.recruitCharacter('${Object.keys(GAME_DATA.characters).find(k => GAME_DATA.characters[k] === character)}', 'logic')">
                                🧠 理屈で説得する
                            </button>
                            <button class="btn btn-choice" onclick="game.recruitCharacter('${Object.keys(GAME_DATA.characters).find(k => GAME_DATA.characters[k] === character)}', 'force')">
                                💪 力で強制する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    recruitCharacter(characterId, method) {
        const character = GAME_DATA.characters[characterId];
        let success = false;
        let message = '';

        // 粗易的な成功判定ロジック
        if (method === 'love') {
            success = Math.random() > 0.3;
            message = success ? 
                `${character.name}はチームへの愛情に心を打たれ、仲間に加わった！` :
                `${character.name}は考えさせてくれと言った。別の方法を試してみよう。`;
        } else if (method === 'logic') {
            success = Math.random() > 0.4;
            message = success ? 
                `${character.name}は理策に納得し、仲間に加わった！` :
                `${character.name}は納得しなかった。別の方法を試してみよう。`;
        } else {
            success = Math.random() > 0.5;
            message = success ? 
                `${character.name}は圧倒され、仲間に加わった！` :
                `${character.name}は逃げ出してしまった。別の方法を試してみよう。`;
        }

        if (success) {
            this.state.recruitedMembers.push(characterId);
            this.state.teamMorale += 10;
        }

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                </div>
                <div class="content">
                    <div class="recruitment-result">
                        <p>${message}</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.renderAfternoon()">戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    nextPhase() {
        this.state.currentPhase++;
        if (this.state.currentPhase >= GAME_CONSTANTS.PHASES_PER_DAY) {
            this.nextDay();
        } else {
            this.renderDay();
        }
    }

    nextDay() {
        this.state.currentDay++;
        this.state.currentPhase = 0;

        if (this.state.currentDay > GAME_CONSTANTS.MAX_DAYS) {
            this.startBattle();
        } else {
            this.renderDay();
        }
    }

    goToExploration() {
        this.nextPhase();
    }

    restAtHome() {
        this.state.teamMorale = Math.min(100, this.state.teamMorale + 10);
        this.nextPhase();
    }

    startBattle() {
        this.state.battleActive = true;
        this.renderBattle();
    }

    renderBattle() {
        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>試合当日 - 対決パート</h2>
                </div>
                <div class="content">
                    <div class="battle-scene">
                        <h3>敵チームのサポーターが現れた！</h3>
                        <div class="battle-info">
                            <p>あなたのチーム: ${this.state.recruitedMembers.length}人</p>
                            <p>敵チーム: 5人</p>
                        </div>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.executeBattle()">戦闘開始</button>
                            <button class="btn btn-secondary" onclick="game.attemptNegotiation()">交渉を試みる</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    executeBattle() {
        // 簡易的なバトルシミュレーション
        const playerStrength = this.state.recruitedMembers.length * 50;
        const enemyStrength = 250;
        const playerWins = playerStrength > enemyStrength;

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>試合当日 - 対決パート</h2>
                </div>
                <div class="content">
                    <div class="battle-result">
                        ${playerWins ? `
                            <h3>🎉 勝利！</h3>
                            <p>あなたのチームは敵を圧倒した！</p>
                            <p>FCマッドドッグスの勝利は確定した。</p>
                            <p>スタジアムは歓喜に包まれた。</p>
                        ` : `
                            <h3>😢 敗北...</h3>
                            <p>敵の方が強かった。</p>
                            <p>しかし、仲間との絆は失われていない。</p>
                            <p>次のシーズンに向けて、また始めよう。</p>
                        `}
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.showEnding()">エンディングを見る</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attemptNegotiation() {
        const success = Math.random() > 0.5;
        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>試合当日 - 対決パート</h2>
                </div>
                <div class="content">
                    <div class="negotiation-result">
                        ${success ? `
                            <h3>✨ 交渉成功！</h3>
                            <p>敵チームのリーダーがあなたの言葉に耳を傾けた。</p>
                            <p>暴力ではなく、チームへの愛情で通じ合った。</p>
                            <p>互いに敬意を持ち、その場を去った。</p>
                        ` : `
                            <h3>⚠️ 交渉失敗</h3>
                            <p>敵チームは交渉に応じなかった。</p>
                            <p>戦闘は避けられない。</p>
                        `}
                        <div class="choices">
                            ${success ? `
                                <button class="btn btn-primary" onclick="game.showEnding()">エンディングを見る</button>
                            ` : `
                                <button class="btn btn-primary" onclick="game.executeBattle()">戦闘開始</button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showEnding() {
        const memberCount = this.state.recruitedMembers.length;
        let endingType = 'bad';
        let endingText = '';

        if (memberCount === 10) {
            endingType = 'good';
            endingText = `
                <h3>グッドエンディング</h3>
                <p>全員の仲間を集め、敵を圧倒した。</p>
                <p>FCマッドドッグスの勝利は確定した。</p>
                <p>スタジアムは歓喜に包まれ、全員で勝利を喜んだ。</p>
                <p>チームの未来は明るい。</p>
            `;
        } else if (memberCount >= 7) {
            endingType = 'normal';
            endingText = `
                <h3>ノーマルエンディング</h3>
                <p>${memberCount}人の仲間を集め、敵に勝利した。</p>
                <p>勝利は手にしたが、心残りがある。</p>
                <p>次のシーズンに向けて、さらに強いチームを作ろう。</p>
            `;
        } else {
            endingType = 'bad';
            endingText = `
                <h3>バッドエンディング</h3>
                <p>${memberCount}人しか仲間を集められなかった。</p>
                <p>敵に敗北してしまった。</p>
                <p>しかし、仲間との絆は失われていない。</p>
                <p>次のシーズンに向けて、また始めよう。</p>
            `;
        }

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>ゲーム終了</h2>
                </div>
                <div class="content">
                    <div class="ending">
                        ${endingText}
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.renderTitle()">タイトルに戻る</button>
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
                        <h3>ゴーゴーフーリガンについて</h3>
                        <p>このゲームは、フットボールの熱狂的なサポーター文化を題材にしたアドベンチャーゲームです。</p>
                        <h3>ゲームの流れ</h3>
                        <ul>
                            <li>7日間で仲間を集める</li>
                            <li>各日は「朝」「昼」「夜」の3時間帯に分かれている</li>
                            <li>昼間に街を探索し、NPCと会話して勧誘する</li>
                            <li>7日目の夜に試合当日となり、対決パートへ</li>
                        </ul>
                        <h3>勧誘について</h3>
                        <p>各NPCには異なる説得方法がある。相手の背景を理解し、最適な方法を選ぼう。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.renderTitle()">タイトルに戻る</button>
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
                    <h2>ゲーム情報</h2>
                </div>
                <div class="content">
                    <div class="game-info">
                        <h3>キャラクター</h3>
                        <p>10人のユニークなキャラクターがいる。各キャラクターは異なる役割と特殊スキルを持つ。</p>
                        <h3>パラメータシステム</h3>
                        <p>各キャラクターは、筋力量、体脂肪率、幸福度、モラル、学力、資産などのユニークなパラメータを持つ。</p>
                        <h3>バトルシステム</h3>
                        <p>対決パートでは、集めた仲間の数と質で戦う。複数の勝利条件がある。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="game.startGame()">ゲーム開始</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ゲーム開始
let game = new GoGoHooligan();
