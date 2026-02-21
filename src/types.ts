export interface Member {
	id: string;
	name: string;
	gen?: string;
	color1_name: string;
	color2_name?: string;
	icon?: string;
	active?: boolean;
}

export interface AbsentMember {
	id: string;
	note?: string;
}

export type CenterScope = "all" | `day${number}`;

export interface Center {
	id: string;
	scope: CenterScope;
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
