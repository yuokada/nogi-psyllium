import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./components/ThemeToggle";
import {
	getNextTheme,
	initializeTheme,
	resolveInitialTheme,
	THEME_STORAGE_KEY,
} from "./theme";

afterEach(() => {
	cleanup();
	window.localStorage.clear();
	document.documentElement.removeAttribute("data-theme");
	document.documentElement.style.removeProperty("color-scheme");
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	window.history.replaceState(null, "", "/");
});

describe("theme", () => {
	it("保存済みテーマを OS 設定より優先する", () => {
		expect(resolveInitialTheme("light", true)).toBe("light");
		expect(resolveInitialTheme("dark", false)).toBe("dark");
	});

	it("有効な保存値がなければ OS 設定、最後にライトへフォールバックする", () => {
		expect(resolveInitialTheme(null, true)).toBe("dark");
		expect(resolveInitialTheme("invalid", false)).toBe("light");
	});

	it("次のテーマを返す", () => {
		expect(getNextTheme("light")).toBe("dark");
		expect(getNextTheme("dark")).toBe("light");
	});

	it("Storage と matchMedia が利用できなくてもライトで初期化する", () => {
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new Error("storage unavailable");
		});
		vi.stubGlobal("matchMedia", () => {
			throw new Error("matchMedia unavailable");
		});

		expect(initializeTheme()).toBe("light");
		expect(document.documentElement.dataset.theme).toBe("light");
	});
});

describe("ThemeToggle", () => {
	it("テーマを切り替えて DOM と localStorage に反映する", () => {
		render(<ThemeToggle initialTheme="light" />);
		const button = screen.getByRole("button", {
			name: "ダークテーマ",
		});

		expect(button.getAttribute("aria-pressed")).toBe("false");
		fireEvent.click(button);

		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
		expect(button.getAttribute("aria-pressed")).toBe("true");
		fireEvent.click(button);
		expect(button.getAttribute("aria-pressed")).toBe("false");
	});

	it("テーマを切り替えても URL、hash、query を変更しない", () => {
		window.history.replaceState(
			null,
			"",
			"/?source=shared#/underlive?id=ul_test&absent=1",
		);
		const before = {
			href: window.location.href,
			search: window.location.search,
			hash: window.location.hash,
		};
		render(<ThemeToggle initialTheme="light" />);

		fireEvent.click(screen.getByRole("button", { name: "ダークテーマ" }));

		expect(window.location.href).toBe(before.href);
		expect(window.location.search).toBe(before.search);
		expect(window.location.hash).toBe(before.hash);
	});

	it("テーマ保存に失敗しても画面上の切替は完了する", () => {
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("storage unavailable");
		});
		render(<ThemeToggle initialTheme="light" />);

		const button = screen.getByRole("button", { name: "ダークテーマ" });
		fireEvent.click(button);

		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(button.getAttribute("aria-pressed")).toBe("true");
	});
});
