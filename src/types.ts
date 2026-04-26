export interface Member {
	id: string;
	name: string;
	gen?: string;
	color1_name: string;
	color2_name?: string;
	icon?: string;
	active?: boolean;
	call?: string;
	profile_url?: string;
}

export interface AbsentMember {
	id: string;
	note?: string;
}

export interface Center {
	id: string;
	label?: string;
}

export interface Underlive {
	id: string;
	title: string;
	year: number;
	dates: string[];
	venue?: string;
	source_url?: string;
	member_ids: string[];
	absent?: AbsentMember[];
	centers?: Center[];
}

export interface SingleRelease {
	id: string;
	number: string;
	title: string;
	release_date: string;
	source_url?: string;
	tracks?: SingleTrack[];
}

export interface SingleTrack {
	title: string;
	editions: string[];
}

export type TimelineItemKind = "underlive" | "single_release";

export interface TimelineItem {
	id: string;
	kind: TimelineItemKind;
	dates: string[];
	displayDate: string;
	sortDate: string;
	title: string;
	label: string;
	venue?: string;
	sourceUrl?: string;
	underliveId?: string;
}
