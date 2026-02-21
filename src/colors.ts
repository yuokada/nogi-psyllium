export const PENLIGHT_COLORS: Record<string, string> = {
	白: "#FFFFFF",
	オレンジ: "#FF8C00",
	青: "#0000FF",
	黄: "#FFD700",
	紫: "#800080",
	緑: "#008000",
	ピンク: "#FF69B4",
	赤: "#FF0000",
	水色: "#87CEEB",
	黄緑: "#ADFF2F",
	ターコイズ: "#40E0D0",
	黒: "#000000",
};

export function getPenlightHex(colorName: string): string | undefined {
	return PENLIGHT_COLORS[colorName];
}
