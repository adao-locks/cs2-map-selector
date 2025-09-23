/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useEffect } from "react";

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

  useEffect(() => {
    if (availableMaps.length === 2) {
      const shuffled = [...availableMaps].sort(() => Math.random() - 0.5);

      const mapToBan = shuffled[0];
      const mapToSelect = shuffled[1];

      // Marca como banido
      setMaps(prev =>
        prev.map(m =>
          m.name === mapToBan.name ? { ...m, isBanned: true, isSelected: false } : m
        )
      );
      setActionHistory(prev => [
        ...prev,
        { team: 3, action: "vetou", map: mapToBan.name }
      ]);

      // Marca como selecionado
      setMaps(prev =>
        prev.map(m =>
          m.name === mapToSelect.name ? { ...m, isSelected: true, isBanned: false } : m
        )
      );
      setActionHistory(prev => [
        ...prev,
        { team: 3, action: "escolheu", map: mapToSelect.name }
      ]);
    }
  }, [availableMaps]);

  const getNextAction = () => {
    const totalBans = actionHistory.filter(a => a.action === "vetou").length;
    const totalSelects = actionHistory.filter(a => a.action === "escolheu").length;

    if (totalBans < 4) return "ban";
    if (totalSelects < 2) return "select";
    return "ban";
  };

  const handleAction = (mapName: string) => {
    const nextAction = getNextAction();

    if (nextAction === "ban") {
      setMaps(maps.map(map => 
        map.name === mapName ? { ...map, isBanned: true, isSelected: false } : map
      ));
      setActionHistory([...actionHistory, {team: currentTeam, action: "vetou", map: mapName}]);
    } else if (nextAction === "select") {
      setMaps(maps.map(map => 
        map.name === mapName ? { ...map, isSelected: true, isBanned: false } : map
      ));
      setActionHistory([...actionHistory, {team: currentTeam, action: "escolheu", map: mapName}]);
    }

    setCurrentTeam(currentTeam === 1 ? 2 : 1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
            SispBalas - Vetador
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="text-center mb-2">
          <Badge className="px-4 py-2 text-lg">
            Vez do: {currentTeam === 1 ? team1 : team2}
          </Badge>
        </div>

        <div className="flex justify-center mb-2">
          <Button 
            onClick={resetAll}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            Reiniciar Tudo
          </Button>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
                <img src={getImagePath(map.name)} alt={`Counter-Strike 2 ${map.name} map`} className="w-full h-full object-cover"/>
              </div>
                
                <h3 className="font-semibold text-lg mb-3 text-foreground">
                  {map.name}
                </h3>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleAction(map.name)}
                    size="sm"
                    className="w-full"
                    disabled={map.isBanned || map.isSelected}
                  >
                    {getNextAction() === "ban" ? "Vetar Mapa" : "Selecionar Mapa"}
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
          <div className="mt-6 p-6 bg-muted/30 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              📜 Histórico de Ações
            </h2>

            <div className="space-y-3">
              {actionHistory.map((action, index) => {
                const isBan = action.action.includes("vetou");
                const isSelect = action.action.includes("escolheu");

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-all
                      ${isBan ? "border-destructive/50 bg-destructive/10" : ""}
                      ${isSelect ? "border-green-600/50 bg-green-600/10" : ""}
                      ${!isBan && !isSelect ? "border-border bg-background" : ""}
                    `}
                  >
                    {/* Time */}
                    <Badge
                      variant={
                        action.team === 1 ? "default" : action.team === 2 ? "secondary" : "outline"
                      }
                      className="px-3 py-1 text-sm"
                    >
                      {action.team === 1 ? team1 : action.team === 2 ? team2 : "Sistema"}
                    </Badge>

                    {/* Ação */}
                    <div className="flex-1 text-center">
                      <span
                        className={`font-medium ${
                          isBan ? "text-destructive" : isSelect ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {action.action}
                      </span>
                    </div>

                    {/* Mapa */}
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 font-semibold ${
                        isBan ? "border-destructive text-destructive" : ""
                      } ${isSelect ? "border-green-600 text-green-600" : ""}`}
                    >
                      {action.map}
                    </Badge>
                  </div>
                );
              })}
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