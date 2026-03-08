export type BookmarkletFormData = {
	last_name: string;
	first_name: string;
	last_name_kana: string;
	first_name_kana: string;
	email: string;
	postal_code: string;
	prefecture: string;
	city: string;
	address1: string;
	address2: string;
	phone: string;
	birthday: string;
	gender: string;
	companion: "あり" | "なし";
	companion_last_name: string;
	companion_first_name: string;
	companion_phone: string;
	companion_address: string;
	companion_email: string;
};

export const STORAGE_KEY = "nogi_psyllium_bookmarklet_form_v1";
export const COPY_STATUS_RESET_DELAY = 2000;

export const PREFECTURES = [
	"北海道",
	"青森県",
	"岩手県",
	"宮城県",
	"秋田県",
	"山形県",
	"福島県",
	"茨城県",
	"栃木県",
	"群馬県",
	"埼玉県",
	"千葉県",
	"東京都",
	"神奈川県",
	"新潟県",
	"富山県",
	"石川県",
	"福井県",
	"山梨県",
	"長野県",
	"岐阜県",
	"静岡県",
	"愛知県",
	"三重県",
	"滋賀県",
	"京都府",
	"大阪府",
	"兵庫県",
	"奈良県",
	"和歌山県",
	"鳥取県",
	"島根県",
	"岡山県",
	"広島県",
	"山口県",
	"徳島県",
	"香川県",
	"愛媛県",
	"高知県",
	"福岡県",
	"佐賀県",
	"長崎県",
	"熊本県",
	"大分県",
	"宮崎県",
	"鹿児島県",
	"沖縄県",
] as const;

export const DEFAULT_FORM_DATA: BookmarkletFormData = {
	last_name: "",
	first_name: "",
	last_name_kana: "",
	first_name_kana: "",
	email: "",
	postal_code: "",
	prefecture: "",
	city: "",
	address1: "",
	address2: "",
	phone: "",
	birthday: "",
	gender: "",
	companion: "なし",
	companion_last_name: "",
	companion_first_name: "",
	companion_phone: "",
	companion_address: "",
	companion_email: "",
};

function isString(value: unknown): value is string {
	return typeof value === "string";
}

function isCompanionValue(
	value: unknown,
): value is BookmarkletFormData["companion"] {
	return value === "あり" || value === "なし";
}

export function parseStoredData(stored: string): Partial<BookmarkletFormData> {
	try {
		const json: unknown = JSON.parse(stored);
		if (!json || typeof json !== "object") return {};

		const data = json as { [K in keyof BookmarkletFormData]?: unknown };
		const result: Partial<BookmarkletFormData> = {};

		if (isString(data.last_name)) result.last_name = data.last_name;
		if (isString(data.first_name)) result.first_name = data.first_name;
		if (isString(data.last_name_kana))
			result.last_name_kana = data.last_name_kana;
		if (isString(data.first_name_kana))
			result.first_name_kana = data.first_name_kana;
		if (isString(data.email)) result.email = data.email;
		if (isString(data.postal_code)) result.postal_code = data.postal_code;
		if (isString(data.prefecture)) result.prefecture = data.prefecture;
		if (isString(data.city)) result.city = data.city;
		if (isString(data.address1)) result.address1 = data.address1;
		if (isString(data.address2)) result.address2 = data.address2;
		if (isString(data.phone)) result.phone = data.phone;
		if (isString(data.birthday)) result.birthday = data.birthday;
		if (isString(data.gender)) result.gender = data.gender;
		if (isCompanionValue(data.companion)) result.companion = data.companion;
		if (isString(data.companion_last_name))
			result.companion_last_name = data.companion_last_name;
		if (isString(data.companion_first_name))
			result.companion_first_name = data.companion_first_name;
		if (isString(data.companion_phone))
			result.companion_phone = data.companion_phone;
		if (isString(data.companion_address))
			result.companion_address = data.companion_address;
		if (isString(data.companion_email))
			result.companion_email = data.companion_email;

		return result;
	} catch {
		return {};
	}
}

function q(value: string): string {
	return JSON.stringify(value);
}

export function buildBookmarkletScript(formData: BookmarkletFormData): string {
	const [year = "", month = "", day = ""] = formData.birthday.split("-");
	const hasCompanion = formData.companion === "あり";

	const companionAssignments = hasCompanion
		? `
				case "同行者・姓":
					e.value = ${q(formData.companion_last_name)};
					break;
				case "同行者名・名":
					e.value = ${q(formData.companion_first_name)};
					break;
				case "同行者電話番号(半角・ハイフン不要)":
					e.value = ${q(formData.companion_phone)};
					break;
				case "同行者住所":
					e.value = ${q(formData.companion_address)};
					break;
				case "同行者メールアドレス":
					e.value = ${q(formData.companion_email)};
					break;
`
		: `
				case "同行者・姓":
				case "同行者名・名":
					e.value = "なし";
					break;
				case "同行者電話番号(半角・ハイフン不要)":
				case "同行者住所":
				case "同行者メールアドレス":
					e.value = "1";
					break;
`;

	return `(function(){
		const setValue = function(id, value) {
			const element = document.getElementById(id);
			if (element) element.value = value;
		};

		setValue("last_name", ${q(formData.last_name)});
		setValue("first_name", ${q(formData.first_name)});
		setValue("last_name_kana", ${q(formData.last_name_kana)});
		setValue("first_name_kana", ${q(formData.first_name_kana)});
		setValue("email_1", ${q(formData.email)});
		setValue("email_1_confirm", ${q(formData.email)});
		setValue("zip", ${q(formData.postal_code)});
		setValue("prefecture", ${q(formData.prefecture)});
		setValue("city", ${q(formData.city)});
		setValue("address_1", ${q(formData.address1)});
		setValue("address_2", ${q(formData.address2)});
		setValue("tel_1", ${q(formData.phone)});
		setValue("sex-0", ${q(formData.gender)});

		if (${q(year)} && ${q(month)} && ${q(day)}) {
			setValue("birthday.year", ${q(year)});
			setValue("birthday.month", ${q(month)});
			setValue("birthday.day", ${q(day)});
		}

		const inputNodes = document.querySelectorAll("#wishForm > div:nth-child(4) > div > div input");
		inputNodes.forEach(function(e) {
			const idValue = e.getAttribute("id");
			switch (idValue) {
				case "申込時の注意事項等.0":
				case "最終確認.0":
					e.checked = true;
					break;
${companionAssignments}
				case "申込者名・姓(来場代表者苗字)":
					e.value = ${q(formData.last_name)};
					break;
				case "申込者名・名":
					e.value = ${q(formData.first_name)};
					break;
				case "申込者電話番号(半角・ハイフン不要)":
					e.value = ${q(formData.phone)};
					break;
				default:
					break;
			}
		});
	})();`;
}
