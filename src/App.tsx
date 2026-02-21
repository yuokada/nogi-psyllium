import { useEffect, useMemo, useState } from "react";
import { getPenlightHex, PENLIGHT_COLORS } from "./colors";
import type { Member, Underlive } from "./types";
import { getTextColor, isValidHex } from "./utils";
import "./App.css";

const COLOR_CYCLE = [
	"白",
	"オレンジ",
	"青",
	"黄",
	"紫",
	"緑",
	"ピンク",
	"赤",
	"水色",
	"黄緑",
	"ターコイズ",
];

function getHashParts(): { path: string; params: URLSearchParams } {
	const hash = window.location.hash.slice(1); // 先頭の # を除く
	const sepIdx = hash.indexOf("?");
	if (sepIdx === -1) {
		return { path: hash, params: new URLSearchParams() };
	}
	return {
		path: hash.slice(0, sepIdx),
		params: new URLSearchParams(hash.slice(sepIdx + 1)),
	};
}

function MemberCard({
	member,
	isCenter = false,
}: {
	member: Member;
	isCenter?: boolean;
}) {
	const hex1 = getPenlightHex(member.color1_name) ?? "#cccccc";
	const hex2 = member.color2_name
		? getPenlightHex(member.color2_name)
		: undefined;
	const color1Valid = isValidHex(hex1);
	const color2Valid = hex2 ? isValidHex(hex2) : false;

	return (
		<div
			className={isCenter ? "member-card member-card--center" : "member-card"}
		>
			<div className="member-header">
				<span className="member-name">{member.name}</span>
				{member.gen && <span className="member-gen">{member.gen}</span>}
				{isCenter && <span className="center-badge">👑</span>}
			</div>
			<div className="color-boxes">
				<div
					className="color-box"
					style={{
						backgroundColor: color1Valid ? hex1 : "#cccccc",
						color: color1Valid ? getTextColor(hex1) : "#000000",
					}}
				>
					<span className="color-name">{member.color1_name}</span>
				</div>
				{member.color2_name && hex2 && (
					<div
						className="color-box"
						style={{
							backgroundColor: color2Valid ? hex2 : "#cccccc",
							color: color2Valid ? getTextColor(hex2) : "#000000",
						}}
					>
						<span className="color-name">{member.color2_name}</span>
					</div>
				)}
			</div>
		</div>
	);
}

function UnderlivePanel({
	underlives,
	members,
	selectedId,
	onSelectId,
}: {
	underlives: Underlive[];
	members: Member[];
	selectedId: string;
	onSelectId: (id: string) => void;
}) {
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
						{sortedMembers.map((member, i) => (
							<MemberCard
								key={`${member.id}-${i}`}
								member={member}
								isCenter={activeCenterIds.has(member.id)}
							/>
						))}
					</div>

					{absentMembers.length > 0 && (
						<div className="absent-section">
							<h3 className="absent-title">欠席メンバー</h3>
							<ul className="absent-list">
								{absentMembers.map(({ member, note }) => (
									<li key={member.id} className="absent-item">
										<span className="absent-name">{member.name}</span>
										{note && <span className="absent-note"> — {note}</span>}
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function App() {
	const [members, setMembers] = useState<Member[]>([]);
	const [underlives, setUnderlives] = useState<Underlive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<"penlight" | "underlive">(() => {
		const { path } = getHashParts();
		return path === "underlive" ? "underlive" : "penlight";
	});
	const [search, setSearch] = useState(
		() => getHashParts().params.get("q") ?? "",
	);
	const [genFilter, setGenFilter] = useState(
		() => getHashParts().params.get("gen") ?? "",
	);
	const [showAll, setShowAll] = useState(
		() => getHashParts().params.get("graduated") === "1",
	);
	const [selectedUnderliveId, setSelectedUnderliveId] = useState(
		() => getHashParts().params.get("id") ?? "",
	);

	useEffect(() => {
		const jsonPath = `${import.meta.env.BASE_URL}data/members.json`;
		fetch(jsonPath)
			.then((res) => {
				if (!res.ok) throw new Error(`データ読み込みエラー: ${res.status}`);
				return res.json() as Promise<Member[]>;
			})
			.then((data) => {
				setMembers(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		const jsonPath = `${import.meta.env.BASE_URL}data/underlives.json`;
		fetch(jsonPath)
			.then((res) => {
				if (!res.ok) return [];
				return res.json() as Promise<Underlive[]>;
			})
			.then(setUnderlives)
			.catch(() => {
				// underlives.json の読み込み失敗は無視する
			});
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (search) params.set("q", search);
		if (genFilter) params.set("gen", genFilter);
		if (showAll) params.set("graduated", "1");
		if (selectedUnderliveId) params.set("id", selectedUnderliveId);
		const qs = params.toString();
		const hashPath = tab === "underlive" ? "underlive" : "";
		const hash = hashPath
			? qs
				? `#${hashPath}?${qs}`
				: `#${hashPath}`
			: qs
				? `#?${qs}`
				: "";
		window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
	}, [tab, search, genFilter, showAll, selectedUnderliveId]);

	useEffect(() => {
		if (
			underlives.length > 0 &&
			!underlives.find((u) => u.id === selectedUnderliveId)
		) {
			setSelectedUnderliveId(underlives[0].id);
		}
	}, [underlives, selectedUnderliveId]);

	const generations = useMemo(() => {
		const gens = new Set<string>();
		members.forEach((m) => {
			if (m.gen) gens.add(m.gen);
		});
		return Array.from(gens).sort();
	}, [members]);

	const filtered = useMemo(() => {
		return members.filter((m) => {
			if (!showAll && m.active !== true) return false;
			if (genFilter && m.gen !== genFilter) return false;
			if (search) {
				const q = search.toLowerCase();
				const fields = [m.name, m.gen, m.color1_name, m.color2_name].filter(
					Boolean,
				);
				return fields.some((f) => f!.toLowerCase().includes(q));
			}
			return true;
		});
	}, [members, search, genFilter, showAll]);

	if (loading) return <div className="loading">読み込み中...</div>;
	if (error) return <div className="error">エラー: {error}</div>;

	return (
		<div className="app">
			<h1>乃木坂46 サイリウムカラー一覧</h1>
			<div className="tabs">
				<button
					type="button"
					className={tab === "penlight" ? "tab active" : "tab"}
					onClick={() => setTab("penlight")}
				>
					サイリウムカラー
				</button>
				<button
					type="button"
					className={tab === "underlive" ? "tab active" : "tab"}
					onClick={() => setTab("underlive")}
				>
					アンダーライブ
				</button>
				<button
					type="button"
					className="copy-link-btn"
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
					}}
				>
					リンクをコピー
				</button>
			</div>

			{tab === "penlight" && (
				<>
					<div className="controls">
						<input
							type="text"
							className="search-input"
							placeholder="名前・期・色名で検索..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<select
							className="gen-select"
							value={genFilter}
							onChange={(e) => setGenFilter(e.target.value)}
						>
							<option value="">すべての期</option>
							{generations.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
						<label className="show-all-label">
							<input
								type="checkbox"
								checked={showAll}
								onChange={(e) => setShowAll(e.target.checked)}
							/>
							卒業メンバーを含む
						</label>
					</div>
					<div className="member-count">{filtered.length}件表示</div>
					<div className="card-grid">
						{filtered.map((member, i) => (
							<MemberCard key={`${member.id}-${i}`} member={member} />
						))}
					</div>
				</>
			)}

			{tab === "underlive" && (
				<UnderlivePanel
					underlives={underlives}
					members={members}
					selectedId={selectedUnderliveId}
					onSelectId={setSelectedUnderliveId}
				/>
			)}

			<footer className="app-footer">
				<p className="footer-title">ペンライト 色変更順</p>
				<p className="footer-ref">
					色順参考：
					<a
						href="https://www.nogizaka46shop.com/category/60"
						target="_blank"
						rel="noopener noreferrer"
					>
						乃木坂46公式ショップ ペンライトカテゴリ
					</a>
				</p>
				<div className="color-cycle">
					{COLOR_CYCLE.map((name, i) => (
						<div key={name} className="cycle-item">
							<div
								className="cycle-swatch"
								style={{ backgroundColor: PENLIGHT_COLORS[name] }}
							/>
							<span className="cycle-name">{name}</span>
							{i < COLOR_CYCLE.length - 1 && (
								<span className="cycle-arrow">→</span>
							)}
						</div>
					))}
				</div>
			</footer>
		</div>
	);
}

export default App;
