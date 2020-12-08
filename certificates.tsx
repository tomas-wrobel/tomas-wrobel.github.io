class Divider extends React.Component<{ title: string; link: string }> {
	render() {
		return <fieldset style={{ margin: "10px", padding: 0, border: 0, borderTop: "1px solid #000" }}>
			<legend>
				<a href={this.props.link} data-animated="true">{this.props.title}</a>
			</legend>
		</fieldset>;
	}
}

class Certificates extends React.Component<{}, Record<string, (Record<string, boolean> | string[])[] | number>> {
	public state = {
		page: 0,
		SoloLearn: [
			{
				"Cs": true,
				"C": false,
				"C++": true,
				"CSS": true
			}, {
				"HTML": true,
				"Java": true,
				"JavaScript": true,
				"jQuery": true
			}, {
				"React + Redux": true,
				"Angular + NestJS": true,
				"PHP": false,
				"Python": true
			}, {
				"Data Science with Python": false,
				"Ruby": false,
				"SQL": false,
				"Swift": false,
			},
			{
				"Machine Learning": true
			}
		],
		ProgrammingHub: [
			{}, {}, {}, {}, {
				"Python": true,
				"Python 3": false,
				"C++": true
			}, {
				"C": true,
				"Java": true,
				"Cs": false,
				"Building a Website": false,
				"CSS": false,
			}, {
				"HTML": true,
				"JavaScript": true,
				"jQuery": false,
				"Machine Learning": false
			}
		],
		FreeCodeCamp: [
			[], [], [], [], [], [], [], [
				"Responsive Web Design",
				"JavaScript Algorithms and Data Structures"
			]
		],
		BitDegree: [
			[], [], [], [], [], [], [], [
				"Introducing Coding for Beginners an HTML and CSS Online Course"
			]
		]
	}
	private _target = $("#certificates div")[0];
	constructor(props: {}) {
		super(props);
		$("#graphs").on("click", this.seeGraphs.bind(this));
		$(window).on("resize", () => $(".certificate").height(this.getEmbedHeight()));
		$("nav a").on("click", ({ target }) => {
			if (target.id != "#certificates") {
				this.setPageToURL(null);
			} else if (!Navigation.params.has("page")) {
				this.setPageToURL(this.page);
			}
		});
		console.log(+Navigation.params.get("page") - 1, this.state.page);
		this.page = Navigation.params.has("page") ? +Navigation.params.get("page") - 1 : 0;
	}
	getEmbedHeight() {
		return this._target.offsetWidth / Math.sqrt(2);
	}
	get<N extends "SoloLearn" | "ProgrammingHub" | "FreeCodeCamp" | "BitDegree">(name: N): this["state"][N][this["page"]] {
		return this.state[name][this.page] || {};
	}
	public get page() {
		return this.state.page;
	}
	public set page(page) {
		this.setPageToURL(page);
		this.setState({ ...this.state, page });
	}
	private setPageToURL(page = 0) {
		if (page === null) {
			Navigation.params.delete("page");
			var prefix = "";
		} else {
			Navigation.params.set("page", "" + (page + 1));
			var prefix = "?";
		}
		history.replaceState({}, document.title, prefix + Navigation.params + location.hash);
	}
	private get maxPage() {
		return this.state.BitDegree.length;
	}
	private get hasPDFViewer() {
		return "application/pdf" in navigator.mimeTypes || /iPad|iPhone|iPod/.test(navigator.userAgent);
	}
	render(): JSX.Element {
		if (this.hasPDFViewer) {
			const embed = (src: string) => <embed type="application/pdf" className="certificate" height={this.getEmbedHeight()} src={src} />
			const SoloLearn = Object.entries(this.get("SoloLearn")).map(([language, doIuse]) => (
				<div key={"SoloLearn " + language}>
					<h5 className={doIuse ? "" : "useless"}>{language.replace("Cs", "C#")} Certificate</h5>
					{embed(`certificates/SL_${language}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=fit`)}
				</div>
			));
			const ProgrammingHub = Object.entries(this.get("ProgrammingHub")).map(([language, advanced]) => (
				<div key={"Programming Hub " + language}>
					<h5>{(language + (advanced ? ` & ${language} Andvanced Certificates` : " Certificate")).replace(/Cs/g, "C#")}</h5>
					{embed(`certificates/PH_${language}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=fit`)}
					{advanced && embed(`certificates/PH_${language} Advanced.pdf#toolbar=0&navpanes=0&scrollbar=0&view=fit`)}
				</div>
			));
			const FreeCodeCamp = this.get("FreeCodeCamp").map(language => (
				<div key={"Free Code Camp " + language}>
					<h5>{language} Certificate</h5>
					{embed(`certificates/FCC_${language}.html`)}
				</div>
			));
			const BitDegree = this.get("BitDegree").map(language => (
				<div key={"BitDegree" + language}>
					<h5>{language /* BitDegree ends with "Course" */}</h5>
					{embed(`certificates/BD_${language}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=fit`)}
				</div>
			));
			const pageButtonStyle = (i) => Object.assign<React.CSSProperties, React.CSSProperties>({
				padding: 0,
				paddingLeft: "0.25em",
				paddingRight: "0.25em",
				borderRadius: "50%",
				margin: 8
			}, this.page === i ? {
				backgroundColor: "red"
			} : {});
			const controls = [...Array(this.maxPage).keys()].map(i => (
				<button style={pageButtonStyle(i)} className="is-button" onClick={() => (this.page === i) ? false : this.page = i}>{i + 1}</button>
			));
			return <div>
				{this.page === 0 && <Divider title="SoloLearn" link="https://sololearn.com/" />}
				{SoloLearn}
				{ProgrammingHub.length > 0 && <Divider title="Programming Hub" link="https://programminghub.io/" />}
				{ProgrammingHub}
				{FreeCodeCamp.length > 0 && <Divider title="freeCodeCamp" link="https://freecodecamp.org" />}
				{FreeCodeCamp}
				{BitDegree.length > 0 && <Divider title="BitDegree" link="https://www.bitdegree.org/" />}
				{BitDegree}
				<div style={{ textAlign: "center" }}>
					<button style={{ marginRight: 8, filter: this.page > 0 ? "" : "brightness(0.5)" }} className="is-button" onClick={() => this.page > 0 && --this.page}>&#10094; Previous</button>
					{controls}
					<button style={{ marginLeft: 8, filter: this.page < this.maxPage ? "" : "brightness(0.5)" }} className="is-button" onClick={() => this.page < this.maxPage && ++this.page}>Next &#10095;</button>
					<br />
					<button className="is-button" id="download">
						<i className="fa fa-download"></i> Download a certificate
					</button>
				</div>
			</div>;
		} else {
			const SoloLearn = Object.entries(this.state.SoloLearn.reduce((a, b) => ({ ...a, ...b }), {})).map(([language, doIuse]) => (
				<li key={"SoloLearn " + language}>
					<span className={doIuse ? undefined : "useless"}>{language.replace("Cs", "C#")} Certificate</span>
				</li>
			));
			const ProgrammingHub = Object.entries(this.state.ProgrammingHub.reduce((a, b) => ({ ...a, ...b }), {})).map(([language, advanced]) => (
				<li key={"Programming Hub " + language}>
					<span>{(language + (advanced ? ` & ${language} Andvanced Certificates` : " Certificate")).replace(/Cs/g, "C#")}</span>
				</li>
			));
			const FreeCodeCamp = this.state.FreeCodeCamp[this.maxPage - 1].map(language => (
				<li key={"Free Code Camp " + language}>
					<span>{language} Certificate</span>
				</li>
			));
			return <div>
				<ul>
					<li>
						by <a href="https://sololearn.com/" data-animated="true">SoloLearn</a>
						<ol>{SoloLearn}</ol>
					</li>
					<li>
						by <a href="https://programminghub.io/" data-animated="true">Programming Hub</a>
						<ol start={SoloLearn.length + 1}>{ProgrammingHub}</ol>
					</li>
					<li>
						by <a href="https://freecodecamp.org" data-animated="true">freeCodeCamp</a>
						<ol start={SoloLearn.length + ProgrammingHub.length + 1}>{FreeCodeCamp}</ol>
					</li>
					<li>
						by <a href="https://www.bitdegree.org/" data-animated="true">BitDegree</a>
						<ol start={SoloLearn.length + ProgrammingHub.length + FreeCodeCamp.length + 1}>
							<li>Introducing Coding for Beginners an HTML and CSS Online Course</li>
						</ol>
					</li>
				</ul>
				<button className="is-button" onClick={this.download.bind(this)}>
					<i className="fa fa-download"></i> Download a certificate
				</button>
			</div>
		}
	}
	seeGraphs() {
		const data = {
			"SoloLearn": Object.keys(this.state.SoloLearn.reduce((a, b) => ({ ...a, ...b }), {})).length,
			"Programming Hub": Object.keys(this.state.SoloLearn.reduce((a, b) => ({ ...a, ...b }), {})).length,
			"freeCodeCamp": this.state.FreeCodeCamp[this.maxPage - 1].length,
			"BitDegree": this.state.BitDegree[this.maxPage - 1].length
		};
		Swal.fire({
			title: `Total ${$("embed.certificate").length} <i class="fas fa-user-graduate"></i>`,
			html: "<div></div>",
			willOpen() {
				new PieChart(data).appendTo(Swal.getContent());
				new BarGraph("Certififcates", data).appendTo(Swal.getContent());
			},
			icon: "info",
			footer: "Powered by my own library&nbsp;<q>Graph.js</q>"
		});
	}
	download() {
		var inputOptions = {
			"certificates/BD_Introducing Coding for Beginners an HTML and CSS Online Course.pdf": "Introducing Coding for Beginners an HTML and CSS Online Course"
		};

		for (const lang in this.state.SoloLearn.reduce((a, b) => ({ ...a, ...b }), {})) {
			inputOptions[`certificates/SL_${lang}.pdf`] = lang.replace("Cs", "C#") + " Certificate by SoloLearn";
		}
		for (const lang in this.state.ProgrammingHub.reduce((a, b) => ({ ...a, ...b }), {})) {
			inputOptions[`certificates/PH_${lang}.pdf`] = lang.replace("Cs", "C#") + " Certificate by Programming Hub";
			if (this.state.ProgrammingHub[lang]) {
				inputOptions[`certificates/PH_${lang} Advanced.pdf`] = lang + " Advanced Certificate by Programming Hub";
			}
		}
		for (const lang of this.state.FreeCodeCamp[this.maxPage - 1]) {
			inputOptions[`certificates/FCC_${lang}.html`] = lang + " Certificate by freeCodeCamp";
		}

		Swal.fire({
			title: "Download a Certificate",
			input: "select",
			inputOptions,
			inputPlaceholder: "Select a Certificate",
			confirmButtonColor: "#60B656",
			confirmButtonText: '<i class="fa fa-download"></i> Download',
			showCancelButton: true,
			inputValidator(value) {
				return !value && "You must select a certificate";
			}
		}).then(result => {
			if (result.value) {
				var link = document.createElement("a");
				link.download = inputOptions[result.value].replace(/\s/g, "-") + ".pdf";
				link.href = result.value;
				link.type = "application/octet-stream";
				link.target = "_self";
				this._target.appendChild(link);
				link.dispatchEvent(new MouseEvent("click"));
			}
		});
	}
}

window.addEventListener("load", function () {
	ReactDOM.render(<Certificates />, $("#certificates div")[0]);
});