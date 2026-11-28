import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const DESERT_STAGES = {
  'desert-1': {
    id: 'desert-1',
    name: 'Desert 1: Sandy Trail',
    world: 'desert',
    width: 3250,
    startX: 60,
    objects: [
      // Area 1: Jump over the cactus!
      { id: 'dc1', type: 'coin', x: 240, y: G - 48, w: 24, h: 24 },
      { id: 'dcactus1', type: 'cactus', x: 430, y: G - 62, w: 42, h: 62 },
      { id: 'dc2', type: 'coin', x: 440, y: G - 134, w: 24, h: 24 },
      { id: 'dgate1', type: 'gate', x: 680, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the blue star! (Red, Blue, Yellow stars)
      { id: 'dstar_red', type: 'star', color: 'red', x: 880, y: G - 48, w: 30, h: 30 },
      { id: 'dstar_blue', type: 'star', color: 'blue', x: 1080, y: G - 110, w: 30, h: 30 },
      { id: 'dstar_yellow', type: 'star', color: 'yellow', x: 1260, y: G - 48, w: 30, h: 30 },
      { id: 'dgate2', type: 'gate', x: 1460, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Don't move! (Freeze for 3 seconds)
      { id: 'dc3', type: 'coin', x: 1660, y: G - 54, w: 24, h: 24 },
      { id: 'dgate3', type: 'gate', x: 1960, y: G - 130, w: 34, h: 130, open: false },

      // Area 4: Shoot the green switch!
      { id: 'dsw_red', type: 'switch', color: 'red', x: 2380, y: G - 56, w: 36, h: 36 },
      { id: 'dsw_green', type: 'switch', color: 'green', x: 2480, y: G - 120, w: 36, h: 36 },
      { id: 'dsw_yellow', type: 'switch', color: 'yellow', x: 2580, y: G - 56, w: 36, h: 36 },
      { id: 'dgate4', type: 'gate', x: 2760, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'dc8', type: 'coin', x: 2920, y: G - 62, w: 24, h: 24 },
      { id: 'dgoal1', type: 'goal', x: 3080, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [],
    missions: [
      {
        id: 'md1_cactus',
        triggerX: 40,
        checkpointX: 60,
        type: 'jump_over_object',
        targetId: 'dcactus1',
        text: 'Jump over the cactus!',
        jp: 'サボテンを飛びこえよう！',
        timeLimit: 25,
        gateId: 'dgate1',
      },
      {
        id: 'md1_star',
        triggerX: 730,
        checkpointX: 750,
        type: 'collect_star',
        targetColor: 'blue',
        text: 'Get the blue star!',
        jp: '青いスター（BLUE STAR）を取ろう！',
        timeLimit: 25,
        gateId: 'dgate2',
      },
      {
        id: 'md1_freeze',
        triggerX: 1520,
        checkpointX: 1540,
        type: 'dont_move',
        holdSeconds: 3,
        text: "Don't move!",
        jp: '3びょう間じっと止まろう！',
        timeLimit: 20,
        gateId: 'dgate3',
      },
      {
        id: 'md1_switch',
        triggerX: 2020,
        checkpointX: 2040,
        type: 'shoot_switch',
        targetColor: 'green',
        text: 'Shoot the green switch!',
        jp: '緑のスイッチ（GREEN SWITCH）を撃とう！',
        timeLimit: 25,
        gateId: 'dgate4',
      },
    ],
  },

  'desert-2': {
    id: 'desert-2',
    name: 'Desert 2: Canyon Run',
    world: 'desert',
    width: 2950,
    startX: 60,
    objects: [
      // Area 1: Break the rock (Charge Shot)
      { id: 'dc2_1', type: 'coin', x: 240, y: G - 56, w: 24, h: 24 },
      { id: 'drock1', type: 'rock', x: 460, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'dgate2_1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Jump on the box, then the tree! (2-step sequence)
      { id: 'dbox2_1', type: 'box', x: 920, y: G - 54, w: 54, h: 54 },
      { id: 'dtree2_1', type: 'tree', x: 1090, y: G - 125, w: 120, h: 26 },
      { id: 'dc2_2', type: 'coin', x: 1138, y: G - 166, w: 24, h: 24 },
      { id: 'dgate2_2', type: 'gate', x: 1420, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Dodge the shots! (5 seconds against turret)
      { id: 'dbox2_2', type: 'box', x: 1640, y: G - 48, w: 48, h: 48 },
      { id: 'dc2_3', type: 'coin', x: 1652, y: G - 108, w: 24, h: 24 },
      { id: 'dgate2_3', type: 'gate', x: 2240, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'dc2_4', type: 'coin', x: 2460, y: G - 90, w: 24, h: 24 },
      { id: 'dgoal2', type: 'goal', x: 2760, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'de_turret1', type: 'turret', word: 'Turret', x: 2100, y: G - 26, hp: 3, shootInterval: 1.8 },
    ],
    missions: [
      {
        id: 'md2_rock',
        triggerX: 40,
        checkpointX: 60,
        type: 'break_object',
        targetId: 'drock1',
        text: 'Break the rock!',
        jp: 'Zキーを長押ししてチャージショットで岩をこわそう！',
        timeLimit: 30,
        gateId: 'dgate2_1',
      },
      {
        id: 'md2_seq_jump',
        triggerX: 750,
        checkpointX: 770,
        type: 'sequence',
        subType: 'jump_objects',
        steps: ['dbox2_1', 'dtree2_1'],
        text: 'Jump on the box, then the tree!',
        jp: 'まず箱（BOX）に乗って、つぎに木（TREE）に乗ろう！',
        timeLimit: 30,
        gateId: 'dgate2_2',
      },
      {
        id: 'md2_dodge',
        triggerX: 1470,
        checkpointX: 1490,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: '敵の弾に当たらずに5びょうよけよう！',
        timeLimit: 25,
        gateId: 'dgate2_3',
      },
    ],
  },

  'desert-2b': {
    id: 'desert-2b',
    name: 'Desert 3: Pyramid Path',
    world: 'desert',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Shoot the big slime!
      { id: 'd2b_c1', type: 'coin', x: 260, y: G - 56, w: 24, h: 24 },
      { id: 'd2b_gate1', type: 'gate', x: 880, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Jump over the cactus!
      { id: 'd2b_cactus1', type: 'cactus', x: 1180, y: G - 62, w: 42, h: 62 },
      { id: 'd2b_c2', type: 'coin', x: 1190, y: G - 136, w: 24, h: 24 },
      { id: 'd2b_gate2', type: 'gate', x: 1500, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 1, 2, 3! (Ordered numbers)
      { id: 'd2b_n1', type: 'number_target', num: 1, resetOnFail: true, x: 1820, y: G - 62, w: 42, h: 42 },
      { id: 'd2b_n2', type: 'number_target', num: 2, resetOnFail: true, x: 1980, y: G - 122, w: 42, h: 42 },
      { id: 'd2b_n3', type: 'number_target', num: 3, resetOnFail: true, x: 2140, y: G - 62, w: 42, h: 42 },
      { id: 'd2b_gate3', type: 'gate', x: 2360, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'd2b_c3', type: 'coin', x: 2600, y: G - 64, w: 24, h: 24 },
      { id: 'd2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'd2b_small', type: 'blue_slime', word: 'Small Slime', sizeTag: 'small', scale: 0.72, x: 460, y: G - 24, patrolRange: 65, hp: 1 },
      { id: 'd2b_big', type: 'red_slime', word: 'Big Slime', sizeTag: 'big', scale: 1.75, x: 680, y: G - 24, patrolRange: 70, hp: 3 },
    ],
    missions: [
      {
        id: 'md2b_big',
        triggerX: 40,
        checkpointX: 60,
        type: 'defeat_enemy_type',
        targetId: 'd2b_big',
        forbiddenIds: ['d2b_small'],
        targetCount: 1,
        text: 'Shoot the big slime!',
        jp: '大きいスライムを撃とう！（小さい方は撃たないで）',
        timeLimit: 30,
        gateId: 'd2b_gate1',
      },
      {
        id: 'md2b_cactus',
        triggerX: 930,
        checkpointX: 950,
        type: 'jump_over_object',
        targetId: 'd2b_cactus1',
        text: 'Jump over the cactus!',
        jp: 'サボテンを飛びこえよう！',
        timeLimit: 25,
        gateId: 'd2b_gate2',
      },
      {
        id: 'md2b_nums',
        triggerX: 1550,
        checkpointX: 1570,
        type: 'sequence',
        subType: 'shoot_numbers',
        steps: [1, 2, 3],
        text: 'Shoot 1, 2, 3!',
        jp: '1、2、3の順番に的を撃とう！',
        timeLimit: 30,
        gateId: 'd2b_gate3',
      },
    ],
  },

  'desert-3': {
    id: 'desert-3',
    name: 'Desert 4: Rock Golem',
    world: 'desert',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'dc3_1', type: 'coin', x: 230, y: G - 54, w: 24, h: 24 },
      { id: 'dc3_2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'drock3_1', type: 'rock', x: 480, y: G - 76, w: 64, h: 76, broken: false },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'rock_golem',
      name: 'Rock Golem',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1860,
      hp: 13,
    },
  },
};
