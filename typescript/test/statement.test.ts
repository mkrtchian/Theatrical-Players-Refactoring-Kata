import fs from "fs";
import { plainTextStatement } from "../src/statement";

test("example statement", () => {
  const invoice = JSON.parse(fs.readFileSync("test/invoice.json", "utf8"));
  const plays = JSON.parse(fs.readFileSync("test/plays.json", "utf8"));
  expect(plainTextStatement(invoice, plays)).toMatchSnapshot();
});

test("statement with new play types", () => {
  const invoice = JSON.parse(
    fs.readFileSync("test/invoice_new_plays.json", "utf8")
  );
  const plays = JSON.parse(fs.readFileSync("test/new_plays.json", "utf8"));
  expect(() => {
    plainTextStatement(invoice, plays);
  }).toThrow(/unknown type/);
});
