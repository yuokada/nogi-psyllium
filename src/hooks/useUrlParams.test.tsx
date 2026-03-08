import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useUrlParams } from "./useUrlParams";

function createWrapper(initialEntry: string) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
		);
	};
}

describe("useUrlParams", () => {
	it("URL クエリから状態を正しく読み取る", () => {
		const { result } = renderHook(() => useUrlParams(), {
			wrapper: createWrapper(
				"/?q=%E5%92%8C&gen=3%E6%9C%9F%E7%94%9F&graduated=1&id=ul_41st_2026&absent=1&companion=1",
			),
		});

		expect(result.current.search).toBe("和");
		expect(result.current.genFilter).toBe("3期生");
		expect(result.current.showAll).toBe(true);
		expect(result.current.selectedUnderliveId).toBe("ul_41st_2026");
		expect(result.current.showAbsent).toBe(true);
		expect(result.current.hasCompanionParam).toBe(true);
		expect(result.current.companionInQuery).toBe(true);
	});

	it("optional/flag パラメータの更新と削除ができる", async () => {
		const { result } = renderHook(() => useUrlParams(), {
			wrapper: createWrapper("/"),
		});

		act(() => {
			result.current.setSearch("冨里");
		});
		await waitFor(() => {
			expect(result.current.search).toBe("冨里");
		});

		act(() => {
			result.current.setGenFilter("5期生");
		});
		await waitFor(() => {
			expect(result.current.genFilter).toBe("5期生");
		});

		act(() => {
			result.current.setShowAll(true);
		});
		await waitFor(() => {
			expect(result.current.showAll).toBe(true);
		});

		act(() => {
			result.current.setSelectedUnderliveId("ul_test");
		});
		await waitFor(() => {
			expect(result.current.selectedUnderliveId).toBe("ul_test");
		});

		act(() => {
			result.current.setShowAbsent(true);
		});
		await waitFor(() => {
			expect(result.current.showAbsent).toBe(true);
		});

		act(() => {
			result.current.setSearch("");
		});
		await waitFor(() => {
			expect(result.current.search).toBe("");
		});

		act(() => {
			result.current.setGenFilter("");
		});
		await waitFor(() => {
			expect(result.current.genFilter).toBe("");
		});

		act(() => {
			result.current.setShowAll(false);
		});
		await waitFor(() => {
			expect(result.current.showAll).toBe(false);
		});

		act(() => {
			result.current.setSelectedUnderliveId("");
		});
		await waitFor(() => {
			expect(result.current.selectedUnderliveId).toBe("");
		});

		act(() => {
			result.current.setShowAbsent(false);
		});
		await waitFor(() => {
			expect(result.current.showAbsent).toBe(false);
		});
	});

	it("companion は true/false を 1/0 として保持できる", async () => {
		const { result } = renderHook(() => useUrlParams(), {
			wrapper: createWrapper("/"),
		});

		act(() => {
			result.current.setCompanionInQuery(false);
		});

		await waitFor(() => {
			expect(result.current.hasCompanionParam).toBe(true);
			expect(result.current.companionInQuery).toBe(false);
		});

		act(() => {
			result.current.setCompanionInQuery(true);
		});

		await waitFor(() => {
			expect(result.current.hasCompanionParam).toBe(true);
			expect(result.current.companionInQuery).toBe(true);
		});
	});
});
