import { Injectable } from '@angular/core';
import {
  MatchData,
  ParticipantData,
} from '../../interfaces/matchData.interface';
import { ApiService } from '../api/api.service';
import { RunesService } from '../icon/runes.service';
import { SumSpellsService } from '../icon/sum-spells.service';

@Injectable({
  providedIn: 'root',
})
export class MatchInfoService {
  ids: string[] = [];
  puuid: string | null= "";
  matchData: {[key: string]: MatchData} = {}; 
  queueIDMap: {[key: number]: string} = {
    400: "NORMAL DRAFT",
    420: "RANKED SOLO",
    430: "QUICK PLAY",
    440: "RANKED FLEX",
    450: "ARAM",
    490: "QUICK PLAY"
  }

  constructor(
    private apiService: ApiService,
    private runesService: RunesService,
    private sumsService: SumSpellsService
  ) {}

  setIds(ids: string[]) {
    for (let key in this.matchData) {
      delete this.matchData[key];
    }
    this.ids = ids;
    this.setData();
  }

  setPuuid(puuid: string) {
    this.puuid = puuid;
  }

  private setData() {
    for (let matchId in this.ids) {
      this.matchData[this.ids[matchId]] = {
        dataLoaded: false,
        time: 0,
        gameMode: '',
        gameLength: 1,
        timeAgo: null,
        expanded: false,
        teams: [
          {
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            members: [],
            win: false,
            totalGold: 0,
            objectives: {},
          },
          {
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            members: [],
            win: false,
            totalGold: 0,
            objectives: {},
          },
        ],
        profile: {
          puuid: '',
          profilePlayer: false,
          gameName: '',
          win: true,
          champion: '',
          kills: 0,
          deaths: 0,
          assists: 0,
          kda: 0,
          items: [],
          lane: '',
          sumSpell1: null,
          sumSpell2: null,
          rune1: null,
          rune2: null,
          CSscore: 0,
          csPerMin: 0,
          Kp: 0,
          damageDealt: 0,
          magicDamage: 0,
          physicalDamage: 0,
          trueDamage: 0,
          damageOrder: [],
          level: 0,
          wardsPlaced: 0,
          wardsCleared: 0,
          RedWardsPlace: 0,
          gold: 0,
          tagLine: '',
        },
      };
    }
    for (const matchId in this.matchData) {
      let match = this.matchData[matchId];
      this.apiService.getMatchData(matchId).subscribe((matchData) => {
        if (matchData.status) {
          if (matchData.status.status_code === 429) {
            console.log('RATE2');
          }
        } else if (matchData) {
          const matchInfo = matchData['info'];
          const participants = matchInfo['participants'];
          const gameStart = matchInfo['gameCreation'];
          const currTime = Date.now();
          const hoursAgo = Math.floor((currTime - gameStart) / 3600000);
          match.timeAgo = this.getTimeFromHours(hoursAgo);
          match.time = gameStart;
          match.gameMode = this.queueIDMap[matchInfo['queueId']];
          match.expanded = false;
          const team1 = matchInfo.teams[0].teamId;
          const team2 = matchInfo.teams[1].teamId;
          match.teams[0].win = matchInfo.teams[0].win;
          match.teams[1].win = matchInfo.teams[1].win;

          match.teams[0].objectives['baron'] =
            matchInfo.teams[0].objectives['baron'];
          match.teams[0].objectives['dragon'] =
            matchInfo.teams[0].objectives['dragon'];
          match.teams[0].objectives['tower'] =
            matchInfo.teams[0].objectives['tower'];
          match.teams[1].objectives['baron'] =
            matchInfo.teams[1].objectives['baron'];
          match.teams[1].objectives['dragon'] =
            matchInfo.teams[1].objectives['dragon'];
          match.teams[1].objectives['tower'] =
            matchInfo.teams[1].objectives['tower'];

          for (const participant of participants) {
            match.gameLength = Math.floor(participant['timePlayed'] / 60);

            let rune1 =
              participant['perks']['styles'][0]['selections'][0]['perk'];
            let rune2 = participant['perks']['styles'][1]['style'];

            const cs =
              participant['totalMinionsKilled'] +
              participant['neutralMinionsKilled'];
            const damages: [string, number][] = [
              ['magic', participant.magicDamageDealtToChampions],
              ['physical', participant.physicalDamageDealtToChampions],
              ['true', participant.trueDamageDealtToChampions],
            ];
            const damageOrder: [string, number][] = damages.sort(
              ([, valueA], [, valueB]) => valueB - valueA
            );
            const kda = parseFloat(
              (
                (participant.kills + participant.assists) /
                Math.max(participant.deaths, 1)
              ).toFixed(1)
            );
            const currentParticipant: ParticipantData = {
              puuid: participant.puuid,
              tagLine: participant.riotIdTagline,
              gameName: participant.riotIdGameName,
              profilePlayer: participant.puuid === this.puuid,
              win: participant.win,
              champion: participant.championName,
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              kda: kda,
              lane:
                match.gameMode !== 'ARAM'
                  ? participant.individualPosition === 'UTILITY'
                    ? 'SUPPORT'
                    : participant.individualPosition
                  : '',
              rune1: this.runesService.getRunes(rune1),
              rune2: this.runesService.getRunes(rune2),
              items: Array.from(
                { length: 7 },
                (_, i) => participant[`item${i}`]
              ),
              sumSpell1: this.sumsService.getSums(participant['summoner1Id']),
              sumSpell2: this.sumsService.getSums(participant['summoner2Id']),
              CSscore: cs,
              csPerMin: Math.floor((cs / match.gameLength) * 10) / 10,
              Kp: 0,
              damageDealt: participant.totalDamageDealtToChampions,
              magicDamage: participant.magicDamageDealtToChampions,
              physicalDamage: participant.physicalDamageDealtToChampions,
              trueDamage: participant.trueDamageDealtToChampions,
              damageOrder: damageOrder,
              level: participant.champLevel,
              wardsPlaced:
                participant.wardsPlaced - participant.detectorWardsPlaced,
              wardsCleared: participant.wardsKilled,
              RedWardsPlace: participant.detectorWardsPlaced,
              gold: participant.goldEarned,
            };
            if (participant.puuid === this.puuid) {
              match.profile = currentParticipant;
            }
            if (participant.teamId == team1) {
              let curTeam = match.teams[0];
              curTeam.members.push(currentParticipant);
              curTeam.totalAssists += currentParticipant.assists;
              curTeam.totalDeaths += currentParticipant.deaths;
              curTeam.totalKills += currentParticipant.kills;
              curTeam.totalGold += currentParticipant.gold;
            } else if (participant.teamId == team2) {
              let curTeam = match.teams[1];
              curTeam.members.push(currentParticipant);
              curTeam.totalAssists += currentParticipant.assists;
              curTeam.totalDeaths += currentParticipant.deaths;
              curTeam.totalKills += currentParticipant.kills;
              curTeam.totalGold += currentParticipant.gold;
            }

            match.dataLoaded = true;
            for (let team of match.teams) {
              for (let player of team.members) {
                player.Kp = parseFloat(
                  (
                    ((player.kills + player.assists) * 100) /
                    Math.max(team.totalKills, 1)
                  ).toFixed(1)
                );
              }
            }
          }
        }
      });
      this.matchData = Object.fromEntries(
        Object.entries(this.matchData).sort(
          ([, valueA], [, valueB]) => valueB.time - valueA.time
        )
      );
    }
  }

  getTimeFromHours(hours: number): string {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60);
      return `${minutes}m ago`;
    }
    const days = Math.floor(hours / 24);
    if (days === 0) {
      return `${hours}h ago`;
    }
    return `${days}d ago`;
  }

  getMatchData() {
    return this.matchData;
  }
}
