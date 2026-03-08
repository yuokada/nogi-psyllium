import type { ChangeEvent } from "react";
import { type BookmarkletFormData, PREFECTURES } from "./shared";

type BookmarkletFormFieldsProps = {
	formData: BookmarkletFormData;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onCompanionChange: (value: "あり" | "なし") => void;
};

export function BookmarkletFormFields({
	formData,
	onChange,
	onCompanionChange,
}: BookmarkletFormFieldsProps) {
	return (
		<div className="bookmarklet-form-grid">
			<label>
				<span>姓</span>
				<input
					name="last_name"
					value={formData.last_name}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>名</span>
				<input
					name="first_name"
					value={formData.first_name}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>セイ</span>
				<input
					name="last_name_kana"
					value={formData.last_name_kana}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>メイ</span>
				<input
					name="first_name_kana"
					value={formData.first_name_kana}
					onChange={onChange}
				/>
			</label>
			<label className="full-width">
				<span>メールアドレス</span>
				<input
					name="email"
					type="email"
					autoComplete="email"
					value={formData.email}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>郵便番号</span>
				<input
					name="postal_code"
					placeholder="例: 1030001"
					value={formData.postal_code}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>都道府県</span>
				<select
					name="prefecture"
					value={formData.prefecture}
					onChange={onChange}
				>
					<option value="">選択してください</option>
					{PREFECTURES.map((pref) => (
						<option key={pref} value={pref}>
							{pref}
						</option>
					))}
				</select>
			</label>
			<label>
				<span>市区町村</span>
				<input name="city" value={formData.city} onChange={onChange} />
			</label>
			<label>
				<span>町名番地</span>
				<input name="address1" value={formData.address1} onChange={onChange} />
			</label>
			<label className="full-width">
				<span>建物名等</span>
				<input name="address2" value={formData.address2} onChange={onChange} />
			</label>
			<label>
				<span>電話番号</span>
				<input
					name="phone"
					type="tel"
					placeholder="例: 08012345678"
					value={formData.phone}
					onChange={onChange}
				/>
			</label>
			<label>
				<span>生年月日</span>
				<input
					name="birthday"
					type="date"
					value={formData.birthday}
					autoComplete="bday"
					onChange={onChange}
				/>
			</label>
			<div className="bookmarklet-radio-group">
				<span>性別</span>
				<label>
					<input
						type="radio"
						name="gender"
						value="1"
						checked={formData.gender === "1"}
						onChange={onChange}
					/>
					男
				</label>
				<label>
					<input
						type="radio"
						name="gender"
						value="2"
						checked={formData.gender === "2"}
						onChange={onChange}
					/>
					女
				</label>
			</div>
			<div className="bookmarklet-radio-group">
				<span>同行者</span>
				<label>
					<input
						type="radio"
						name="companion"
						value="あり"
						checked={formData.companion === "あり"}
						onChange={() => onCompanionChange("あり")}
					/>
					あり
				</label>
				<label>
					<input
						type="radio"
						name="companion"
						value="なし"
						checked={formData.companion === "なし"}
						onChange={() => onCompanionChange("なし")}
					/>
					なし
				</label>
			</div>
			{formData.companion === "あり" && (
				<>
					<label>
						<span>同行者 姓</span>
						<input
							name="companion_last_name"
							value={formData.companion_last_name}
							onChange={onChange}
						/>
					</label>
					<label>
						<span>同行者 名</span>
						<input
							name="companion_first_name"
							value={formData.companion_first_name}
							onChange={onChange}
						/>
					</label>
					<label>
						<span>同行者電話番号</span>
						<input
							name="companion_phone"
							type="tel"
							value={formData.companion_phone}
							onChange={onChange}
						/>
					</label>
					<label>
						<span>同行者住所</span>
						<input
							name="companion_address"
							value={formData.companion_address}
							onChange={onChange}
						/>
					</label>
					<label className="full-width">
						<span>同行者メールアドレス</span>
						<input
							name="companion_email"
							type="email"
							value={formData.companion_email}
							onChange={onChange}
						/>
					</label>
				</>
			)}
		</div>
	);
}
