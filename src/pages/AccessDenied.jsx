import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AccessDeniedPage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-destructive" />
          </div>
          <CardTitle>Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar este recurso. (403)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {user?.role === 'operational' ? 
              'Entre em contato com o administrador da empresa para solicitar acesso.' :
              'Se acredita que isso é um erro, entre em contato com o administrador.'
            }
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => setLocation('/')} 
              className="w-full"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Dashboard
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="w-full"
              data-testid="button-logout-denied"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Fazer Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
