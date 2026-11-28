import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const VOLCANO_STAGES = {
  'volcano-1': {
    id: 'volcano-1',
    name: 'Volcano 1: Lava Ridge',
    world: 'volcano',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Jump on the right box!
      { id: 'vbox_l', type: 'box', label: 'LEFT BOX', x: 300, y: G - 54, w: 54, h: 54 },
      { id: 'vbox_r', type: 'box', label: 'RIGHT BOX', x: 520, y: G - 54, w: 54, h: 54 },
      { id: 'vgate1', type: 'gate', x: 760, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the fire! (Picture-word matching)
      { id: 'v1_w1', type: 'word_target', word: 'water', icon: '💧', x: 860, y: G - 62, w: 48, h: 48 },
      { id: 'v1_w2', type: 'word_target', word: 'fire', icon: '🔥', x: 1000, y: G - 124, w: 48, h: 48 },
      { id: 'v1_w3', type: 'word_target', word: 'leaf', icon: '🍃', x: 1140, y: G - 62, w: 48, h: 48 },
      { id: 'vgate2', type: 'gate', x: 1260, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Stop the laser!
      { id: 'vsw_laser', type: 'switch', color: 'red', label: 'LASER SWITCH', controlsLaserId: 'vlaser1', x: 1620, y: G - 122, w: 40, h: 40 },
      { id: 'vlaser1', type: 'laser', active: true, x: 1860, y: G - 160, w: 22, h: 160 },

      // Area 4: Shoot 2 robots!
      { id: 'vc2', type: 'coin', x: 2140, y: G - 88, w: 24, h: 24 },
      { id: 'vgate3', type: 'gate', x: 2660, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'vgoal1', type: 'goal', x: 2920, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 've_rob1', type: 'robot', word: 'Robot', x: 2200, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 've_rob2', type: 'robot', word: 'Robot', x: 2460, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'mv1_rbox',
        triggerX: 40,
        checkpointX: 60,
        type: 'jump_on_object',
        targetId: 'vbox_r',
        text: 'Jump on the right box!',
        jp: '右の箱（RIGHT BOX）に飛び乗ろう！',
        timeLimit: 25,
        gateId: 'vgate1',
      },
      {
        id: 'mv1_fire',
        triggerX: 810,
        checkpointX: 830,
        type: 'shoot_word_target',
        targetWord: 'fire',
        text: 'Shoot the fire!',
        jp: '炎（🔥）の的を撃とう！',
        timeLimit: 25,
        gateId: 'vgate2',
      },
      {
        id: 'mv1_laser',
        triggerX: 1310,
        checkpointX: 1330,
        type: 'shoot_switch',
        targetId: 'vsw_laser',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'mv1_robots',
        triggerX: 1930,
        checkpointX: 1950,
        type: 'defeat_enemy_type',
        targetType: 'robot',
        targetCount: 2,
        text: 'Shoot 2 robots!',
        jp: 'ロボットを2たい倒そう！',
        timeLimit: 30,
        gateId: 'vgate3',
      },
    ],
  },

  'volcano-2': {
    id: 'volcano-2',
    name: 'Volcano 2: Magma Core',
    world: 'volcano',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Spell HOT!
      { id: 'v2_lh', type: 'letter_target', letter: 'H', resetOnFail: true, x: 260, y: G - 62, w: 44, h: 44 },
      { id: 'v2_lo', type: 'letter_target', letter: 'O', resetOnFail: true, x: 420, y: G - 122, w: 44, h: 44 },
      { id: 'v2_lt', type: 'letter_target', letter: 'T', resetOnFail: true, x: 580, y: G - 62, w: 44, h: 44 },
      { id: 'vgate2_1', type: 'gate', x: 720, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Dodge the shots!
      { id: 'vbox2_1', type: 'box', x: 960, y: G - 48, w: 48, h: 48 },
      { id: 'vgate2_2', type: 'gate', x: 1580, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot yellow, then red!
      { id: 'vsw_y', type: 'switch', color: 'yellow', resetOnFail: true, x: 1920, y: G - 62, w: 38, h: 38 },
      { id: 'vsw_r', type: 'switch', color: 'red', resetOnFail: true, x: 2120, y: G - 122, w: 38, h: 38 },
      { id: 'vgate2_3', type: 'gate', x: 2420, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'vc2_1', type: 'coin', x: 2620, y: G - 64, w: 24, h: 24 },
      { id: 'vgoal2', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 've_tur1', type: 'turret', word: 'Turret', x: 1420, y: G - 26, hp: 3, shootInterval: 1.6 },
    ],
    missions: [
      {
        id: 'mv2_hot',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['H', 'O', 'T'],
        text: 'Spell HOT!',
        spokenText: 'Spell hot! H, O, T!',
        jp: 'H → O → T の順番に撃って HOT を作ろう！',
        timeLimit: 30,
        gateId: 'vgate2_1',
      },
      {
        id: 'mv2_dodge',
        triggerX: 770,
        checkpointX: 790,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: '弾に当たらずに5びょうよけよう！',
        timeLimit: 25,
        gateId: 'vgate2_2',
      },
      {
        id: 'mv2_seq',
        triggerX: 1630,
        checkpointX: 1650,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['yellow', 'red'],
        text: 'Shoot yellow, then red!',
        jp: 'まず黄（YELLOW）、つぎに赤（RED）を撃とう！',
        timeLimit: 30,
        gateId: 'vgate2_3',
      },
    ],
  },

  'volcano-2b': {
    id: 'volcano-2b',
    name: 'Volcano 3: Ash Bridge',
    world: 'volcano',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Shoot the red slime!
      { id: 'v2b_c1', type: 'coin', x: 240, y: G - 56, w: 24, h: 24 },
      { id: 'v2b_gate1', type: 'gate', x: 880, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Jump on the box, then the tree!
      { id: 'v2b_box', type: 'box', x: 1120, y: G - 54, w: 54, h: 54 },
      { id: 'v2b_tree', type: 'tree', x: 1290, y: G - 125, w: 120, h: 26 },
      { id: 'v2b_gate2', type: 'gate', x: 1640, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot number 5! (2, 5, 8)
      { id: 'v2b_n2', type: 'number_target', num: 2, x: 1860, y: G - 62, w: 42, h: 42 },
      { id: 'v2b_n5', type: 'number_target', num: 5, x: 2020, y: G - 122, w: 42, h: 42 },
      { id: 'v2b_n8', type: 'number_target', num: 8, x: 2180, y: G - 62, w: 42, h: 42 },
      { id: 'v2b_gate3', type: 'gate', x: 2420, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'v2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'v2b_blue', type: 'blue_slime', word: 'Blue Slime', x: 460, y: G - 24, patrolRange: 70, hp: 2 },
      { id: 'v2b_red', type: 'red_slime', word: 'Red Slime', x: 680, y: G - 24, patrolRange: 75, hp: 2 },
    ],
    missions: [
      {
        id: 'mv2b_red',
        triggerX: 40,
        checkpointX: 60,
        type: 'defeat_enemy_type',
        targetType: 'red_slime',
        forbiddenEnemyType: 'blue_slime',
        targetCount: 1,
        text: 'Shoot the red slime!',
        jp: '赤いスライムを撃とう！（青は撃たないで）',
        timeLimit: 30,
        gateId: 'v2b_gate1',
      },
      {
        id: 'mv2b_seq',
        triggerX: 930,
        checkpointX: 950,
        type: 'sequence',
        subType: 'jump_objects',
        steps: ['v2b_box', 'v2b_tree'],
        text: 'Jump on the box, then the tree!',
        jp: 'まず箱（BOX）、つぎに木（TREE）に飛び乗ろう！',
        timeLimit: 30,
        gateId: 'v2b_gate2',
      },
      {
        id: 'mv2b_num5',
        triggerX: 1690,
        checkpointX: 1710,
        type: 'shoot_number',
        targetNum: 5,
        text: 'Shoot number 5!',
        jp: '数字の「5」の的を撃とう！',
        timeLimit: 25,
        gateId: 'v2b_gate3',
      },
    ],
  },

  'volcano-3': {
    id: 'volcano-3',
    name: 'Volcano 4: Fire Dragon',
    world: 'volcano',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'vc3_1', type: 'coin', x: 230, y: G - 54, w: 24, h: 24 },
      { id: 'vc3_2', type: 'coin', x: 340, y: G - 94, w: 24, h: 24 },
      { id: 'vrock3_1', type: 'rock', x: 500, y: G - 76, w: 64, h: 76, broken: false },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'fire_dragon',
      name: 'Fire Dragon',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 16,
    },
  },
};
