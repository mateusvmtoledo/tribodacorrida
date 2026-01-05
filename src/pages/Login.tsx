import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const cat = (window as any).catalyst;
    
    if (cat && cat.auth) {
      // Função auxiliar para desenhar o login
      const renderLoginForm = () => {
        try {
          cat.auth.signIn("login-container", {
             is_customize_forgot_password: true,
             forgot_password_id: "forgot-password-container"
          });
        } catch (e) {
          console.error("Erro ao desenhar iframe:", e);
        }
      };

      cat.auth.isUserAuthenticated()
        .then((result: any) => {
          if (result.content) {
            navigate('/torredecontrole');
          } else {
            renderLoginForm();
          }
        })
        .catch((err: any) => {
          // SE DER ERRO (Net Issue), TENTA MOSTRAR O LOGIN MESMO ASSIM
          console.error("Erro Auth (Tentando renderizar forçado):", err);
          
          if (err?.code === 700) {
             toast({ 
               title: "Alerta de Conexão", 
               description: "Verifique se o localhost está autorizado no Console do Catalyst ou desligue o AdBlock.",
               variant: "destructive"
             });
          }
          renderLoginForm();
        });
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
          <div id="login-container" className="min-h-[350px]"></div>
          <div id="forgot-password-container" className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;