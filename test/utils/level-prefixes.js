"use strict";

const test            = require("tape")
    , requireUncached = require("cjs-module/require-uncached")
    , overrideEnv     = require("process-utils/override-env");

const resolveUncached = callback => {
	const { restoreEnv } = overrideEnv();
	try {
		return requireUncached(
			[
				require.resolve("../../utils/level-prefixes"), require.resolve("supports-color"),
				require.resolve("../../lib/colors-support-level")
			],
			callback
		);
	}
	finally { restoreEnv(); }
};

test("levelPrefixes", t => {
	t.test("Should expose map of prefixes in modern colorful environment", t => {
		const levelPrefixes = resolveUncached(() => {
			const platformCache = process.platform;
			Object.defineProperty(process, "platform", { value: "darwin" });
			require("supports-color").stderr = { level: 2 };
			const result = require("../../utils/level-prefixes");
			Object.defineProperty(process, "platform", { value: platformCache });
			return result;
		});
		t.equal(typeof levelPrefixes.info, "string");
		t.equal(typeof levelPrefixes.alert, "string");
		t.end();
	});
	t.test("Should expose map of prefixes in limited colorful environment", t => {
		const levelPrefixes = resolveUncached(() => {
			const platformCache = process.platform;
			Object.defineProperty(process, "platform", { value: "win32" });
			require("supports-color").stderr = { level: 2 };
			const result = require("../../utils/level-prefixes");
			Object.defineProperty(process, "platform", { value: platformCache });
			return result;
		});
		t.equal(typeof levelPrefixes.info, "string");
		t.equal(typeof levelPrefixes.alert, "string");
		t.end();
	});
	t.test("Should expose map of prefixes in colorfless environment", t => {
		const levelPrefixes = resolveUncached(() => {
			require("supports-color").stderr = false;
			return require("../../utils/level-prefixes");
		});
		t.equal(typeof levelPrefixes.info, "string");
		t.equal(typeof levelPrefixes.alert, "string");
		t.end();
	});
	t.end();
});
