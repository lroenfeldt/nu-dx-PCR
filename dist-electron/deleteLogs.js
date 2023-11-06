"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const deleteLogs = () => {
  const folderPath = path__namespace.resolve(electron.app.getPath("userData"), "logs");
  fs__namespace.readdir(folderPath, (_err, files) => {
    files.forEach((file) => {
      const filePath = path__namespace.join(folderPath, file);
      fs__namespace.stat(filePath, (_err2, stats) => {
        const today = /* @__PURE__ */ new Date();
        const diffTime = Math.abs(today.getTime() - stats.birthtime.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        if (diffDays >= 30) {
          const filePath2 = path__namespace.join(folderPath, file);
          fs__namespace.promises.unlink(filePath2);
        }
      });
    });
  });
};
exports.deleteLogs = deleteLogs;
