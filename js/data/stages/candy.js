import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const CANDY_STAGES = {
  'candy-1': {
    id: 'candy-1',
    name: 'Candy 1: Sugar Path',
    world: 'candy',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Get 4 coins
      { id: 'cc1', type: 'coin', x: 240, y: G - 54, w: 24, h: 24 },
      { id: 'cc2', type: 'coin', x: 350, y: G - 108, w: 24, h: 24 },
      { id: 'cc3', type: 'coin', x: 460, y: G - 54, w: 24, h: 24 },
      { id: 'cc4', type: 'coin', x: 560, y: G - 108, w: 24, h: 24 },
      { id: 'cgate1', type: 'gate', x: 700, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the square! (Circle / Square / Triangle)
      { id: 'c1_sh_c', type: 'shape_target', shape: 'circle', color: 'red', x: 900, y: G - 62, w: 46, h: 46 },
      { id: 'c1_sh_s', type: 'shape_target', shape: 'square', color: 'blue', x: 1060, y: G - 126, w: 46, h: 46 },
      { id: 'c1_sh_t', type: 'shape_target', shape: 'triangle', color: 'yellow', x: 1220, y: G - 62, w: 46, h: 46 },
      { id: 'cgate2', type: 'gate', x: 1400, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Get the yellow star!
      { id: 'cstar_r', type: 'star', color: 'red', x: 1620, y: G - 48, w: 30, h: 30 },
      { id: 'cstar_y', type: 'star', color: 'yellow', x: 1820, y: G - 115, w: 30, h: 30 },
      { id: 'cstar_b', type: 'star', color: 'blue', x: 2020, y: G - 48, w: 30, h: 30 },
      { id: 'cgate3', type: 'gate', x: 2280, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'cc5', type: 'coin', x: 2520, y: G - 76, w: 24, h: 24 },
      { id: 'cgoal1', type: 'goal', x: 2880, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ce_slime1', type: 'red_slime', word: 'Red Slime', x: 2560, y: G - 24, patrolRange: 80, hp: 2 },
    ],
    missions: [
      {
        id: 'mc1_coins',
        triggerX: 40,
        checkpointX: 60,
        type: 'collect_coins',
        targetCount: 4,
        text: 'Get 4 coins!',
        jp: 'コインを4まい集めよう！',
        timeLimit: 25,
        gateId: 'cgate1',
      },
      {
        id: 'mc1_square',
        triggerX: 750,
        checkpointX: 770,
        type: 'shoot_shape',
        targetShape: 'square',
        text: 'Shoot the square!',
        jp: '四角（SQUARE）の的を撃とう！',
        timeLimit: 25,
        gateId: 'cgate2',
      },
      {
        id: 'mc1_star',
        triggerX: 1450,
        checkpointX: 1470,
        type: 'collect_star',
        targetColor: 'yellow',
        text: 'Get the yellow star!',
        jp: '黄色いスター（YELLOW STAR）を取ろう！',
        timeLimit: 25,
        gateId: 'cgate3',
      },
    ],
  },

  'candy-2': {
    id: 'candy-2',
    name: 'Candy 2: Cookie Hills',
    world: 'candy',
    width: 3150,
    startX: 60,
    objects: [
      // Area 1: Shoot the big slime!
      { id: 'cc2_1', type: 'coin', x: 240, y: G - 56, w: 24, h: 24 },
      { id: 'cgate2_1', type: 'gate', x: 900, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot red, then green!
      { id: 'csw_r', type: 'switch', color: 'red', resetOnFail: true, x: 1240, y: G - 62, w: 38, h: 38 },
      { id: 'csw_g', type: 'switch', color: 'green', resetOnFail: true, x: 1440, y: G - 122, w: 38, h: 38 },
      { id: 'cgate2_2', type: 'gate', x: 1720, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Stay on the tree!
      { id: 'cbox2_1', type: 'box', x: 1940, y: G - 48, w: 48, h: 48 },
      { id: 'ctree2_1', type: 'tree', x: 2100, y: G - 125, w: 130, h: 26 },
      { id: 'cgate2_3', type: 'gate', x: 2480, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'cc2_2', type: 'coin', x: 2700, y: G - 70, w: 24, h: 24 },
      { id: 'cgoal2', type: 'goal', x: 2940, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ce_small', type: 'blue_slime', word: 'Small Slime', sizeTag: 'small', scale: 0.72, x: 460, y: G - 24, patrolRange: 65, hp: 1 },
      { id: 'ce_big', type: 'red_slime', word: 'Big Slime', sizeTag: 'big', scale: 1.75, x: 700, y: G - 24, patrolRange: 75, hp: 3 },
    ],
    missions: [
      {
        id: 'mc2_big',
        triggerX: 40,
        checkpointX: 60,
        type: 'defeat_enemy_type',
        targetId: 'ce_big',
        forbiddenIds: ['ce_small'],
        targetCount: 1,
        text: 'Shoot the big slime!',
        jp: '大きいスライムを撃とう！（小さい方は撃たないで）',
        timeLimit: 30,
        gateId: 'cgate2_1',
      },
      {
        id: 'mc2_seq',
        triggerX: 950,
        checkpointX: 970,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['red', 'green'],
        text: 'Shoot red, then green!',
        jp: 'まず赤（RED）、つぎに緑（GREEN）を撃とう！',
        timeLimit: 30,
        gateId: 'cgate2_2',
      },
      {
        id: 'mc2_stay',
        triggerX: 1770,
        checkpointX: 1790,
        type: 'stay_on_object',
        targetId: 'ctree2_1',
        holdSeconds: 3,
        text: 'Stay on the tree!',
        jp: '木の上に3びょう乗りつづけよう！',
        timeLimit: 25,
        gateId: 'cgate2_3',
      },
    ],
  },

  'candy-2b': {
    id: 'candy-2b',
    name: 'Candy 3: Donut Bridge',
    world: 'candy',
    width: 3150,
    startX: 60,
    objects: [
      // Area 1: Break the ice!
      { id: 'c2b_ice', type: 'ice', x: 460, y: G - 78, w: 66, h: 78, broken: false },
      { id: 'c2b_gate1', type: 'gate', x: 740, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Stop the laser!
      { id: 'c2b_sw_l', type: 'switch', color: 'yellow', label: 'LASER SWITCH', controlsLaserId: 'c2b_laser', x: 1120, y: G - 122, w: 40, h: 40 },
      { id: 'c2b_laser', type: 'laser', active: true, x: 1380, y: G - 160, w: 22, h: 160 },

      // Area 3: Shoot 3 bats!
      { id: 'c2b_tree', type: 'tree', x: 1640, y: G - 115, w: 120, h: 26 },
      { id: 'c2b_gate3', type: 'gate', x: 2480, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'c2b_c1', type: 'coin', x: 2680, y: G - 76, w: 24, h: 24 },
      { id: 'c2b_goal', type: 'goal', x: 2940, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'c2b_bat1', type: 'bat', word: 'Bat', x: 1820, y: G - 150, patrolRange: 85, hp: 1 },
      { id: 'c2b_bat2', type: 'bat', word: 'Bat', x: 2040, y: G - 115, patrolRange: 85, hp: 1 },
      { id: 'c2b_bat3', type: 'bat', word: 'Bat', x: 2260, y: G - 165, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'mc2b_ice',
        triggerX: 40,
        checkpointX: 60,
        type: 'break_object',
        targetId: 'c2b_ice',
        text: 'Break the ice!',
        jp: 'チャージショットで氷（ICE）をこわそう！',
        timeLimit: 30,
        gateId: 'c2b_gate1',
      },
      {
        id: 'mc2b_laser',
        triggerX: 790,
        checkpointX: 810,
        type: 'shoot_switch',
        targetId: 'c2b_sw_l',
        text: 'Stop the laser!',
        jp: 'スイッチを撃ってレーザーを止めよう！',
        timeLimit: 25,
      },
      {
        id: 'mc2b_bats',
        triggerX: 1450,
        checkpointX: 1470,
        type: 'defeat_enemy_type',
        targetType: 'bat',
        targetCount: 3,
        text: 'Shoot 3 bats!',
        jp: 'コウモリを3びき撃とう！',
        timeLimit: 35,
        gateId: 'c2b_gate3',
      },
    ],
  },

  'candy-3': {
    id: 'candy-3',
    name: 'Candy 4: Candy King',
    world: 'candy',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'cc3_1', type: 'coin', x: 220, y: G - 54, w: 24, h: 24 },
      { id: 'cc3_2', type: 'coin', x: 330, y: G - 94, w: 24, h: 24 },
      { id: 'cc3_3', type: 'coin', x: 440, y: G - 54, w: 24, h: 24 },
      { id: 'cbox3_1', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'candy_king',
      name: 'Candy King',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 17,
    },
  },
};
