import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const SNOW_STAGES = {
  'snow-1': {
    id: 'snow-1',
    name: 'Snow 1: Frost Path',
    world: 'snow',
    width: 2900,
    startX: 60,
    objects: [
      // Area 1: Stay on the tree! (3 seconds)
      { id: 'sc1', type: 'coin', x: 240, y: G - 52, w: 24, h: 24 },
      { id: 'sbox1', type: 'box', x: 360, y: G - 48, w: 48, h: 48 },
      { id: 'stree1', type: 'tree', x: 500, y: G - 125, w: 120, h: 26 },
      { id: 'sc2', type: 'coin', x: 548, y: G - 165, w: 24, h: 24 },
      { id: 'sgate1', type: 'gate', x: 760, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot 2 bats!
      { id: 'stree2', type: 'tree', x: 960, y: G - 105, w: 120, h: 26 },
      { id: 'sc3', type: 'coin', x: 1008, y: G - 148, w: 24, h: 24 },
      { id: 'sgate2', type: 'gate', x: 1560, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Break the ice! (Charge Shot)
      { id: 'sc4', type: 'coin', x: 1740, y: G - 52, w: 24, h: 24 },
      { id: 'sice1', type: 'ice', x: 1980, y: G - 78, w: 66, h: 78, broken: false },
      { id: 'sgate3', type: 'gate', x: 2300, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'sc8', type: 'coin', x: 2500, y: G - 70, w: 24, h: 24 },
      { id: 'sgoal1', type: 'goal', x: 2700, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'se_bat1', type: 'bat', word: 'Bat', x: 1140, y: G - 150, patrolRange: 90, hp: 1 },
      { id: 'se_bat2', type: 'bat', word: 'Bat', x: 1360, y: G - 115, patrolRange: 90, hp: 1 },
      { id: 'se_robot1', type: 'robot', word: 'Robot', x: 2500, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'ms1_stay',
        triggerX: 40,
        checkpointX: 60,
        type: 'stay_on_object',
        targetId: 'stree1',
        holdSeconds: 3,
        text: 'Stay on the tree!',
        jp: '木の上に3びょう乗りつづけよう！',
        timeLimit: 25,
        gateId: 'sgate1',
      },
      {
        id: 'ms1_bats',
        triggerX: 810,
        checkpointX: 830,
        type: 'defeat_enemy_type',
        targetType: 'bat',
        targetCount: 2,
        text: 'Shoot 2 bats!',
        jp: 'コウモリを2ひき撃とう！',
        timeLimit: 30,
        gateId: 'sgate2',
      },
      {
        id: 'ms1_ice',
        triggerX: 1610,
        checkpointX: 1630,
        type: 'break_object',
        targetId: 'sice1',
        text: 'Break the ice!',
        jp: 'チャージショットで氷（ICE）をこわそう！',
        timeLimit: 30,
        gateId: 'sgate3',
      },
    ],
  },

  'snow-2': {
    id: 'snow-2',
    name: 'Snow 2: Ice Cave',
    world: 'snow',
    width: 3000,
    startX: 60,
    objects: [
      // Area 1: Shoot the robot!
      { id: 'sc2_1', type: 'coin', x: 260, y: G - 56, w: 24, h: 24 },
      { id: 'sbox2_1', type: 'box', x: 380, y: G - 48, w: 48, h: 48 },
      { id: 'sgate2_1', type: 'gate', x: 820, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the coin under the tree!
      { id: 'stree_under', type: 'tree', x: 1120, y: G - 125, w: 140, h: 26 },
      { id: 'scoin_above', type: 'coin', x: 1178, y: G - 168, w: 24, h: 24 },
      { id: 'scoin_under', type: 'coin', x: 1178, y: G - 36, w: 24, h: 24 },
      { id: 'sgate2_2', type: 'gate', x: 1480, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot red, then blue! (2-step switches)
      { id: 'ssw_red', type: 'switch', color: 'red', resetOnFail: true, x: 1860, y: G - 64, w: 38, h: 38 },
      { id: 'ssw_blue', type: 'switch', color: 'blue', resetOnFail: true, x: 2040, y: G - 115, w: 38, h: 38 },
      { id: 'sgate2_3', type: 'gate', x: 2320, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'sc2_3', type: 'coin', x: 2520, y: G - 56, w: 24, h: 24 },
      { id: 'sgoal2', type: 'goal', x: 2800, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'se_robot2', type: 'robot', word: 'Robot', x: 600, y: G - 24, patrolRange: 95, hp: 2 },
    ],
    missions: [
      {
        id: 'ms2_robot',
        triggerX: 40,
        checkpointX: 60,
        type: 'defeat_enemy_type',
        targetType: 'robot',
        targetCount: 1,
        text: 'Shoot the robot!',
        jp: 'ロボットを撃って倒そう！',
        timeLimit: 25,
        gateId: 'sgate2_1',
      },
      {
        id: 'ms2_under',
        triggerX: 870,
        checkpointX: 890,
        type: 'collect_specific_coin',
        targetId: 'scoin_under',
        text: 'Get the coin under the tree!',
        jp: '木の下（UNDER）にあるコインを取ろう！',
        timeLimit: 25,
        gateId: 'sgate2_2',
      },
      {
        id: 'ms2_seq_sw',
        triggerX: 1530,
        checkpointX: 1550,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['red', 'blue'],
        text: 'Shoot red, then blue!',
        jp: 'まず赤（RED）を撃って、つぎに青（BLUE）を撃とう！',
        timeLimit: 30,
        gateId: 'sgate2_3',
      },
    ],
  },

  'snow-2b': {
    id: 'snow-2b',
    name: 'Snow 3: Frozen Peak',
    world: 'snow',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Jump on the right box!
      { id: 's2b_bl', type: 'box', label: 'LEFT BOX', x: 300, y: G - 54, w: 54, h: 54 },
      { id: 's2b_br', type: 'box', label: 'RIGHT BOX', x: 520, y: G - 54, w: 54, h: 54 },
      { id: 's2b_gate1', type: 'gate', x: 780, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Break the ice!
      { id: 's2b_ice1', type: 'ice', x: 1180, y: G - 78, w: 66, h: 78, broken: false },
      { id: 's2b_c1', type: 'coin', x: 1020, y: G - 54, w: 24, h: 24 },
      { id: 's2b_gate2', type: 'gate', x: 1500, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the high bat!
      { id: 's2b_tree1', type: 'tree', x: 1740, y: G - 115, w: 120, h: 26 },
      { id: 's2b_gate3', type: 'gate', x: 2360, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 's2b_c2', type: 'coin', x: 2600, y: G - 76, w: 24, h: 24 },
      { id: 's2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 's2b_bat_high', type: 'bat', word: 'High Bat', heightTag: 'high', x: 2040, y: G - 210, patrolRange: 85, hp: 1 },
      { id: 's2b_bat_low', type: 'bat', word: 'Low Bat', heightTag: 'low', x: 2060, y: G - 68, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'ms2b_look',
        triggerX: 40,
        checkpointX: 60,
        type: 'look_left_right',
        text: 'Look left, then look right!',
        jp: 'まず左（←）を向いて、つぎに右（→）を向こう！',
        timeLimit: 20,
        gateId: 's2b_gate1',
      },
      {
        id: 'ms2b_ice',
        triggerX: 830,
        checkpointX: 850,
        type: 'break_object',
        targetId: 's2b_ice1',
        text: 'Break the ice!',
        jp: 'チャージショットで氷（ICE）をこわそう！',
        timeLimit: 30,
        gateId: 's2b_gate2',
      },
      {
        id: 'ms2b_hbat',
        triggerX: 1550,
        checkpointX: 1570,
        type: 'defeat_enemy_type',
        targetId: 's2b_bat_high',
        forbiddenIds: ['s2b_bat_low'],
        targetCount: 1,
        text: 'Shoot the high bat!',
        jp: '高いところのコウモリを撃とう！（低い方は撃たないで）',
        timeLimit: 30,
        gateId: 's2b_gate3',
      },
    ],
  },

  'snow-3': {
    id: 'snow-3',
    name: 'Snow 4: Ice Machine',
    world: 'snow',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'sc3_1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'sbox3_1', type: 'box', x: 360, y: G - 48, w: 48, h: 48 },
      { id: 'sc3_2', type: 'coin', x: 372, y: G - 110, w: 24, h: 24 },
      { id: 'sc3_3', type: 'coin', x: 520, y: G - 54, w: 24, h: 24 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'ice_machine',
      name: 'Ice Machine',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1860,
      hp: 14,
    },
  },
};
