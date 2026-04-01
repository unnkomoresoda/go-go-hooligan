# AudioManager 統合ガイド

## 概要
`AudioManager` クラスを `game.js` に統合し、各ゲーム画面で効果音・音声を再生する。

## 統合手順

### 1. HTML に AudioManager を読み込む

```html
<!-- index.html -->
<script src="audio-manager.js"></script>
<script src="game.js"></script>
```

### 2. Game クラスに AudioManager をインスタンス化

```javascript
class Game {
    constructor() {
        // ... 既存コード ...
        
        // AudioManager を初期化
        this.audioManager = new AudioManager();
    }
}
```

### 3. 各再生箇所に効果音再生コードを追加

## 再生箇所と実装例

### タイトルSE

**箇所**: `renderTitleScreen()` 内

```javascript
renderTitleScreen() {
    // ... 既存コード ...
    
    // タイトル画面表示時に SE を再生
    setTimeout(() => {
        this.audioManager.playSE('title');
    }, 500);
}
```

### ボタン押下音

**箇所**: `setScreen()` 内の `click` イベント処理

```javascript
// ボタンクリック時に SE を再生
document.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        this.audioManager.playSE('button');
    }
});
```

### 勧誘成功音

**箇所**: `processRecruit()` 内（勧誘成功確定時）

```javascript
processRecruit(characterId) {
    // ... 既存コード ...
    
    if (recruitSuccess) {
        // 勧誘成功時に SE を再生
        this.audioManager.playSE('recruitSuccess');
        
        // ... 既存コード ...
    }
}
```

### 最終決戦の攻撃音

**箇所**: `resolveBattle()` 内（攻撃実行時）

```javascript
resolveBattle() {
    // ... 既存コード ...
    
    // 攻撃実行時に SE を再生
    this.audioManager.playSE('attack');
    
    // ... 既存コード ...
}
```

### 勝利ボイス

**箇所**: `resolveBattle()` 内（勝利判定時）

```javascript
resolveBattle() {
    // ... 既存コード ...
    
    if (allyTeam.length > 0 && enemyTeam.length === 0) {
        // 勝利時にボイスを再生
        this.audioManager.playVoice('victory');
        
        // ... 既存コード ...
    }
}
```

### 敗北ボイス

**箇所**: `resolveBattle()` 内（敗北判定時）

```javascript
resolveBattle() {
    // ... 既存コード ...
    
    if (allyTeam.length === 0 && enemyTeam.length > 0) {
        // 敗北時にボイスを再生
        this.audioManager.playVoice('defeat');
        
        // ... 既存コード ...
    }
}
```

## 音量調整

### デフォルト音量
```javascript
// AudioManager 初期化時
this.audioManager = new AudioManager();
// SE: 0.5 (50%), Voice: 0.8 (80%)
```

### 音量変更
```javascript
// SE の音量を 60% に設定
this.audioManager.setVolume('se', 0.6);

// ボイスの音量を 90% に設定
this.audioManager.setVolume('voice', 0.9);
```

## モバイル対応

### 自動初期化
`AudioManager` は最初のユーザー操作時に `AudioContext` を自動初期化します。

```javascript
// ボタンクリック時に自動初期化
this.audioManager.initAudioContext();
```

### 再生失敗時の処理
モバイルでの再生失敗は自動的に無視されます。

```javascript
// エラーハンドリングは AudioManager 内で実装済み
this.audioManager.playSE('button'); // 失敗時も無視
```

## トラブルシューティング

### 音声が再生されない

1. **ファイルパスを確認**
   - `audio/se/button.mp3` が存在するか確認

2. **ブラウザコンソールでエラーを確認**
   - F12 → Console タブ

3. **モバイルの場合**
   - ユーザー操作後に再生されるか確認
   - iOS Safari の場合、サイレントモード解除

### 音量が小さい / 大きい

1. **音量設定を調整**
   ```javascript
   this.audioManager.setVolume('se', 0.7); // 70%
   ```

2. **音声ファイル自体の音量を確認**
   - 音声編集ソフトで確認・調整

### 多重再生される

1. **`AudioManager` が正しく多重再生を制御しているか確認**
   - 同じ効果音が連続で再生されないか確認

2. **再生タイミングを確認**
   - 同じ処理が複数回呼ばれていないか確認

## 音声ファイル管理

### ファイル構造
```
audio/
├── se/
│   ├── title.mp3
│   ├── button.mp3
│   ├── recruit-success.mp3
│   └── attack.mp3
└── voice/
    ├── victory.mp3
    └── defeat.mp3
```

### ファイル仕様
- **形式**: MP3
- **ビットレート**: 128-192 kbps
- **サンプリングレート**: 44.1 kHz
- **ファイルサイズ**: 1MB 以下

## 今後の拡張

### BGM 追加
```javascript
// AudioManager に BGM 機能を追加
this.audioManager.playBGM('title');
this.audioManager.stopBGM();
```

### 効果音の種類追加
```javascript
// 新しい効果音をマップに追加
this.audioFiles.se.damage = 'audio/se/damage.mp3';
this.audioManager.playSE('damage');
```

### 音量設定画面
```javascript
// ユーザーが音量を調整できるようにする
<input type="range" min="0" max="100" value="50" 
       onchange="game.audioManager.setVolume('se', this.value / 100)">
```

## 参考資料

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [モバイルブラウザの音声再生制約](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_and_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html)
