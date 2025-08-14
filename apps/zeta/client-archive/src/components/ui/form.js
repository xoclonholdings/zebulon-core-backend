"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormField = exports.FormMessage = exports.FormDescription = exports.FormControl = exports.FormLabel = exports.FormItem = exports.Form = exports.useFormField = void 0;
var React = require("react");
var react_slot_1 = require("@radix-ui/react-slot");
var react_hook_form_1 = require("react-hook-form");
var utils_1 = require("@/lib/utils");
var label_1 = require("@/components/ui/label");
var Form = react_hook_form_1.FormProvider;
exports.Form = Form;
var FormFieldContext = React.createContext({});
var FormField = function (_a) {
    var props = __rest(_a, []);
    return (<FormFieldContext.Provider value={{ name: props.name }}>
      <react_hook_form_1.Controller {...props}/>
    </FormFieldContext.Provider>);
};
exports.FormField = FormField;
var useFormField = function () {
    var fieldContext = React.useContext(FormFieldContext);
    var itemContext = React.useContext(FormItemContext);
    var _a = (0, react_hook_form_1.useFormContext)(), getFieldState = _a.getFieldState, formState = _a.formState;
    var fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    var id = itemContext.id;
    return __assign({ id: id, name: fieldContext.name, formItemId: "".concat(id, "-form-item"), formDescriptionId: "".concat(id, "-form-item-description"), formMessageId: "".concat(id, "-form-item-message") }, fieldState);
};
exports.useFormField = useFormField;
var FormItemContext = React.createContext({});
var FormItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var id = React.useId();
    return (<FormItemContext.Provider value={{ id: id }}>
      <div ref={ref} className={(0, utils_1.cn)("space-y-2", className)} {...props}/>
    </FormItemContext.Provider>);
});
exports.FormItem = FormItem;
FormItem.displayName = "FormItem";
var FormLabel = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var _b = useFormField(), error = _b.error, formItemId = _b.formItemId;
    return (<label_1.Label ref={ref} className={(0, utils_1.cn)(error && "text-destructive", className)} htmlFor={formItemId} {...props}/>);
});
exports.FormLabel = FormLabel;
FormLabel.displayName = "FormLabel";
var FormControl = React.forwardRef(function (_a, ref) {
    var props = __rest(_a, []);
    var _b = useFormField(), error = _b.error, formItemId = _b.formItemId, formDescriptionId = _b.formDescriptionId, formMessageId = _b.formMessageId;
    return (<react_slot_1.Slot ref={ref} id={formItemId} aria-describedby={!error
            ? "".concat(formDescriptionId)
            : "".concat(formDescriptionId, " ").concat(formMessageId)} aria-invalid={!!error} {...props}/>);
});
exports.FormControl = FormControl;
FormControl.displayName = "FormControl";
var FormDescription = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var formDescriptionId = useFormField().formDescriptionId;
    return (<p ref={ref} id={formDescriptionId} className={(0, utils_1.cn)("text-sm text-muted-foreground", className)} {...props}/>);
});
exports.FormDescription = FormDescription;
FormDescription.displayName = "FormDescription";
var FormMessage = React.forwardRef(function (_a, ref) {
    var _b;
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    var _c = useFormField(), error = _c.error, formMessageId = _c.formMessageId;
    var body = error ? String((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "") : children;
    if (!body) {
        return null;
    }
    return (<p ref={ref} id={formMessageId} className={(0, utils_1.cn)("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>);
});
exports.FormMessage = FormMessage;
FormMessage.displayName = "FormMessage";
