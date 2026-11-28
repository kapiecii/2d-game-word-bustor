import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const CASTLE_STAGES = {
  'castle-1': {
    id: 'castle-1',
    name: 'Castle 1: Stone Bridge',
    world: 'castle',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Get the key!
      { id: 'ca1_box', type: 'box', x: 280, y: G - 48, w: 48, h: 48 },
      { id: 'ca1_tree', type: 'tree', x: 420, y: G - 125, w: 120, h: 26 },
      { id: 'ca1_key', type: 'key', x: 468, y: G - 165, w: 24, h: 28 },
      { id: 'ca1_gate1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Don't jump! Go to the gate!
      { id: 'ca1_c1', type: 'coin', x: 1020, y: G - 42, w: 24, h: 24 },
      { id: 'ca1_gate2', type: 'gate', x: 1380, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Spell CAT! (Ordered letters)
      { id: 'ca1_lc', type: 'letter_target', letter: 'C', resetOnFail: true, x: 1740, y: G - 62, w: 44, h: 44 },
      { id: 'ca1_la', type: 'letter_target', letter: 'A', resetOnFail: true, x: 1920, y: G - 122, w: 44, h: 44 },
      { id: 'ca1_lt', type: 'letter_target', letter: 'T', resetOnFail: true, x: 2100, y: G - 62, w: 44, h: 44 },
      { id: 'ca1_gate3', type: 'gate', x: 2360, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'ca1_c2', type: 'coin', x: 2600, y: G - 76, w: 24, h: 24 },
      { id: 'ca1_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ca1_r1', type: 'robot', word: 'Robot', x: 2620, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'mca1_key',
        triggerX: 40,
        checkpointX: 60,
        type: 'collect_key',
        targetId: 'ca1_key',
        text: 'Get the key!',
        jp: 'お城のカギを取ろう！',
        timeLimit: 25,
        gateId: 'ca1_gate1',
      },
      {
        id: 'mca1_nojump',
        triggerX: 750,
        checkpointX: 770,
        type: 'reach_without_jump',
        targetX: 1310,
        text: "Don't jump! Go to the gate!",
        jp: 'ジャンプしないでゲートまで歩いて進もう！',
        timeLimit: 20,
        gateId: 'ca1_gate2',
      },
      {
        id: 'mca1_cat',
        triggerX: 1430,
        checkpointX: 1450,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['C', 'A', 'T'],
        text: 'Spell CAT!',
        spokenText: 'Spell cat! C, A, T!',
        jp: 'C → A → T の順番に撃って CAT を作ろう！',
        timeLimit: 30,
        gateId: 'ca1_gate3',
      },
    ],
  },

  'castle-2': {
    id: 'castle-2',
    name: 'Castle 2: Magic Hall',
    world: 'castle',
    width: 3150,
    startX: 60,
    objects: [
      // Area 1: Shoot the triangle!
      { id: 'ca2_sh1', type: 'shape_target', shape: 'circle', color: 'blue', x: 360, y: G - 62, w: 46, h: 46 },
      { id: 'ca2_sh2', type: 'shape_target', shape: 'triangle', color: 'green', x: 520, y: G - 126, w: 46, h: 46 },
      { id: 'ca2_sh3', type: 'shape_target', shape: 'square', color: 'red', x: 680, y: G - 62, w: 46, h: 46 },
      { id: 'ca2_gate1', type: 'gate', x: 880, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot blue, then red!
      { id: 'ca2_sw_b', type: 'switch', color: 'blue', resetOnFail: true, x: 1220, y: G - 62, w: 38, h: 38 },
      { id: 'ca2_sw_r', type: 'switch', color: 'red', resetOnFail: true, x: 1420, y: G - 122, w: 38, h: 38 },
      { id: 'ca2_gate2', type: 'gate', x: 1700, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 2 turrets!
      { id: 'ca2_box', type: 'box', x: 1900, y: G - 48, w: 48, h: 48 },
      { id: 'ca2_gate3', type: 'gate', x: 2520, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'ca2_c1', type: 'coin', x: 2720, y: G - 68, w: 24, h: 24 },
      { id: 'ca2_goal', type: 'goal', x: 2940, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ca2_t1', type: 'turret', word: 'Turret', x: 2120, y: G - 26, hp: 2, shootInterval: 2.0 },
      { id: 'ca2_t2', type: 'turret', word: 'Turret', x: 2360, y: G - 26, hp: 2, shootInterval: 1.9 },
    ],
    missions: [
      {
        id: 'mca2_jshoot',
        triggerX: 40,
        checkpointX: 60,
        type: 'jump_shoot',
        targetCount: 3,
        text: 'Jump and shoot 3 times!',
        jp: 'ジャンプしながら3回撃とう！',
        timeLimit: 25,
        gateId: 'ca2_gate1',
      },
      {
        id: 'mca2_seq',
        triggerX: 930,
        checkpointX: 950,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['blue', 'red'],
        text: 'Shoot blue, then red!',
        jp: 'まず青（BLUE）、つぎに赤（RED）を撃とう！',
        timeLimit: 30,
        gateId: 'ca2_gate2',
      },
      {
        id: 'mca2_turrets',
        triggerX: 1750,
        checkpointX: 1770,
        type: 'defeat_enemy_type',
        targetType: 'turret',
        targetCount: 2,
        text: 'Shoot 2 turrets!',
        jp: 'タレットを2たい倒そう！',
        timeLimit: 30,
        gateId: 'ca2_gate3',
      },
    ],
  },

  'castle-2b': {
    id: 'castle-2b',
    name: 'Castle 3: Royal Tower',
    world: 'castle',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Use a big shot!
      { id: 'ca2b_c1', type: 'coin', x: 260, y: G - 56, w: 24, h: 24 },
      { id: 'ca2b_gate1', type: 'gate', x: 660, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Jump on the box, then the tree!
      { id: 'ca2b_box', type: 'box', x: 920, y: G - 54, w: 54, h: 54 },
      { id: 'ca2b_tree', type: 'tree', x: 1100, y: G - 125, w: 120, h: 26 },
      { id: 'ca2b_gate2', type: 'gate', x: 1460, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the small slime!
      { id: 'ca2b_gate3', type: 'gate', x: 2320, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'ca2b_c2', type: 'coin', x: 2580, y: G - 76, w: 24, h: 24 },
      { id: 'ca2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ca2b_big', type: 'red_slime', word: 'Big Slime', sizeTag: 'big', scale: 1.75, x: 1780, y: G - 24, patrolRange: 75, hp: 3 },
      { id: 'ca2b_small', type: 'blue_slime', word: 'Small Slime', sizeTag: 'small', scale: 0.72, x: 2060, y: G - 24, patrolRange: 70, hp: 1 },
    ],
    missions: [
      {
        id: 'mca2b_charge',
        triggerX: 40,
        checkpointX: 60,
        type: 'use_charge_shot',
        targetCount: 1,
        text: 'Use a big shot!',
        jp: 'Zキーを長押ししてチャージショットを撃とう！',
        timeLimit: 25,
        gateId: 'ca2b_gate1',
      },
      {
        id: 'mca2b_seq',
        triggerX: 710,
        checkpointX: 730,
        type: 'sequence',
        subType: 'jump_objects',
        steps: ['ca2b_box', 'ca2b_tree'],
        text: 'Jump on the box, then the tree!',
        jp: 'まず箱（BOX）、つぎに木（TREE）に飛び乗ろう！',
        timeLimit: 30,
        gateId: 'ca2b_gate2',
      },
      {
        id: 'mca2b_small',
        triggerX: 1510,
        checkpointX: 1530,
        type: 'defeat_enemy_type',
        targetId: 'ca2b_small',
        forbiddenIds: ['ca2b_big'],
        targetCount: 1,
        text: 'Shoot the small slime!',
        jp: '小さいスライムを撃とう！（大きい方は撃たないで）',
        timeLimit: 30,
        gateId: 'ca2b_gate3',
      },
    ],
  },

  'castle-3': {
    id: 'castle-3',
    name: 'Castle 4: Dark Knight',
    world: 'castle',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'ca3_c1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'ca3_c2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'ca3_c3', type: 'coin', x: 440, y: G - 54, w: 24, h: 24 },
      { id: 'ca3_box', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'dark_knight',
      name: 'Dark Knight',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 18,
    },
  },
};
