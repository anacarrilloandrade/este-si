import { useState } from 'react';
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Server,
  FormInput,
  Activity,
  Shield,
  Trash2,
  CreditCard,
  Zap,
  Lock,
  Check,
  RefreshCw,
  Info,
  ArrowRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useGateway } from '@/hooks/useGateway';
import { useCardsContext } from '@/context/CardsContext';
import { toast } from 'sonner';

export function GatewayTester() {
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  
  const { 
    cards, 
    selectedCards, 
    toggleCardSelection, 
    selectAllCards, 
    deselectAllCards 
  } = useCardsContext();
  
  const { 
    responses, 
    isTesting, 
    connectionStatus, 
    detectedForm,
    currentGatewayUrl,
    testConnection, 
    detectForm, 
    testMultipleCards,
    clearResponses 
  } = useGateway();

  const handleTestConnection = async () => {
    if (!gatewayUrl.trim()) {
      toast.error('Ingresa la URL de la pasarela de pago');
      return;
    }
    
    let urlToTest = gatewayUrl.trim();
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = 'https://' + urlToTest;
      setGatewayUrl(urlToTest);
    }
    
    const success = await testConnection(urlToTest);
    if (success) {
      toast.success('Conexión exitosa con la pasarela');
    } else {
      toast.error('Error de conexión con la pasarela');
    }
  };

  const handleDetectForm = async () => {
    if (!gatewayUrl.trim()) {
      toast.error('Ingresa la URL de la pasarela de pago');
      return;
    }
    
    let urlToTest = gatewayUrl.trim();
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = 'https://' + urlToTest;
    }
    
    setIsDetecting(true);
    try {
      const form = await detectForm(urlToTest);
      if (form?.detected) {
        toast.success('Formulario de pago detectado');
      } else {
        toast.warning('No se detectó formulario de pago');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  const handleProcessCards = async () => {
    const urlToTest = currentGatewayUrl || gatewayUrl;
    
    if (!urlToTest.trim()) {
      toast.error('Primero debes configurar la URL de la pasarela de pago');
      return;
    }
    
    if (cards.length === 0) {
      toast.error('No hay tarjetas para probar. Ve a "Generador de Tarjetas" y genera algunas.');
      return;
    }
    
    const cardsToTest = selectedCards.size > 0 
      ? cards.filter(c => selectedCards.has(c.id))
      : cards;
    
    if (cardsToTest.length === 0) {
      toast.error('Selecciona al menos una tarjeta para probar');
      return;
    }
    
    setTestProgress(0);
    
    toast.info(`Iniciando pruebas con ${cardsToTest.length} tarjetas en ${connectionStatus.gatewayInfo?.name || 'la pasarela'}...`);
    
    await testMultipleCards(
      cardsToTest,
      urlToTest,
      undefined,
      (completed, total) => setTestProgress((completed / total) * 100)
    );
    
    toast.success(`¡${cardsToTest.length} pruebas completadas! Revisa los resultados.`);
    setTestProgress(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'declined': return <XCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getGatewayIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('stripe')) return '💳';
    if (lower.includes('paypal')) return '💰';
    if (lower.includes('mercadopago')) return '🛒';
    if (lower.includes('conekta')) return '🌮';
    if (lower.includes('openpay')) return '💳';
    if (lower.includes('culqi')) return '🇵🇪';
    if (lower.includes('wompi')) return '🇨🇴';
    if (lower.includes('epayco')) return '🇨🇴';
    if (lower.includes('pagseguro')) return '🇧🇷';
    if (lower.includes('payu')) return '🌎';
    return '🔒';
  };

  // Obtener tarjetas seleccionadas para mostrar
  const selectedCardsList = cards.filter(c => selectedCards.has(c.id));
  const cardsToProcess = selectedCards.size > 0 ? selectedCardsList : cards;

  return (
    <div className="space-y-6">
      {/* Gateway Connection Card */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Globe className="h-5 w-5 text-blue-400" />
            Configuración de Pasarela de Pago
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingresa la URL de la pasarela de pago que deseas probar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              URL de la Pasarela de Pago
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://ejemplo.com/checkout o ejemplo.com/pago"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestConnection()}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
              />
              <Button
                onClick={handleTestConnection}
                disabled={connectionStatus.status === 'testing'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {connectionStatus.status === 'testing' ? (
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Server className="h-4 w-4 mr-2" />
                )}
                Probar
              </Button>
              <Button
                onClick={handleDetectForm}
                disabled={isDetecting}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <FormInput className="h-4 w-4 mr-2" />
                Detectar
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Puedes ingresar la URL con o sin http:// o https://
            </p>
          </div>

          {/* Gateway Detection Result */}
          {connectionStatus.gatewayInfo && (
            <div className={`p-4 rounded-lg border ${
              connectionStatus.gatewayInfo.detected 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-yellow-500/30 bg-yellow-500/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl">
                  {getGatewayIcon(connectionStatus.gatewayInfo.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">
                      {connectionStatus.gatewayInfo.name}
                    </h3>
                    {connectionStatus.gatewayInfo.detected ? (
                      <Badge className="bg-green-600/20 text-green-400">
                        <Check className="h-3 w-3 mr-1" />
                        Detectada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        No detectada
                      </Badge>
                    )}
                  </div>
                  {connectionStatus.gatewayInfo.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connectionStatus.gatewayInfo.features.map((feature, i) => (
                        <span key={i} className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {connectionStatus.responseTime && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {connectionStatus.responseTime}ms
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Connection Status */}
          {connectionStatus.status !== 'idle' && (
            <div className={`p-3 rounded-lg border ${getStatusColor(connectionStatus.status === 'success' ? 'success' : connectionStatus.status === 'error' ? 'error' : 'pending')}`}>
              <div className="flex items-center gap-2">
                {connectionStatus.status === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : connectionStatus.status === 'error' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Activity className="h-4 w-4 animate-spin" />
                )}
                <span className="text-sm">{connectionStatus.message}</span>
              </div>
            </div>
          )}

          {/* Detected Form Fields */}
          {detectedForm?.detected && (
            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 text-green-400 mb-3">
                <FormInput className="h-4 w-4" />
                <span className="text-sm font-medium">Formulario de pago detectado</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {detectedForm.cardNumberField && (
                  <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                    <CreditCard className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">Tarjeta:</span>
                    <code className="text-green-400">{detectedForm.cardNumberField}</code>
                  </div>
                )}
                {detectedForm.expiryField && (
                  <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">Expiración:</span>
                    <code className="text-green-400">{detectedForm.expiryField}</code>
                  </div>
                )}
                {detectedForm.cvvField && (
                  <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">CVV:</span>
                    <code className="text-green-400">{detectedForm.cvvField}</code>
                  </div>
                )}
                {detectedForm.nameField && (
                  <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                    <Shield className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">Nombre:</span>
                    <code className="text-green-400">{detectedForm.nameField}</code>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Processing Section */}
      {cards.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Procesar Tarjetas en la Pasarela
              </span>
              {connectionStatus.gatewayInfo?.name && (
                <Badge className="bg-blue-600/20 text-blue-400">
                  {getGatewayIcon(connectionStatus.gatewayInfo.name)} {connectionStatus.gatewayInfo.name}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {selectedCards.size > 0 
                ? `${selectedCards.size} tarjetas seleccionadas para procesar`
                : `${cards.length} tarjetas disponibles para procesar (todas)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selection Summary */}
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">{cards.length}</p>
                    <p className="text-xs text-slate-400">Total Tarjetas</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{selectedCards.size}</p>
                    <p className="text-xs text-slate-400">Seleccionadas</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{cardsToProcess.length}</p>
                    <p className="text-xs text-slate-400">A Procesar</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={selectAllCards}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Todas
                  </Button>
                  <Button
                    onClick={deselectAllCards}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Ninguna
                  </Button>
                </div>
              </div>

              {/* Main Process Button */}
              <Button
                onClick={handleProcessCards}
                disabled={isTesting || cardsToProcess.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6"
                size="lg"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Procesando {cardsToProcess.length} Tarjetas...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Procesar {cardsToProcess.length} Tarjetas en {connectionStatus.gatewayInfo?.name || 'la Pasarela'}
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isTesting && (
                <div className="space-y-2">
                  <Progress value={testProgress} className="h-3" />
                  <p className="text-sm text-slate-400 text-center">
                    {Math.round(testProgress)}% completado - Procesando tarjeta {Math.ceil((testProgress / 100) * cardsToProcess.length)} de {cardsToProcess.length}
                  </p>
                </div>
              )}

              <Separator className="bg-slate-700" />

              {/* Cards Grid */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">
                  Tarjetas Disponibles (clic para seleccionar/deseleccionar)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => toggleCardSelection(card.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCards.has(card.id)
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-sm text-slate-100">{card.formattedNumber}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize border-slate-600">
                              {card.brand}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {card.expiryMonth}/{card.expiryYear}
                            </span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedCards.has(card.id)
                            ? 'bg-green-500 border-green-500'
                            : 'border-slate-500'
                        }`}>
                          {selectedCards.has(card.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {responses.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Resultados de Pruebas
              </span>
              <div className="flex gap-2">
                <Badge className="bg-green-600/20 text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {responses.filter(r => r.status === 'success').length}
                </Badge>
                <Badge className="bg-yellow-600/20 text-yellow-400">
                  <XCircle className="h-3 w-3 mr-1" />
                  {responses.filter(r => r.status === 'declined').length}
                </Badge>
                <Badge className="bg-red-600/20 text-red-400">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {responses.filter(r => r.status === 'error').length}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-slate-700 w-full">
                <TabsTrigger value="all" className="flex-1">
                  Todas ({responses.length})
                </TabsTrigger>
                <TabsTrigger value="success" className="flex-1">
                  Éxitos ({responses.filter(r => r.status === 'success').length})
                </TabsTrigger>
                <TabsTrigger value="declined" className="flex-1">
                  Denegadas ({responses.filter(r => r.status === 'declined').length})
                </TabsTrigger>
                <TabsTrigger value="errors" className="flex-1">
                  Errores ({responses.filter(r => r.status === 'error').length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg border ${getStatusColor(response.status)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(response.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm">{response.cardNumber}</span>
                            <Badge variant="outline" className="text-xs">
                              {response.gatewayName}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{response.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
                            <span>{response.timestamp.toLocaleTimeString()}</span>
                            <span>{response.responseTime}ms</span>
                            {response.responseCode && (
                              <span>Código: {response.responseCode}</span>
                            )}
                            {response.authCode && (
                              <span>Auth: {response.authCode}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="success" className="mt-4">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {responses.filter(r => r.status === 'success').length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay transacciones exitosas aún</p>
                    </div>
                  ) : (
                    responses.filter(r => r.status === 'success').map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg border ${getStatusColor('success')}`}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{response.cardNumber}</span>
                              <Badge variant="outline" className="text-xs">
                                {response.gatewayName}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{response.message}</p>
                            {response.authCode && (
                              <p className="text-xs mt-1">Código de autorización: {response.authCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="declined" className="mt-4">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {responses.filter(r => r.status === 'declined').length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay transacciones denegadas aún</p>
                    </div>
                  ) : (
                    responses.filter(r => r.status === 'declined').map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg border ${getStatusColor('declined')}`}
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-yellow-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{response.cardNumber}</span>
                              <Badge variant="outline" className="text-xs">
                                {response.gatewayName}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{response.message}</p>
                            {response.responseCode && (
                              <p className="text-xs mt-1">Código: {response.responseCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="errors" className="mt-4">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {responses.filter(r => r.status === 'error').length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay errores registrados</p>
                    </div>
                  ) : (
                    responses.filter(r => r.status === 'error').map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg border ${getStatusColor('error')}`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{response.cardNumber}</span>
                              <Badge variant="outline" className="text-xs">
                                {response.gatewayName}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{response.message}</p>
                            {response.errorDetails && (
                              <pre className="text-xs mt-2 p-2 bg-slate-900 rounded overflow-x-auto">
                                {response.errorDetails}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <Button
              onClick={clearResponses}
              variant="outline"
              className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Resultados
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info when no cards */}
      {cards.length === 0 && (
        <Card className="border-slate-700 bg-slate-800/30">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-400 mb-1">No hay tarjetas generadas</h3>
            <p className="text-sm text-slate-500 mb-4">
              Ve a la pestaña &quot;Generador de Tarjetas&quot; para crear tarjetas de prueba
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
