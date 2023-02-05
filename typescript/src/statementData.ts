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
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
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

  function totalAmount(performances: EnrichedPerformance[]) {
    return performances.reduce((total, perf) => total + perf.amount, 0);
  }

  function totalVolumeCredits(performances: EnrichedPerformance[]) {
    return performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}

class PerformanceCalculator {
  constructor(
    private readonly aPerformance: Performance,
    private readonly play: Play
  ) {}

  get amount() {
    let thisAmount = 0;
    switch (this.play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (this.aPerformance.audience > 30) {
          thisAmount += 1000 * (this.aPerformance.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (this.aPerformance.audience > 20) {
          thisAmount += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        thisAmount += 300 * this.aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return thisAmount;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.aPerformance.audience - 30, 0);
    if ("comedy" === this.play.type)
      result += Math.floor(this.aPerformance.audience / 5);
    return result;
  }
}
