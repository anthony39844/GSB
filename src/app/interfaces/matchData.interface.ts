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
    rune1: string | null;
    rune2: string | null;
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

export interface TeamData {
    totalKills: number,
    totalDeaths: number,
    totalAssists: number,
    members: ParticipantData[],
    win: boolean,
    totalGold: number
    objectives: {[key: string]: {first: boolean, kills: number}}
}