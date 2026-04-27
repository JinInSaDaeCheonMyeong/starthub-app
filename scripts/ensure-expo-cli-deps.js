const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const rootNodeModules = path.join(projectRoot, "node_modules");
const cliNodeModules = path.join(
  rootNodeModules,
  "expo",
  "node_modules",
  "@expo",
  "cli",
  "node_modules"
);

const requiredPackages = ["fetch-nodeshim"];

function isValidPackageDir(dirPath) {
  return (
    fs.existsSync(dirPath) &&
    fs.existsSync(path.join(dirPath, "package.json")) &&
    fs.existsSync(path.join(dirPath, "dist"))
  );
}

function writeFetchNodeShim(target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });

  fs.writeFileSync(
    path.join(target, "package.json"),
    JSON.stringify(
      {
        name: "fetch-nodeshim",
        version: "0.4.10-shim",
        main: "index.js"
      },
      null,
      2
    ) + "\n"
  );

  fs.writeFileSync(
    path.join(target, "index.js"),
    `"use strict";

const requiredGlobals = [
  "fetch",
  "Blob",
  "URL",
  "URLSearchParams",
  "Request",
  "Response",
  "Headers",
  "FormData"
];

for (const key of requiredGlobals) {
  if (typeof globalThis[key] === "undefined") {
    throw new Error("Global " + key + " is required for the local fetch-nodeshim shim.");
  }
}

module.exports = {
  fetch: globalThis.fetch.bind(globalThis),
  Blob: globalThis.Blob,
  URL: globalThis.URL,
  URLSearchParams: globalThis.URLSearchParams,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  FormData: globalThis.FormData
};
`
  );

  console.log("[postinstall] created local fetch-nodeshim shim for Expo CLI");
}

function ensurePackage(packageName) {
  const source = path.join(rootNodeModules, packageName);
  const target = path.join(cliNodeModules, packageName);

  if (isValidPackageDir(target)) {
    return;
  }

  fs.mkdirSync(cliNodeModules, { recursive: true });

  if (packageName === "fetch-nodeshim" && !isValidPackageDir(source)) {
    writeFetchNodeShim(target);
    return;
  }

  try {
    fs.rmSync(target, { recursive: true, force: true });
    const relativeSource = path.relative(cliNodeModules, source);
    fs.symlinkSync(relativeSource, target, "junction");
    console.log(`[postinstall] linked ${packageName} into Expo CLI node_modules`);
  } catch (error) {
    // Fall back to copying in environments where symlinks are restricted.
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(source, target, { recursive: true });
    console.log(`[postinstall] copied ${packageName} into Expo CLI node_modules`);
  }
}

for (const packageName of requiredPackages) {
  ensurePackage(packageName);
}
