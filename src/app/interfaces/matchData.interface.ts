export interface MatchData { 
    time: number; 
    gameMode: string
    dataLoaded: boolean 
    gameLength: number;
    timeAgo: string | null;
    expanded: boolean;
    profile: ParticipantData
    teams: TeamData[],
}

export interface ParticipantData {
    puuid: string;
    gameName: string;
    tagLine: string,
    profilePlayer: boolean;
    win: boolean; 
    champion: string; 
    kills: number;
    deaths: number;
    assists: number;
    kda: number;
    items: number[];
    lane: string | null;
    sumSpell1: string | null;
    sumSpell2: string | null;
    rune1: number;
    rune2: number;
    CSscore: number;
    csPerMin: number;  
    Kp: number;
    damageDealt: number;
    magicDamage: number;
    physicalDamage: number;
    trueDamage: number;
    damageOrder: [string, number][];
    level: number;
    gold: number,
    wardsPlaced: number,
    wardsCleared: number,
    RedWardsPlace: number,
}

export const defaultParticipantData: ParticipantData = {
    puuid: '',
    gameName: '',
    tagLine: '',
    profilePlayer: false,
    win: false,
    champion: '',
    kills: 0,
    deaths: 0,
    assists: 0,
    kda: 0,
    items: [],
    lane: null,
    sumSpell1: null,
    sumSpell2: null,
    rune1: 0,
    rune2: 0,
    CSscore: 0,
    csPerMin: 0,
    Kp: 0,
    damageDealt: 0,
    magicDamage: 0,
    physicalDamage: 0,
    trueDamage: 0,
    damageOrder: [],
    level: 0,
    gold: 0,
    wardsPlaced: 0,
    wardsCleared: 0,
    RedWardsPlace: 0,
  };

export interface TeamData {
    totalKills: number,
    totalDeaths: number,
    totalAssists: number,
    members: ParticipantData[],
    win: boolean,
    totalGold: number
    objectives: {[key: string]: {first: boolean, kills: number}}
}