import { describe, expect, it } from "vitest";
import { isSingleRelease } from "./singles";

describe("isSingleRelease", () => {
	it("tracks なしの既存形式を許容する", () => {
		expect(
			isSingleRelease({
				id: "single_39th",
				number: "39th",
				title: "Same numbers",
				release_date: "2025-07-30",
			}),
		).toBe(true);
	});

	it("tracks が正しい形式なら許容する", () => {
		expect(
			isSingleRelease({
				id: "single_41st",
				number: "41st",
				title: "最後に階段を駆け上がったのはいつだ？",
				release_date: "2026-04-08",
				tracks: [
					{
						title: "最後に階段を駆け上がったのはいつだ？",
						editions: ["共通"],
					},
					{
						title: "桜橋を教えてくれた",
						editions: ["TYPE-A"],
					},
				],
			}),
		).toBe(true);
	});

	it("editions が文字列配列でない tracks は拒否する", () => {
		expect(
			isSingleRelease({
				id: "single_41st",
				number: "41st",
				title: "最後に階段を駆け上がったのはいつだ？",
				release_date: "2026-04-08",
				tracks: [
					{
						title: "桜橋を教えてくれた",
						editions: ["TYPE-A", 1],
					},
				],
			}),
		).toBe(false);
	});
});
