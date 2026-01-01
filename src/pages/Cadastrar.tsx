import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { raceTypes, distances, states, citiesByState } from '@/lib/races-data';

interface Coupon {
  id: string;
  code: string;
  discount: string;
}

const Cadastrar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    distance: '',
    date: '',
    state: '',
    city: '',
    location: '',
    organizer: '',
    description: '',
    price: '',
    imageUrl: '',
    isFree: false,
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });

  const showDistance = ['rua', 'trilha', 'hibrida', 'ultramaratona'].includes(formData.type);
  const cities = formData.state && citiesByState[formData.state] ? citiesByState[formData.state] : [];

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset city when state changes
    if (field === 'state') {
      setFormData((prev) => ({ ...prev, city: '' }));
    }
    
    // Reset price if free
    if (field === 'isFree' && value === true) {
      setFormData((prev) => ({ ...prev, price: '0' }));
    }
  };

  const addCoupon = () => {
    if (newCoupon.code && newCoupon.discount) {
      setCoupons((prev) => [
        ...prev,
        { id: Date.now().toString(), ...newCoupon },
      ]);
      setNewCoupon({ code: '', discount: '' });
    }
  };

  const removeCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.type || !formData.date || !formData.state || !formData.city) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Simular envio
    toast({
      title: 'Corrida cadastrada com sucesso!',
      description: 'Sua corrida foi enviada para aprovação e em breve estará disponível.',
    });

    // Redirecionar para resultados
    setTimeout(() => {
      navigate('/resultados');
    }, 2000);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Cadastrar <span className="gradient-text">Corrida</span>
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados do seu evento para que corredores de todo o Brasil possam encontrá-lo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Informações do Evento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome da Corrida *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Maratona de São Paulo 2025"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Corrida *</Label>
                <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {raceTypes.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        {rt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={!showDistance ? 'opacity-50' : ''}>
                <Label htmlFor="distance">Distância</Label>
                <Select
                  value={formData.distance}
                  onValueChange={(v) => handleChange('distance', v)}
                  disabled={!showDistance}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione a distância" />
                  </SelectTrigger>
                  <SelectContent>
                    {distances.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Data do Evento *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizador</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => handleChange('organizer', e.target.value)}
                  placeholder="Nome do organizador"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Localização</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="state">Estado *</Label>
                <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(v) => handleChange('city', v)}
                  disabled={cities.length === 0}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location">Local de Largada</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Ex: Av. Paulista, 1000"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Valor e Cupons */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Valor e Cupons</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFree" className="text-base">Evento Gratuito</Label>
                  <p className="text-sm text-muted-foreground">Marque se o evento for gratuito</p>
                </div>
                <Switch
                  id="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(v) => handleChange('isFree', v)}
                />
              </div>

              {!formData.isFree && (
                <div className="max-w-xs">
                  <Label htmlFor="price">Valor da Inscrição (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0,00"
                    className="mt-2"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              {/* Cupons */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-4">Cupons de Desconto</h3>
                
                {coupons.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <span className="font-mono font-semibold">{coupon.code}</span>
                          <span className="text-muted-foreground ml-2">- {coupon.discount}% OFF</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCoupon(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="CODIGO"
                    className="max-w-[150px] font-mono"
                  />
                  <Input
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon((prev) => ({ ...prev, discount: e.target.value }))}
                    placeholder="% desconto"
                    className="max-w-[120px]"
                    min="1"
                    max="100"
                  />
                  <Button type="button" variant="outline" onClick={addCoupon}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Descrição</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="description">Descrição do Evento</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descreva seu evento, diferenciais, estrutura oferecida..."
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL da Imagem de Capa</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-gradient">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cadastrar Corrida
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Cadastrar;
