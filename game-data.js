const ASSET_VERSION = 26;

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
            story: '油と煤の匂いが染みついた作業着のまま、三十年以上スタンドに立ち続けてきた古参。派手さはないが、街の熱がどこへ流れるかを誰より早く嗅ぎ取り、若い連中の暴走も静かな一言で止める。プレイヤーにとっては、勝ち方よりも立ち方を教えてくれる古い灯台のような存在だ。',
            recruitDifficulty: 'auto',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 62,
            dialogue: {
                intro: '「昼に動けるのは一度きりだ。その一手で夜の空気まで変わる。だからこそ、誰に声をかけるかを雑に決めるな。」',
                success: {
                    love: '「その目なら信じられる。まだこのクラブに賭ける理由は、俺たちの側に残ってる。」',
                    logic: '「段取りが見えているな。なら俺も古いやり方だけじゃなく、お前の列に並ぼう。」',
                    force: '「気迫だけで押し切る気か。いい、嫌いじゃない。その代わり最後まで先頭を歩け。」'
                },
                failure: {
                    love: '「想いは分かる。だが今の言葉じゃ、長い夜を越えるだけの重さが足りない。」',
                    logic: '「筋はあるが、腹に落ちるにはもう一歩だ。今はまだ動けん。」',
                    force: '「圧だけで人は預けられない。俺を前に立たせたいなら、背中の理由を見せろ。」'
                },
                night: [
                    '「夜は声が大きい奴より、黙って残る奴の本音が見える。仲間の沈黙もちゃんと聞いておけ。」',
                    '「数が揃っても、心がばらけりゃただの群れだ。明日は誰と噛み合わせるか、寝る前に考えろ。」'
                ],
                enemy: '「情だけじゃ街は守れん。だが情のない連中に、この通りを渡す気もない。」'
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
            story: '講義室では冷静な理論家として知られるが、試合日になるとノートの余白はフォーメーションと路地の導線で埋まる。人の感情を数字で切る癖がある一方で、クラブの凋落だけは理屈では割り切れず、敗戦の夜ほど眠れなくなる。勝算を語る時の声には、知性より先に執念がにじむ。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 54,
            dialogue: {
                intro: '「感情で突っ込む群れは燃え尽きるだけだ。君の話には、熱以外の根拠もちゃんとあるのか？」',
                success: {
                    love: '「感情論だと思ったが、核がある。その熱を理屈で支えれば、十分戦える。」',
                    logic: '「いい説明だ。前提も結論も噛み合っている。なら僕は計算役として加わろう。」',
                    force: '「やり方は荒い。だが、退路を断っていることだけは理解できた。」'
                },
                failure: {
                    love: '「情熱は認める。でも情熱だけで隊列は持たない。数字の裏付けが欲しい。」',
                    logic: '「前提が崩れている。その計画では味方を消耗させるだけだ。」',
                    force: '「威圧は議論の敗北だよ。そんな雑な方法に僕は乗れない。」'
                },
                night: [
                    '「敵の癖は歩幅と視線に出る。怒鳴り声より先に、足運びを観察しておくべきだ。」',
                    '「今日の一手は悪くない。けれど勝負を決めるのは、明日その情報をどう繋ぐかだ。」'
                ],
                enemy: '「考えることを捨てた群れに、僕たちの街を明け渡すつもりはない。」'
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
            story: '古い応援歌を知らなくても、今の熱を誰より大きく鳴らせる新世代のサポーター。走り出したら止まらない衝動と、空気が沈んだ瞬間に真っ先に声を上げる胆力を持つ。危うさもあるが、その危うさこそが停滞した街に新しい火花を落とす。',
            recruitDifficulty: 'easy',
            preferredMethod: 'love',
            secondaryMethod: 'force',
            enemyThreat: 74,
            dialogue: {
                intro: '「退屈な話なら三秒で帰る。でもさ、心臓を叩くような話なら最後まで聞くよ。」',
                success: {
                    love: '「それだ、それ！ そういう熱を待ってたんだよ。だったら俺も全力で燃える！」',
                    logic: '「理屈で来るとは思わなかった。でも嫌いじゃない。ちゃんと筋があるなら走れる。」',
                    force: '「強引で乱暴、でも火はついた。だったら派手にやろうぜ。」'
                },
                failure: {
                    love: '「悪くはないけど、まだ胸の奥まで届いてない。今日は飛び込めないな。」',
                    logic: '「頭では分かる。でもそれだけじゃ靴は前に出ないんだよ。」',
                    force: '「押されるだけって一番つまらない。俺を乗せたいなら、もっと燃やしてくれ。」'
                },
                night: [
                    '「明日も一回勝負なんだろ？ なら迷う時間まで熱に変えようぜ。」',
                    '「街がピリついてる時ほど面白い。火花が散るなら、こっちはもっと派手に光ればいい。」'
                ],
                enemy: '「本気になったこっちのスピード、簡単には止められないよ。」'
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
            story: '救急外来で何度も無茶の後始末を見てきた看護師。クラブへの愛は深いが、愛の名で人が壊れていく光景には誰より敏感で、熱狂と暴力の境界線をいつも睨んでいる。だからこそ彼女がこちらに立つ時、それは単なる同調ではなく、痛みごと引き受ける覚悟の証になる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 38,
            dialogue: {
                intro: '「好きだからこそ、何でも許せるわけじゃないの。守りたいなら、その先で誰を傷つけるのかまで考えて。」',
                success: {
                    love: '「その言葉なら信じたい。痛みまで見ようとしてくれるなら、私もそばに立てる。」',
                    logic: '「無茶を減らす手順があるなら協力する。守るための戦いなら、私も背を向けない。」',
                    force: '「怖がらせても心は動かない。でも、そこに誰かを守る覚悟があるなら無視もできないわね。」'
                },
                failure: {
                    love: '「気持ちは伝わる。でも、その熱だけでは誰かが壊れる未来まで見えてしまうの。」',
                    logic: '「説明は悪くない。それでもまだ、安心して命を預けられる話じゃないわ。」',
                    force: '「そのやり方だけは受け入れられない。恐怖で並んだ列は、いちばん簡単に崩れるから。」'
                },
                night: [
                    '「無理をした顔はすぐ分かるのよ。明日も立つ気なら、今夜はちゃんと息を整えて。」',
                    '「誰かを守るための夜なら、私は逃げない。でも守ると言うなら、最後まで見届けて。」'
                ],
                enemy: '「傷つけることしか知らない側に回るなら、私は全力で止めるわ。」'
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
            story: 'パブ『ザ・レッドライオン』のカウンター越しに、何百という愚痴と誓いを聞いてきた男。酒を注ぐ手つきは穏やかでも、街の裏表と人の本音を読む目は鋭い。潰れそうな夜ほど誰を励まし、誰を帰すべきかを知っていて、サポーターたちの間では最後の避難所のように頼られている。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 68,
            dialogue: {
                intro: '「酒場じゃな、言葉の軽い客ほど長居する。お前の話が本物なら、一杯目のうちに伝わるはずだ。」',
                success: {
                    love: '「いい顔になったじゃないか。クラブへの想いがまだ腐ってないなら、俺も樽を空ける価値がある。」',
                    logic: '「話が具体的で助かる。商売と同じだ、見込みがあるならこっちも仕入れるさ。」',
                    force: '「乱暴だが、景気づけにはなる。今夜の空気をひっくり返すには、それくらいの勢いも要る。」'
                },
                failure: {
                    love: '「気持ちは嫌いじゃない。ただ、今夜の一杯を賭けるにはまだ足りない。」',
                    logic: '「勘定が合わない話だな。情だけで帳尻は合わせられない。」',
                    force: '「店で荒れるな。威勢がいいのと品がないのは別物だ。」'
                },
                night: [
                    '「夜は舌が本音を引きずり出す。仲間の酔い方より、黙り方を覚えておけ。」',
                    '「街は広く見えて、揉め事の匂いはすぐ回る。明日は別の顔を当たるといい。」'
                ],
                enemy: '「この街の酒場を敵に回したら、朝までに居場所がなくなるぞ。」'
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
            story: '現場では鉄骨を担ぎ、スタンドでは感情をむき出しにする若い怪力男。頭で考えるより先に身体が動くが、その衝動の奥には仲間を見捨てられないまっすぐさがある。怒る時も笑う時も全力で、だからこそ彼が拳を握る理由には、周囲の人間が思う以上の重みが宿る。',
            recruitDifficulty: 'medium',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 86,
            dialogue: {
                intro: '「難しいことは半分も分かんねえ。でもよ、本気の顔かどうかぐらいなら見りゃ分かる。」',
                success: {
                    love: '「それなら拳を振るう理由になる。守りてえもんが同じなら、俺は行くぜ！」',
                    logic: '「細けえ話は全部は分かんねえ。でもお前の顔見りゃ、嘘じゃねえって分かる。」',
                    force: '「上等だ。真正面から来るなら好きだぜ。だったら俺も前に出る！」'
                },
                failure: {
                    love: '「気持ちは伝わるけど、まだ拳が前に出ねえ……今日はその時じゃねえな。」',
                    logic: '「難しすぎるって。俺を置いていく話には乗れねえよ。」',
                    force: '「挑発だけなら乗らねえ。殴り合いにもタイミングってもんがあるだろ。」'
                },
                night: [
                    '「明日も一発勝負なんだろ。だったら今夜ちゃんと寝ろ、倒れたら守れるもんも守れねえ。」',
                    '「考えるのは得意じゃねえ。でも味方だって決めたやつなら、最後まで背中守るからな。」'
                ],
                enemy: '「こっちに立てないなら敵だ。だったら手加減はしねえ。」'
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
            story: 'プレイヤーがまだ無鉄砲だった頃、叱るより先に考えさせることを教えた恩師。授業では厳格、だがスタンドでは誰より熱く歌う二面性を持ち、理性と情熱は敵ではなく支え合うものだと信じている。彼女の承認は単なる戦力以上に、自分たちのやり方が間違っていないという確かな支柱になる。',
            recruitDifficulty: 'easy',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 40,
            dialogue: {
                intro: '「大声は誰にでも出せます。けれど、人を動かすのは筋の通った言葉と、その後ろにある責任です。」',
                success: {
                    love: '「情熱だけでは危うい。ですが、その情熱を理性で支えようとしているなら十分です。」',
                    logic: '「いい話です。その理屈なら、私も胸を張って列に立てます。」',
                    force: '「乱暴ではありますが、逃げない覚悟だけは見えました。そこは評価しましょう。」'
                },
                failure: {
                    love: '「志は感じます。けれど志だけでは、若い子たちを守れません。まだ未熟です。」',
                    logic: '「論が粗い。結論を急ぎすぎています。やり直しです。」',
                    force: '「威圧は教育にも統率にもなりません。そんな方法は論外です。」'
                },
                night: [
                    '「夜ほど人柄が出ます。仲間への言葉遣いが乱れた時点で、隊列はもう崩れ始めているのですよ。」',
                    '「感情を否定する気はありません。ただし制御しなさい。熱を持つ者ほど、その責任も重いのです。」'
                ],
                enemy: '「未熟な怒りに街を任せるほど、私は甘い教師ではありません。」'
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
            story: 'スマホ一台で街の温度を切り取り、応援動画として拡散する映像クリエイター。暴力そのものより、その前後に漂う空気や人の目つきに物語を見出すタイプで、勝敗の瞬間よりも誰がどう立ち上がるかに執着する。彼にとってサポートとは叫ぶことだけではなく、記憶の残し方まで含めた戦いだ。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 57,
            dialogue: {
                intro: '「街の空気そのものは編集できない。でも、どこを切り取って誰に見せるかで物語の流れは変えられる。」',
                success: {
                    love: '「いいね、その熱。レンズ越しでも嘘に見えない。撮る価値がある顔だ。」',
                    logic: '「狙いが明確だ。順番も悪くない。ならその熱を、こっちで拡散してやる。」',
                    force: '「荒い。でも素材としては強い。削ればかなり映える。」'
                },
                failure: {
                    love: '「熱はある。でも、まだ観る側の心を掴むだけの物語になってない。」',
                    logic: '「見せる順番が悪いな。いい素材でも編集を間違えたら刺さらない。」',
                    force: '「ノイズが多すぎる。勢いだけじゃ画面は持たないよ。」'
                },
                night: [
                    '「明日は見せ場を作ろう。街は結末より、その途中のドラマにいちばん飢えてる。」',
                    '「敵の空気を削るのも立派な演出だ。勝つだけじゃなく、どう勝つかまで設計しよう。」'
                ],
                enemy: '「最悪なのは負けることじゃない。見苦しく崩れることだろ？」'
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
            story: '若い頃から人生の節目をすべてクラブと共に過ごしてきた老サポーター。昇格も降格も暴動も見てきたからこそ、熱狂の価値も醜さも知り尽くしている。彼が一度うなずけば、それは年季の入った誇りがこちらの側に残っているという証明になり、多くの若手が背筋を伸ばす。',
            recruitDifficulty: 'easy',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 64,
            dialogue: {
                intro: '「若いの、熱はいい。だがな、その熱をどこへ置くかで人間の値打ちは決まる。誇りの置き場所を間違えるな。」',
                success: {
                    love: '「その誇りなら、まだ肩を貸せる。年寄りの声にも、もう少し意味が残っていそうだ。」',
                    logic: '「分かりやすい話だ。歳を取った耳でも、まだ信じてみようと思える。」',
                    force: '「荒い。だが逃げてはいないな。それを若さだけで終わらせるなよ。」'
                },
                failure: {
                    love: '「今日は胸が動かん。言葉が軽いと、どれだけ叫んでも風に飛ぶ。」',
                    logic: '「策はある。だが魂が足りん。背中を預けるにはまだ薄い。」',
                    force: '「力任せの誇りは長持ちしない。そんなものは誇りとは呼ばん。」'
                },
                night: [
                    '「勝ったか負けたかより、終わった後で胸を張れるかを考えろ。それが次の朝に残る。」',
                    '「長く残るのは怒鳴り声じゃない。最後まで立っていた背中の記憶だ。」'
                ],
                enemy: '「誇りを持たん群れには、こちらも年寄りの遠慮などしてやらん。」'
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
            story: 'ネオン街の奥でラウンジを回しながら、人脈と資金で街の流れを静かに書き換えるフィクサー。自分では拳を振るわないが、誰に酒を注ぎ、誰の借りを回収するかで盤面をひっくり返す術を知っている。彼が味方につく時、それはただ一人増えるのではなく、夜そのものがこちらに傾き始めることを意味する。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 77,
            dialogue: {
                intro: '「人も金も、動かすには値打ちが要る。君の話にそれがあるなら、私も安くはない札を切ろう。」',
                success: {
                    love: '「熱だけの客かと思ったが、執念の質は悪くない。少しは賭ける価値がある。」',
                    logic: '「条件が整っている。数字も導線も見えているなら、こちらも本気で動ける。」',
                    force: '「強引だ。だが胆力は認めるよ。無茶を金に換える人間は嫌いじゃない。」'
                },
                failure: {
                    love: '「感傷だけでは勘定が合わない。夜の街は、優しいだけの人間から順に沈む。」',
                    logic: '「数字が足りない。今の提案では、こちらの札を切る理由にならないな。」',
                    force: '「脅しで動くほど、私を安い男だと思ったなら見込み違いだ。」'
                },
                night: [
                    '「夜は人脈がものを言う。昼の一手を雑に使う者に、夜の援護は集まらない。」',
                    '「明日拾うべき相手は、熱い者じゃなく値打ちのある者だ。そこを見誤るなよ。」'
                ],
                enemy: '「こちらに立てなかった時点で、君はもう街の流れから遅れている。」'
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
            story: '人前では声が震えることもあるが、ひとたび観察に入ると相手の視線、間合い、沈黙の長さまで記憶してしまう繊細な分析役。喧噪の中心に立つタイプではないものの、彼が拾う小さな違和感が何度も仲間を救ってきた。怯えやすさと鋭さが同居しているからこそ、彼の言葉には軽視できない切実さが宿る。',
            recruitDifficulty: 'medium',
            preferredMethod: 'logic',
            secondaryMethod: 'love',
            enemyThreat: 43,
            dialogue: {
                intro: '「ぼ、僕でも役に立てるなら……ちゃんと見ます。人の癖とか、並びの崩れとか、そういうのなら。」',
                success: {
                    love: '「その言い方なら……信じてみたいです。怖くても、背を向けずに済みそうだから。」',
                    logic: '「理屈は十分です。危険も利点も整理できています。なら協力できます。」',
                    force: '「こ、怖かったですけど……逃げない覚悟だけは伝わりました。」'
                },
                failure: {
                    love: '「気持ちは分かるんです。でも、まだ不安の方が勝ってしまいます。」',
                    logic: '「計算が合いません。このままだと損耗が大きすぎます。」',
                    force: '「そのやり方は……僕には無理です。恐怖で固まる未来しか見えない。」'
                },
                night: [
                    '「敵の視線、今日かなり右に流れてました。あの癖、次なら確実に突けると思います。」',
                    '「会話の温度差って、戦いの前兆になるんです。仲間の沈み方も、ちゃんと見ておきたい。」'
                ],
                enemy: '「分析した限りだと……隙が多いのは、そちらの方です。」'
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
            story: 'ライブハウスで培った煽りと連携を、そのまま路上戦に持ち込むパンク双子。片方が火をつけ、もう片方が酸素を送り込むように、挑発も突撃も寸分違わず噛み合う。騒がしく見えて実は相手の怯みを見逃さない冷たさもあり、彼女たちが乗ると場の空気は一気に祝祭と暴発の境界へ傾く。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'force',
            enemyThreat: 82,
            dialogue: {
                intro: '「ねえ、その話って退屈じゃないよね？」「つまんないなら途中で音切って帰るけど。」',
                success: {
                    love: '「その熱、好き。」「今夜からうちらがその鼓動、もっとデカく鳴らしてやる。」',
                    logic: '「珍しく理屈で刺さった。」「悔しいけど、筋が通ってるのは認める。」',
                    force: '「挑発上等。」「だったら派手にやろうよ、どうせなら耳鳴りが残るくらい。」'
                },
                failure: {
                    love: '「悪くないけど今日は乗れない。」「熱があるだけじゃ、まだ音になってないね。」',
                    logic: '「頭では分かる。」「でもノれない。理由よりリズムが足りない。」',
                    force: '「雑に押すだけじゃダメ。」「センスがない挑発って、一番冷めるんだよ。」'
                },
                night: [
                    '「夜は騒いだ方が勝ち。」「でも勢いだけで明日の一手を外したらダサいからね。」',
                    '「敵が静かだと逆に不気味。」「ならこっちは音で心拍ごと崩してやればいい。」'
                ],
                enemy: '「こっちのノイズ、耐えられる？」「鼓膜じゃなく心の方から割れるよ。」'
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
            story: '群衆整理と現場制圧を叩き上げで身につけた警備主任。熱より配置、勢いより圧の掛け方を重視し、混乱した場でも人の流れを壁のように押し返す。情に流されることは少ないが、秩序を守るための覚悟には強く反応し、認めた相手には驚くほど堅実な盾になる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'force',
            enemyThreat: 88,
            dialogue: {
                intro: '「混乱を制するのは怒鳴り声じゃない。並び、間合い、そして圧のかけ方だ。そこまで見えているか？」',
                success: {
                    love: '「情で現場は回らん。だが、その情が誰を守るためかは見えた。なら話は変わる。」',
                    logic: '「配置が見えているな。人をどこで受け、どこで返すかまで考えている。なら組める。」',
                    force: '「威圧の質は悪くない。ただ荒れるだけじゃなく、前に出る覚悟がある。」'
                },
                failure: {
                    love: '「甘い。感傷だけでは列は保てん。最初に崩れるのはそういう現場だ。」',
                    logic: '「詰めが浅い。現場を知らない机上の話に俺は付き合わん。」',
                    force: '「半端な圧で俺は動かせない。押すなら最後まで押し切れ。」'
                },
                night: [
                    '「明日は前に出す人間を絞れ。列が一度乱れると、後ろまで全部崩れる。」',
                    '「夜に考えるべきは勇気じゃない。配置だ。勇気は、配置が決まった後に初めて役に立つ。」'
                ],
                enemy: '「列を乱した時点で、お前たちの敗北は始まっている。」'
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
            story: '免許より腕前、倫理より結果で生き延びてきた闇医者。正規の病院では扱えない傷も平然と縫い合わせるが、その目は常に人間の価値と限界を測っている。冷酷に見えて、助けると決めた相手には最後まで執着するため、彼の協力は治療以上に生存そのものへの保証になる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'logic',
            secondaryMethod: 'force',
            enemyThreat: 71,
            dialogue: {
                intro: '「助ける価値がある人間かどうか、それだけが興味だ。綺麗事を聞くほど、こちらも暇じゃない。」',
                success: {
                    love: '「感傷は嫌いだ。だが、その執着は嫌いじゃない。助ける理由としては上等だよ。」',
                    logic: '「理にかなっている。損耗も手順も見えているなら、こちらも手を貸す価値がある。」',
                    force: '「脅しで動く趣味はない。だが、覚悟が本物なら見捨てる理由もないな。」'
                },
                failure: {
                    love: '「優しさだけでは死体が増える。そこを見ない話に、私は協力しない。」',
                    logic: '「処置の順番が悪い。先に守るべきものが整理されていない。」',
                    force: '「その程度の圧で針は握らない。私を動かしたいなら、もっと切実であるべきだ。」'
                },
                night: [
                    '「夜は傷が浮く時間だ。痛みを誤魔化すな、明日までに立て直しておけ。」',
                    '「生き残るだけなら方法はいくらでもある。だが勝ちたいなら、綺麗事を削る覚悟も必要だ。」'
                ],
                enemy: '「救う側に立てなかったなら、あとは切り捨てるだけだ。」'
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
            story: 'イベント会場を満員にも空席だらけにも変えてしまう、感情操作に長けたオーガナイザー。照明も音も人の視線も、自分の舞台装置として扱う胆力があり、ひと声で群衆の気分を塗り替えてしまう。彼女が前に出ると、勝負は力比べから空気の奪い合いへと一段階変わる。',
            recruitDifficulty: 'medium',
            preferredMethod: 'love',
            secondaryMethod: 'logic',
            enemyThreat: 73,
            dialogue: {
                intro: '「空気は待ってくれないわ。あなたの言葉で、この夜の主役を塗り替えられる？」',
                success: {
                    love: '「その情熱、ちゃんと人を振り向かせる熱だわ。舞台に上げる価値がある。」',
                    logic: '「計算と華、その両方があるなら十分。観客も群衆も、まとめてこちらへ向かせられる。」',
                    force: '「荒いけれど勢いは本物ね。無骨でも、場をさらう力はあるじゃない。」'
                },
                failure: {
                    love: '「熱はある。でもまだ、人を動かすには少し足りない。燃えるだけでは舞台は成立しないの。」',
                    logic: '「理屈は綺麗よ。でも綺麗なだけじゃ心は震えない。」',
                    force: '「無骨すぎるわ。強いだけで美しくないものに、人は長くついてこない。」'
                },
                night: [
                    '「夜の空気は味方にも敵にもなる。先に掴んだ方が、この街の主導権を取るのよ。」',
                    '「明日は誰を主役にするか、ちゃんと選びなさい。群れは主役を間違えると簡単に散るわ。」'
                ],
                enemy: '「空気を奪われた時点で、あなたたちの負けはもう始まっているの。」'
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
            story: '重い過去を背負い、余計な言い訳を捨てて生きてきた無言の前衛。言葉数は少ないが、筋が通っているかどうかだけは人一倍厳しく見ており、一度認めた相手には黙って前を空ける。彼の圧は怒鳴り声ではなく、引かない立ち姿そのものから滲み出る種類のものだ。',
            recruitDifficulty: 'medium',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 90,
            dialogue: {
                intro: '「言い訳はいらない。ここに立つ理由だけ言え。それが薄いなら、どんな声も俺には届かない。」',
                success: {
                    love: '「筋が通ってる。綺麗ごとじゃなく、ちゃんと痛みごと抱えてる顔だ。なら背中を預ける。」',
                    logic: '「言葉は多いが、芯は感じた。口先だけなら最初の一歩で崩れるからな。」',
                    force: '「その眼なら信用できる。引く気がないなら、俺も前に出る。」'
                },
                failure: {
                    love: '「綺麗ごとが多い。耳障りはいいが、今日はその気になれない。」',
                    logic: '「言葉が先走ってる。芯より先に説明が出る話は軽い。」',
                    force: '「その程度の圧で俺は折れない。押すなら、お前自身も壊れる覚悟で来い。」'
                },
                night: [
                    '「明日も一度きりなら迷うな。迷いは匂いになる。敵はそこから嗅ぎつけてくる。」',
                    '「敵より先に自分を固めろ。人間は崩れる時、思ってるより大きな音を立てる。」'
                ],
                enemy: '「こちらに立てなかった時点で、お前はもう敵だ。線引きはそれで十分だろ。」'
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
            story: '勝敗より先に破壊の快楽へ反応してしまう危険な狂戦士。扱いを誤れば味方すら焼きかねないが、刺さる状況では均衡そのものを一撃で粉砕する。理屈も秩序も信じていないようでいて、退屈だけは誰より憎んでおり、燃え上がる理由を見つけた時の爆発力は常軌を逸している。',
            recruitDifficulty: 'hard',
            preferredMethod: 'force',
            secondaryMethod: 'love',
            enemyThreat: 99,
            dialogue: {
                intro: '「退屈だけは殺してくれよ。痛みでも怒号でもいい、何かが壊れる音がしなきゃ意味がない。」',
                success: {
                    love: '「その狂い方、嫌いじゃない。綺麗にまとまってない感じが、むしろ信用できる。」',
                    logic: '「頭で分かったわけじゃない。でも、その先に何か壊れる景色は見えた。」',
                    force: '「いいね、その圧。血の匂いがしてきた。だったら俺も本気で噛みつく。」'
                },
                failure: {
                    love: '「熱が足りない。そんなぬるい話じゃ、欠伸しか出ない。」',
                    logic: '「理屈？ そんなもので人が前に飛ぶと思ってんのか？」',
                    force: '「半端だな。押すならもっと奥まで来いよ。」'
                },
                night: [
                    '「夜はいい。街の歯ぎしりがよく聞こえる。ああいう音は、壊れる直前が一番いい。」',
                    '「明日も一回だけ？ ならその一回を、骨まで鳴るくらい振り切れよ。」'
                ],
                enemy: '「お前らの一歩目から噛み砕いてやる。立つ前に終わらせてやるよ。」'
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
            story: '敵過激派の象徴として恐れられる圧殺型の統率者。言葉よりも威圧、威圧よりも結果で群衆を従わせ、自分が最前列に立つことで支配を完成させる。冷酷で容赦はないが、その冷たさの奥には『負けた側に人権はない』という歪んだ信念があり、最後までこちらの前に立ちはだかる最大の壁となる。',
            recruitDifficulty: 'hard',
            preferredMethod: 'force',
            secondaryMethod: 'logic',
            enemyThreat: 97,
            dialogue: {
                intro: '「俺を口説くなら、言葉か拳のどちらかで黙らせてみろ。半端な覚悟は、ここじゃ笑いものにしかならん。」',
                success: {
                    love: '「狂ってるな。だが、その執念は本物だ。そこまで来るなら認めてやる。」',
                    logic: '「面白い理屈だ。血の匂いがしないのに、なぜか前に出たくなる。今回はお前の側で試してやる。」',
                    force: '「その圧なら前線に立てる。引く気がないなら来い、地獄の先頭に。」'
                },
                failure: {
                    love: '「情で俺は曲がらん。そんな温さで折れるなら、とっくに死んでる。」',
                    logic: '「綺麗すぎる。言葉に血の匂いがしない話など、俺には響かん。」',
                    force: '「その程度の威圧なら笑えるな。せめて俺の一歩を止めてみろ。」'
                },
                night: [
                    '「夜は裏切りが一番よく見える。仲間の目を見ておけ、濁ったやつから先に沈む。」',
                    '「明日の一手で敵になるか味方になるか、それだけだ。中立でいられる夜なんて存在しない。」'
                ],
                enemy: '「こちらに回らなかったこと、夜明けの前に後悔させてやる。」'
            }
        },
        bruno: {
            name: 'Bruno Garcia',
            age: 52,
            job: '元ボクサー',
            role: '破壊者',
            stats: {
                strength: 88,
                bodyFat: 30,
                happiness: 50,
                morality: 40,
                education: 35,
                assets: 800
            },
            skill: {
                name: '鉄拳制裁',
                description: '敵単体に大ダメージ',
                type: 'attack'
            },
            story: 'かつてリングの上で名を馳せた元ボクサー。今は酒場の主人として街を仕切っている。酒と煙の香り、そして拳に残る感触を忘れられない。',
            recruitDifficulty: 'hard',
            preferredMethod: 'force',
            secondaryMethod: 'logic',
            enemyThreat: 85,
            dialogue: {
                intro: '「何の用だ？俺の店でトラブルを起こさないでくれよ。」',
                success: {
                    love: 'お前らの情熱が気に入った。俺も一緒に暴れてやる。',
                    logic: '計算され尽くした戦略か……悪くないな。乗ってやる。',
                    force: 'それだけの力があれば信じてもいい。俺の拳も貸そう。'
                },
                failure: {
                    love: '人情にほだされるほど俺は甘くない。出直してこい。',
                    logic: '理屈だけじゃ俺の心は動かん。',
                    force: 'その程度の腕では俺を納得させられん。'
                },
                night: [
                    '夜の街に流れるジャズが好きでな。酒と煙の香りがたまらないんだ。',
                    '昔はリングの上で叫んだものだが、今はこの店が俺のリングさ。'
                ],
                enemy: '俺の店を荒らす奴は許さない。叩き潰してやる。'
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
            characters: ['michael', 'kevin', 'margaret', 'sophie', 'graham', 'malcolm', 'bruno'],
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
