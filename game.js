
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
                    <button class="btn btn-primary" onclick="window.game.startGame()">ゲーム開始</button>
                    <button class="btn btn-secondary" onclick="window.game.showHelp()">ヘルプ</button>
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
        const phaseNames = ['朝', '昼', '夜'];
        const phaseName = phaseNames[this.state.currentPhase];
        
        if (this.state.currentPhase === 0) {
            return this.renderMorning();
        } else if (this.state.currentPhase === 1) {
            return this.renderAfternoon();
        } else if (this.state.currentPhase === 2) {
            return this.renderNight();
        }
    }

    renderMorning() {
        if (this.state.currentDay === 1 && this.state.recruitedMembers.length === 0) {
            return `
                <div class="tutorial">
                    <div class="character-info">
                        <img src="images/derek.jpg" alt="Derek Thompson" class="character-image">
                        <h3>Derek Thompson</h3>
                    </div>
                    <p>よお、ボス。聞いてくれ。</p>
                    <p>FCマッドドッグスは、ビッチだ。日頃の試合までに、仲間を集めて、敵チームのサポーターを駆逐しなくてはならん。</p>
                    <p>お前なら、できるはずだ。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.advancePhase()">了解した。仲間を集めよう。</button>
                        <button class="btn btn-secondary" onclick="window.game.showGameInfo()">ゲームについて詳しく知りたい</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="morning-scene">
                    <p>朝日が昇った。新しい一日が始まる。</p>
                    <p>昼間に仲間を集めるか、夜に敵の動きを探るか。</p>
                    <div class="choices">
                        <button class="btn btn-primary" onclick="window.game.advancePhase()">昼間に向かう</button>
                    </div>
                </div>
            `;
        }
    }

    renderAfternoon() {
        const locations = [
            { id: 'pub', name: '🍺 パブ「ザ・レッドライオン」', description: 'パブ。街は活気に満ちている。どこに行く？' },
            { id: 'park', name: '🌳 セントラルパーク', description: 'セントラルパーク。街は活気に満ちている。どこに行く？' },
            { id: 'street', name: '🏪 商店街「ハイストリート」', description: '商店街「ハイストリート」。街は活気に満ちている。どこに行く？' }
        ];

        let locationButtons = locations.map(loc => 
            `<button class="btn btn-location" onclick="window.game.visitLocation('${loc.id}')">${loc.name}</button>`
        ).join('');

        return `
            <div class="afternoon-scene">
                <p>昼間だ。街は活気に満ちている。どこに行く？</p>
                <div class="location-buttons">
                    ${locationButtons}
                </div>
            </div>
        `;
    }

    renderNight() {
        return `
            <div class="night-scene">
                <p>夜が訪れた。敵チームの動きを探ったり、仲間と作戦を立てたりできる。</p>
                <div class="choices">
                    <button class="btn btn-primary" onclick="window.game.advanceDay()">次の日へ</button>
                </div>
            </div>
        `;
    }

    visitLocation(locationId) {
        const locations = {
            'pub': 'パブ「ザ・レッドライオン」',
            'park': 'セントラルパーク',
            'street': '商店街「ハイストリート」'
        };

        const availableCharacters = Object.keys(GAME_DATA.characters).filter(
            characterId => !this.state.recruitedMembers.includes(characterId)
        );

        if (availableCharacters.length === 0) {
            this.gameScreen.innerHTML = `
                <div class="game-screen">
                    <div class="header">
                        <h2>${this.state.currentDay}日目 昼</h2>
                    </div>
                    <div class="content">
                        <p>もう仲間にできるキャラクターがいない。</p>
                        <button class="btn btn-primary" onclick="window.game.renderDay()">戻る</button>
                    </div>
                </div>
            `;
            return;
        }

        const characterId = availableCharacters[0];
        const character = GAME_DATA.characters[characterId];
        this.renderRecruitmentScene(characterId, character, locations[locationId]);
    }

    renderRecruitmentScene(characterId, character, location) {
        const methods = [
            { id: 'love', name: '❤️ チームへの愛情で説得する', successRate: 60 },
            { id: 'logic', name: '🧠 理屈で説得する', successRate: 50 },
            { id: 'force', name: '💪 力で強制する', successRate: 70 }
        ];

        let methodButtons = methods.map(method =>
            `<button class="btn btn-method" onclick="window.game.recruitCharacter('${characterId}', '${method.id}')">${method.name}</button>`
        ).join('');

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                </div>
                <div class="content">
                    <div class="character-recruitment">
                        <div class="character-card">
                            <img src="images/${characterId}.jpg" alt="${character.name}" class="character-image">
                            <h3>${character.name}</h3>
                            <p>年齢: ${character.age}歳</p>
                            <p>職業: ${character.occupation}</p>
                            <p>役割: ${character.role}</p>
                        </div>
                        <div class="character-story">
                            <p>${character.story}</p>
                            <p>どやって勧誘する？</p>
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
        if (this.state.recruitedMembers.includes(characterId)) {
            this.gameScreen.innerHTML = `
                <div class="game-screen">
                    <div class="header">
                        <h2>${this.state.currentDay}日目 昼</h2>
                    </div>
                    <div class="content">
                        <p>${GAME_DATA.characters[characterId].name}はすでに仲間だ。</p>
                        <button class="btn btn-primary" onclick="window.game.renderDay()">戻る</button>
                    </div>
                </div>
            `;
            return;
        }

        const character = GAME_DATA.characters[characterId];
        const successRates = { love: 60, logic: 50, force: 70 };
        const successRate = successRates[method];
        const success = Math.random() * 100 < successRate;

        let resultMessage = '';
        if (success) {
            resultMessage = `${character.name}はチームへの愛情に心を打たれ、仲間に加わった！`;
            this.state.recruitedMembers.push(characterId);
            this.state.teamMorale = Math.min(this.state.teamMorale + 10, 100);
        } else {
            resultMessage = `${character.name}は考えさせてくれった。別の方法を試してみよう。`;
        }

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>${this.state.currentDay}日目 昼</h2>
                </div>
                <div class="content">
                    <p>${resultMessage}</p>
                    <button class="btn btn-primary" onclick="window.game.renderDay()">戻る</button>
                </div>
            </div>
        `;
    }

    advancePhase() {
        this.state.currentPhase++;
        if (this.state.currentPhase > 2) {
            this.advanceDay();
        } else {
            this.renderDay();
        }
    }

    advanceDay() {
        this.state.currentDay++;
        this.state.currentPhase = 0;

        if (this.state.currentDay > 7) {
            this.showEnding();
        } else {
            this.renderDay();
        }
    }

    showEnding() {
        const recruitedCount = this.state.recruitedMembers.length;
        let ending = '';

        if (recruitedCount === 9) {
            ending = '完璧な勝利！全員を集めた。敵チームは圧倒的に敗北した。';
        } else if (recruitedCount >= 6) {
            ending = '大勝利！十分な仲間を集めた。敵チームを撃破した。';
        } else if (recruitedCount >= 3) {
            ending = '勝利！仲間の力で敵チームに勝った。';
        } else {
            ending = '敗北。仲間が足りず、敵チームに敗れた。';
        }

        this.gameScreen.innerHTML = `
            <div class="game-screen">
                <div class="header">
                    <h2>ゲーム終了</h2>
                </div>
                <div class="content">
                    <p>${ending}</p>
                    <p>仲間数: ${recruitedCount}/9</p>
                    <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
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
                        <p>7日間で仲間を集め、敵チームとの対決に臨む。</p>
                        <h3>キャラクター</h3>
                        <p>9人のユニークなキャラクターがいる。各キャラクターは異なる役割と特殊スキルを持つ。</p>
                        <h3>パラメータシステム</h3>
                        <p>各キャラクターは、筋力量、体脂肪率、幸福度、モラル、学力、資産などのユニークなパラメータを持つ。</p>
                        <h3>バトルシステム</h3>
                        <p>対決パートでは、集めた仲間の数と質で戦う。複数の勝利条件がある。</p>
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
                        <p>7日間でできるだけ多くの仲間を集め、敵チームとの対決に勝つ。</p>
                        <h3>ゲームの進め方</h3>
                        <p>1. 朝：新しい一日が始まる</p>
                        <p>2. 昼：街の場所を訪れて仲間を勧誘する</p>
                        <p>3. 夜：敵の動きを探ったり、作戦を立てたりする</p>
                        <h3>勧誘方法</h3>
                        <p>愛情、理屈、力の3つの方法がある。各方法で成功率が異なる。</p>
                        <div class="choices">
                            <button class="btn btn-primary" onclick="window.game.renderTitle()">タイトルに戻る</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ゲーム開始
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
