export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "nogi-psyllium-theme";

export function isTheme(value: unknown): value is Theme {
	return value === "light" || value === "dark";
}

export function resolveInitialTheme(
	storedTheme: unknown,
	prefersDark: boolean,
): Theme {
	if (isTheme(storedTheme)) return storedTheme;
	return prefersDark ? "dark" : "light";
}

export function getNextTheme(theme: Theme): Theme {
	return theme === "light" ? "dark" : "light";
}

export function applyTheme(
	theme: Theme,
	root: HTMLElement = document.documentElement,
): void {
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
}

export function saveTheme(
	theme: Theme,
	storage?: Pick<Storage, "setItem">,
): void {
	try {
		(storage ?? window.localStorage).setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// Storage can be unavailable in private browsing or restricted contexts.
	}
}

export function initializeTheme(): Theme {
	let storedTheme: string | null = null;
	let prefersDark = false;

	try {
		storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
	} catch {
		// Fall through to the OS preference.
	}

	try {
		prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	} catch {
		// Browsers without matchMedia use the light theme.
	}

	const theme = resolveInitialTheme(storedTheme, prefersDark);
	applyTheme(theme);
	return theme;
}
