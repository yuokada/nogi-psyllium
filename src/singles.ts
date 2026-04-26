import type { SingleRelease, SingleTrack } from "./types";

function isSingleTrack(value: unknown): value is SingleTrack {
	if (!value || typeof value !== "object") return false;
	const track = value as Record<string, unknown>;
	return (
		typeof track.title === "string" &&
		Array.isArray(track.editions) &&
		track.editions.every((edition) => typeof edition === "string")
	);
}

export function isSingleRelease(value: unknown): value is SingleRelease {
	if (!value || typeof value !== "object") return false;
	const single = value as Record<string, unknown>;
	if (
		typeof single.id !== "string" ||
		typeof single.number !== "string" ||
		typeof single.title !== "string" ||
		typeof single.release_date !== "string"
	) {
		return false;
	}
	if (single.tracks === undefined) return true;
	return Array.isArray(single.tracks) && single.tracks.every(isSingleTrack);
}
