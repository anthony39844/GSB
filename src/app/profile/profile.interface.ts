export interface MatchData { 
    matchId: string; 
    win: boolean; 
    champion: string; 
    time: number; 
    gameMode: string
    dataLoaded: boolean 
    kills: number;
    deaths: number;
    assists: number;
    items: number[];
    lane: string;
    sumSpell1: string | null;
    sumSpell2: string | null;
    rune1: string | null;
    rune2: string | null;
    CSscore: number | null;
    gameLength: number | null;
}
