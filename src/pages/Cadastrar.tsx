import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Link as LinkIcon, User, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { addRaceToDb } from '@/services/raceService';

// Opções de distâncias disponíveis
const DISTANCES_OPTIONS = [
  { id: "3k", label: "3 km" },
  { id: "5k", label: "5 km" },
  { id: "10k", label: "10 km" },
  { id: "15k", label: "15 km" },
  { id: "21k", label: "Meia Maratona (21k)" },
  { id: "42k", label: "Maratona (42k)" },
  { id: "ultra", label: "Ultramaratona" },
  { id: "caminhada", label: "Caminhada" },
];

// Schema de validação Zod (Regras do Formulário)
const formSchema = z.object({
  eventName: z.string().min(3, "Nome muito curto (mínimo 3 letras)"),
  dateRun: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Use sigla de 2 letras (ex: SP)"),
  organizer: z.string().min(2, "Organizador obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  
  // O link deve ser uma URL válida para o banco aceitar
  link: z.string().url("Link inválido. Deve começar com http:// ou https://"),
  
  description: z.string().min(10, "Descreva o evento (mínimo 10 caracteres)"),
  distances: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Selecione pelo menos uma distância.",
  }),
});

const Cadastrar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inicialização do Hook Form com valores padrão
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      dateRun: "",
      city: "",
      state: "",
      organizer: "",
      email: "",
      link: "",
      description: "",
      distances: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("📝 [Formulário] Validação OK. Enviando:", values);
    setIsLoading(true);
    
    try {
      const distanceString = values.distances.join(', ');

      // AQUI ESTAVA O ERRO: Faltavam campos obrigatórios da Interface Race.
      // Agora enviamos valores padrão para satisfazer o TypeScript.
      await addRaceToDb({
        name: values.eventName,
        date: values.dateRun,
        city: values.city,
        state: values.state.toUpperCase(),
        organizer: values.organizer,
        email: values.email || "", // Garante string vazia se for undefined
        description: values.description,
        link: values.link,
        distances: distanceString,
        
        // --- CORREÇÃO: Campos obrigatórios preenchidos automaticamente ---
        type: 'rua', // Padrão 'rua' (Street Run) já que não perguntamos no form
        price: 0,    // Padrão 0 (Preço sob consulta/não informado)
        location: `${values.city}, ${values.state.toUpperCase()}`, // Monta a Location
        // ---------------------------------------------------------------

        image: "", 
        approved: false,
        hasResults: false
      });

      console.log("🎉 [Formulário] Sucesso!");
      setIsSubmitted(true);
      toast({ 
        title: "Sucesso!", 
        description: "Evento enviado para a Torre de Controle.",
        className: "bg-green-600 text-white"
      });
      
      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      console.error("❌ [Formulário] Erro:", error);
      toast({
        title: "Erro ao salvar",
        description: "Erro de conexão ou dados inválidos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Tela de Sucesso
  if (isSubmitted) {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Cadastro Enviado!</h2>
          <p className="text-gray-600 mb-6">Sua corrida foi enviada para análise e em breve estará no calendário.</p>
          <Button onClick={() => navigate('/')} variant="outline">Voltar para Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-secondary/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Cadastrar Corrida</h1>
          <p className="text-muted-foreground">Preencha os dados oficiais do evento.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Linha 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Evento</FormLabel>
                      <FormControl><Input placeholder="Ex: Corrida de Verão" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRun"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input maxLength={2} placeholder="SP" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Linha 3 - Distâncias */}
              <FormField
                control={form.control}
                name="distances"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Distâncias</FormLabel>
                      <FormDescription>Selecione ao menos uma.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {DISTANCES_OPTIONS.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="distances"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white hover:bg-gray-50 cursor-pointer"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full text-sm">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Linha 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizador</FormLabel>
                      <FormControl>
                          <div className="relative">
                           <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                           <Input className="pl-9" {...field} />
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Linha 5 - Link */}
               <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link de Inscrição <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="https://..." {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Cole o link completo do site oficial.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              {/* Linha 6 - Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl><Textarea className="h-32" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full btn-gradient font-bold text-lg h-12" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando dados...
                    </>
                ) : 'Enviar Cadastro'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Cadastrar;