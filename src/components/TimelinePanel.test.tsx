import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TimelineItem } from "../types";
import { TimelinePanel } from "./TimelinePanel";

describe("TimelinePanel", () => {
	it("sourceUrl がある項目だけ出典リンクを表示する", () => {
		const items: TimelineItem[] = [
			{
				id: "single_39th",
				kind: "single_release",
				dates: ["2025-07-30"],
				displayDate: "2025.07.30",
				sortDate: "2025-07-30",
				title: "39thシングル「Same numbers」",
				label: "シングル発売",
				sourceUrl: "https://example.com/single",
			},
			{
				id: "ul_41st_2026",
				kind: "underlive",
				dates: ["2026-03-17", "2026-03-18", "2026-03-19"],
				displayDate: "2026.03.17-2026.03.19",
				sortDate: "2026-03-19",
				title: "41stSGアンダーライブ",
				label: "アンダーライブ",
			},
		];

		render(<TimelinePanel items={items} />);

		expect(screen.getByText("39thシングル「Same numbers」")).not.toBeNull();
		expect(screen.getByText("2025.07.30")).not.toBeNull();
		expect(screen.getByText("2026.03.17-2026.03.19")).not.toBeNull();
		expect(screen.getByText("2026.03.17")).not.toBeNull();
		expect(screen.getByText("2026.03.18")).not.toBeNull();
		expect(screen.getByText("2026.03.19")).not.toBeNull();
		expect(screen.getAllByRole("link", { name: "出典" })).toHaveLength(1);
	});
});
