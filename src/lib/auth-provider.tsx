
// src/lib/auth-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from './api';
import { type User } from './data';
import { getUser, mapUser } from './services';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await apiPost('logout', {});
    } catch (error) {
      console.error('Logout via API falhou, procedendo com logout local.', error);
    } finally {
      // Garante a limpeza completa e o redirecionamento
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      setToken(null);
      setUser(null);
      // Força o redirecionamento para a página inicial para evitar estados inconsistentes
      router.push('/'); 
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      if (storedToken && storedUserId) {
        setToken(storedToken);

        try {
          const userData = await getUser(storedUserId);

          if (!mounted) return;
          if (!userData) {
            console.error('Falha ao carregar dados do usuário, limpando sessão.');
            await logout(); // Usa a função de logout centralizada
            return;
          }

          setUser(userData);
        } catch (error) {
          console.error('Falha crítica ao inicializar autenticação, limpando sessão.', error);
          await logout(); // Usa a função de logout centralizada
        }
      }
      if (mounted) setIsLoading(false);
    };

    initializeAuth();
    return () => { mounted = false; };
  }, [logout]); // Adiciona logout como dependência

  const handleAuthSuccess = (response: any) => {
    // CORREÇÃO: O backend agora retorna a estrutura dentro de um `data` aninhado
    const apiResponse = response.data || response;
    const apiUser = apiResponse.user;
    const apiToken = apiResponse.token;
    
    const mappedUser = mapUser(apiUser);
    localStorage.setItem('authToken', apiToken);
    localStorage.setItem('userId', mappedUser.id.toString());
    setToken(apiToken);
    setUser(mappedUser);
  };
  
  const refreshUser = useCallback(async () => {
    if (!user?.id) {
        console.warn("Tentativa de atualizar usuário sem um usuário logado.");
        return;
    }
    try {
        const updatedUserData = await getUser(user.id);
        if (updatedUserData) {
            setUser(updatedUserData);
        }
    } catch (error) {
        console.error("Falha ao atualizar os dados do usuário:", error);
    }
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    // CRÍTICO: Alterado 'senha' para 'password' para corresponder ao novo AuthController
    const response = await apiPost<any>('login', {
      email,
      password: password,
      device_name: 'browser',
    });
    handleAuthSuccess(response);
  };

  const register = async (data: Record<string, any>) => {
    // O payload é enviado diretamente como o backend espera.
    await apiPost('users', data);
    await login(data.email, data.password);
  };

  const value = { user, token, isLoading, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
