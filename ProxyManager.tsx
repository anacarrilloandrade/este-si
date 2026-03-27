import { useState } from 'react';
import { 
  Network, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCw,
  Globe,
  Shield,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProxies } from '@/hooks/useProxies';
import { toast } from 'sonner';
import type { Proxy } from '@/types';

export function ProxyManager() {
  const {
    proxies,
    autoRotate,
    setAutoRotate,
    addProxy,
    removeProxy,
    toggleProxy,
    testProxy,
    addRandomProxies,
    clearAllProxies,
    enableAllProxies,
    disableAllProxies,
    activeCount
  } = useProxies();

  const [newProxy, setNewProxy] = useState({
    host: '',
    port: 8080,
    username: '',
    password: '',
    protocol: 'http' as Proxy['protocol']
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testingProxy, setTestingProxy] = useState<string | null>(null);

  const handleAddProxy = () => {
    if (!newProxy.host) {
      toast.error('El host es requerido');
      return;
    }

    addProxy({
      host: newProxy.host,
      port: newProxy.port,
      username: newProxy.username || undefined,
      password: newProxy.password || undefined,
      protocol: newProxy.protocol,
      isActive: true
    });

    setNewProxy({
      host: '',
      port: 8080,
      username: '',
      password: '',
      protocol: 'http'
    });

    setIsDialogOpen(false);
    toast.success('Proxy agregado exitosamente');
  };

  const handleTestProxy = async (proxy: Proxy) => {
    setTestingProxy(proxy.id);
    try {
      const success = await testProxy(proxy);
      if (success) {
        toast.success(`Proxy ${proxy.host}:${proxy.port} funciona correctamente`);
      } else {
        toast.error(`Proxy ${proxy.host}:${proxy.port} no responde`);
      }
    } finally {
      setTestingProxy(null);
    }
  };

  const handleAddRandom = () => {
    addRandomProxies(5);
    toast.success('5 proxies aleatorios agregados');
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Network className="h-5 w-5" />
            Gestor de Proxies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600/20 text-green-400">
                <Check className="h-3 w-3 mr-1" />
                {activeCount} Activos
              </Badge>
              <Badge className="bg-slate-600/20 text-slate-400">
                <Server className="h-3 w-3 mr-1" />
                {proxies.length} Total
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Switch
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
                id="auto-rotate"
              />
              <Label htmlFor="auto-rotate" className="text-slate-300 cursor-pointer">
                Rotación Automática
              </Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Proxy
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">Agregar Nuevo Proxy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Host</Label>
                    <Input
                      placeholder="proxy.ejemplo.com"
                      value={newProxy.host}
                      onChange={(e) => setNewProxy({ ...newProxy, host: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Puerto</Label>
                    <Input
                      type="number"
                      value={newProxy.port}
                      onChange={(e) => setNewProxy({ ...newProxy, port: parseInt(e.target.value) || 8080 })}
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Protocolo</Label>
                    <Select
                      value={newProxy.protocol}
                      onValueChange={(v) => setNewProxy({ ...newProxy, protocol: v as Proxy['protocol'] })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="https">HTTPS</SelectItem>
                        <SelectItem value="socks4">SOCKS4</SelectItem>
                        <SelectItem value="socks5">SOCKS5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Usuario (opcional)</Label>
                    <Input
                      value={newProxy.username}
                      onChange={(e) => setNewProxy({ ...newProxy, username: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Contraseña (opcional)</Label>
                    <Input
                      type="password"
                      value={newProxy.password}
                      onChange={(e) => setNewProxy({ ...newProxy, password: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                  
                  <Button onClick={handleAddProxy} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Proxy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleAddRandom}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Agregar Aleatorios
            </Button>

            <Button
              onClick={enableAllProxies}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Activar Todos
            </Button>

            <Button
              onClick={disableAllProxies}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="h-4 w-4 mr-2" />
              Desactivar Todos
            </Button>

            {proxies.length > 0 && (
              <Button
                onClick={clearAllProxies}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {proxies.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Lista de Proxies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {proxies.map((proxy) => (
                <div
                  key={proxy.id}
                  className={`p-3 rounded-lg border transition-all ${
                    proxy.isActive
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-slate-600 bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {proxy.isActive ? (
                        <Shield className="h-5 w-5 text-green-500" />
                      ) : (
                        <Globe className="h-5 w-5 text-slate-500" />
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-100">
                            {proxy.protocol}://{proxy.host}:{proxy.port}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {proxy.protocol}
                          </Badge>
                        </div>
                        {proxy.username && (
                          <p className="text-xs text-slate-400">
                            Auth: {proxy.username}:****
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleTestProxy(proxy)}
                        disabled={testingProxy === proxy.id}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300"
                      >
                        {testingProxy === proxy.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Probar
                      </Button>
                      
                      <Switch
                        checked={proxy.isActive}
                        onCheckedChange={() => toggleProxy(proxy.id)}
                      />
                      
                      <Button
                        onClick={() => removeProxy(proxy.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {proxies.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay proxies configurados</p>
          <p className="text-sm">Agrega proxies manualmente o genera aleatorios</p>
        </div>
      )}
    </div>
  );
}
