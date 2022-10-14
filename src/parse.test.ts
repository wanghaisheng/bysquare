import { describe, expect, test } from "vitest"

import { parse, detect } from "."
import { assemble, ParsedModel } from "./parse"

const qr = "0004A00090IFU27IV0J6HGGLIOTIBVHNQQJQ6LAVGNBT363HR13JC6C75G19O246KTT5G8LTLM67HOIATP4OOG8F8FDLJ6T26KFCB1690NEVPQVSG0"

const tabbedString = [
	"random-id",
	"\t", "1",
	"\t", "1",
	"\t", "100",
	"\t", "EUR",
	"\t",
	"\t", "123",
	"\t",
	"\t",
	"\t",
	"\t",
	"\t", "1",
	"\t", "SK9611000000002918599669",
	"\t",
	"\t", "0",
	"\t", "0",
	"\t",
	"\t",
	"\t",
].join("")

test("Parse model from qr-string", async () => {
	const parsed = await parse(qr)
	const expected: ParsedModel = {
		invoiceID: "random-id",
		payments: [
			{
				amount: 100,
				currencyCode: "EUR",
				variableSymbol: "123",
				bankAccounts: [
					{
						iban: "SK9611000000002918599669",
					}
				]
			}
		]
	}

	expect(parsed).toEqual(expected)
})

test("Create model from tabbed string", () => {
	const assembed = assemble(tabbedString)
	expect(assembed).toEqual({
		invoiceID: "random-id",
		payments: [
			{
				amount: 100,
				currencyCode: "EUR",
				variableSymbol: "123",
				bankAccounts: [{ iban: "SK9611000000002918599669" }]
			}
		]
	})
})

describe("QR detector", () => {
	test("Detect valid QR", () => {
		const isBysquare = detect(qr)
		expect(isBysquare).toBeTruthy()
	})

	test("Empty string, should be invalid", () => {
		const isBysquare = detect("")
		expect(isBysquare).toBeFalsy()
	})
})
