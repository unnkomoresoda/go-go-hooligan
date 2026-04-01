# 音声ファイル管理

## フォルダ構造

```
audio/
├── se/                      # 効果音
│   ├── title.mp3           # タイトルSE
│   ├── button.mp3          # ボタン押下音
│   ├── recruit-success.mp3 # 勧誘成功音
│   └── attack.mp3          # 最終決戦の攻撃音
├── voice/                   # ボイス
│   ├── victory.mp3         # 勝利ボイス
│   └── defeat.mp3          # 敗北ボイス
└── README.md               # このファイル
```

## 音声ファイル仕様

### 効果音（SE）

#### タイトルSE (`title.mp3`)
- **用途**: タイトル画面表示時に再生
- **長さ**: 1-2秒
- **特徴**: 荒い、重い、ストリート感
- **推奨音量**: -6dB
- **例**: ドラムロール、ブレーク音、ビートドロップ

#### ボタン押下音 (`button.mp3`)
- **用途**: ボタンクリック時に再生
- **長さ**: 0.3-0.5秒
- **特徴**: 軽い、クリック感、邪魔しない
- **推奨音量**: -12dB
- **例**: ビープ音、クリック音、チャイム音

#### 勧誘成功音 (`recruit-success.mp3`)
- **用途**: 勧誘成功時に再生
- **長さ**: 1-2秒
- **特徴**: 明るい、成功感、ポジティブ
- **推奨音量**: -9dB
- **例**: ファンファーレ、チャイム音、勝利音

#### 攻撃音 (`attack.mp3`)
- **用途**: 最終決戦の攻撃時に再生
- **長さ**: 0.5-1秒
- **特徴**: 迫力、インパクト、重い
- **推奨音量**: -6dB
- **例**: パンチ音、爆発音、ヒット音

### ボイス

#### 勝利ボイス (`victory.mp3`)
- **用途**: 最終決戦勝利時に再生
- **長さ**: 2-3秒
- **特徴**: 興奮、喜び、フーリガン的
- **推奨音量**: -3dB
- **例**: 「勝ったぜ！」「やったぜ！」

#### 敗北ボイス (`defeat.mp3`)
- **用途**: 最終決戦敗北時に再生
- **長さ**: 2-3秒
- **特徴**: 悔しさ、落胆、フーリガン的
- **推奨音量**: -3dB
- **例**: 「負けちまった...」「悔しい...」

## 音声ファイル作成ガイド

### 推奨スペック

| 項目 | 推奨値 |
|------|--------|
| 形式 | MP3 |
| ビットレート | 128-192 kbps |
| サンプリングレート | 44.1 kHz |
| チャンネル | モノラル（SE）/ ステレオ（ボイス） |
| ファイルサイズ | 1MB 以下 |

### 音声ファイルの準備方法

#### 1. 既存の効果音ライブラリから取得

**推奨サイト**:
- [Freesound.org](https://freesound.org/) - 著作権フリー効果音
- [Zapsplat](https://www.zapsplat.com/) - 無料効果音
- [BBC Sound Effects Library](https://sound-effects.bbcrewind.co.uk/) - BBC 効果音

#### 2. AI で生成

**推奨ツール**:
- [Eleven Labs](https://elevenlabs.io/) - AI ボイス生成
- [Google Text-to-Speech](https://cloud.google.com/text-to-speech) - テキスト音声変換

#### 3. 自分で録音

**推奨ツール**:
- [Audacity](https://www.audacityteam.org/) - 無料音声編集ソフト
- [GarageBand](https://www.apple.com/garageband/) - Mac 内蔵音声編集

### 音声ファイルの編集・変換

#### FFmpeg を使用した MP3 変換

```bash
# WAV から MP3 に変換
ffmpeg -i input.wav -codec:a libmp3lame -q:a 4 output.mp3

# ビットレート指定
ffmpeg -i input.wav -b:a 128k output.mp3

# サンプリングレート変更
ffmpeg -i input.wav -ar 44100 -b:a 128k output.mp3

# 長さを制限（最初の 2 秒）
ffmpeg -i input.wav -t 2 -b:a 128k output.mp3
```

#### Audacity での編集

1. ファイルを開く: File → Open
2. 不要な部分を削除: Select → Trim Audio
3. 音量を調整: Effect → Normalize
4. MP3 に書き出す: File → Export → Export as MP3

### 音声ファイルのノーマライズ

**目的**: 音量を統一し、歪みを防ぐ

```bash
# FFmpeg でノーマライズ
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 output.mp3
```

## ファイルアップロード手順

### 1. 音声ファイルを作成・編集

- 上記のガイドに従って音声ファイルを作成
- MP3 形式で保存
- ファイルサイズが 1MB 以下か確認

### 2. ファイルをプロジェクトに追加

```bash
# SE をアップロード
cp title.mp3 audio/se/
cp button.mp3 audio/se/
cp recruit-success.mp3 audio/se/
cp attack.mp3 audio/se/

# ボイスをアップロード
cp victory.mp3 audio/voice/
cp defeat.mp3 audio/voice/
```

### 3. Git にコミット

```bash
git add audio/
git commit -m "feat: add audio files for game effects and voices"
git push origin main
```

## チェックリスト

### ファイル作成

- [ ] `audio/se/title.mp3` - タイトルSE
- [ ] `audio/se/button.mp3` - ボタン押下音
- [ ] `audio/se/recruit-success.mp3` - 勧誘成功音
- [ ] `audio/se/attack.mp3` - 攻撃音
- [ ] `audio/voice/victory.mp3` - 勝利ボイス
- [ ] `audio/voice/defeat.mp3` - 敗北ボイス

### ファイル仕様確認

- [ ] 全ファイルが MP3 形式
- [ ] ビットレート: 128-192 kbps
- [ ] サンプリングレート: 44.1 kHz
- [ ] ファイルサイズ: 1MB 以下
- [ ] 長さが仕様内

### 音質確認

- [ ] 音が歪んでいない
- [ ] 音量が適切
- [ ] ノイズがない
- [ ] 音が明確に聞こえる

### 統合確認

- [ ] AudioManager が正しく再生する
- [ ] 多重再生が制御されている
- [ ] 音量バランスが適切
- [ ] モバイルで再生される

## トラブルシューティング

### ファイルが再生されない

1. **ファイルパスを確認**
   - `audio/se/button.mp3` が存在するか確認

2. **ファイル形式を確認**
   - MP3 形式か確認
   - 破損していないか確認

3. **ブラウザコンソールでエラーを確認**
   - F12 → Console タブ

### 音が小さい / 大きい

1. **ファイルの音量を確認**
   - 音声編集ソフトで確認

2. **ノーマライズを実行**
   - FFmpeg でノーマライズ

3. **AudioManager の音量設定を確認**
   - `setVolume()` で調整

### 多重再生される

1. **AudioManager が正しく制御しているか確認**
   - 同じ効果音が連続で再生されないか確認

2. **再生タイミングを確認**
   - 同じ処理が複数回呼ばれていないか確認

## 今後の拡張

- BGM 追加（タイトル、戦闘、勝利など）
- 効果音の種類追加（ダメージ音、回復音など）
- 音声言語の切り替え
- 音量設定画面の追加
