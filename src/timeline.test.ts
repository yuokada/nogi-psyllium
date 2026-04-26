import { describe, expect, it } from "vitest";
import { buildTimelineItems } from "./timeline";
import type { SingleRelease, Underlive } from "./types";

describe("buildTimelineItems", () => {
	it("シングル発売とアンダーライブを降順で混在表示できる", () => {
		const underlives: Underlive[] = [
			{
				id: "ul_39th_2025",
				title: "39thSGアンダーライブ",
				year: 2025,
				dates: ["2025-10-07", "2025-10-09", "2025-10-08"],
				venue: "横浜BUNTAI",
				member_ids: [],
				source_url: "https://example.com/underlive",
			},
			{
				id: "ul_38th_2025",
				title: "38thSGアンダーライブ",
				year: 2025,
				dates: ["2025-04-05"],
				venue: "ぴあアリーナMM",
				member_ids: [],
			},
		];
		const singles: SingleRelease[] = [
			{
				id: "single_39th",
				number: "39th",
				title: "Same numbers",
				release_date: "2025-07-30",
				source_url: "https://example.com/single",
				tracks: [
					{
						title: "Same numbers",
						editions: ["共通"],
					},
				],
			},
			{
				id: "single_38th",
				number: "38th",
				title: "ネーブルオレンジ",
				release_date: "2025-03-26",
			},
		];

		const items = buildTimelineItems(underlives, singles);

		expect(items.map((item) => item.id)).toEqual([
			"ul_39th_2025",
			"single_39th",
			"ul_38th_2025",
			"single_38th",
		]);
		expect(items[1]).toMatchObject({
			kind: "single_release",
			title: "39thシングル「Same numbers」",
			label: "シングル発売",
			dates: ["2025-07-30"],
			sortDate: "2025-07-30",
			sourceUrl: "https://example.com/single",
		});
		expect(items[0]).toMatchObject({
			kind: "underlive",
			dates: ["2025-10-09", "2025-10-08", "2025-10-07"],
		});
	});
});
