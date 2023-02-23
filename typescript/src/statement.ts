import { createStatementData } from "./statementData";
import { Invoice, Plays, StatementData } from "./types";

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
  return renderPlainText(createStatementData(invoice, plays));
}

export { statement };
