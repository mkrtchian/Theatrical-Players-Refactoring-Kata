import { EnrichPerformance, Invoice, Performance, Play, Plays } from "./types";

export function createStatementData(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);
  const statementData = {
    customer: invoice.customer,
    performances,
    totalVolumeCredit: totalVolumeCredit(performances),
    totalAmount: getTotalAmount(performances),
  };

  return statementData;

  function enrichPerformance(aPerformance: Performance) {
    const performanceWithPlay = {
      ...aPerformance,
      play: playFor(aPerformance),
    };
    const enrichedPerformance = {
      ...performanceWithPlay,
      amount: amountFor(performanceWithPlay),
      volumeCredits: volumeCreditFor(performanceWithPlay),
    };

    return enrichedPerformance;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: Performance & { play: Play }) {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result;
  }

  function totalVolumeCredit(performances: EnrichPerformance[]) {
    return performances.reduce(
      (result, performance) => result + performance.volumeCredits,
      0
    );
  }

  function volumeCreditFor(aPerformance: Performance & { play: Play }) {
    let result = Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function getTotalAmount(performances: EnrichPerformance[]) {
    return performances.reduce(
      (result, performance) => result + performance.amount,
      0
    );
  }
}
