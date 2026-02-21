import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { getPenlightHex } from "./colors";
import type { Member } from "./types";
import { getTextColor, isValidHex } from "./utils";
import "./App.css";

function MemberCard({ member }: { member: Member }) {
	const hex1 = getPenlightHex(member.color1_name) ?? "#cccccc";
	const hex2 = member.color2_name
		? getPenlightHex(member.color2_name)
		: undefined;
	const color1Valid = isValidHex(hex1);
	const color2Valid = hex2 ? isValidHex(hex2) : false;

	return (
		<div className="member-card">
			<div className="member-header">
				<span className="member-name">{member.name}</span>
				{member.gen && <span className="member-gen">{member.gen}</span>}
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

function App() {
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [genFilter, setGenFilter] = useState("");

	useEffect(() => {
		const csvPath = `${import.meta.env.BASE_URL}data/members.csv`;
		fetch(csvPath)
			.then((res) => {
				if (!res.ok) throw new Error(`CSV読み込みエラー: ${res.status}`);
				return res.text();
			})
			.then((text) => {
				const result = Papa.parse<Member>(text, {
					header: true,
					skipEmptyLines: true,
				});
				setMembers(result.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	const generations = useMemo(() => {
		const gens = new Set<string>();
		members.forEach((m) => {
			if (m.gen) gens.add(m.gen);
		});
		return Array.from(gens).sort();
	}, [members]);

	const filtered = useMemo(() => {
		return members.filter((m) => {
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
	}, [members, search, genFilter]);

	if (loading) return <div className="loading">読み込み中...</div>;
	if (error) return <div className="error">エラー: {error}</div>;

	return (
		<div className="app">
			<h1>乃木坂46 サイリウムカラー一覧</h1>
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
			</div>
			<div className="member-count">{filtered.length}件表示</div>
			<div className="card-grid">
				{filtered.map((member, i) => (
					<MemberCard key={`${member.name}-${i}`} member={member} />
				))}
			</div>
		</div>
	);
}

export default App;
