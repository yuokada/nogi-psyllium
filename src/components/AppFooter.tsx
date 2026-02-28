import { PENLIGHT_COLORS } from "../colors";

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

export function AppFooter() {
	return (
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
	);
}
