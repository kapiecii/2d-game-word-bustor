import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const GHOST_STAGES = {
  'ghost-1': {
    id: 'ghost-1',
    name: 'Ghost 1: Spooky Garden',
    world: 'ghost',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Don't move!
      { id: 'gh1_c1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'gh1_gate1', type: 'gate', x: 640, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot 3 bats!
      { id: 'gh1_tree', type: 'tree', x: 900, y: G - 115, w: 120, h: 26 },
      { id: 'gh1_gate2', type: 'gate', x: 1680, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Spell SUN!
      { id: 'gh1_ls', type: 'letter_target', letter: 'S', resetOnFail: true, x: 1960, y: G - 62, w: 44, h: 44 },
      { id: 'gh1_lu', type: 'letter_target', letter: 'U', resetOnFail: true, x: 2120, y: G - 122, w: 44, h: 44 },
      { id: 'gh1_ln', type: 'letter_target', letter: 'N', resetOnFail: true, x: 2280, y: G - 62, w: 44, h: 44 },
      { id: 'gh1_gate3', type: 'gate', x: 2520, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'gh1_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'gh1_b1', type: 'bat', word: 'Bat', x: 1080, y: G - 150, patrolRange: 85, hp: 1 },
      { id: 'gh1_b2', type: 'bat', word: 'Bat', x: 1300, y: G - 115, patrolRange: 85, hp: 1 },
      { id: 'gh1_b3', type: 'bat', word: 'Bat', x: 1500, y: G - 165, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'mgh1_freeze',
        triggerX: 40,
        checkpointX: 60,
        type: 'dont_move',
        holdSeconds: 3,
        text: "Don't move!",
        jp: '3びょう間じっと止まろう！',
        timeLimit: 20,
        gateId: 'gh1_gate1',
      },
      {
        id: 'mgh1_bats',
        triggerX: 690,
        checkpointX: 710,
        type: 'defeat_enemy_type',
        targetType: 'bat',
        targetCount: 3,
        text: 'Shoot 3 bats!',
        jp: 'コウモリを3びき撃とう！',
        timeLimit: 35,
        gateId: 'gh1_gate2',
      },
      {
        id: 'mgh1_sun',
        triggerX: 1730,
        checkpointX: 1750,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['S', 'U', 'N'],
        text: 'Spell SUN!',
        spokenText: 'Spell sun! S, U, N!',
        jp: 'S → U → N の順番に撃って SUN を作ろう！',
        timeLimit: 30,
        gateId: 'gh1_gate3',
      },
    ],
  },

  'ghost-2': {
    id: 'ghost-2',
    name: 'Ghost 2: Haunted Hall',
    world: 'ghost',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Shoot the low bat!
      { id: 'gh2_tree', type: 'tree', x: 280, y: G - 115, w: 120, h: 26 },
      { id: 'gh2_gate1', type: 'gate', x: 860, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Stop the laser!
      { id: 'gh2_sw', type: 'switch', color: 'yellow', label: 'LASER SWITCH', controlsLaserId: 'gh2_laser', x: 1220, y: G - 122, w: 40, h: 40 },
      { id: 'gh2_laser', type: 'laser', active: true, x: 1480, y: G - 160, w: 22, h: 160 },

      // Area 3: Dodge the shots!
      { id: 'gh2_box', type: 'box', x: 1760, y: G - 48, w: 48, h: 48 },
      { id: 'gh2_gate3', type: 'gate', x: 2420, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'gh2_c1', type: 'coin', x: 2660, y: G - 76, w: 24, h: 24 },
      { id: 'gh2_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'gh2_bh', type: 'bat', word: 'High Bat', heightTag: 'high', x: 560, y: G - 210, patrolRange: 80, hp: 1 },
      { id: 'gh2_bl', type: 'bat', word: 'Low Bat', heightTag: 'low', x: 580, y: G - 68, patrolRange: 80, hp: 1 },
      { id: 'gh2_t1', type: 'turret', word: 'Turret', x: 2260, y: G - 26, hp: 3, shootInterval: 1.55 },
    ],
    missions: [
      {
        id: 'mgh2_lbat',
        triggerX: 40,
        checkpointX: 60,
        type: 'defeat_enemy_type',
        targetId: 'gh2_bl',
        forbiddenIds: ['gh2_bh'],
        targetCount: 1,
        text: 'Shoot the low bat!',
        jp: '低いところのコウモリを撃とう！（高い方は撃たないで）',
        timeLimit: 30,
        gateId: 'gh2_gate1',
      },
      {
        id: 'mgh2_laser',
        triggerX: 910,
        checkpointX: 930,
        type: 'shoot_switch',
        targetId: 'gh2_sw',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'mgh2_dodge',
        triggerX: 1550,
        checkpointX: 1570,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: '弾に当たらずに5びょうよけよう！',
        timeLimit: 25,
        gateId: 'gh2_gate3',
      },
    ],
  },

  'ghost-2b': {
    id: 'ghost-2b',
    name: 'Ghost 3: Moonlit Attic',
    world: 'ghost',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Shoot A, B, C!
      { id: 'gh2b_la', type: 'letter_target', letter: 'A', resetOnFail: true, x: 320, y: G - 62, w: 44, h: 44 },
      { id: 'gh2b_lb', type: 'letter_target', letter: 'B', resetOnFail: true, x: 480, y: G - 122, w: 44, h: 44 },
      { id: 'gh2b_lc', type: 'letter_target', letter: 'C', resetOnFail: true, x: 640, y: G - 62, w: 44, h: 44 },
      { id: 'gh2b_gate1', type: 'gate', x: 820, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Break the ice!
      { id: 'gh2b_ice', type: 'ice', x: 1220, y: G - 78, w: 66, h: 78, broken: false },
      { id: 'gh2b_gate2', type: 'gate', x: 1540, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Get 5 coins!
      { id: 'gh2b_c1', type: 'coin', x: 1760, y: G - 54, w: 24, h: 24 },
      { id: 'gh2b_c2', type: 'coin', x: 1880, y: G - 108, w: 24, h: 24 },
      { id: 'gh2b_c3', type: 'coin', x: 2000, y: G - 54, w: 24, h: 24 },
      { id: 'gh2b_c4', type: 'coin', x: 2120, y: G - 108, w: 24, h: 24 },
      { id: 'gh2b_c5', type: 'coin', x: 2240, y: G - 54, w: 24, h: 24 },
      { id: 'gh2b_gate3', type: 'gate', x: 2440, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'gh2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [],
    missions: [
      {
        id: 'mgh2b_abc',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['A', 'B', 'C'],
        text: 'Shoot A, B, C!',
        jp: 'A → B → C の順番に撃とう！',
        timeLimit: 30,
        gateId: 'gh2b_gate1',
      },
      {
        id: 'mgh2b_ice',
        triggerX: 870,
        checkpointX: 890,
        type: 'break_object',
        targetId: 'gh2b_ice',
        text: 'Break the ice!',
        jp: 'チャージショットで氷（ICE）をこわそう！',
        timeLimit: 30,
        gateId: 'gh2b_gate2',
      },
      {
        id: 'mgh2b_coins',
        triggerX: 1590,
        checkpointX: 1610,
        type: 'collect_coins',
        targetCount: 5,
        text: 'Get 5 coins!',
        jp: 'コインを5まい集めよう！',
        timeLimit: 25,
        gateId: 'gh2b_gate3',
      },
    ],
  },

  'ghost-3': {
    id: 'ghost-3',
    name: 'Ghost 4: Phantom Ghost',
    world: 'ghost',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'gh3_c1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'gh3_c2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'gh3_c3', type: 'coin', x: 440, y: G - 54, w: 24, h: 24 },
      { id: 'gh3_box', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'phantom_ghost',
      name: 'Phantom Ghost',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 20,
    },
  },
};
