/**
 * @file navigation.ts
 * @author Tomáš Wróbel
 * @version 2.1
 * sticky navbar
 * showing / hiding sections – only index.html
 *//** */
class Navigation {
	parameters: Record<string, string>;
	readonly sidebar: JQuery<HTMLElement>;
	readonly mainbar: JQuery<HTMLElement>;
	static params = new URLSearchParams(location.search);
	open() {
		this.sidebar.css("width", "12em");
	}
	close() {
		this.sidebar.css("width", 0);
	}
	constructor(sidebar: string, mainbar: string) {
		this.sidebar = $(sidebar);
		this.mainbar = $(mainbar);
		this.initEvents();
		this.initPage();
	}
	initPage() {
		if (location.hash) {
			const navLink = this.mainbar.find(`a[href="${location.hash}"]`);
			if (navLink.length != 0) {
				navLink.trigger("click");
				return;
			} else {
				this.pageNotFound(location.hash.substring(1));
			}
		} else {
			if (Navigation.params.has("page_not_found")) {
				this.pageNotFound(Navigation.params.get("page_not_found"));
			} else {
				history.replaceState({}, document.title, "#certificates");
			}
		}
	}
	initEvents() {
		const nav = this;
		this.mainbar.find('a[href^="#"]').on("click", function () {
			nav.page($(this).attr("href"), this.innerText);
			nav.mainbar.children(".active").removeClass("active");
			this.className = "active";
		});
		this.sidebar.find('a[href^="#"]').on("click", function () {
			nav.page($(this).attr("href"), this.innerText);
		});
		window.addEventListener("hashchange", () => $(`a[href="${location.hash}"]`).trigger("click"));
		this.sidebar.find("a").eq(0).on("click", nav.close.bind(nav));
		this.mainbar.children(".fas").on("click", nav.open.bind(nav));
	}
	pageNotFound(page: string) {
		page = page.replace(/^\//, "").replace(/\/$/, "");
		Swal.fire({
			title: "Page not found",
			html: `Page <i>${page.split("/").join(' <i class="fas fa-long-arrow-alt-right"></i> ')}</i> not found. Are you sure you type URL correctly?`,
			icon: "error",
			footer: 'Error code:&nbsp;<a href="https://en.wikipedia.org/wiki/HTTP_404" data-animated>HTTP 404</a>'
		});
	}
	page(url: string, title: string) {
		$("section.active").removeClass("active");
		$(url).addClass("active");
		this.close();
		document.title = url === "#home" ? "Programmer Tomáš Wróbel" : `Programmer Tomáš Wróbel | ${title.trim()}`;
	}
};

$(".angry-bird").on("click", function (this: HTMLAnchorElement) {
	Swal.fire({
		title: "Angry Bird",
		html: `<svg height="400" width="400" style="margin-top: -60px;">
			<path d="M110 150 290 150 350 290 50 290 z" stroke="#d1212a" fill="#d1212a" />
			<!-- line up -->
			<path d="M110 150 C 155 105, 245 105, 290 150" stroke="black" fill="#d1212a" />
			<!-- line left -->
			<path d="M110 150 C 70 190, 50 240, 50 290" stroke="black" fill="#d1212a" />
			<!-- line right -->
			<path d="M290 150 C 330 190, 350 240, 350 290" stroke="black" fill="#d1212a" />
			<!-- line bottom -->
			<path d="M50 290 C 50 430, 350 430, 350 290" stroke="black" fill="#d1212a" />

			<!-- hair begins -->
			<path d="M160 130 C 70 130, 100 70, 230 110" stroke="black" fill="#d1212a" />
			<path d="M190 113 C 70 40, 210 20, 262 131" stroke="black" fill="#d1212a" />
			<!-- hair ends -->

			<!-- outer head ends -->

			<!-- inner head begins -->

			<!-- marks begin -->

			<!-- outer marks begin -->
			<path d="M50 290 C 70 275, 80 325, 55 320" stroke="transparent" fill="#a82023" />
			<path d="M50 290 C 50 300, 53 315, 55 320" stroke="black" fill="#a82023" />
			<path d="M350 290 C 330 275, 320 325, 345 320" stroke="transparent" fill="#a82023" />
			<path d="M350 290 C 350 300, 347 315, 345 320" stroke="black" fill="#a82023" />
			<!-- outer marks end -->
			
			<!-- inner marks begin -->
			<ellipse rx="12" ry="25" cx="92" cy="282" transform="rotate(175 92 282)" stroke="transparent" fill="#a82023" />
			<ellipse rx="12" ry="25" cx="308" cy="282" transform="rotate(185 308 282)" stroke="transparent" fill="#a82023" />
			<ellipse rx="40" ry="45" cx="155" cy="268" transform="rotate(40 155 268)" stroke="transparent" fill="#a82023" />
			<ellipse rx="40" ry="45" cx="242" cy="268" transform="rotate(-40 242 268)" stroke="transparent" fill="#a82023" />
			<!-- inner marks end -->


			<!-- marks end -->

			<!-- eyes begin -->
			<!-- left eye begins -->
			<circle cx="167" cy="252" r="32" stroke="black" fill="#dcdad9"></circle>
			<ellipse cx="166" cy="250" rx="26" ry="31.5" transform="rotate(110 166 251)" stroke="transparent" fill="#f8f8f8" />
			<path d="M135 252 C 138 209, 196 209, 199 252" transform="rotate(10 167 252)" stroke="black" fill="#f8f8f8" />
			<circle id="leftPupile" cx="150" cy="247" r="10" stroke="black" fill="#1f1915"></circle>
			<ellipse id="leftPupileInner" cx="165" cy="245" rx="1.5" ry="2" stroke="transparent" fill="#f8f8f8" />
			<!-- left eye ends -->
			<!-- right eye begins -->
			<circle cx="231" cy="252" r="32" stroke="black" fill="#dcdad9"></circle>
			<ellipse cx="232" cy="250" rx="26" ry="31.5" transform="rotate(-110 232 251)" stroke="transparent" fill="#f8f8f8" />
			<path d="M199 252 C 202 209, 260 209, 263 252" transform="rotate(-10 231 252)" stroke="black" fill="#f8f8f8" />
			<circle id="rightPupile" cx="215" cy="247" r="9" stroke="black" fill="#1f1915"></circle>
			<ellipse id="rightPupileInner" cx="212" cy="245" rx="1.5" ry="2" stroke="transparent" fill="#f8f8f8" />
			<path d="M113 190 206 210 206 230 113 230 z" transform="rotate(10 157.5 190)" stroke="#1f1916" fill="#1f1916" />
			<path d="M192 210 282 190 282 230 192 230 z" transform="rotate(-10 239.5 190)" stroke="#1f1916" fill="#1f1916" />

			<path d="M100 370 C 150 260, 250 260, 300 370" stroke="black" fill="#e5caae" />
			<path d="M100 370 C 160 405, 240 405, 300 370" stroke="black" fill="#e5caae" />

			<!-- beak begins -->
			<!-- lower beak begins -->
			<path d="M158 305 C 200.5 360, 200.5 360, 243 305 " fill="#ed9d21" stroke="black" />
			<!-- lower beak ends -->
			<!-- upper beak begins -->
			<path d="M148 302 C 200 245, 200 245, 253 302" stroke="black" fill="#f5bb19" />
			<path d="M148 302 L200.5 320 L253 302 " fill="#f5bb19" stroke="black" />
			<!-- uper beak ends -->
			<!-- beak ends -->
			<!-- inner head ends -->
			<animate xlink:href="#leftPupile" attributeName="cx" from="175" to="185" dur="4s" values="150; 185; 185; 150; 150" keyTimes="0; 0.20; 0.50; 0.7; 1" repeatCount="indefinite" fill="freeze" />
			<animate xlink:href="#leftPupileInner" attributeName="cx" from="145" to="192" dur="4s" values="145; 192; 192; 145; 145;" keyTimes="0; 0.20; 0.50; 0.7; 1" repeatCount="indefinite" fill="freeze" />
			<animate xlink:href="#rightPupile" attributeName="cx" from="221" to="247" dur="4s" values="215; 247; 247; 215; 215" keyTimes="0; 0.20; 0.50; 0.7; 1" repeatCount="indefinite" fill="freeze" />
			<animate xlink:href="#rightPupileInner" attributeName="cx" from="210" to="253" dur="4s" values="210; 253; 253; 210; 210;" keyTimes="0; 0.20; 0.50; 0.7; 1" repeatCount="indefinite" fill="freeze" />
		</svg>`,
		showCancelButton: true,
		confirmButtonText: "Go to " + this.href,
		cancelButtonText: "OK"
	}).then(({ isConfirmed }) => isConfirmed && window.open(this.href));
	return false;
});

new Navigation("side-nav", "nav");

// Some browsers want declaration
customElements.define("side-nav", class HTMLSideNavElement extends HTMLElement { }, { extends: "nav" });