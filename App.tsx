import { useState } from 'react';
import { 
  Shield, 
  CreditCard, 
  Globe, 
  Network, 
  Menu,
  X,
  Github,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';
import { CardGenerator } from '@/sections/CardGenerator';
import { GatewayTester } from '@/sections/GatewayTester';
import { ProxyManager } from '@/sections/ProxyManager';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showDisclaimer = () => {
    toast.info(
      'Esta herramienta es solo para fines educativos y pruebas de seguridad autorizadas.',
      { duration: 5000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9',
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Payment Security Tester
              </h1>
              <p className="text-xs text-slate-400">Herramienta de Pentesting</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Solo para pruebas autorizadas
            </Badge>
            <Button
              onClick={showDisclaimer}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200"
            >
              <Lock className="h-4 w-4 mr-2" />
              Disclaimer
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-700 bg-slate-800 p-4">
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 w-full justify-center mb-3">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Solo para pruebas autorizadas
          </Badge>
          <Button
            onClick={showDisclaimer}
            variant="ghost"
            className="w-full text-slate-400"
          >
            <Lock className="h-4 w-4 mr-2" />
            Disclaimer
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">
                    Plataforma de Pruebas de Seguridad de Pasarelas de Pago
                  </h2>
                  <p className="text-slate-400">
                    Herramienta completa para pruebas de penetración y auditoría de seguridad 
                    en pasarelas de pago. Incluye generador de tarjetas con algoritmo de Luhn, 
                    verificador de pasarelas y gestión de proxies.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Luhn Generator
                  </Badge>
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                    <Globe className="h-3 w-3 mr-1" />
                    Gateway Tester
                  </Badge>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                    <Network className="h-3 w-3 mr-1" />
                    Proxy Manager
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger 
              value="generator"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Generador de Tarjetas</span>
              <span className="sm:hidden">Tarjetas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tester"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Verificador de Pasarelas</span>
              <span className="sm:hidden">Pasarelas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="proxies"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Network className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Gestor de Proxies</span>
              <span className="sm:hidden">Proxies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <CardGenerator />
          </TabsContent>

          <TabsContent value="tester" className="mt-6">
            <GatewayTester />
          </TabsContent>

          <TabsContent value="proxies" className="mt-6">
            <ProxyManager />
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Algoritmo de Luhn</h3>
                  <p className="text-sm text-slate-400">
                    Genera números de tarjetas válidos según el algoritmo de Luhn 
                    para pruebas de validación de formularios.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Detección de Formularios</h3>
                  <p className="text-sm text-slate-400">
                    Detecta automáticamente campos de formulario de pago en 
                    cualquier URL de pasarela de pago.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Network className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Rotación de Proxies</h3>
                  <p className="text-sm text-slate-400">
                    Sistema de gestión de proxies con rotación automática 
                    para pruebas distribuidas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                © 2024 Payment Security Tester. Proyecto Universitario de Ciberseguridad.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Esta herramienta debe usarse únicamente para pruebas de seguridad autorizadas.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-slate-200 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Documentación en desarrollo');
                }}
              >
                Documentación
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Repositorio privado');
                }}
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
