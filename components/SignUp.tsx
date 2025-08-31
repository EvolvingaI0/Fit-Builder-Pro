
import React, { useState } from 'react';
import Button from './common/Button';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import Logo from './common/Logo';

interface SignUpProps {
    onNavigateToLogin: () => void;
    onNavigateToHome: () => void;
}

function SignUp({ onNavigateToLogin, onNavigateToHome }: SignUpProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        try {
            signUp(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        }
    };
    
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-surface">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 order-2 md:order-1">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-4xl font-bold text-text-primary">Crie sua conta</h1>
              <p className="text-text-secondary mt-2">Comece sua jornada para uma vida mais saudável hoje.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="font-semibold text-text-secondary mb-2 block">Email</label>
                  <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"/>
                      <input 
                        type="email" 
                        placeholder="seuemail@exemplo.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition" 
                        required
                      />
                  </div>
               </div>
               <div>
                  <label className="font-semibold text-text-secondary mb-2 block">Senha</label>
                  <div className="relative">
                       <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"/>
                      <input 
                        type="password" 
                        placeholder="********" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition" 
                        required
                      />
                  </div>
               </div>
                <div>
                  <label className="font-semibold text-text-secondary mb-2 block">Confirmar Senha</label>
                  <div className="relative">
                       <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"/>
                      <input 
                        type="password" 
                        placeholder="********" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition" 
                        required
                      />
                  </div>
               </div>
               {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
               <Button type="submit" className="w-full py-3.5 text-lg">Criar Conta</Button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-8">
                Já tem uma conta? <span onClick={onNavigateToLogin} className="font-semibold text-primary cursor-pointer hover:underline">Faça login.</span>
            </p>
            <p className="text-center text-sm text-text-secondary mt-4">
                <span onClick={onNavigateToHome} className="font-semibold text-gray-500 cursor-pointer hover:underline">Voltar para a página inicial</span>
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-primary flex justify-center items-center p-8 order-1 md:order-2">
          <div className="text-center text-white">
            <Logo className="w-24 h-24 mx-auto" />
            <h2 className="text-5xl font-bold mt-4">FitBuilder Pro</h2>
            <p className="mt-4 text-primary-content/80 max-w-sm">Sua jornada para uma vida mais saudável começa com um plano inteligente.</p>
          </div>
        </div>
      </div>
    );
};

export default SignUp;
