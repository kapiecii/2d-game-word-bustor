import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const OCEAN_STAGES = {
  'ocean-1': {
    id: 'ocean-1',
    name: 'Ocean 1: Coral Reef',
    world: 'ocean',
    width: 3050,
    startX: 60,
    objects: [
      // Area 1: Get 4 coins
      { id: 'oc1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'oc2', type: 'coin', x: 350, y: G - 108, w: 24, h: 24 },
      { id: 'oc3', type: 'coin', x: 460, y: G - 54, w: 24, h: 24 },
      { id: 'oc4', type: 'coin', x: 560, y: G - 100, w: 24, h: 24 },
      { id: 'ogate1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the yellow star (Red, Blue, Yellow)
      { id: 'ostar_r', type: 'star', color: 'red', x: 900, y: G - 48, w: 30, h: 30 },
      { id: 'ostar_b', type: 'star', color: 'blue', x: 1100, y: G - 115, w: 30, h: 30 },
      { id: 'ostar_y', type: 'star', color: 'yellow', x: 1300, y: G - 48, w: 30, h: 30 },
      { id: 'ogate2', type: 'gate', x: 1500, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot the small slime! (Big vs Small)
      { id: 'obox1', type: 'box', x: 1680, y: G - 48, w: 48, h: 48 },
      { id: 'ogate3', type: 'gate', x: 2360, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'oc5', type: 'coin', x: 2560, y: G - 76, w: 24, h: 24 },
      { id: 'ogoal1', type: 'goal', x: 2860, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'oe_big', type: 'red_slime', word: 'Big Slime', sizeTag: 'big', scale: 1.75, x: 1880, y: G - 24, patrolRange: 70, hp: 3 },
      { id: 'oe_small', type: 'blue_slime', word: 'Small Slime', sizeTag: 'small', scale: 0.75, x: 2140, y: G - 24, patrolRange: 70, hp: 1 },
    ],
    missions: [
      {
        id: 'mo1_coins',
        triggerX: 40,
        checkpointX: 60,
        type: 'collect_coins',
        targetCount: 4,
        text: 'Get 4 coins!',
        jp: 'コインを4まい集めよう！',
        timeLimit: 25,
        gateId: 'ogate1',
      },
      {
        id: 'mo1_star',
        triggerX: 750,
        checkpointX: 770,
        type: 'collect_star',
        targetColor: 'yellow',
        text: 'Get the yellow star!',
        jp: '黄色いスター（YELLOW STAR）を取ろう！',
        timeLimit: 25,
        gateId: 'ogate2',
      },
      {
        id: 'mo1_small_slime',
        triggerX: 1550,
        checkpointX: 1570,
        type: 'defeat_enemy_type',
        targetId: 'oe_small',
        forbiddenIds: ['oe_big'],
        targetCount: 1,
        text: 'Shoot the small slime!',
        jp: '小さいスライムを撃とう！（大きい方は撃たないで）',
        timeLimit: 30,
        gateId: 'ogate3',
      },
    ],
  },

  'ocean-2': {
    id: 'ocean-2',
    name: 'Ocean 2: Deep Sea Cave',
    world: 'ocean',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Shoot blue, then green!
      { id: 'osw_b', type: 'switch', color: 'blue', resetOnFail: true, x: 420, y: G - 62, w: 38, h: 38 },
      { id: 'osw_g', type: 'switch', color: 'green', resetOnFail: true, x: 580, y: G - 120, w: 38, h: 38 },
      { id: 'ogate2_1', type: 'gate', x: 820, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the low bat! (High vs Low)
      { id: 'otree1', type: 'tree', x: 1020, y: G - 115, w: 120, h: 26 },
      { id: 'ogate2_2', type: 'gate', x: 1620, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Break the rock + Dodge
      { id: 'orock1', type: 'rock', x: 2020, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'ogate2_3', type: 'gate', x: 2340, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'oc2_1', type: 'coin', x: 2560, y: G - 68, w: 24, h: 24 },
      { id: 'ogoal2', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'oe_bat_high', type: 'bat', word: 'High Bat', heightTag: 'high', x: 1300, y: G - 210, patrolRange: 80, hp: 1 },
      { id: 'oe_bat_low', type: 'bat', word: 'Low Bat', heightTag: 'low', x: 1320, y: G - 66, patrolRange: 80, hp: 1 },
      { id: 'oe_tur1', type: 'turret', word: 'Turret', x: 2660, y: G - 26, hp: 2, shootInterval: 2.1 },
    ],
    missions: [
      {
        id: 'mo2_seq',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['blue', 'green'],
        text: 'Shoot blue, then green!',
        jp: 'まず青（BLUE）、つぎに緑（GREEN）を撃とう！',
        timeLimit: 30,
        gateId: 'ogate2_1',
      },
      {
        id: 'mo2_low_bat',
        triggerX: 870,
        checkpointX: 890,
        type: 'defeat_enemy_type',
        targetId: 'oe_bat_low',
        forbiddenIds: ['oe_bat_high'],
        targetCount: 1,
        text: 'Shoot the low bat!',
        jp: '低いところを飛ぶコウモリを撃とう！（高い方は撃たないで）',
        timeLimit: 30,
        gateId: 'ogate2_2',
      },
      {
        id: 'mo2_rock',
        triggerX: 1670,
        checkpointX: 1690,
        type: 'break_object',
        targetId: 'orock1',
        text: 'Break the rock!',
        jp: 'チャージショットで岩をこわそう！',
        timeLimit: 30,
        gateId: 'ogate2_3',
      },
    ],
  },

  'ocean-2b': {
    id: 'ocean-2b',
    name: 'Ocean 3: Sunken Ship',
    world: 'ocean',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Jump 4 times!
      { id: 'o2b_c1', type: 'coin', x: 260, y: G - 96, w: 24, h: 24 },
      { id: 'o2b_c2', type: 'coin', x: 380, y: G - 118, w: 24, h: 24 },
      { id: 'o2b_gate1', type: 'gate', x: 660, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the key!
      { id: 'o2b_box', type: 'box', x: 880, y: G - 48, w: 48, h: 48 },
      { id: 'o2b_tree', type: 'tree', x: 1040, y: G - 125, w: 120, h: 26 },
      { id: 'o2b_key', type: 'key', x: 1088, y: G - 165, w: 24, h: 28 },
      { id: 'o2b_gate2', type: 'gate', x: 1420, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Dodge the shots!
      { id: 'o2b_box2', type: 'box', x: 1680, y: G - 48, w: 48, h: 48 },
      { id: 'o2b_gate3', type: 'gate', x: 2340, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'o2b_c3', type: 'coin', x: 2580, y: G - 68, w: 24, h: 24 },
      { id: 'o2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'o2b_tur1', type: 'turret', word: 'Turret', x: 2180, y: G - 26, hp: 3, shootInterval: 1.7 },
    ],
    missions: [
      {
        id: 'mo2b_nojump',
        triggerX: 40,
        checkpointX: 60,
        type: 'reach_without_jump',
        targetX: 590,
        text: "Don't jump! Go to the gate!",
        jp: 'ジャンプしないでゲートまで歩いて進もう！',
        timeLimit: 20,
        gateId: 'o2b_gate1',
      },
      {
        id: 'mo2b_key',
        triggerX: 710,
        checkpointX: 730,
        type: 'collect_key',
        targetId: 'o2b_key',
        text: 'Get the key!',
        jp: '木の上のカギを取ろう！',
        timeLimit: 25,
        gateId: 'o2b_gate2',
      },
      {
        id: 'mo2b_dodge',
        triggerX: 1470,
        checkpointX: 1490,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: '弾に当たらずに5びょうよけよう！',
        timeLimit: 25,
        gateId: 'o2b_gate3',
      },
    ],
  },

  'ocean-3': {
    id: 'ocean-3',
    name: 'Ocean 4: Giant Octopus',
    world: 'ocean',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'oc3_1', type: 'coin', x: 230, y: G - 54, w: 24, h: 24 },
      { id: 'oc3_2', type: 'coin', x: 340, y: G - 94, w: 24, h: 24 },
      { id: 'obox3_1', type: 'box', x: 520, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'giant_octopus',
      name: 'Giant Octopus',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1860,
      hp: 15,
    },
  },
};
