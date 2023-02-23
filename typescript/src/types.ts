export type Play = {
  name: string;
  type: string;
};

export type Plays = {
  [key: string]: Play;
};

export type Performance = {
  playID: string;
  audience: number;
};

export type Invoice = {
  customer: string;
  performances: Performance[];
};

export type EnrichPerformance = Performance & {
  play: Play;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
  customer: string;
  performances: EnrichPerformance[];
  totalVolumeCredit: number;
  totalAmount: number;
};
