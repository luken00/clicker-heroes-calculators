import { rarities } from '../constants';

import { roundNum } from '../utils';

export const getActiveTab = state => state.appState.activeTab;

export const getPlayStyle = state => state.appState.playStyle;

export const getEncodedState = state => state.encodedState;

export const getAncients = state => state.ancients.ancients;

export const isEditing = state => state.ancients.editing;

export const getHeroCosts = state => state.heroes.costs;

export const isGameStateSet = state => Boolean(state.gameState);

export const getDogcogLevel = state => state.heroes.dogcogLevel;

export const isRelicBonusChecked = state => state.heroes.relicsBonusChecked;

export const parseGameState = gameState => {
    const SPLITTER = 'Fe12NAfA3R6z4k0z';
    let temp = '';

    if (gameState.indexOf(SPLITTER) > 0) {
        gameState = gameState.split(SPLITTER)[0];

        for (let i = 0; i < gameState.length; i += 2) {
            temp += gameState[i];
        }

        return JSON.parse(atob(temp));
    }

    return null;
}

const relicBonusCallbacks = {
    3: levels => 0,
    4: levels => 0,
    5: levels => 0,
    8: levels => levels * 5,
    9: levels => levels * 50,
    11: (relicLevels, totalLevels) => {
        return 99 * (1 - Math.exp(-0.01 * totalLevels)) - 99 * (1 - Math.exp(-0.01 * (totalLevels - relicLevels)))
    },
    12: (relicLevels, totalLevels) => {
        return 100 * (1 - Math.exp(-0.0025 * totalLevels)) - 100 * (1 - Math.exp(-0.0025 * (totalLevels - relicLevels)))
    },
    13: (relicLevels, totalLevels) => {
        return 75 * (1 - Math.exp(-0.013 * totalLevels)) - 75 * (1 - Math.exp(-0.013 * (totalLevels - relicLevels)));
    },
    14: levels => 0,
    15: levels => 0,
    16: levels => 0,
    17: (relicLevels, totalLevels) => {
        return 30 * (1 - Math.exp(-0.034 * totalLevels)) - 30 * (1 - Math.exp(-0.034 * (totalLevels - relicLevels)));
    },
    18: (relicLevels, totalLevels) => {
        return 50 * (1 - Math.exp(-0.02 * totalLevels)) - 50 * (1 - Math.exp(-0.02 * (totalLevels - relicLevels)))
    },
    19: levels => 0,
    20: (relicLevels, totalLevels) => {
        return 75 * (1 - Math.exp(-0.026 * totalLevels)) - 75 * (1 - Math.exp(-0.026 * (totalLevels - relicLevels)))
    },
    21: (relicLevels, totalLevels) => {
        return 8 * (1 - Math.exp(-0.01 * totalLevels)) - 8 * (1 - Math.exp(-0.01 * (totalLevels - relicLevels)))
    },
    22: levels => levels * 2,
    23: levels => levels * 2,
    24: levels => levels * 2,
    25: levels => levels * 2,
    26: levels => levels * 2,
    27: levels => levels * 2,
    28: levels => levels * 2,
    29: levels => 0,
    31: (relicLevels, totalLevels) => {
        return 100 * (1 - Math.exp(-0.01 * totalLevels)) - 100 * (1 - Math.exp(-0.01 * (totalLevels - relicLevels)));
    },
    32: levels => 0,
};

export const getRelics = state => {
    if (!state.gameState) {
        return [];
    }

    const items = state.gameState.items.items;
    const style = state.appState.playStyle;
    const { ancients, byRelicBonusId } = state.ancients;

    const relics = Object.keys(items).map(k => {
        const item = items[k];
        let total = 0;

        let bonuses = [];
        let ancient = ancients[byRelicBonusId[item.bonusType1]];

        bonuses.push({
            id: ancient.id,
            ancient: ancient.label,
            ancientFullName: ancient.fullName,
            level: +item.bonus1Level,
        });
        total += item.bonus1Level * ancient.coefficients[style];

        if (item.bonusType2) {
            ancient = ancients[byRelicBonusId[item.bonusType2]];

            bonuses.push({
                id: ancient.id,
                ancient: ancient.label,
                ancientFullName: ancient.fullName,
                level: +item.bonus2Level,
            });
            total += item.bonus2Level * ancient.coefficients[style];
        }

        if (item.bonusType3) {
            ancient = ancients[byRelicBonusId[item.bonusType3]];

            bonuses.push({
                id: ancient.id,
                ancient: ancient.label,
                ancientFullName: ancient.fullName,
                level: +item.bonus3Level,
            });
            total += item.bonus3Level * ancient.coefficients[style];
        }

        if (item.bonusType4) {
            ancient = ancients[byRelicBonusId[item.bonusType4]];

            bonuses.push({
                id: ancient.id,
                ancient: ancient.label,
                ancientFullName: ancient.fullName,
                level: +item.bonus4Level,
            });
            total += item.bonus4Level * ancient.coefficients[style];
        }

        return {
            name: item.name,
            rarity: rarities[item.rarity],
            level: item.level,
            type: item.type,
            bonuses,
            total
        };
    }).sort((a, b) => b.total - a.total);

    const aggBonuses = aggregateBonuses(relics.slice(0, 4));

    relics.forEach(r => {
        r.bonuses.forEach(b => {
            const ancient = ancients[b.id];
            const totalLevels = ancient.baseLevel + (aggBonuses[ancient.id] ? aggBonuses[ancient.id].level : 0);

            b.tooltip = ancient.relicText.replace('{}', roundNum(relicBonusCallbacks[b.id](b.level, totalLevels)))
        });
    });

    return relics;
};

const aggregateBonuses = relics => {
    return [].concat.apply([], relics.map(r => r.bonuses))
        .reduce((agg, b) => {
            if (!agg[b.id]) {
                agg[b.id] = { ...b };
            } else {
                agg[b.id].level += b.level;
            }

            return agg;
        }, {});
}

export const getRelicsBonuses = state => Object.values(aggregateBonuses(getRelics(state).slice(0, 4)));

export const getDogcogRelicLevels = state => getRelicsBonuses(state).find(b => b.id === 11).level || 0;
