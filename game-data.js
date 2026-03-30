const ASSET_VERSION = 13;

const GAME_DATA = {
    characters: {
        derek: {
            name: 'Derek Thompson',
            age: 45,
            job: '工場勤務',
            role: '防御役',
            stats: {
                strength: 75,
                bodyFat: 35,
                happiness: 30,
                morality: 60,
                education: 45,
                assets: 500
            },
            skill: {
                name: '鉄壁の守り',
                description: '味方全体の防御+30%',
                type: 'defense'
            },
            story: 'FCマッドドッグスの古参サポーター。30年以上応援している。プレイヤーの良き相談役。',
            recruitDifficulty: 'auto',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 62,
            dialogue: {
                intro: '「昼に動けるのは一度きりだ。誰に会うかで夜の空気まで変わる。」',
                success: {
                    love: '「いいだろう。まだこのクラブに懸ける価値はある。」',
                    logic: '「筋が通っている。お前の段取りに乗る。」',
                    force: '「その気迫、嫌いじゃない。前に立つぞ。」'
                },
                failure: {
                    love: '「気持ちだけじゃ足りない。今日はまだ腹が決まらん。」',
                    logic: '「理屈は分かるが、今は動く理由が弱い。」',
                    force: '「力で曲がるほど軽い男じゃない。」'
                },
                night: [
                    '「焦るな。明日も勝負は一度だけだ。」',
                    '「仲間は数より噛み合いだ。夜に頭を冷やしておけ。」'
                ],
                enemy: '「情だけで街は取れない。覚悟を見せろ。」'
            }
        },
        michael: {
            name: 'Michael Bennett',
            age: 32,
            job: '大学講師',
            role: '参謀役',
            stats: {
                strength: 40,
                bodyFat: 20,
                happiness: 70,
                morality: 85,
                education: 95,
                assets: 600
            },
            skill: {
                name: '戦術分析',
                description: '敵1体の攻撃力-25%',
                type: 'debuff'
            },
            story: '理屈っぽいが、チームへの愛情は本物。データ分析でチームの弱点を見抜く。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 54,
            dialogue: {
                intro: '「感情で突っ込むだけでは勝てない。数字を持ってきたのか？」',
                success: {
                    love: '「熱量がある。そこに理屈を足せば戦える。」',
                    logic: '「その説明なら納得できる。協力しよう。」',
                    force: '「乱暴だが、覚悟だけは伝わった。」'
                },
                failure: {
                    love: '「情熱だけでは不十分だ。根拠が欲しい。」',
                    logic: '「前提が甘い。その話には乗れない。」',
                    force: '「脅しは最も非効率だ。失敗だよ。」'
                },
                night: [
                    '「敵の並びを読むなら、まず感情より癖を見るべきだ。」',
                    '「今日の接触は悪くない。明日は別の角度から攻めよう。」'
                ],
                enemy: '「思考停止の群れには負けない。証明してみせる。」'
            }
        },
        jamie: {
            name: 'Jamie Wilson',
            age: 19,
            job: '大学生',
            role: '高速攻撃役',
            stats: {
                strength: 70,
                bodyFat: 15,
                happiness: 35,
                morality: 40,
                education: 50,
                assets: 50
            },
            skill: {
                name: '電光石火',
                description: '敵全体に2回攻撃',
                type: 'attack'
            },
            story: '若き日のプレイヤーのような熱狂的サポーター。エネルギッシュで、新しいアイデアをもたらす。',
            recruitDifficulty: 'easy',
            preferredMethod: 'love',
            secondaryMethod: 'force',
            enemyThreat: 74,
            dialogue: {
                intro: '「熱くなれる話なら聞くよ。退屈なやつは嫌いだけど。」',
                success: {
                    love: '「それだよ、それ！ その熱さなら乗れる！」',
                    logic: '「珍しく頭で納得した。悪くない。」',
                    force: '「強引だけど燃えるな。やってやるよ。」'
                },
                failure: {
                    love: '「今日はそこまで心が跳ねなかったな。」',
                    logic: '「頭で分かっても、心が動かない。」',
                    force: '「押されるだけじゃ白ける。やめとく。」'
                },
                night: [
                    '「明日も一発で決めようぜ。迷ってる時間はない。」',
                    '「街の空気がピリついてる。逆に燃えるけどね。」'
                ],
                enemy: '「こっちが本気になったら止まらないよ。」'
            }
        },
        sophie: {
            name: 'Sophie Davies',
            age: 26,
            job: '看護師',
            role: '回復役',
            stats: {
                strength: 45,
                bodyFat: 22,
                happiness: 60,
                morality: 80,
                education: 75,
                assets: 400
            },
            skill: {
                name: '癒しの手',
                description: '味方全体のHP30%回復',
                type: 'heal'
            },
            story: '女性サポーターの代表格。チームへの愛情は深いが、フーリガン活動の暴力性には悩んでいる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 38,
            dialogue: {
                intro: '「好きだからこそ、暴力に飲まれたくないの。」',
                success: {
                    love: '「その言葉なら信じたい。私も支える。」',
                    logic: '「無茶を減らす算段があるなら協力する。」',
                    force: '「怖がらせても心は動かないわ。」'
                },
                failure: {
                    love: '「気持ちは分かる。でもまだ踏み切れない。」',
                    logic: '「説明は悪くない。でも安心できない。」',
                    force: '「そのやり方だけは受け入れられない。」'
                },
                night: [
                    '「無理をしすぎないで。倒れたら元も子もないから。」',
                    '「誰かを守るためなら、私は夜でも立てる。」'
                ],
                enemy: '「誰かを傷つける側に回るなら、私は止める。」'
            }
        },
        joe: {
            name: 'Joe O\'Connor',
            age: 35,
            job: '飲食店経営',
            role: 'バフ役',
            stats: {
                strength: 65,
                bodyFat: 30,
                happiness: 50,
                morality: 55,
                education: 48,
                assets: 800
            },
            skill: {
                name: '乾杯の絆',
                description: '味方全体の攻撃力+25%、士気+15%',
                type: 'buff'
            },
            story: 'パブ「ザ・レッドライオン」のマスター。多くのサポーターの相談役でもある。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 68,
            dialogue: {
                intro: '「酒場じゃ言葉の重さがすべてだ。軽い話なら帰りな。」',
                success: {
                    love: '「クラブへの想い、まだ死んじゃいないって顔だな。」',
                    logic: '「商売の話みたいで分かりやすい。乗ろう。」',
                    force: '「乱暴だが、景気づけにはなる。」'
                },
                failure: {
                    love: '「気持ちは嫌いじゃないが、今夜は貸せない。」',
                    logic: '「採算が合わない話だ。見送るよ。」',
                    force: '「店で荒れるな。出直しな。」'
                },
                night: [
                    '「夜は言葉が本音を引きずり出す。仲間の顔を覚えておけ。」',
                    '「明日は別のツラを当たれ。街は広いようで狭い。」'
                ],
                enemy: '「この街の酒場を敵に回すと、高くつくぞ。」'
            }
        },
        kevin: {
            name: 'Kevin Murphy',
            age: 22,
            job: '建設作業員',
            role: '高火力攻撃役',
            stats: {
                strength: 90,
                bodyFat: 28,
                happiness: 25,
                morality: 30,
                education: 35,
                assets: 100
            },
            skill: {
                name: '必殺パンチ',
                description: '敵1体に150%のダメージ',
                type: 'attack'
            },
            story: '力持ちで単純だが心は優しい。チームへの愛情は誰よりも純粋。',
            recruitDifficulty: 'medium',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 86,
            dialogue: {
                intro: '「難しいことは分かんねえ。でも、熱い話なら好きだ。」',
                success: {
                    love: '「それなら殴る理由になる。行こうぜ！」',
                    logic: '「よく分かんねえけど、お前の顔は本気だな。」',
                    force: '「上等だ、真正面からやろうぜ！」'
                },
                failure: {
                    love: '「今日はまだ拳が動かねえな……。」',
                    logic: '「話が難しすぎる。置いていくなよ。」',
                    force: '「挑発だけなら乗らねえ。タイミングが悪い。」'
                },
                night: [
                    '「明日も殴る相手がいるなら、ちゃんと寝とけよ。」',
                    '「考えるのは苦手だけど、味方なら最後まで守る。」'
                ],
                enemy: '「こっちに立つなら、手加減しないからな。」'
            }
        },
        margaret: {
            name: 'Margaret Brown',
            age: 48,
            job: '学校教員',
            role: '知恵役',
            stats: {
                strength: 50,
                bodyFat: 26,
                happiness: 65,
                morality: 90,
                education: 90,
                assets: 700
            },
            skill: {
                name: '教えの力',
                description: '敵1体の攻撃力-40%',
                type: 'debuff'
            },
            story: 'プレイヤーの高校時代の恩師。当時からチームの応援をしていた。',
            recruitDifficulty: 'easy',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 40,
            dialogue: {
                intro: '「大声より、筋の通った言葉を聞かせなさい。」',
                success: {
                    love: '「情熱を理性で支えられるなら十分です。」',
                    logic: '「その話なら生徒にも胸を張って語れます。」',
                    force: '「乱暴ですが、覚悟だけは見えました。」'
                },
                failure: {
                    love: '「志は感じますが、まだ未熟ですね。」',
                    logic: '「論が粗い。やり直しです。」',
                    force: '「威圧は教育になりません。論外です。」'
                },
                night: [
                    '「夜こそ人柄が出ます。仲間への言葉遣いに気を付けなさい。」',
                    '「感情は否定しません。ただし制御しなさい。」'
                ],
                enemy: '「未熟な群れを見過ごすほど甘くはありません。」'
            }
        },
        ryan: {
            name: 'Ryan Foster',
            age: 24,
            job: '映像クリエイター',
            role: '特殊効果役',
            stats: {
                strength: 48,
                bodyFat: 18,
                happiness: 55,
                morality: 45,
                education: 65,
                assets: 200
            },
            skill: {
                name: 'メディア戦',
                description: '敵全体の士気-20%',
                type: 'debuff'
            },
            story: 'SNSでチームの応援動画を配信している。新しい形のサポーター活動を実践中。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 57,
            dialogue: {
                intro: '「街の空気は編集できない。でも見せ方は変えられる。」',
                success: {
                    love: '「画になる熱さだ。撮る価値がある。」',
                    logic: '「狙いが明確だね。拡散する。」',
                    force: '「荒いけど、素材としては強い。」'
                },
                failure: {
                    love: '「熱いけど、まだ物語が弱い。」',
                    logic: '「見せる順番が悪い。刺さらないよ。」',
                    force: '「雑音が多すぎる。今日は乗れない。」'
                },
                night: [
                    '「明日は見せ場を作ろう。街はドラマに飢えてる。」',
                    '「敵の空気を削るのも戦い方の一つだ。」'
                ],
                enemy: '「映りの悪い負け方、したくないだろ？」'
            }
        },
        george: {
            name: 'George Harris',
            age: 55,
            job: '退職者',
            role: '精神的支柱',
            stats: {
                strength: 55,
                bodyFat: 40,
                happiness: 45,
                morality: 75,
                education: 60,
                assets: 1200
            },
            skill: {
                name: '人生の誇り',
                description: '味方全体の士気+40%、攻撃力+15%',
                type: 'buff'
            },
            story: '人生の大部分をチームの応援に費やしてきた。多くのサポーターから尊敬されている。',
            recruitDifficulty: 'easy',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 64,
            dialogue: {
                intro: '「若いの、熱はいい。だが誇りの置き場所を間違えるな。」',
                success: {
                    love: '「その誇りなら、まだ肩を貸せる。」',
                    logic: '「年寄りにも分かる話だ。悪くない。」',
                    force: '「荒いが、若さとしては本物だな。」'
                },
                failure: {
                    love: '「今日は胸が動かん。言葉が軽い。」',
                    logic: '「策はあっても魂が足りない。」',
                    force: '「力任せの誇りは長持ちしない。」'
                },
                night: [
                    '「勝ち方より、終わった後に胸を張れるかを考えろ。」',
                    '「長く残るのは、叫び声じゃなく背中の記憶だ。」'
                ],
                enemy: '「誇りなき群れには、こちらも容赦せん。」'
            }
        },
        victor: {
            name: 'Victor Blackwell',
            age: 46,
            job: 'ナイトラウンジ経営',
            role: '資金支援型バフ役',
            stats: {
                strength: 58,
                bodyFat: 24,
                happiness: 62,
                morality: 22,
                education: 81,
                assets: 1500
            },
            skill: {
                name: '黄金の口利き',
                description: '味方全体の攻撃力+20%、士気+20%',
                type: 'buff'
            },
            story: '夜の街を仕切るフィクサー。暴れはしないが、金と人脈で盤面をひっくり返す。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 77,
            dialogue: {
                intro: '「人も金も、動かすには値打ちを見せてもらう必要がある。」',
                success: {
                    love: '「熱だけの客かと思ったが、少しは価値がある。」',
                    logic: '「その条件ならこちらも札を切ろう。」',
                    force: '「強引だが胆力は認める。面白い。」'
                },
                failure: {
                    love: '「感傷だけでは勘定が合わない。」',
                    logic: '「数字が足りない。今の提案は弱い。」',
                    force: '「脅しで動くほど安い男に見えるか？」'
                },
                night: [
                    '「夜は人脈が効く。昼の一手を無駄にするなよ。」',
                    '「明日拾うべき人間は、熱より利が見える者だ。」'
                ],
                enemy: '「こちらに立てなかった時点で、お前はもう遅れている。」'
            }
        },
        ethan: {
            name: 'Ethan Mercer',
            age: 19,
            job: '大学生',
            role: '情報解析型デバフ役',
            stats: {
                strength: 28,
                bodyFat: 13,
                happiness: 48,
                morality: 78,
                education: 97,
                assets: 90
            },
            skill: {
                name: '戦況プロファイル',
                description: '敵1体の攻撃力-35%、敵全体の士気-10%',
                type: 'debuff'
            },
            story: '気弱そうに見えるが観察眼は鋭い。相手の癖や隊列を見抜く頭脳担当。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 43,
            dialogue: {
                intro: '「ぼ、僕でも役に立つなら……話を聞きます。」',
                success: {
                    love: '「その言い方なら、信じてみたいです。」',
                    logic: '「理屈は十分です。協力できます。」',
                    force: '「怖かったけど……覚悟は伝わりました。」'
                },
                failure: {
                    love: '「気持ちは分かるけど、まだ不安です。」',
                    logic: '「計算が合いません。危険すぎます。」',
                    force: '「そのやり方は、僕には無理です。」'
                },
                night: [
                    '「敵の視線、今日かなり右に流れていました。次は突けます。」',
                    '「会話の温度差って、戦いの前兆になるんです。」'
                ],
                enemy: '「分析では、あなたたちの隙の方が目立っています。」'
            }
        },
        roxynia: {
            name: 'Roxy & Nia Hart',
            age: 22,
            job: 'ライブハウス店員ユニット',
            role: '連携攻撃役',
            stats: {
                strength: 72,
                bodyFat: 16,
                happiness: 61,
                morality: 34,
                education: 49,
                assets: 180
            },
            skill: {
                name: 'ツイン・ノイズ',
                description: '敵全体に2連撃、低確率で敵士気-15%',
                type: 'attack'
            },
            story: '行動も発言も常にセットのパンク双子ユニット。挑発と突撃のテンポが異様に噛み合う。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'force',
            enemyThreat: 82,
            dialogue: {
                intro: '「ねえ、退屈な話じゃないよね？」「つまんないなら帰るけど。」',
                success: {
                    love: '「その熱、好き。」「今夜からうちらが鳴らす。」',
                    logic: '「珍しく理屈で刺さった。」「まあ、悪くない。」',
                    force: '「挑発上等。」「だったら派手にいこうよ。」'
                },
                failure: {
                    love: '「悪くないけど、今日は乗れない。」「気分じゃないね。」',
                    logic: '「頭で分かってもノれない。」「音が足りない。」',
                    force: '「雑に押すだけじゃダメ。」「センスがない。」'
                },
                night: [
                    '「夜は騒いだ方が勝ち。」「でも明日の一手は外すなよ。」',
                    '「敵が静かなら不気味。」「うちらは音で崩すけどね。」'
                ],
                enemy: '「こっちのノイズ、耐えられる？」「耳じゃなく心が割れるよ。」'
            }
        },
        graham: {
            name: 'Graham Pike',
            age: 39,
            job: '民間警備会社主任',
            role: '制圧型防御役',
            stats: {
                strength: 91,
                bodyFat: 27,
                happiness: 31,
                morality: 41,
                education: 52,
                assets: 420
            },
            skill: {
                name: 'ライオット・ライン',
                description: '味方全体の防御+35%、敵1体の行動威力-20%',
                type: 'defense'
            },
            story: '現場叩き上げの警備主任。秩序への執着が強く、乱戦では隊列を押し戻す壁になる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'force',
            enemyThreat: 88,
            dialogue: {
                intro: '「混乱を制するのは声の大きさじゃない。並びと圧だ。」',
                success: {
                    love: '「情で現場は回らんが、芯は見えた。」',
                    logic: '「配置が見えている。なら組める。」',
                    force: '「威圧の質は悪くない。使える。」'
                },
                failure: {
                    love: '「甘い。感傷では隊列は保てん。」',
                    logic: '「詰めが浅い。現場を知らない話だ。」',
                    force: '「半端な圧で俺は動かせない。」'
                },
                night: [
                    '「明日は前に出す人間を絞れ。列が乱れると全部崩れる。」',
                    '「夜に考えるべきは勇気じゃない。配置だ。」'
                ],
                enemy: '「列を乱した時点で、お前たちの負けだ。」'
            }
        },
        malcolm: {
            name: 'Dr. Malcolm Reed',
            age: 44,
            job: '闇医者',
            role: '危険回復型ヒーラー',
            stats: {
                strength: 49,
                bodyFat: 21,
                happiness: 18,
                morality: 19,
                education: 93,
                assets: 640
            },
            skill: {
                name: 'ブラック・メディック',
                description: '味方全体のHP30%回復、さらに1ターン攻撃力+10%',
                type: 'heal'
            },
            story: '正規ルートから外れた医療屋。治療の腕は確かだが、やり方は常に危うい。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'force',
            enemyThreat: 71,
            dialogue: {
                intro: '「助ける価値がある人間かどうか、それだけが興味だ。」',
                success: {
                    love: '「感傷は嫌いだが、その執着は嫌いじゃない。」',
                    logic: '「理にかなっている。なら手を貸そう。」',
                    force: '「脅しで動くのは趣味じゃないが、覚悟は見えた。」'
                },
                failure: {
                    love: '「優しさだけでは死体が増える。」',
                    logic: '「処置の順番が悪い。協力はしない。」',
                    force: '「その程度の圧で針は握らない。」'
                },
                night: [
                    '「夜は傷が浮く時間だ。明日までに立て直しておけ。」',
                    '「生き残るだけなら方法はいくらでもある。勝つなら別だがね。」'
                ],
                enemy: '「救う側に立てなかったなら、切り捨てるだけだ。」'
            }
        },
        vanessa: {
            name: 'Vanessa Crowe',
            age: 34,
            job: 'イベントオーガナイザー',
            role: '士気支配型バフ役',
            stats: {
                strength: 56,
                bodyFat: 33,
                happiness: 67,
                morality: 38,
                education: 71,
                assets: 980
            },
            skill: {
                name: 'クイーンズ・コール',
                description: '味方全体の士気+35%、敵全体の士気-10%',
                type: 'buff'
            },
            story: '場の空気を掌握するカリスマ。ひと声で人の感情を動かし、空間そのものを支配する。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 73,
            dialogue: {
                intro: '「空気は待たないわ。あなたの言葉でこの夜を変えられる？」',
                success: {
                    love: '「その情熱、舞台に上げる価値があるわ。」',
                    logic: '「計算と華、両方あるなら手を貸す。」',
                    force: '「荒いけれど、勢いは本物ね。」'
                },
                failure: {
                    love: '「熱はある。でもまだ人を動かすには弱い。」',
                    logic: '「理屈は綺麗。でも心が震えない。」',
                    force: '「無骨すぎる。美しくないわ。」'
                },
                night: [
                    '「夜の空気は味方にも敵にもなる。先に掴んだ方が勝ちよ。」',
                    '「明日は誰を主役にするか、ちゃんと選びなさい。」'
                ],
                enemy: '「空気を奪われた時点で、あなたたちはもう遅い。」'
            }
        },
        marcus: {
            name: 'Marcus Vale',
            age: 36,
            job: '元服役囚',
            role: '威圧型前衛',
            stats: {
                strength: 94,
                bodyFat: 18,
                happiness: 24,
                morality: 29,
                education: 37,
                assets: 60
            },
            skill: {
                name: '無言の威圧',
                description: '敵全体の攻撃力-15%、味方前衛の防御+20%',
                type: 'debuff'
            },
            story: '過去は重いが、筋を通すことだけは曲げない。無言の圧で相手をひるませる前衛。',
            recruitDifficulty: 'medium',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 90,
            dialogue: {
                intro: '「言い訳はいらない。ここに立つ理由だけ言え。」',
                success: {
                    love: '「筋が通ってる。なら背中を預ける。」',
                    logic: '「言葉は多いが、芯は感じた。」',
                    force: '「その眼なら信用できる。前に出る。」'
                },
                failure: {
                    love: '「綺麗ごとが多い。今日は違う。」',
                    logic: '「言葉が先走ってる。軽い。」',
                    force: '「その程度の圧で俺は折れない。」'
                },
                night: [
                    '「明日も一度きりなら、迷うな。迷いは匂いになる。」',
                    '「敵より先に自分を固めろ。崩れると音がする。」'
                ],
                enemy: '「こちらに立てなかった時点で、お前は敵だ。」'
            }
        },
        nate: {
            name: 'Nate Holloway',
            age: 31,
            job: '無所属フーリガン',
            role: '狂戦士型高火力アタッカー',
            stats: {
                strength: 99,
                bodyFat: 9,
                happiness: 11,
                morality: 4,
                education: 23,
                assets: 40
            },
            skill: {
                name: 'ブラッド・キック',
                description: '敵1体に180%ダメージ、低確率で追加20%ダメージ',
                type: 'attack'
            },
            story: '勝敗よりも破壊衝動が先に立つ危険人物。扱いづらいが、刺さる相手には一撃で試合を壊す。',
            recruitDifficulty: 'hard',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 99,
            dialogue: {
                intro: '「退屈だけは殺してくれよ。じゃなきゃ意味がない。」',
                success: {
                    love: '「その狂い方、嫌いじゃない。」',
                    logic: '「頭で分かったわけじゃない。でも壊せそうだ。」',
                    force: '「いいね、血の匂いがする。」'
                },
                failure: {
                    love: '「熱が足りない。眠くなる。」',
                    logic: '「理屈？ そんなもので殴れるのか？」',
                    force: '「半端だな。もっと来いよ。」'
                },
                night: [
                    '「夜はいい。街の歯ぎしりがよく聞こえる。」',
                    '「明日も一回だけ？ なら一回を壊れるまで振れ。」'
                ],
                enemy: '「お前らの一歩目から噛み砕いてやる。」'
            }
        },
        jake: {
            name: 'Jake Hunter',
            age: 52,
            job: '敵サポーター集団の統率者',
            role: '圧殺型ボス',
            stats: {
                strength: 93,
                bodyFat: 26,
                happiness: 14,
                morality: 6,
                education: 28,
                assets: 950
            },
            skill: {
                name: 'ヘル・マーチ',
                description: '敵全体の攻撃力+25%、威圧で士気-10%',
                type: 'buff'
            },
            story: '敵チームの過激派を束ねる統率者。武装した威圧感と冷酷さで群衆を従わせ、自ら前線に立つ。',
            recruitDifficulty: 'hard',
            preferredMethod: 'force',
            secondaryMethod: 'logic',
            enemyThreat: 97,
            dialogue: {
                intro: '「俺を口説くなら、言葉か拳のどちらかで黙らせてみろ。」',
                success: {
                    love: '「狂ってるな。だが、その執念は認める。」',
                    logic: '「面白い理屈だ。今回はお前の側で試してやる。」',
                    force: '「その圧なら前線に立てる。来い。」'
                },
                failure: {
                    love: '「情では俺は曲がらん。」',
                    logic: '「綺麗すぎる。血の匂いがしない。」',
                    force: '「その程度の威圧なら笑えるな。」'
                },
                night: [
                    '「夜は裏切りが一番よく見える。仲間の目を見ておけ。」',
                    '「明日の一手で敵になるか味方になるか、それだけだ。」'
                ],
                enemy: '「こちらに回らなかったこと、後で悔やめ。」'
            }
        }
    },

    gameProgress: {
        currentDay: 1,
        currentPhase: 'morning',
        recruitedMembers: ['derek'],
        teamMorale: 100,
        teamExperience: 0,
        dayActionTaken: false,
        currentEncounterId: null,
        currentLocationId: null,
        nightConversationIds: [],
        nightConversationId: null,
        lastNightSpeakerIds: [],
        lastNightSpeakerId: null
    },

    locations: {
        pub: {
            name: 'パブ「ザ・レッドライオン」',
            description: '古参サポーターが群れ、裏の話も表の話も酒と一緒に流れる。',
            characters: ['derek', 'joe', 'victor', 'vanessa', 'jake'],
            recruitmentTopic: '誇りと取引'
        },
        park: {
            name: 'セントラルパーク',
            description: '若い連中や流れ者がたむろし、勢いとノリがぶつかる。',
            characters: ['jamie', 'ryan', 'george', 'ethan', 'roxynia', 'marcus', 'nate'],
            recruitmentTopic: '熱と衝動'
        },
        street: {
            name: '商店街「ハイストリート」',
            description: '市民も裏稼業も交差する、噂と利害の密集地帯。',
            characters: ['michael', 'kevin', 'margaret', 'sophie', 'graham', 'malcolm'],
            recruitmentTopic: '理屈と生活'
        }
    }
};

const GAME_CONSTANTS = {
    MAX_DAYS: 7,
    PHASES_PER_DAY: 3,
    INITIAL_MORALE: 100,
    BATTLE_TURNS_MIN: 10,
    BATTLE_TURNS_MAX: 15,
    DEFAULT_ALLY_LIMIT: 8,
    ENEMY_LINEUP_SIZE: 4
};

let gameState = {
    currentDay: 1,
    currentPhase: 0,
    recruitedMembers: ['derek'],
    teamMorale: 100,
    teamExperience: 0,
    gameOver: false,
    battleActive: false,
    dayActionTaken: false,
    finalBattleResult: null,
    currentEncounterId: null,
    currentLocationId: null,
    nightConversationIds: [],
    nightConversationId: null,
    lastNightSpeakerIds: [],
    lastNightSpeakerId: null
};
