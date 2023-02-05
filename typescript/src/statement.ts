import { createStatementData } from "./statementData";
import { Invoice, Plays, StatementData } from "./types";

function statement(invoice: Invoice, plays: Plays) {
  return renderPlaintext(createStatementData(invoice, plays));
}

function renderPlaintext(statementData: StatementData) {
  let result = `Statement for ${statementData.customer}\n`;

  for (let perf of statementData.performances) {
    // print line for this order
    result += ` ${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(statementData.totalAmount / 100)}\n`;
  result += `You earned ${statementData.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }
}

export { statement };
