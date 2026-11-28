import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const DINO_STAGES = {
  'dino-1': {
    id: 'dino-1',
    name: 'Dino 1: Fern Valley',
    world: 'dino',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Jump over the cactus!
      { id: 'di1_c1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'di1_cac', type: 'cactus', x: 430, y: G - 62, w: 42, h: 62 },
      { id: 'di1_gate1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the coin under the tree!
      { id: 'di1_tree', type: 'tree', x: 1020, y: G - 125, w: 140, h: 26 },
      { id: 'di1_ctop', type: 'coin', x: 1078, y: G - 168, w: 24, h: 24 },
      { id: 'di1_cunder', type: 'coin', x: 1078, y: G - 36, w: 24, h: 24 },
      { id: 'di1_gate2', type: 'gate', x: 1420, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the apple! (Picture-word matching)
      { id: 'di1_w1', type: 'word_target', word: 'banana', icon: '🍌', x: 1760, y: G - 62, w: 48, h: 48 },
      { id: 'di1_w2', type: 'word_target', word: 'apple', icon: '🍎', x: 1940, y: G - 126, w: 48, h: 48 },
      { id: 'di1_w3', type: 'word_target', word: 'grape', icon: '🍇', x: 2120, y: G - 62, w: 48, h: 48 },
      { id: 'di1_gate3', type: 'gate', x: 2360, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'di1_c2', type: 'coin', x: 2600, y: G - 76, w: 24, h: 24 },
      { id: 'di1_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'di1_bh', type: 'bat', word: 'High Bat', heightTag: 'high', x: 2000, y: G - 210, patrolRange: 85, hp: 1 },
      { id: 'di1_bl', type: 'bat', word: 'Low Bat', heightTag: 'low', x: 2020, y: G - 68, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'mdi1_cac',
        triggerX: 40,
        checkpointX: 60,
        type: 'jump_over_object',
        targetId: 'di1_cac',
        text: 'Jump over the cactus!',
        jp: 'サボテンを飛びこえよう！',
        timeLimit: 25,
        gateId: 'di1_gate1',
      },
      {
        id: 'mdi1_under',
        triggerX: 750,
        checkpointX: 770,
        type: 'collect_specific_coin',
        targetId: 'di1_cunder',
        text: 'Get the coin under the tree!',
        jp: '木の下（UNDER）のコインを取ろう！',
        timeLimit: 25,
        gateId: 'di1_gate2',
      },
      {
        id: 'mdi1_apple',
        triggerX: 1470,
        checkpointX: 1490,
        type: 'shoot_word_target',
        targetWord: 'apple',
        text: 'Shoot the apple!',
        jp: 'リンゴ（🍎）の的を撃とう！',
        timeLimit: 25,
        gateId: 'di1_gate3',
      },
    ],
  },

  'dino-2': {
    id: 'dino-2',
    name: 'Dino 2: Fossil Ridge',
    world: 'dino',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Break the rock!
      { id: 'di2_rock', type: 'rock', x: 460, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'di2_gate1', type: 'gate', x: 740, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Spell DOG!
      { id: 'di2_ld', type: 'letter_target', letter: 'D', resetOnFail: true, x: 920, y: G - 62, w: 44, h: 44 },
      { id: 'di2_lo', type: 'letter_target', letter: 'O', resetOnFail: true, x: 1080, y: G - 122, w: 44, h: 44 },
      { id: 'di2_lg', type: 'letter_target', letter: 'G', resetOnFail: true, x: 1240, y: G - 62, w: 44, h: 44 },
      { id: 'di2_gate2', type: 'gate', x: 1400, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 1, 2, 3!
      { id: 'di2_n1', type: 'number_target', num: 1, resetOnFail: true, x: 1760, y: G - 62, w: 42, h: 42 },
      { id: 'di2_n2', type: 'number_target', num: 2, resetOnFail: true, x: 1940, y: G - 122, w: 42, h: 42 },
      { id: 'di2_n3', type: 'number_target', num: 3, resetOnFail: true, x: 2120, y: G - 62, w: 42, h: 42 },
      { id: 'di2_gate3', type: 'gate', x: 2380, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'di2_c2', type: 'coin', x: 2620, y: G - 76, w: 24, h: 24 },
      { id: 'di2_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [],
    missions: [
      {
        id: 'mdi2_rock',
        triggerX: 40,
        checkpointX: 60,
        type: 'break_object',
        targetId: 'di2_rock',
        text: 'Break the rock!',
        jp: 'チャージショットで岩をこわそう！',
        timeLimit: 30,
        gateId: 'di2_gate1',
      },
      {
        id: 'mdi2_dog',
        triggerX: 790,
        checkpointX: 810,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['D', 'O', 'G'],
        text: 'Spell DOG!',
        spokenText: 'Spell dog! D, O, G!',
        jp: 'D → O → G の順番に撃って DOG を作ろう！',
        timeLimit: 30,
        gateId: 'di2_gate2',
      },
      {
        id: 'mdi2_nums',
        triggerX: 1450,
        checkpointX: 1470,
        type: 'sequence',
        subType: 'shoot_numbers',
        steps: [1, 2, 3],
        text: 'Shoot 1, 2, 3!',
        jp: '1、2、3の順番に的を撃とう！',
        timeLimit: 30,
        gateId: 'di2_gate3',
      },
    ],
  },

  'dino-2b': {
    id: 'dino-2b',
    name: 'Dino 3: Volcanic Jungle',
    world: 'dino',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Stay on the tree!
      { id: 'di2b_box', type: 'box', x: 280, y: G - 48, w: 48, h: 48 },
      { id: 'di2b_tree', type: 'tree', x: 440, y: G - 125, w: 130, h: 26 },
      { id: 'di2b_gate1', type: 'gate', x: 760, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: What is 4 + 4?
      { id: 'di2b_n6', type: 'number_target', num: 6, x: 1060, y: G - 62, w: 44, h: 44 },
      { id: 'di2b_n8', type: 'number_target', num: 8, x: 1220, y: G - 126, w: 44, h: 44 },
      { id: 'di2b_n9', type: 'number_target', num: 9, x: 1380, y: G - 62, w: 44, h: 44 },
      { id: 'di2b_gate2', type: 'gate', x: 1620, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 2 robots!
      { id: 'di2b_gate3', type: 'gate', x: 2440, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'di2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'di2b_r1', type: 'robot', word: 'Robot', x: 1940, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 'di2b_r2', type: 'robot', word: 'Robot', x: 2220, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'mdi2b_stay',
        triggerX: 40,
        checkpointX: 60,
        type: 'stay_on_object',
        targetId: 'di2b_tree',
        holdSeconds: 3,
        text: 'Stay on the tree!',
        jp: '木の上に3びょう乗りつづけよう！',
        timeLimit: 25,
        gateId: 'di2b_gate1',
      },
      {
        id: 'mdi2b_math',
        triggerX: 810,
        checkpointX: 830,
        type: 'shoot_number',
        targetNum: 8,
        text: 'What is 4 + 4?',
        spokenText: 'What is four plus four?',
        jp: '4 たす 4 はいくつ？ 正しい数字を撃とう！',
        timeLimit: 25,
        gateId: 'di2b_gate2',
      },
      {
        id: 'mdi2b_rob',
        triggerX: 1670,
        checkpointX: 1690,
        type: 'defeat_enemy_type',
        targetType: 'robot',
        targetCount: 2,
        text: 'Shoot 2 robots!',
        jp: 'ロボットを2たい倒そう！',
        timeLimit: 30,
        gateId: 'di2b_gate3',
      },
    ],
  },

  'dino-3': {
    id: 'dino-3',
    name: 'Dino 4: T-Rex King',
    world: 'dino',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'di3_c1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'di3_c2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'di3_rock', type: 'rock', x: 500, y: G - 76, w: 64, h: 76, broken: false },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'trex_king',
      name: 'T-Rex King',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 19,
    },
  },
};
