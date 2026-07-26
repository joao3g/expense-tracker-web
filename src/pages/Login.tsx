import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import * as authService from '../api/services/auth.service';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '../components/Icon';
import { Badge } from '../components/Badge';
import { Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';

function Main() {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const authContext = useAuth();
    const { addToast } = useToast();

    async function handleLogin() {
        try {
            const result = await authService.login(login, password);

            authContext.login(result.token, result.user);
            return navigate("/dashboard");
        } catch (error) {
            addToast("Login e/ou senha incorretos!", "error");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <div className="flex flex-1 justify-center">
                <div className="flex flex-col justify-center w-100 items-center gap-y-5">
                    <div className="flex w-full items-center gap-3 mb-6">
                        <Icon size={20} />
                        <span className="font-[600] text-md">Expense Tracker</span>
                    </div>

                    <div className="flex flex-col w-full">
                        <span className="font-[600] text-xl">Bem-vindo de volta</span>
                        <span className="text-sm text-neutral-600">Faça login para gerenciar suas finanças.</span>
                    </div>

                    <Input
                        type="text"
                        label="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? handleLogin() : null}
                    />

                    <Input
                        type="password"
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? handleLogin() : null}
                    />

                    <div className="flex flex-row gap-x-3 flex-1 w-full">
                        <Button
                            variant="primary"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </div>

                    <span className="text-neutral-600 text-xs">Ainda não tem conta? <span className="text-green-700 font-bold cursor-pointer" onClick={() => navigate("/components")}>Criar conta</span></span>
                </div>
            </div>
            <div className="flex flex-1 justify-center bg-radial-[at_0%_90%] from-transparent from-10% via-green-600/12 to-transparent to-90% h-screen">
                <div className="flex flex-col justify-center w-120 items-center gap-y-5">
                    <div className="flex w-full">
                        <Badge color="#fff">
                            <div className="flex gap-2">
                                <Sparkles size={16} color="green" />
                                Compartilhe com a família
                            </div>
                        </Badge>
                    </div>

                    <div className="flex flex-col w-full">
                        <h3 className="text-xl font-[600]">Finanças pessoais & compartilhadas.</h3>
                        <span className="text-neutral-600 text-sm">Mapeie cada despesa, compartilhe com seu grupo e veja seu balanço crescer — tudo em um único lugar.</span>
                    </div>

                    <div className="flex flex-col w-full bg-white p-6 shadow-lg rounded-3xl">
                        <div className="flex justify-between w-full text-neutral-600 text-sm">
                            <span>Balanço</span>
                            <span>+24.6%</span>
                        </div>

                        <div className="flex justify-between w-full">
                            <span className="text-3xl font-bold text-emerald-600">R$3.896,00</span>
                        </div>

                        <div className="flex justify-between items-end w-full mt-8 gap-2">
                            <div className="flex flex-1 h-13 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-8 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-10 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-16 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-12 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-10 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-8 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-10 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-4 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-8 rounded-2xl bg-emerald-600" />
                            <div className="flex flex-1 h-16 rounded-2xl bg-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
