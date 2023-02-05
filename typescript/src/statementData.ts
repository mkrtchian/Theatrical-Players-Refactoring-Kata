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
      amount: amountFor({ ...aPerformance, play }),
      volumeCredits: volumeCreditsFor({ ...aPerformance, play }),
    };
    return result;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: Performance & { play: Play }) {
    let thisAmount = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (aPerformance.audience > 30) {
          thisAmount += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (aPerformance.audience > 20) {
          thisAmount += 10000 + 500 * (aPerformance.audience - 20);
        }
        thisAmount += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return thisAmount;
  }

  function volumeCreditsFor(aPerformance: Performance & { play: Play }) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
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
}
