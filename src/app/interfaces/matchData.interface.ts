export interface MatchData { 
    time: number; 
    gameMode: string
    dataLoaded: boolean 
    gameLength: number;
    timeAgo: string | null;
    expanded: boolean;
    participants: ParticipantData[]
    profile: ParticipantData
}

export interface ParticipantData {
    gameName: string;
    profilePlayer: boolean;
    win: boolean; 
    champion: string; 
    kills: number;
    deaths: number;
    assists: number;
    items: number[];
    lane: string | null;
    sumSpell1: string | null;
    sumSpell2: string | null;
    rune1: string | null;
    rune2: string | null;
    CSscore: number;
    csPerMin: number;
}