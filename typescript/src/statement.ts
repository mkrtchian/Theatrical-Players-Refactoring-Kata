type Play = {
  name: string;
  type: string;
};

type Plays = {
  [key: string]: Play;
};

type Performance = {
  playID: string;
  audience: number;
};

type Invoice = {
  customer: string;
  performances: Performance[];
};

type EnrichPerformance = Performance & {
  play: Play;
  amount: number;
  volumeCredits: number;
};

type StatementData = {
  customer: string;
  performances: EnrichPerformance[];
  totalVolumeCredit: number;
  totalAmount: number;
};

function renderPlainText(statementData: StatementData) {
  let result = `Statement for ${statementData.customer}\n`;

  for (let perf of statementData.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(statementData.totalAmount / 100)}\n`;
  result += `You earned ${statementData.totalVolumeCredit} credits\n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }
}

function statement(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);
  const statementData = {
    customer: invoice.customer,
    performances,
    totalVolumeCredit: totalVolumeCredit(performances),
    totalAmount: getTotalAmount(performances),
  };

  return renderPlainText(statementData);

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
    let result = 0;
    for (let perf of performances) {
      result += perf.volumeCredits;
    }
    return result;
  }

  function volumeCreditFor(aPerformance: Performance & { play: Play }) {
    let result = Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function getTotalAmount(performances: EnrichPerformance[]) {
    let result = 0;
    for (let perf of performances) {
      result += perf.amount;
    }
    return result;
  }
}

export { statement };
