import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const FOREST_STAGES = {
  'forest-1': {
    id: 'forest-1',
    name: 'Forest 1: Green Meadow',
    world: 'forest',
    width: 3150,
    startX: 60,
    objects: [
      // Area 1: Get 3 coins
      { id: 'c1', type: 'coin', x: 250, y: G - 42, w: 24, h: 24 },
      { id: 'c2', type: 'coin', x: 340, y: G - 92, w: 24, h: 24 },
      { id: 'c3', type: 'coin', x: 430, y: G - 42, w: 24, h: 24 },
      { id: 'c4', type: 'coin', x: 520, y: G - 82, w: 24, h: 24 },
      { id: 'gate1', type: 'gate', x: 650, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Jump on the left box! (Left vs Right box)
      { id: 'box_left', type: 'box', label: 'LEFT BOX', x: 860, y: G - 54, w: 54, h: 54 },
      { id: 'box_right', type: 'box', label: 'RIGHT BOX', x: 1090, y: G - 54, w: 54, h: 54 },
      { id: 'c5', type: 'coin', x: 874, y: G - 118, w: 24, h: 24 },
      { id: 'gate2', type: 'gate', x: 1320, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the apple! (Picture-word matching)
      { id: 'f1_w1', type: 'word_target', word: 'banana', icon: '🍌', x: 1480, y: G - 62, w: 48, h: 48 },
      { id: 'f1_w2', type: 'word_target', word: 'apple', icon: '🍎', x: 1600, y: G - 124, w: 48, h: 48 },
      { id: 'f1_w3', type: 'word_target', word: 'grape', icon: '🍇', x: 1720, y: G - 62, w: 48, h: 48 },
      { id: 'gate3', type: 'gate', x: 1840, y: G - 130, w: 34, h: 130, open: false },

      // Area 4: Shoot the red slime! (Blue slime nearby)
      { id: 'box2', type: 'box', x: 2020, y: G - 44, w: 44, h: 44 },
      { id: 'c8', type: 'coin', x: 2200, y: G - 96, w: 24, h: 24 },
      { id: 'gate4', type: 'gate', x: 2680, y: G - 130, w: 34, h: 130, open: false },

      // Goal area
      { id: 'c9', type: 'coin', x: 2820, y: G - 64, w: 24, h: 24 },
      { id: 'goal1', type: 'goal', x: 2980, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'e_blue1', type: 'blue_slime', word: 'Blue Slime', x: 2200, y: G - 24, patrolRange: 70, hp: 2 },
      { id: 'e_red1', type: 'red_slime', word: 'Red Slime', x: 2460, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'm1_coins',
        triggerX: 40,
        checkpointX: 60,
        type: 'collect_coins',
        targetCount: 3,
        text: 'Get 3 coins!',
        jp: 'コインを3まい集めよう！',
        timeLimit: 25,
        gateId: 'gate1',
      },
      {
        id: 'm1_left_box',
        triggerX: 700,
        checkpointX: 720,
        type: 'jump_on_object',
        targetId: 'box_left',
        text: 'Jump on the left box!',
        jp: '左の箱（LEFT BOX）に飛び乗ろう！',
        timeLimit: 25,
        gateId: 'gate2',
      },
      {
        id: 'm1_apple',
        triggerX: 1370,
        checkpointX: 1390,
        type: 'shoot_word_target',
        targetWord: 'apple',
        text: 'Shoot the apple!',
        jp: 'リンゴ（🍎）の的を撃とう！',
        timeLimit: 25,
        gateId: 'gate3',
      },
      {
        id: 'm1_red_slime',
        triggerX: 1890,
        checkpointX: 1910,
        type: 'defeat_enemy_type',
        targetType: 'red_slime',
        forbiddenEnemyType: 'blue_slime',
        targetCount: 1,
        text: 'Shoot the red slime!',
        jp: '赤いスライムを撃とう！（青は撃たないで）',
        timeLimit: 30,
        gateId: 'gate4',
      },
    ],
  },

  'forest-2': {
    id: 'forest-2',
    name: 'Forest 2: Deep Woods',
    world: 'forest',
    width: 3350,
    startX: 60,
    objects: [
      // Area 1: Shoot A, B, C!
      { id: 'f2_la', type: 'letter_target', letter: 'A', resetOnFail: true, x: 240, y: G - 62, w: 44, h: 44 },
      { id: 'f2_lb', type: 'letter_target', letter: 'B', resetOnFail: true, x: 380, y: G - 122, w: 44, h: 44 },
      { id: 'f2_lc', type: 'letter_target', letter: 'C', resetOnFail: true, x: 520, y: G - 62, w: 44, h: 44 },
      { id: 'gate2_1', type: 'gate', x: 660, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the high bat! (High vs Low bat)
      { id: 'tree2_2', type: 'tree', x: 860, y: G - 115, w: 120, h: 26 },
      { id: 'c2_2', type: 'coin', x: 908, y: G - 156, w: 24, h: 24 },
      { id: 'gate2_2', type: 'gate', x: 1440, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the big slime! (Big vs Small slime)
      { id: 'c2_3', type: 'coin', x: 1640, y: G - 62, w: 24, h: 24 },
      { id: 'gate2_3', type: 'gate', x: 2220, y: G - 130, w: 34, h: 130, open: false },

      // Area 4: Break the rock! (Charge Shot)
      { id: 'rock1', type: 'rock', x: 2560, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'gate2_4', type: 'gate', x: 2820, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'c2_4', type: 'coin', x: 2980, y: G - 64, w: 24, h: 24 },
      { id: 'goal2', type: 'goal', x: 3160, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'e_bat_high', type: 'bat', word: 'High Bat', heightTag: 'high', x: 1150, y: G - 210, patrolRange: 80, hp: 1 },
      { id: 'e_bat_low', type: 'bat', word: 'Low Bat', heightTag: 'low', x: 1160, y: G - 68, patrolRange: 80, hp: 1 },
      { id: 'e_slime_small', type: 'blue_slime', word: 'Small Slime', sizeTag: 'small', scale: 0.72, x: 1760, y: G - 24, patrolRange: 65, hp: 1 },
      { id: 'e_slime_big', type: 'red_slime', word: 'Big Slime', sizeTag: 'big', scale: 1.75, x: 2000, y: G - 24, patrolRange: 75, hp: 3 },
    ],
    missions: [
      {
        id: 'm2_abc',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['A', 'B', 'C'],
        text: 'Shoot A, B, C!',
        jp: 'A → B → C の順番に撃とう！',
        timeLimit: 30,
        gateId: 'gate2_1',
      },
      {
        id: 'm2_high_bat',
        triggerX: 710,
        checkpointX: 730,
        type: 'defeat_enemy_type',
        targetId: 'e_bat_high',
        forbiddenIds: ['e_bat_low'],
        targetCount: 1,
        text: 'Shoot the high bat!',
        jp: '高いところを飛ぶコウモリを撃とう！（低い方は撃たないで）',
        timeLimit: 30,
        gateId: 'gate2_2',
      },
      {
        id: 'm2_big_slime',
        triggerX: 1490,
        checkpointX: 1510,
        type: 'defeat_enemy_type',
        targetId: 'e_slime_big',
        forbiddenIds: ['e_slime_small'],
        targetCount: 1,
        text: 'Shoot the big slime!',
        jp: '大きいスライムを撃とう！（小さいスライムは撃たないで）',
        timeLimit: 30,
        gateId: 'gate2_3',
      },
      {
        id: 'm2_rock',
        triggerX: 2270,
        checkpointX: 2290,
        type: 'break_object',
        targetId: 'rock1',
        text: 'Break the rock!',
        jp: 'Zキーを長押ししてチャージショットで岩をこわそう！',
        timeLimit: 30,
        gateId: 'gate2_4',
      },
    ],
  },

  'forest-2b': {
    id: 'forest-2b',
    name: 'Forest 3: Hidden Grove',
    world: 'forest',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Get the coin under the tree!
      { id: 'f2b_tree1', type: 'tree', x: 380, y: G - 122, w: 130, h: 26 },
      { id: 'f2b_c_top', type: 'coin', x: 432, y: G - 165, w: 24, h: 24 },
      { id: 'f2b_c_under', type: 'coin', x: 432, y: G - 36, w: 24, h: 24 },
      { id: 'f2b_gate1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the triangle! (Circle / Triangle / Square)
      { id: 'f2b_sh_c', type: 'shape_target', shape: 'circle', color: 'blue', x: 1040, y: G - 62, w: 46, h: 46 },
      { id: 'f2b_sh_t', type: 'shape_target', shape: 'triangle', color: 'yellow', x: 1180, y: G - 126, w: 46, h: 46 },
      { id: 'f2b_sh_s', type: 'shape_target', shape: 'square', color: 'red', x: 1320, y: G - 62, w: 46, h: 46 },
      { id: 'f2b_gate2', type: 'gate', x: 1520, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: What is 1 + 2?
      { id: 'f2b_n2', type: 'number_target', num: 2, x: 1760, y: G - 62, w: 44, h: 44 },
      { id: 'f2b_n3', type: 'number_target', num: 3, x: 1920, y: G - 122, w: 44, h: 44 },
      { id: 'f2b_n4', type: 'number_target', num: 4, x: 2080, y: G - 62, w: 44, h: 44 },
      { id: 'f2b_gate3', type: 'gate', x: 2320, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'f2b_c3', type: 'coin', x: 2560, y: G - 68, w: 24, h: 24 },
      { id: 'f2b_goal', type: 'goal', x: 2880, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'f2b_bat1', type: 'bat', word: 'Bat', x: 2560, y: G - 150, patrolRange: 90, hp: 1 },
    ],
    missions: [
      {
        id: 'mf2b_under',
        triggerX: 40,
        checkpointX: 60,
        type: 'collect_specific_coin',
        targetId: 'f2b_c_under',
        text: 'Get the coin under the tree!',
        jp: '木の下（UNDER）にあるコインを取ろう！',
        timeLimit: 25,
        gateId: 'f2b_gate1',
      },
      {
        id: 'mf2b_shape',
        triggerX: 750,
        checkpointX: 770,
        type: 'shoot_shape',
        targetShape: 'triangle',
        text: 'Shoot the triangle!',
        jp: '三角（TRIANGLE）の的を撃とう！',
        timeLimit: 25,
        gateId: 'f2b_gate2',
      },
      {
        id: 'mf2b_math',
        triggerX: 1570,
        checkpointX: 1590,
        type: 'shoot_number',
        targetNum: 3,
        text: 'What is 1 + 2?',
        spokenText: 'What is one plus two?',
        jp: '1 たす 2 はいくつ？ 正しい数字を撃とう！',
        timeLimit: 25,
        gateId: 'f2b_gate3',
      },
    ],
  },

  'forest-3': {
    id: 'forest-3',
    name: 'Forest 4: Forest Guardian',
    world: 'forest',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'c3_1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'c3_2', type: 'coin', x: 340, y: G - 92, w: 24, h: 24 },
      { id: 'c3_3', type: 'coin', x: 440, y: G - 54, w: 24, h: 24 },
      { id: 'box3_1', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'forest_guardian',
      name: 'Forest Guardian',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1860,
      hp: 12,
    },
  },
};
