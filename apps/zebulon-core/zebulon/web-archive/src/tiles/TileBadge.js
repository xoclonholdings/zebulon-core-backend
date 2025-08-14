"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TileBadge;
function TileBadge(_a) {
    var label = _a.label, status = _a.status;
    return (<span className={"tile-badge ".concat(status)} title={label} aria-label={"Update status: ".concat(label)}>
      {label}
    </span>);
}
