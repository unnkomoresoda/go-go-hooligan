# 音量バランス・モバイル最適化ガイド

## 音量設定

### デフォルト音量レベル

| 効果音 | 音量 | 理由 |
|--------|------|------|
| タイトルSE | 0.5 (50%) | 目立つが邪魔しない |
| ボタン押下音 | 0.3 (30%) | 軽く、邪魔しない |
| 勧誘成功音 | 0.6 (60%) | 成功を強調 |
| 攻撃音 | 0.5 (50%) | 迫力を表現 |
| 勝利ボイス | 0.8 (80%) | 勝利を強調 |
| 敗北ボイス | 0.8 (80%) | 敗北を強調 |

### 音量調整コード

```javascript
// Game クラスのコンストラクタ内
this.audioManager = new AudioManager();

// 各効果音の音量を設定
this.audioManager.setVolume('se', 0.5);      // SE: 50%
this.audioManager.setVolume('voice', 0.8);   // Voice: 80%
```

### 詳細な音量調整

```javascript
// 個別に再生時に音量を調整する場合
// （AudioManager に機能追加が必要）

// 例: ボタン音は小さく
this.audioManager.playSE('button', 0.3);

// 例: 勝利ボイスは大きく
this.audioManager.playVoice('victory', 0.9);
```

## モバイル対応

### iOS Safari の制約

**制約**: ユーザー操作なしに音声を再生できない

**対応方法**:
1. 最初のユーザー操作時に `AudioContext` を初期化
2. その後、自由に音声を再生可能

```javascript
// 自動初期化（AudioManager 内で実装）
this.audioManager.initAudioContext();
```

### Android の制約

**制約**: 通常は制約なし（一部デバイスで異なる）

**対応方法**:
- 再生失敗時は無視（エラーハンドリング）

```javascript
// 再生失敗時は自動的に無視
this.audioManager.playSE('button');
```

### モバイルでの音量調整

**注意点**:
- デバイスの音量設定に依存
- アプリ内音量設定は 0-1 の範囲で調整

```javascript
// モバイルでの推奨設定
if (this.audioManager.isMobile) {
    this.audioManager.setVolume('se', 0.6);      // SE: 60%
    this.audioManager.setVolume('voice', 0.9);   // Voice: 90%
}
```

## 音量テストチェックリスト

### デスクトップ環境

- [ ] タイトルSE: 適切な音量で再生される
- [ ] ボタン押下音: 軽く、邪魔しない
- [ ] 勧誘成功音: 成功を感じさせる音量
- [ ] 攻撃音: 迫力がある
- [ ] 勝利ボイス: 大きく、目立つ
- [ ] 敗北ボイス: 大きく、目立つ
- [ ] 多重再生: 同じ音が重ならない

### モバイル環境（iPhone）

- [ ] ユーザー操作後に音が再生される
- [ ] サイレントモード解除時に音が出る
- [ ] 音量が適切（スピーカーボリュームで調整）
- [ ] 複数の音が同時に再生されない
- [ ] 画面ロック時も音が出る

### モバイル環境（Android）

- [ ] 音が再生される
- [ ] 音量が適切
- [ ] 複数の音が同時に再生されない
- [ ] 画面ロック時も音が出る

## 音声ファイルの準備

### 推奨スペック

| 項目 | 推奨値 |
|------|--------|
| 形式 | MP3 |
| ビットレート | 128-192 kbps |
| サンプリングレート | 44.1 kHz |
| チャンネル | モノラル（SE）/ ステレオ（ボイス） |
| ファイルサイズ | 1MB 以下 |

### 音声ファイル作成ガイド

#### 効果音（SE）

**タイトルSE**
- 長さ: 1-2秒
- 特徴: 荒い、重い、ストリート感
- 例: ドラムロール、ブレーク音

**ボタン押下音**
- 長さ: 0.3-0.5秒
- 特徴: 軽い、クリック感
- 例: ビープ音、クリック音

**勧誘成功音**
- 長さ: 1-2秒
- 特徴: 明るい、成功感
- 例: ファンファーレ、チャイム音

**攻撃音**
- 長さ: 0.5-1秒
- 特徴: 迫力、インパクト
- 例: パンチ音、爆発音

#### ボイス

**勝利ボイス**
- 長さ: 2-3秒
- 特徴: 興奮、喜び
- 例: 「勝ったぜ！」

**敗北ボイス**
- 長さ: 2-3秒
- 特徴: 悔しさ、落胆
- 例: 「負けちまった...」

### 音声ファイルの圧縮

```bash
# FFmpeg を使用した MP3 圧縮
ffmpeg -i input.wav -codec:a libmp3lame -q:a 4 output.mp3

# ビットレート指定
ffmpeg -i input.wav -b:a 128k output.mp3
```

## 音量バランスの微調整

### 問題: 音が小さい

**原因**:
1. 音声ファイルのレベルが低い
2. 音量設定が低い
3. デバイスの音量が低い

**対応**:
1. 音声ファイルを再度編集（ノーマライズ）
2. 音量設定を上げる: `setVolume('se', 0.7)`
3. デバイスの音量を上げる

### 問題: 音が大きい / 歪む

**原因**:
1. 音声ファイルのレベルが高い
2. 音量設定が高い
3. 複数の音が同時に再生

**対応**:
1. 音声ファイルを再度編集（ノーマライズ）
2. 音量設定を下げる: `setVolume('se', 0.4)`
3. 多重再生制御を確認

### 問題: 音が再生されない

**原因**:
1. ファイルパスが間違っている
2. ファイルが存在しない
3. ブラウザが再生をブロック

**対応**:
1. ファイルパスを確認: `audio/se/button.mp3`
2. ファイルが存在するか確認
3. ブラウザコンソールでエラーを確認

## 今後の最適化

### 音声ファイルの最適化

```javascript
// 音声ファイルをプリロード
const audioPreload = {
    'audio/se/button.mp3': true,
    'audio/se/title.mp3': true,
    'audio/voice/victory.mp3': true,
};

// ゲーム開始時にプリロード
Object.keys(audioPreload).forEach(src => {
    const audio = new Audio(src);
    audio.preload = 'auto';
});
```

### 音量設定画面の追加

```javascript
// ユーザーが音量を調整できるようにする
renderSettingsScreen() {
    return `
        <div class="settings">
            <label>SE 音量</label>
            <input type="range" min="0" max="100" 
                   value="${this.audioManager.volumeSE * 100}"
                   onchange="game.audioManager.setVolume('se', this.value / 100)">
            
            <label>ボイス音量</label>
            <input type="range" min="0" max="100"
                   value="${this.audioManager.volumeVoice * 100}"
                   onchange="game.audioManager.setVolume('voice', this.value / 100)">
        </div>
    `;
}
```

### BGM の追加

```javascript
// AudioManager に BGM 機能を追加
playBGM(name) {
    // BGM 再生（ループ）
}

stopBGM() {
    // BGM 停止
}
```
