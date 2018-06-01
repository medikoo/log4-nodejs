"use strict";

const clc                = require("cli-color/bare")
    , defaultSymbols     = require("log4/writer-utils/level-symbols")
    , colorsSupportLevel = require("../lib/colors-support-level");

const symbols = (() => {
	if (process.platform !== "win32" && colorsSupportLevel >= 2) return defaultSymbols;
	return {
		debug: "*",
		info: "i",
		notice: "→",
		warning: "‼",
		error: "×",
		critical: "█",
		alert: "⁂",
		emergency: "[█]"
	};
})();

if (!colorsSupportLevel) {
	module.exports = symbols;
	return;
}
const coloredSymbols = module.exports = {};
for (const [levelName, colorDecorator] of Object.entries({
	debug: clc.white,
	info: clc.blueBright,
	notice: clc.yellow,
	warning: clc.yellowBright,
	error: clc.redBright,
	critical: clc.redBright,
	alert: clc.redBright,
	emergency: clc.redBright
})) {
	coloredSymbols[levelName] = colorDecorator(symbols[levelName]);
}