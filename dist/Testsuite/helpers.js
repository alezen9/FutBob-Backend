"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorRegEx = exports.ShouldFail = exports.ShouldSucceed = void 0;
const ResetColor = '\x1b[0m';
const FgGreen = '\x1b[32m';
const FgRed = '\x1b[31m';
exports.ShouldSucceed = `${FgGreen}Should succeed ⇩${ResetColor}`;
exports.ShouldFail = `${FgRed}Should fail ⇩${ResetColor}`;
exports.validationErrorRegEx = /^Field.*required.*was\snot\sprovided\.$/;
//# sourceMappingURL=helpers.js.map