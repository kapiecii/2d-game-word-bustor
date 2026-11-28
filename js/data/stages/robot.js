import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const ROBOT_STAGES = {
  'robot-1': {
    id: 'robot-1',
    name: 'Robot 1: Metal Factory',
    world: 'robot',
    width: 2950,
    startX: 60,
    objects: [
      // Area 1: Shoot 2 robots!
      { id: 'rc1', type: 'coin', x: 240, y: G - 56, w: 24, h: 24 },
      { id: 'rbox1', type: 'box', x: 380, y: G - 48, w: 48, h: 48 },
      { id: 'rgate1', type: 'gate', x: 960, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Stop the laser! (Shoot the switch to turn off laser barrier)
      { id: 'rbox2', type: 'box', x: 1120, y: G - 48, w: 48, h: 48 },
      { id: 'rsw_laser', type: 'switch', color: 'yellow', label: 'LASER SWITCH', controlsLaserId: 'rlaser1', x: 1360, y: G - 120, w: 40, h: 40 },
      { id: 'rlaser1', type: 'laser', active: true, x: 1580, y: G - 160, w: 22, h: 160 },

      // Area 3: Break the rock!
      { id: 'rc2', type: 'coin', x: 1780, y: G - 58, w: 24, h: 24 },
      { id: 'rrock1', type: 'rock', x: 1980, y: G - 76, w: 64, h: 76, broken: false },
      { id: 'rgate3', type: 'gate', x: 2240, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'rc3', type: 'coin', x: 2440, y: G - 82, w: 24, h: 24 },
      { id: 'rc4', type: 'coin', x: 2560, y: G - 52, w: 24, h: 24 },
      { id: 'rgoal1', type: 'goal', x: 2760, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 're_rob1', type: 'robot', word: 'Robot', x: 560, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 're_rob2', type: 'robot', word: 'Robot', x: 780, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 're_tur1', type: 'turret', word: 'Turret', x: 2520, y: G - 26, hp: 2, shootInterval: 2.0 },
    ],
    missions: [
      {
        id: 'mr1_shoot5',
        triggerX: 40,
        checkpointX: 60,
        type: 'shoot_count',
        targetCount: 5,
        text: 'Shoot 5 times!',
        jp: '5回ショットを撃とう！',
        timeLimit: 20,
        gateId: 'rgate1',
      },
      {
        id: 'mr1_laser',
        triggerX: 1010,
        checkpointX: 1030,
        type: 'shoot_switch',
        targetId: 'rsw_laser',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'mr1_rock',
        triggerX: 1650,
        checkpointX: 1670,
        type: 'break_object',
        targetId: 'rrock1',
        text: 'Break the rock!',
        jp: 'チャージショットで岩をこわそう！',
        timeLimit: 30,
        gateId: 'rgate3',
      },
    ],
  },

  'robot-2': {
    id: 'robot-2',
    name: 'Robot 2: Laser Core',
    world: 'robot',
    width: 3050,
    startX: 60,
    objects: [
      // Area 1: Spell CAR!
      { id: 'r2_lc', type: 'letter_target', letter: 'C', resetOnFail: true, x: 420, y: G - 62, w: 44, h: 44 },
      { id: 'r2_la', type: 'letter_target', letter: 'A', resetOnFail: true, x: 580, y: G - 122, w: 44, h: 44 },
      { id: 'r2_lr', type: 'letter_target', letter: 'R', resetOnFail: true, x: 740, y: G - 62, w: 44, h: 44 },
      { id: 'rgate2_1', type: 'gate', x: 940, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot red, then blue!
      { id: 'rsw_seq_r', type: 'switch', color: 'red', resetOnFail: true, x: 1260, y: G - 62, w: 38, h: 38 },
      { id: 'rsw_seq_b', type: 'switch', color: 'blue', resetOnFail: true, x: 1460, y: G - 118, w: 38, h: 38 },
      { id: 'rgate2_2', type: 'gate', x: 1740, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Dodge the shots!
      { id: 'rbox2_2', type: 'box', x: 1960, y: G - 48, w: 48, h: 48 },
      { id: 'rc2_3', type: 'coin', x: 1972, y: G - 108, w: 24, h: 24 },
      { id: 'rgate2_3', type: 'gate', x: 2520, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'rc2_7', type: 'coin', x: 2700, y: G - 68, w: 24, h: 24 },
      { id: 'rgoal2', type: 'goal', x: 2860, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 're_tur2', type: 'turret', word: 'Turret', x: 2380, y: G - 26, hp: 3, shootInterval: 1.7 },
    ],
    missions: [
      {
        id: 'mr2_car',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'shoot_letters',
        steps: ['C', 'A', 'R'],
        text: 'Spell CAR!',
        spokenText: 'Spell car! C, A, R!',
        jp: 'C → A → R の順番に撃って CAR を作ろう！',
        timeLimit: 30,
        gateId: 'rgate2_1',
      },
      {
        id: 'mr2_seq',
        triggerX: 990,
        checkpointX: 1010,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['red', 'blue'],
        text: 'Shoot red, then blue!',
        jp: 'まず赤（RED）、つぎに青（BLUE）のスイッチを撃とう！',
        timeLimit: 30,
        gateId: 'rgate2_2',
      },
      {
        id: 'mr2_dodge',
        triggerX: 1790,
        checkpointX: 1810,
        type: 'dodge_shots',
        holdSeconds: 5,
        text: 'Dodge the shots!',
        jp: 'タレットの弾を5びょう間よけよう！',
        timeLimit: 25,
        gateId: 'rgate2_3',
      },
    ],
  },

  'robot-2b': {
    id: 'robot-2b',
    name: 'Robot 3: Cyber Vault',
    world: 'robot',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Stop the laser!
      { id: 'r2b_sw_l', type: 'switch', color: 'green', label: 'LASER SWITCH', controlsLaserId: 'r2b_laser', x: 460, y: G - 120, w: 40, h: 40 },
      { id: 'r2b_laser', type: 'laser', active: true, x: 700, y: G - 160, w: 22, h: 160 },

      // Area 2: Get the red star!
      { id: 'r2b_sr', type: 'star', color: 'red', x: 1000, y: G - 115, w: 30, h: 30 },
      { id: 'r2b_sb', type: 'star', color: 'blue', x: 1180, y: G - 48, w: 30, h: 30 },
      { id: 'r2b_sy', type: 'star', color: 'yellow', x: 1360, y: G - 48, w: 30, h: 30 },
      { id: 'r2b_gate2', type: 'gate', x: 1580, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 2 robots!
      { id: 'r2b_box', type: 'box', x: 1780, y: G - 48, w: 48, h: 48 },
      { id: 'r2b_gate3', type: 'gate', x: 2440, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'r2b_c1', type: 'coin', x: 2640, y: G - 68, w: 24, h: 24 },
      { id: 'r2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'r2b_rob1', type: 'robot', word: 'Robot', x: 2020, y: G - 24, patrolRange: 80, hp: 2 },
      { id: 'r2b_rob2', type: 'robot', word: 'Robot', x: 2260, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'mr2b_laser',
        triggerX: 40,
        checkpointX: 60,
        type: 'shoot_switch',
        targetId: 'r2b_sw_l',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'mr2b_charge',
        triggerX: 770,
        checkpointX: 790,
        type: 'use_charge_shot',
        targetCount: 1,
        text: 'Use a big shot!',
        jp: 'Zキーを長押ししてチャージショット（BIG SHOT）を撃とう！',
        timeLimit: 25,
        gateId: 'r2b_gate2',
      },
      {
        id: 'mr2b_robots',
        triggerX: 1630,
        checkpointX: 1650,
        type: 'defeat_enemy_type',
        targetType: 'robot',
        targetCount: 2,
        text: 'Shoot 2 robots!',
        jp: 'ロボットを2たい倒そう！',
        timeLimit: 30,
        gateId: 'r2b_gate3',
      },
    ],
  },

  'robot-3': {
    id: 'robot-3',
    name: 'Robot 4: Mega Robot',
    world: 'robot',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'rc3_1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'rc3_2', type: 'coin', x: 320, y: G - 94, w: 24, h: 24 },
      { id: 'rc3_3', type: 'coin', x: 420, y: G - 54, w: 24, h: 24 },
      { id: 'rbox3_1', type: 'box', x: 540, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'mega_robot',
      name: 'Mega Robot',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1860,
      hp: 15,
    },
  },
};
