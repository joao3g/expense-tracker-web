import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import authService from '../api/auth.service';

function Main() {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        try {
            const result = await authService.login(login, password);
            
            localStorage.setItem("token", result.token);
            return navigate("/group");
        } catch (error) {
            setError("Login e/ou senha incorretos!");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-gray-200 rounded py-6 px-8 flex flex-col justify-center items-center max-w-min gap-y-5">
                <h1>Minhas Finanças</h1>
                <Input 
                    type="text" 
                    label="Login" 
                    value={login} 
                    onChange={(e) => { setLogin(e.target.value); setError(""); }} 
                    onKeyDown={(e) => e.key === "Enter" ? handleLogin() : null}
                />

                <Input 
                    type="password" 
                    label="Senha" 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" ? handleLogin() : null}
                />

                <div className="flex flex-row gap-x-3">
                    <Button onClick={handleLogin}>Login</Button>
                    {/* <Button>Cadastrar</Button> */}
                </div>
                {error ? (
                    <span className="text-red-500 text-sm">{error}</span>
                ) : null}
            </div>
        </div>
    );
}

export default Main;
