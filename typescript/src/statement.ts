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
};

type StatementData = {
  customer: string;
  performances: EnrichPerformance[];
};

function renderPlainText(plays: Plays, statementData: StatementData) {
  let result = `Statement for ${statementData.customer}\n`;

  for (let perf of statementData.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(getTotalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredit()} credits\n`;
  return result;

  function amountFor(aPerformance: Performance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditFor(aPerformance: Performance) {
    let result = Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totalVolumeCredit() {
    let result = 0;
    for (let perf of statementData.performances) {
      result += volumeCreditFor(perf);
    }
    return result;
  }

  function getTotalAmount() {
    let result = 0;
    for (let perf of statementData.performances) {
      result += amountFor(perf);
    }
    return result;
  }
}

function statement(invoice: Invoice, plays: Plays) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };

  return renderPlainText(plays, statementData);

  function enrichPerformance(aPerformance: Performance) {
    const performanceCopy = { ...aPerformance, play: playFor(aPerformance) };

    return performanceCopy;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }
}

export { statement };
