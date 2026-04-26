import type { TimelineItem, Underlive } from "./types";

export function buildTimelineItems(underlives: Underlive[]): TimelineItem[] {
	return underlives
		.map((underlive) => {
			const dates = [...underlive.dates].sort((a, b) => b.localeCompare(a));
			return {
				id: underlive.id,
				kind: "underlive" as const,
				dates,
				sortDate: dates[0] ?? "",
				title: underlive.title,
				label: "アンダーライブ",
				venue: underlive.venue,
				sourceUrl: underlive.source_url,
				underliveId: underlive.id,
			};
		})
		.sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}
