import type { SingleRelease, TimelineItem, Underlive } from "./types";

function formatTimelineDate(date: string): string {
	return date.replaceAll("-", ".");
}

function formatTimelineDateRange(dates: string[]): string {
	const start = dates[0];
	const end = dates[dates.length - 1];
	if (!start || !end) return "";
	if (start === end) return formatTimelineDate(start);
	return `${formatTimelineDate(start)}-${formatTimelineDate(end)}`;
}

function buildUnderliveItems(underlives: Underlive[]): TimelineItem[] {
	return underlives.map((underlive) => {
		const dates = [...underlive.dates].sort((a, b) => a.localeCompare(b));
		const sortDate = dates[dates.length - 1] ?? "";
		return {
			id: underlive.id,
			kind: "underlive" as const,
			dates,
			displayDate: formatTimelineDateRange(dates),
			sortDate,
			title: underlive.title,
			label: "アンダーライブ",
			venue: underlive.venue,
			sourceUrl: underlive.source_url,
			underliveId: underlive.id,
		};
	});
}

function buildSingleReleaseItems(singles: SingleRelease[]): TimelineItem[] {
	return singles.map((single) => ({
		id: single.id,
		kind: "single_release",
		dates: [single.release_date],
		displayDate: formatTimelineDate(single.release_date),
		sortDate: single.release_date,
		title: `${single.number}シングル「${single.title}」`,
		label: "シングル発売",
		sourceUrl: single.source_url,
	}));
}

export function buildTimelineItems(
	underlives: Underlive[],
	singles: SingleRelease[],
): TimelineItem[] {
	return [
		...buildSingleReleaseItems(singles),
		...buildUnderliveItems(underlives),
	].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}
