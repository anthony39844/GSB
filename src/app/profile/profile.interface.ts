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

}
