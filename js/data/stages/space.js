import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const SPACE_STAGES = {
  'space-1': {
    id: 'space-1',
    name: 'Space 1: Star Station',
    world: 'space',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Stop the laser!
      { id: 'sp1_sw', type: 'switch', color: 'blue', label: 'LASER SWITCH', controlsLaserId: 'sp1_laser', x: 460, y: G - 122, w: 40, h: 40 },
      { id: 'sp1_laser', type: 'laser', active: true, x: 700, y: G - 160, w: 22, h: 160 },

      // Area 2: Shoot the moon! (Picture-word matching)
      { id: 'sp1_w1', type: 'word_target', word: 'sun', icon: '☀', x: 1020, y: G - 62, w: 48, h: 48 },
      { id: 'sp1_w2', type: 'word_target', word: 'moon', icon: '🌙', x: 1180, y: G - 126, w: 48, h: 48 },
      { id: 'sp1_w3', type: 'word_target', word: 'rocket', icon: '🚀', x: 1340, y: G - 62, w: 48, h: 48 },
      { id: 'sp1_gate2', type: 'gate', x: 1560, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 2 robots!
      { id: 'sp1_box', type: 'box', x: 1780, y: G - 48, w: 48, h: 48 },
      { id: 'sp1_gate3', type: 'gate', x: 2440, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'sp1_c1', type: 'coin', x: 2660, y: G - 76, w: 24, h: 24 },
      { id: 'sp1_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'sp1_r1', type: 'robot', word: 'Robot', x: 2020, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 'sp1_r2', type: 'robot', word: 'Robot', x: 2260, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'msp1_laser',
        triggerX: 40,
        checkpointX: 60,
        type: 'shoot_switch',
        targetId: 'sp1_sw',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'msp1_moon',
        triggerX: 770,
        checkpointX: 790,
        type: 'shoot_word_target',
        targetWord: 'moon',
        text: 'Shoot the moon!',
        jp: '月（🌙）の的を撃とう！',
        timeLimit: 25,
        gateId: 'sp1_gate2',
      },
      {
        id: 'msp1_robots',
        triggerX: 1610,
        checkpointX: 1630,
        type: 'defeat_enemy_type',
        targetType: 'robot',
        targetCount: 2,
        text: 'Shoot 2 robots!',
        jp: 'ロボットを2たい倒そう！',
        timeLimit: 30,
        gateId: 'sp1_gate3',
      },
    ],
  },

  'space-2': {
    id: 'space-2',
    name: 'Space 2: Moon Crater',
    world: 'space',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: What is 2 + 3? (English math!)
      { id: 'sp2_n4', type: 'number_target', num: 4, x: 320, y: G - 62, w: 44, h: 44 },
      { id: 'sp2_n5', type: 'number_target', num: 5, x: 480, y: G - 122, w: 44, h: 44 },
      { id: 'sp2_n6', type: 'number_target', num: 6, x: 640, y: G - 62, w: 44, h: 44 },
      { id: 'sp2_gate1', type: 'gate', x: 860, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Use a big shot!
      { id: 'sp2_c1', type: 'coin', x: 1080, y: G - 62, w: 24, h: 24 },
      { id: 'sp2_rock', type: 'rock', x: 1260, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'sp2_gate2', type: 'gate', x: 1520, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Dodge the shots!
      { id: 'sp2_box', type: 'box', x: 1760, y: G - 48, w: 48, h: 48 },
      { id: 'sp2_gate3', type: 'gate', x: 2400, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'sp2_c2', type: 'coin', x: 2620, y: G - 76, w: 24, h: 24 },
      { id: 'sp2_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'sp2_tur1', type: 'turret', word: 'Turret', x: 2240, y: G - 26, hp: 3, shootInterval: 1.6 },
    ],
    missions: [
      {
        id: 'msp2_math',
        triggerX: 40,
        checkpointX: 60,
        type: 'shoot_number',
        targetNum: 5,
        text: 'What is 2 + 3?',
        spokenText: 'What is two plus three?',
        jp: '2 たす 3 はいくつ？ 正しい数字を撃とう！',
        timeLimit: 25,
        gateId: 'sp2_gate1',
      },
      {
        id: 'msp2_rock',
        triggerX: 910,
        checkpointX: 930,
        type: 'break_object',
        targetId: 'sp2_rock',
        text: 'Break the rock!',
        jp: 'チャージショットで月の岩をこわそう！',
        timeLimit: 30,
        gateId: 'sp2_gate2',
      },
      {
        id: 'msp2_dodge',
        triggerX: 1570,
        checkpointX: 1590,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: 'タレットの弾を5びょうよけよう！',
        timeLimit: 25,
        gateId: 'sp2_gate3',
      },
    ],
  },

  'space-2b': {
    id: 'space-2b',
    name: 'Space 3: Nebula Core',
    world: 'space',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Look left, then look right!
      { id: 'sp2b_c1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'sp2b_gate1', type: 'gate', x: 640, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the blue star!
      { id: 'sp2b_sr', type: 'star', color: 'red', x: 920, y: G - 48, w: 30, h: 30 },
      { id: 'sp2b_sb', type: 'star', color: 'blue', x: 1120, y: G - 115, w: 30, h: 30 },
      { id: 'sp2b_sy', type: 'star', color: 'yellow', x: 1320, y: G - 48, w: 30, h: 30 },
      { id: 'sp2b_gate2', type: 'gate', x: 1540, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 3 bats!
      { id: 'sp2b_tree', type: 'tree', x: 1740, y: G - 115, w: 120, h: 26 },
      { id: 'sp2b_gate3', type: 'gate', x: 2520, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'sp2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'sp2b_b1', type: 'bat', word: 'Bat', x: 1920, y: G - 150, patrolRange: 85, hp: 1 },
      { id: 'sp2b_b2', type: 'bat', word: 'Bat', x: 2140, y: G - 115, patrolRange: 85, hp: 1 },
      { id: 'sp2b_b3', type: 'bat', word: 'Bat', x: 2340, y: G - 165, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'msp2b_look',
        triggerX: 40,
        checkpointX: 60,
        type: 'look_left_right',
        text: 'Look left, then look right!',
        jp: 'まず左（←）を向いて、つぎに右（→）を向こう！',
        timeLimit: 20,
        gateId: 'sp2b_gate1',
      },
      {
        id: 'msp2b_star',
        triggerX: 690,
        checkpointX: 710,
        type: 'collect_star',
        targetColor: 'blue',
        text: 'Get the blue star!',
        jp: '青いスター（BLUE STAR）を取ろう！',
        timeLimit: 25,
        gateId: 'sp2b_gate2',
      },
      {
        id: 'msp2b_bats',
        triggerX: 1590,
        checkpointX: 1610,
        type: 'defeat_enemy_type',
        targetType: 'bat',
        targetCount: 3,
        text: 'Shoot 3 bats!',
        jp: 'コウモリを3びき撃とう！',
        timeLimit: 35,
        gateId: 'sp2b_gate3',
      },
    ],
  },

  'space-3': {
    id: 'space-3',
    name: 'Space 4: Alien UFO',
    world: 'space',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'sp3_c1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'sp3_c2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'sp3_c3', type: 'coin', x: 440, y: G - 54, w: 24, h: 24 },
      { id: 'sp3_box', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'alien_ufo',
      name: 'Alien UFO',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 18,
    },
  },
};
