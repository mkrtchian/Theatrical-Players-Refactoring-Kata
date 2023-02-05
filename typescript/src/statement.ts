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
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}

export function htmlStatement(invoice: Invoice, plays: Plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(statementData: StatementData) {
  let result = `<h1>Statement for ${statementData.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of statementData.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount / 100)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(
    statementData.totalAmount / 100
  )}</em></p>\n`;
  result += `<p>You earned <em>${statementData.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

export { statement };
