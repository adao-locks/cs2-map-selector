/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function CS2MapSelector() {
  const [team1, setTeam1] = useState("Time 1");
  const [team2, setTeam2] = useState("Time 2");
  const [currentTeam, setCurrentTeam] = useState(1);
  const [actionHistory, setActionHistory] = useState<Array<{team: number, action: string, map: string}>>([]);
  
  const [maps, setMaps] = useState([
    { name: "Ancient", isBanned: false, isSelected: false },
    { name: "Ancient Night", isBanned: false, isSelected: false },
    { name: "Dust II", isBanned: false, isSelected: false },
    { name: "Inferno", isBanned: false, isSelected: false },
    { name: "Mirage", isBanned: false, isSelected: false },
    { name: "Nuke", isBanned: false, isSelected: false },
    { name: "Overpass", isBanned: false, isSelected: false },
    { name: "Train", isBanned: false, isSelected: false },
    { name: "Anubis", isBanned: false, isSelected: false },
    { name: "Italy", isBanned: false, isSelected: false },
    { name: "Office", isBanned: false, isSelected: false },
    { name: "Vertigo", isBanned: false, isSelected: false },
  ]);

  const handleBanMap = (mapName: string) => {
    const teamName = currentTeam === 1 ? team1 : team2;
    setMaps(maps.map(map => 
      map.name === mapName ? { ...map, isBanned: !map.isBanned, isSelected: false } : map
    ));
    setActionHistory([...actionHistory, {team: currentTeam, action: "vetou", map: mapName}]);
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
  };

  const handleSelectMap = (mapName: string) => {
    const teamName = currentTeam === 1 ? team1 : team2;
    setMaps(maps.map(map => 
      map.name === mapName ? { ...map, isSelected: !map.isSelected, isBanned: false } : map
    ));
    setActionHistory([...actionHistory, {team: currentTeam, action: "escolheu", map: mapName}]);
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
  };

  const resetAll = () => {
    setMaps(maps.map(map => ({ ...map, isBanned: false, isSelected: false })));
    setActionHistory([]);
    setCurrentTeam(1);
    setTeam1("Time 1");
    setTeam2("Time 2");
  };

  const bannedMaps = maps.filter(map => map.isBanned);
  const selectedMaps = maps.filter(map => map.isSelected);
  const availableMaps = maps.filter(map => !map.isBanned && !map.isSelected);

  const getImagePath = (mapName: string) => {
    return `/assets/maps/${mapName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            SispBalas - Vetador
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-semibold text-foreground">Total</h3>
              <p className="text-2xl font-bold text-primary">{maps.length}</p>
              <p className="text-sm text-muted-foreground">Mapas</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-semibold text-foreground">Banidos</h3>
              <p className="text-2xl font-bold text-destructive">{bannedMaps.length}</p>
              <p className="text-sm text-muted-foreground">Vetados</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-semibold text-foreground">Selecionados</h3>
              <p className="text-2xl font-bold text-green-600">{selectedMaps.length}</p>
              <p className="text-sm text-muted-foreground">Escolhidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time 1</label>
            <input
              type="text"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Nome do Time 1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time 2</label>
            <input
              type="text"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Nome do Time 2"
            />
          </div>
        </div>

        {/* Current Team Indicator */}
        <div className="text-center mb-6">
          <Badge className="px-4 py-2 text-lg">
            Vez do: {currentTeam === 1 ? team1 : team2}
          </Badge>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={resetAll}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            Reiniciar Tudo
          </Button>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {maps.map((map) => (
            <Card 
              key={map.name}
              className={`transition-all duration-200 ${
                map.isBanned 
                  ? 'border-destructive bg-destructive/10' 
                  : map.isSelected 
                  ? 'border-green-600 bg-green-600/10' 
                  : 'border-border hover:shadow-md'
              }`}
            >
              <CardContent className="p-4">
              <div className="h-32 mb-3 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={getImagePath(map.name)}
                  alt={`Counter-Strike 2 ${map.name} map`}
                  className="w-full h-full object-cover"
                />
              </div>
                
                <h3 className="font-semibold text-lg mb-3 text-foreground">
                  {map.name}
                </h3>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleBanMap(map.name)}
                    variant={map.isBanned ? "destructive" : "outline"}
                    size="sm"
                    className="w-full"
                    disabled={map.isSelected}
                  >
                    {map.isBanned ? "Desfazer Ban" : "Vetar Mapa"}
                  </Button>
                  
                  <Button
                    onClick={() => handleSelectMap(map.name)}
                    variant={map.isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${
                      map.isSelected ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                    disabled={map.isBanned}
                  >
                    {map.isSelected ? "Desselecionar" : "Selecionar Mapa"}
                  </Button>
                </div>

                {map.isBanned && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">
                    VETADO
                  </Badge>
                )}
                
                {map.isSelected && (
                  <Badge className="mt-2 w-full justify-center bg-green-600">
                    SELECIONADO
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action History */}
        {actionHistory.length > 0 && (
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Histórico de Ações</h2>
            <div className="space-y-2">
              {actionHistory.map((action, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-background rounded-md">
                  <Badge variant={action.team === 1 ? "default" : "secondary"}>
                    {action.team === 1 ? team1 : team2}
                  </Badge>
                  <span className="text-foreground">{action.action}</span>
                  <Badge variant="outline">{action.map}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {(bannedMaps.length > 0 || selectedMaps.length > 0) && (
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Resultado da Simulação</h2>
            
            {bannedMaps.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-destructive mb-2">Mapas Vetados:</h3>
                <div className="flex flex-wrap gap-2">
                  {bannedMaps.map(map => (
                    <Badge key={map.name} variant="destructive">
                      {map.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedMaps.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600 mb-2">Mapas Selecionados:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMaps.map(map => (
                    <Badge key={map.name} className="bg-green-600">
                      {map.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {availableMaps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Mapas Disponíveis:</h3>
                <div className="flex flex-wrap gap-2">
                  {availableMaps.map(map => (
                    <Badge key={map.name} variant="secondary">
                      {map.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}