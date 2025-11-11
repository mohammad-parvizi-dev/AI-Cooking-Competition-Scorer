
export interface AI {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ScoringCriterion {
  criterion: string;
  points: number;
}

export interface Challenge {
  id: string;
  name: string; // Full name: "Group - Level"
  groupName: string;
  level: string;
  details: {
    levelDescription: string;
    prompt: string;
    expectation: string;
  };
  scoringCriteria: ScoringCriterion[];
  objective: string;
}


export interface Score {
  aiId: string;
  challengeId: string;
  score: number;
  notes: string;
}

export enum View {
  SETUP = 'SETUP',
  COMPETITION = 'COMPETITION',
  RESULTS = 'RESULTS',
}