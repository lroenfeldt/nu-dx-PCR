document.addEventListener("DOMContentLoaded", function () {
	// Création des éléments
	const body = document.body;

	// Configuration du body
	body.style.height = "300px";
	body.style.width = "500px";
	body.style.display = "flex";
	body.style.flexDirection = "column";
	body.style.justifyContent = "center";
	body.style.alignItems = "center";
	body.style.backgroundColor = "rgb(1, 21, 60)";
	body.style.overflow = "hidden";
	body.style.fontFamily = "sans-serif";
	body.style.color = "white";
	body.style.margin = "0 auto";

	const bodyAfter = document.createElement("div");
	bodyAfter.style.content = "";
	bodyAfter.style.position = "absolute";
	bodyAfter.style.height = "120%";
	bodyAfter.style.width = "100%";
	bodyAfter.style.left = "0%";
	bodyAfter.style.top = "0";
	bodyAfter.style.backgroundImage = "url('./DNA-Helix.png')";
	bodyAfter.style.backgroundSize = "contain";
	bodyAfter.style.backgroundRepeat = "no-repeat";
	bodyAfter.style.zIndex = "-1";
	bodyAfter.style.opacity = "0.1";
	body.appendChild(bodyAfter);

	const title = document.createElement("div");
	title.className = "title";
	title.style.display = "flex";
	title.style.alignItems = "flex-end";
	title.style.marginBottom = "20px";

	const h1 = document.createElement("h1");
	h1.style.margin = "0 10px 0 0";
	h1.style.padding = "0";
	title.appendChild(h1);

	const logoImg = document.createElement("img");
	logoImg.src = "./nu-dx PCR Logo white.png";
	logoImg.alt = "logo";
	logoImg.style.height = "50px";
	logoImg.style.marginRight = "10px";
	logoImg.style.maxWidth = "100%";
	logoImg.style.width = "300px";
	title.appendChild(logoImg);

	body.appendChild(title);

	const updateStatusDiv = document.createElement("div");
	updateStatusDiv.className = "updateStatus";

	const updateMessageSpan = document.createElement("span");
	updateMessageSpan.id = "updateMessage";
	updateMessageSpan.innerText = "Initializing...";
	updateStatusDiv.appendChild(updateMessageSpan);

	body.appendChild(updateStatusDiv);

	const nuDxImg = document.createElement("img");
	nuDxImg.className = "nu-dx";
	nuDxImg.src = "./nu-diagnostics white.png";
	nuDxImg.alt = "nu-diagnostics";
	nuDxImg.width = "150";
	body.appendChild(nuDxImg);

	const versionNumberSpan = document.createElement("span");
	versionNumberSpan.id = "versionNumber";
	versionNumberSpan.innerText = "Test";
	body.appendChild(versionNumberSpan);

	// Scripts
	const getVersion = async () => {
		const version = await window.api.getVersion();
		const versionElement = document.getElementById("versionNumber");
		versionElement.innerText = "v" + version;
	};
	getVersion();

	window.api.updateStatus((event, message) => {
		const messageElement = document.getElementById("updateMessage");
		messageElement.innerText = message;
	});
});
