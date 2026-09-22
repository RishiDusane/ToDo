import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
export default function AuthPage() {
    const [registerMode, setRegisterMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const error = useAuthStore((state) => state.error);
    const loading = useAuthStore((state) => state.loading);
    async function submit(event) {
        event.preventDefault();
        try {
            if (registerMode)
                await register(name, email, password);
            else
                await login(email, password);
        }
        catch { /* The store exposes the message below the form. */ }
    }
    return _jsxs("main", { className: "auth-shell", children: [_jsxs("div", { className: "auth-brand", children: [_jsx("span", { children: "TF" }), _jsx("strong", { children: "TaskFlow" })] }), _jsxs("section", { className: "auth-card", children: [_jsx("p", { className: "eyebrow", children: "Your focused workspace" }), _jsx("h1", { children: registerMode ? 'Create your account' : 'Welcome back' }), _jsx("p", { className: "auth-subtitle", children: registerMode ? 'Start planning work that feels possible.' : 'Pick up where you left off.' }), _jsxs("form", { className: "auth-form", onSubmit: submit, children: [registerMode && _jsxs("label", { children: [_jsx("span", { children: "Name" }), _jsxs("div", { className: "auth-input", children: [_jsx(UserRound, { size: 17 }), _jsx("input", { value: name, onChange: (event) => setName(event.target.value), placeholder: "Your name", required: true, minLength: 2 })] })] }), _jsxs("label", { children: [_jsx("span", { children: "Email" }), _jsxs("div", { className: "auth-input", children: [_jsx(Mail, { size: 17 }), _jsx("input", { type: "email", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "you@example.com", required: true })] })] }), _jsxs("label", { children: [_jsx("span", { children: "Password" }), _jsxs("div", { className: "auth-input", children: [_jsx(LockKeyhole, { size: 17 }), _jsx("input", { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "At least 8 characters", required: true, minLength: 8 })] })] }), error && _jsx("p", { className: "auth-error", children: error }), _jsx("button", { className: "button primary auth-submit", disabled: loading, children: loading ? 'Please wait...' : registerMode ? 'Create account' : 'Log in' })] }), _jsx("button", { className: "auth-switch", onClick: () => setRegisterMode(!registerMode), children: registerMode ? 'Already have an account? Log in' : 'New here? Create an account' }), _jsx("p", { className: "auth-note", children: "Your data is stored in the TaskFlow MySQL database." })] })] });
}
