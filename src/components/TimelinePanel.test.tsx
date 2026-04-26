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
				sortDate: "2025-07-30",
				title: "39thシングル「Same numbers」",
				label: "シングル発売",
				sourceUrl: "https://example.com/single",
			},
			{
				id: "single_38th",
				kind: "single_release",
				dates: ["2025-03-26"],
				sortDate: "2025-03-26",
				title: "38thシングル「ネーブルオレンジ」",
				label: "シングル発売",
			},
		];

		render(<TimelinePanel items={items} />);

		expect(screen.getByText("39thシングル「Same numbers」")).not.toBeNull();
		expect(screen.getAllByRole("link", { name: "出典" })).toHaveLength(1);
	});
});
