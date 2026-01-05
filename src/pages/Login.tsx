import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Acessa o objeto global do Catalyst
    const cat = (window as any).catalyst;
    
    if (cat && cat.auth) {
      // 1. Verifica se já está logado
      cat.auth.isUserAuthenticated().then((result: any) => {
        if (result.content) {
          navigate('/torredecontrole');
        } else {
          // 2. SE NÃO ESTIVER LOGADO: Desenha o formulário
          // O primeiro argumento "login-container" tem de ser IGUAL ao id da div lá em baixo
          cat.auth.signIn("login-container", {
             // Configurações opcionais
             is_customize_forgot_password: true,
             forgot_password_id: "forgot-password-container"
          });
        }
      }).catch((err: any) => {
        console.error("Erro no Catalyst Auth:", err);
      });
    } else {
      console.error("Catalyst SDK não encontrado no window.");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 pb-20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle>Acesso Restrito</CardTitle>
          <p className="text-sm text-muted-foreground">Tribo da Corrida</p>
        </CardHeader>
        <CardContent>
          {/* O Catalyst vai injetar o iframe AQUI dentro */}
          {/* O ID aqui deve bater com o do useEffect */}
          <div id="login-container" className="min-h-[350px]"></div>
          
          {/* Container para "Esqueci a senha" */}
          <div id="forgot-password-container" className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;