import { getPenlightHex } from "../colors";
import type { Member } from "../types";
import { getTextColor, isValidHex } from "../utils";

type MemberCardProps = {
	member: Member;
	isCenter?: boolean;
};

export function MemberCard({ member, isCenter = false }: MemberCardProps) {
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
				{member.active === true && member.profile_url && (
					<a
						href={member.profile_url}
						target="_blank"
						rel="noopener noreferrer"
						className="member-profile-link"
						aria-label={`${member.name}の公式プロフィール`}
					>
						🔗
					</a>
				)}
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
