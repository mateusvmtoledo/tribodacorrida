import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle, TrendingUp, MapPin, 
  Calendar, Edit, Save, Trophy, Camera, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Race } from '@/lib/races-data';
// Importamos as funções reais do Service
import { fetchRacesFromDb, updateRaceInDb, deleteRaceFromDb } from '@/services/raceService';

const TorreDeControle = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  // Estados dos dados REAIS
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Race>>({});

  // 1. Segurança e SEO (Noindex)
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // 2. Carregar dados ao entrar
  useEffect(() => {
    if (isAuthenticated) {
      loadRaces();
    }
  }, [isAuthenticated]);

  const loadRaces = async () => {
    setIsLoading(true);
    const data = await fetchRacesFromDb();
    setRaces(data);
    setIsLoading(false);
  };

  const handleLogin = () => {
    if (password === 'miews') {
      setIsAuthenticated(true);
      toast({ title: "Acesso autorizado", description: "Conectando ao banco de dados..." });
    } else {
      toast({ title: "Acesso negado", variant: "destructive" });
    }
  };

  // Aprovar Corrida
  const handleApprove = async (id: string) => {
    try {
      await updateRaceInDb(id, { approved: true } as any);
      toast({ title: "Corrida Aprovada!", description: "Já deve aparecer no site oficial." });
      loadRaces(); // Recarrega a lista
    } catch (error) {
      toast({ title: "Erro ao aprovar", variant: "destructive" });
    }
  };

  // Rejeitar/Deletar Corrida
  const handleReject = async (id: string) => {
    if(!confirm("Tem certeza que deseja excluir permanentemente?")) return;
    try {
      await deleteRaceFromDb(id);
      toast({ title: "Corrida Excluída", variant: "destructive" });
      loadRaces();
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  // Salvar Edição (Resultados/Fotos)
  const handleSaveEdit = async (id: string) => {
    try {
      await updateRaceInDb(id, editForm);
      setEditingId(null);
      toast({ title: "Alterações salvas" });
      loadRaces();
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const startEdit = (race: Race) => {
    setEditingId(race.id);
    setEditForm(race);
  };

  // Filtros Calculados
  const pendingRaces = races.filter(r => !r.approved);
  const approvedRaces = races.filter(r => r.approved);
  // Passadas = Aprovadas E data anterior a hoje
  const historyRaces = approvedRaces.filter(r => new Date(r.date) < new Date());
  // Futuras = Aprovadas E data futura
  const futureRaces = approvedRaces.filter(r => new Date(r.date) >= new Date());

  const stats = {
    total: races.length,
    pending: pendingRaces.length,
    past: historyRaces.length,
    states: new Set(races.map(r => r.state)).size
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">ACESSO RESTRITO</h1>
          <div className="flex gap-2">
            <Input 
              type="password" 
              placeholder="Código de acesso" 
              className="bg-gray-800 border-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} variant="destructive">Entrar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="container mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Torre de Controle</h1>
            <p className="text-muted-foreground">
              {isLoading ? "Sincronizando com satélite..." : "Sistema Online"}
            </p>
          </div>
          <Button variant="outline" onClick={() => loadRaces()}>
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Atualizar Dados"}
          </Button>
        </div>

        {/* Dashboards Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total DB</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Para Aprovar</CardTitle>
              <ShieldAlert className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Resultados</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {/* Quantas do passado ainda não têm link de foto ou resultado */}
              <div className="text-2xl font-bold text-blue-600">
                {historyRaces.filter(r => !r.hasResults).length}
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abrangência</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.states}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Aprovação Pendente 
              {stats.pending > 0 && <Badge className="ml-2 bg-red-500">{stats.pending}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="management">Gestão (Futuras)</TabsTrigger>
            <TabsTrigger value="history">Histórico & Resultados</TabsTrigger>
          </TabsList>

          {/* ABA: PENDENTES */}
          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6">
                {pendingRaces.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-300 mb-2" />
                    <p>Nenhuma solicitação pendente.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRaces.map((race) => (
                        <TableRow key={race.id}>
                          <TableCell className="font-medium">{race.name}</TableCell>
                          <TableCell>{new Date(race.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{race.city}/{race.state}</TableCell>
                          <TableCell className="max-w-[150px] truncate text-xs text-blue-500">
                            <a href={race.link} target="_blank" rel="noreferrer">{race.link}</a>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(race.id)}>
                              Aprovar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(race.id)}>
                              Rejeitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: GESTÃO (Editar Futuras) */}
          <TabsContent value="management">
            <Card>
              <CardContent className="pt-6">
                 <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead className="text-right">Editar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {futureRaces.map((race) => (
                        <TableRow key={race.id}>
                          <TableCell>{race.name}</TableCell>
                          <TableCell>{new Date(race.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{race.city}-{race.state}</TableCell>
                          <TableCell className="text-right">
                            {/* Aqui poderia abrir um modal de edição completa */}
                            <Button variant="ghost" size="sm" disabled>Em breve</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: HISTÓRICO (Adicionar Resultados) */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Pós-Prova</CardTitle>
                <p className="text-sm text-muted-foreground">Adicione links de fotos e resultados.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historyRaces.map((race) => (
                    <div key={race.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-white shadow-sm gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{race.name}</h3>
                          <Badge variant="secondary">Realizada</Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="h-3 w-3" /> {new Date(race.date).toLocaleDateString('pt-BR')} • {race.city}-{race.state}
                        </p>
                      </div>

                      {editingId === race.id ? (
                        <div className="flex flex-col gap-2 w-full md:w-1/2 bg-gray-50 p-3 rounded border">
                          <label className="text-xs font-bold text-gray-600">Link Resultados</label>
                          <Input 
                            value={editForm.photosLink || ''} 
                            onChange={(e) => setEditForm({...editForm, photosLink: e.target.value, hasResults: true})}
                            placeholder="https://resultados..."
                          />
                          <div className="flex gap-2 justify-end mt-2">
                             <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                             <Button size="sm" onClick={() => handleSaveEdit(race.id)}>
                               <Save className="h-4 w-4 mr-2" /> Salvar
                             </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end gap-1">
                             {race.photosLink ? (
                               <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Trophy className="h-3 w-3 mr-1"/> Com Resultados</Badge>
                             ) : (
                               <Badge variant="outline" className="text-gray-400">Pendente</Badge>
                             )}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => startEdit(race)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TorreDeControle;