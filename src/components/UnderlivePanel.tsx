import { useMemo } from "react";
import type { Member, Underlive } from "../types";
import { MemberCard } from "./MemberCard";

export type UnderlivePanelProps = {
	underlives: Underlive[];
	members: Member[];
	selectedId: string;
	onSelectId: (id: string) => void;
	showAbsent: boolean;
	onShowAbsentChange: (value: boolean) => void;
};

export function UnderlivePanel({
	underlives,
	members,
	selectedId,
	onSelectId,
	showAbsent,
	onShowAbsentChange,
}: UnderlivePanelProps) {
	const selected = useMemo(
		() => underlives.find((u) => u.id === selectedId),
		[underlives, selectedId],
	);

	const memberMap = useMemo(() => {
		const map = new Map<string, Member>();
		for (const m of members) {
			map.set(m.id, m);
		}
		return map;
	}, [members]);

	const activeMembers = useMemo(() => {
		if (!selected) return [];
		return selected.member_ids
			.map((id) => memberMap.get(id))
			.filter((m): m is Member => m !== undefined);
	}, [selected, memberMap]);

	const absentMembers = useMemo(() => {
		if (!selected?.absent) return [];
		const result: { member: Member; note?: string }[] = [];
		for (const a of selected.absent) {
			const member = memberMap.get(a.id);
			if (member) result.push({ member, note: a.note });
		}
		return result;
	}, [selected, memberMap]);

	const activeCenterIds = useMemo(() => {
		if (!selected?.centers) return new Set<string>();
		return new Set(selected.centers.map((c) => c.id));
	}, [selected]);

	const sortedMembers = useMemo(() => {
		if (!activeCenterIds.size) return activeMembers;
		const centers = activeMembers.filter((m) => activeCenterIds.has(m.id));
		const others = activeMembers.filter((m) => !activeCenterIds.has(m.id));
		return [...centers, ...others];
	}, [activeMembers, activeCenterIds]);

	if (underlives.length === 0) {
		return <div className="loading">アンダーライブデータがありません</div>;
	}

	return (
		<div className="underlive-panel">
			<div className="underlive-controls">
				<select
					className="gen-select"
					value={selectedId}
					onChange={(e) => onSelectId(e.target.value)}
				>
					{underlives.map((u) => (
						<option key={u.id} value={u.id}>
							{u.title}
						</option>
					))}
				</select>
			</div>

			{selected && (
				<>
					<div className="underlive-info">
						<div className="underlive-meta">
							{selected.dates.length > 0 && (
								<span className="underlive-dates">
									{selected.dates[0]}
									{selected.dates.length > 1 &&
										` 〜 ${selected.dates[selected.dates.length - 1]}`}
								</span>
							)}
							{selected.venue && (
								<span className="underlive-venue">{selected.venue}</span>
							)}
							{selected.source_url && (
								<a
									href={selected.source_url}
									target="_blank"
									rel="noopener noreferrer"
									className="underlive-source"
								>
									出典
								</a>
							)}
						</div>
					</div>

					<div className="member-count">
						出演メンバー {sortedMembers.length}名
					</div>
					<div className="card-grid">
						{sortedMembers.map((member) => (
							<MemberCard
								key={member.id}
								member={member}
								isCenter={activeCenterIds.has(member.id)}
							/>
						))}
					</div>

					{absentMembers.length > 0 && (
						<div className="absent-section">
							<label className="absent-toggle">
								<input
									type="checkbox"
									checked={showAbsent}
									onChange={(e) => onShowAbsentChange(e.target.checked)}
								/>
								欠席メンバーを表示（{absentMembers.length}名）
							</label>
							{showAbsent && (
								<ul className="absent-list">
									{absentMembers.map(({ member, note }) => (
										<li key={member.id} className="absent-item">
											<span className="absent-name">{member.name}</span>
											{note && <span className="absent-note"> — {note}</span>}
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
