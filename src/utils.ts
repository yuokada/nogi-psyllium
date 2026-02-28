export function isValidHex(hex: string): boolean {
	return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function getLuminance(hex: string): number {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const toLinear = (c: number) =>
		c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getTextColor(bgHex: string): string {
	if (!isValidHex(bgHex)) return "#000000";
	return getLuminance(bgHex) > 0.179 ? "#000000" : "#ffffff";
}
