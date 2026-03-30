// ゴーゴーフーリガン - ゲームデータ

const GAME_DATA = {
    // キャラクター情報
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
            recruited: true,
            recruitDifficulty: 'auto'
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
            recruited: false,
            recruitDifficulty: 'medium'
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
            story: '若き日のプレイヤーのような熱狂的なサポーター。エネルギッシュで、新しいアイデアをもたらす。',
            recruited: false,
            recruitDifficulty: 'easy'
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
            story: '女性サポーターの代表格。チームへの愛情は深いが、フーリガン活動の「暴力性」に悩んでいる。',
            recruited: false,
            recruitDifficulty: 'hard'
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
            story: 'パブ「ザ・レッドライオン」のマスター。多くのサポーターの相談役。',
            recruited: false,
            recruitDifficulty: 'medium'
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
            story: '力持ちで、単純だが心は優しい。チームへの愛情は純粋。',
            recruited: false,
            recruitDifficulty: 'medium'
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
            recruited: false,
            recruitDifficulty: 'easy'
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
            story: 'SNSでチームの応援動画を配信している。新しい形のサポーター活動を実践。',
            recruited: false,
            recruitDifficulty: 'medium'
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
            recruited: false,
            recruitDifficulty: 'easy'
        }
    },

    // ゲーム進行
    gameProgress: {
        currentDay: 1,
        currentPhase: 'morning', // morning, afternoon, evening
        recruitedMembers: ['derek'],
        teamMorale: 100,
        teamExperience: 0
    },

    // シナリオイベント
    scenarios: {
        day1: {
            morning: {
                text: 'ゲーム開始。Derek Thompsonがプレイヤーに話しかける。',
                event: 'tutorial',
                choices: [
                    { text: 'チームを立て直す決意を示す', next: 'day1_afternoon' },
                    { text: '状況を詳しく聞く', next: 'day1_afternoon' }
                ]
            },
            afternoon: {
                text: 'Derek Thompsonからチームの現状について説明を受ける。街に出て、仲間を探すことになった。',
                event: 'exploration',
                locations: ['pub', 'park', 'street']
            },
            evening: {
                text: '初日の夜。Derek Thompsonと作戦会議。',
                event: 'strategy'
            }
        }
    },

    // 場所情報
    locations: {
        pub: {
            name: 'パブ「ザ・レッドライオン」',
            description: '古参サポーターが集まる。',
            characters: ['joe'],
            recruitmentTopic: 'ビジネスと人情'
        },
        park: {
            name: 'セントラルパーク',
            description: '若い世代のサポーターが多い。',
            characters: ['jamie', 'ryan', 'george'],
            recruitmentTopic: 'チームの未来'
        },
        street: {
            name: '商店街「ハイストリート」',
            description: '一般市民も多い。',
            characters: ['michael', 'kevin', 'margaret', 'sophie'],
            recruitmentTopic: 'チームへの愛情'
        }
    }
};

// ゲーム定数
const GAME_CONSTANTS = {
    MAX_DAYS: 7,
    PHASES_PER_DAY: 3,
    INITIAL_MORALE: 100,
    MAX_TEAM_SIZE: 10,
    BATTLE_TURNS_MIN: 10,
    BATTLE_TURNS_MAX: 15
};

// ゲーム状態
let gameState = {
    currentDay: 1,
    currentPhase: 0, // 0: morning, 1: afternoon, 2: evening
    recruitedMembers: ['derek'],
    teamMorale: 100,
    teamExperience: 0,
    gameOver: false,
    battleActive: false
};
