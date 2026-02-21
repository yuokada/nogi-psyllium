import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

function GithubCorner({ href }: { href: string }) {
	return (
		<a
			href={href}
			className="github-corner"
			aria-label="View source on GitHub"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true">
				<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
				<path
					d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
					fill="currentColor"
					style={{ transformOrigin: "130px 106px" }}
					className="octo-arm"
				/>
				<path
					d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
					fill="currentColor"
					className="octo-body"
				/>
			</svg>
		</a>
	);
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
	showAbsent,
	onShowAbsentChange,
}: {
	underlives: Underlive[];
	members: Member[];
	selectedId: string;
	onSelectId: (id: string) => void;
	showAbsent: boolean;
	onShowAbsentChange: (value: boolean) => void;
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

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const [members, setMembers] = useState<Member[]>([]);
	const [underlives, setUnderlives] = useState<Underlive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// タブはパスから導出
	const tab = location.pathname === "/underlive" ? "underlive" : "penlight";

	// フィルタ状態は searchParams から読む
	const search = searchParams.get("q") ?? "";
	const genFilter = searchParams.get("gen") ?? "";
	const showAll = searchParams.get("graduated") === "1";
	const selectedUnderliveId = searchParams.get("id") ?? "";
	const showAbsent = searchParams.get("absent") === "1";

	// IME コンポジション対応: 入力中は URL を更新せずローカル state で管理する
	const [inputValue, setInputValue] = useState(
		() => searchParams.get("q") ?? "",
	);
	const composingRef = useRef(false);

	// ブラウザ戻る/進むで URL が変化したとき inputValue を同期する
	useEffect(() => {
		if (!composingRef.current) {
			setInputValue(search);
		}
	}, [search]);

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
		if (
			underlives.length > 0 &&
			tab === "underlive" &&
			!underlives.find((u) => u.id === selectedUnderliveId)
		) {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set("id", underlives[0].id);
					return next;
				},
				{ replace: true },
			);
		}
	}, [underlives, tab, selectedUnderliveId, setSearchParams]);

	function setTab(newTab: "penlight" | "underlive") {
		navigate(newTab === "underlive" ? "/underlive" : "/");
	}

	function setSearch(value: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("q", value);
				else next.delete("q");
				return next;
			},
			{ replace: true },
		);
	}

	function setGenFilter(value: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("gen", value);
				else next.delete("gen");
				return next;
			},
			{ replace: true },
		);
	}

	function setShowAll(value: boolean) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("graduated", "1");
				else next.delete("graduated");
				return next;
			},
			{ replace: true },
		);
	}

	function setShowAbsent(value: boolean) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("absent", "1");
				else next.delete("absent");
				return next;
			},
			{ replace: true },
		);
	}

	function setSelectedUnderliveId(id: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (id) next.set("id", id);
				else next.delete("id");
				return next;
			},
			{ replace: true },
		);
	}

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
		<>
			<GithubCorner href="https://github.com/yuokada/nogi-psyllium" />
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
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value);
									if (!composingRef.current) {
										setSearch(e.target.value);
									}
								}}
								onCompositionStart={() => {
									composingRef.current = true;
								}}
								onCompositionEnd={(e) => {
									composingRef.current = false;
									setSearch(e.currentTarget.value);
								}}
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
						showAbsent={showAbsent}
						onShowAbsentChange={setShowAbsent}
					/>
				)}

				<footer className="app-footer">
					<p className="footer-title">ペンライト 色変更順</p>
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
					<p className="footer-ref">
						色順参考：
						<a
							href="https://www.nogizaka46shop.com/category/60"
							target="_blank"
							rel="noopener noreferrer"
						>
							乃木坂46公式ショップ
						</a>
					</p>
				</footer>
			</div>
		</>
	);
}

export default App;
