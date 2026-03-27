import { useState } from 'react';
import { 
  CreditCard, 
  RefreshCw, 
  Trash2, 
  Download, 
  Check,
  Copy,
  AlertCircle,
  Sparkles,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCardsContext } from '@/context/CardsContext';
import type { CardBrand } from '@/types';
import { toast } from 'sonner';

const cardBrands: { value: CardBrand; label: string }[] = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'discover', label: 'Discover' },
];

export function CardGenerator() {
  const { 
    cards, 
    isGenerating, 
    generateCards, 
    generateTestSet,
    removeCard, 
    clearCards, 
    exportCards,
    validateCard,
    selectedCards,
    toggleCardSelection,
    selectAllCards,
    deselectAllCards
  } = useCardsContext();

  const [brand, setBrand] = useState<CardBrand>('visa');
  const [first12Digits, setFirst12Digits] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [count, setCount] = useState(10);

  const handleGenerate = () => {
    if (first12Digits && first12Digits.length !== 12) {
      toast.error('Los primeros 12 dígitos deben tener exactamente 12 números');
      return;
    }
    
    const newCards = generateCards(count, brand, first12Digits || undefined, expiryMonth || undefined, expiryYear || undefined);
    toast.success(`${newCards.length} tarjetas generadas y seleccionadas para pruebas`);
  };

  const handleGenerateTest = () => {
    const testCards = generateTestSet();
    toast.success(`${testCards.length} tarjetas de prueba generadas y seleccionadas`);
  };

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('Número copiado al portapapeles');
  };

  const handleExport = () => {
    const data = exportCards();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarjetas-${Date.now()}.json`;
    a.click();
    toast.success('Tarjetas exportadas');
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'bg-blue-500';
      case 'mastercard': return 'bg-red-500';
      case 'amex': return 'bg-green-500';
      case 'discover': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Generador de Tarjetas (Algoritmo de Luhn)
          </CardTitle>
          <CardDescription className="text-slate-400">
            Genera tarjetas de prueba válidas automáticamente seleccionadas para las pruebas de pasarela
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Marca de Tarjeta</Label>
              <Select value={brand} onValueChange={(v) => setBrand(v as CardBrand)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {cardBrands.map((b) => (
                    <SelectItem key={b.value} value={b.value} className="text-slate-100">
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Primeros 12 dígitos (opcional)</Label>
              <Input
                placeholder="123456789012"
                value={first12Digits}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                  setFirst12Digits(val);
                }}
                maxLength={12}
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Mes Exp. (MM)</Label>
              <Input
                placeholder="12"
                value={expiryMonth}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setExpiryMonth(val);
                }}
                maxLength={2}
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Año Exp. (YY)</Label>
              <Input
                placeholder="25"
                value={expiryYear}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setExpiryYear(val);
                }}
                maxLength={2}
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-slate-300">Cantidad:</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                className="w-20 bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generar {count} Tarjetas
            </Button>
            
            <Button
              onClick={handleGenerateTest}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Tarjetas de Prueba
            </Button>
            
            {cards.length > 0 && (
              <>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                
                <Button
                  onClick={clearCards}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cards List */}
      {cards.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Tarjetas Generadas ({cards.length})
              </span>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  {selectedCards.size} Seleccionadas
                </Badge>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                  <Shield className="h-3 w-3 mr-1" />
                  {cards.filter(c => validateCard(c.number)).length} Válidas
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Las tarjetas seleccionadas se usarán automáticamente en las pruebas de pasarela
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Selection Controls */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={selectAllCards}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
              >
                <Check className="h-4 w-4 mr-1" />
                Seleccionar Todas
              </Button>
              <Button
                onClick={deselectAllCards}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Deseleccionar
              </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => toggleCardSelection(card.id)}
                  className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCards.has(card.id)
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getBrandColor(card.brand)}`} />
                  
                  {/* Selection Indicator */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center ${
                    selectedCards.has(card.id)
                      ? 'bg-green-500 border-green-500'
                      : 'border-slate-500 bg-slate-800'
                  }`}>
                    {selectedCards.has(card.id) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  
                  <div className="space-y-2 pt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono tracking-wider text-slate-100">
                        {card.formattedNumber}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(card.number);
                        }}
                        className="p-1 hover:bg-slate-600 rounded transition-colors"
                      >
                        <Copy className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Exp: {card.expiryMonth}/{card.expiryYear}</span>
                      <span>CVV: {card.cvv}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 capitalize">
                        {card.brand}
                      </Badge>
                      
                      {validateCard(card.number) ? (
                        <Badge className="bg-green-600/20 text-green-400 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Válida
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Inválida
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCard(card.id);
                    }}
                    className="absolute bottom-2 right-2 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {cards.length === 0 && (
        <Card className="border-slate-700 bg-slate-800/30">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No hay tarjetas generadas</h3>
            <p className="text-sm text-slate-500 mb-4">
              Genera tarjetas de prueba para comenzar las pruebas de pasarela
            </p>
            <Button onClick={handleGenerateTest} className="bg-blue-600 hover:bg-blue-700">
              <Shield className="h-4 w-4 mr-2" />
              Generar Tarjetas de Prueba
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
