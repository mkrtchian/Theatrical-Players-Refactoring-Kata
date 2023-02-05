import {
  EnrichedPerformance,
  Invoice,
  Performance,
  Play,
  Plays,
} from "./types";

export function createStatementData(invoice: Invoice, plays: Plays) {
  const enrichedPerformances = invoice.performances.map(enrichPerformance);
  const statementData = {
    customer: invoice.customer,
    performances: enrichedPerformances,
    totalAmount: totalAmount(enrichedPerformances),
    totalVolumeCredits: totalVolumeCredits(enrichedPerformances),
  };
  return statementData;

  function enrichPerformance(aPerformance: Performance) {
    const play = playFor(aPerformance);
    const calculator = createPerformanceCalculator(aPerformance, play);
    const result = {
      ...aPerformance,
      play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    };
    return result;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function createPerformanceCalculator(aPerformance: Performance, play: Play) {
    switch (play.type) {
      case "tragedy":
        return new TragedyCalculator(aPerformance, play);
      case "comedy":
        return new ComedyCalculator(aPerformance, play);
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
  }

  function totalAmount(performances: EnrichedPerformance[]) {
    return performances.reduce((total, perf) => total + perf.amount, 0);
  }

  function totalVolumeCredits(performances: EnrichedPerformance[]) {
    return performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}

class PerformanceCalculator {
  constructor(
    protected readonly aPerformance: Performance,
    protected readonly play: Play
  ) {}

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.aPerformance.audience - 30, 0);
    if ("comedy" === this.play.type)
      result += Math.floor(this.aPerformance.audience / 5);
    return result;
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let thisAmount = 40000;
    if (this.aPerformance.audience > 30) {
      thisAmount += 1000 * (this.aPerformance.audience - 30);
    }
    return thisAmount;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let thisAmount = 30000;
    if (this.aPerformance.audience > 20) {
      thisAmount += 10000 + 500 * (this.aPerformance.audience - 20);
    }
    thisAmount += 300 * this.aPerformance.audience;
    return thisAmount;
  }
}
