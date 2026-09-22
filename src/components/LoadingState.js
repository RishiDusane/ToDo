import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LoadingState({ message = 'Loading your workspace...' }) {
    return _jsxs("div", { className: "loading-state", children: [_jsx("span", { className: "spinner" }), _jsx("p", { children: message })] });
}
