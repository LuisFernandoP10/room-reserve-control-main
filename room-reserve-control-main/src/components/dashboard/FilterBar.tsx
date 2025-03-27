
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { Block, Resource, RoomFilters } from '@/types';
import apiClient from '@/services/api';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onFiltersChange: (filters: RoomFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedBlock, setSelectedBlock] = useState<string | undefined>(undefined);
  const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  
  // Fetch blocks and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blocksData, resourcesData] = await Promise.all([
          apiClient.getBlocks(),
          apiClient.getResources()
        ]);
        setBlocks(blocksData);
        setResources(resourcesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update filters when they change
  useEffect(() => {
    const filters: RoomFilters = {};
    
    if (selectedBlock) filters.block = selectedBlock;
    if (selectedCapacity) filters.capacity = selectedCapacity;
    if (selectedResources.length > 0) filters.resources = selectedResources;
    if (searchQuery) filters.query = searchQuery;
    if (availableOnly) filters.available = true;
    
    onFiltersChange(filters);
  }, [selectedBlock, selectedCapacity, selectedResources, searchQuery, availableOnly, onFiltersChange]);
  
  const toggleResource = (resourceId: string) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };
  
  const clearFilters = () => {
    setSelectedBlock(undefined);
    setSelectedCapacity(undefined);
    setSelectedResources([]);
    setSearchQuery('');
    setAvailableOnly(false);
  };
  
  const capacityOptions = [
    { value: 15, label: 'Até 15 pessoas' },
    { value: 30, label: 'Até 30 pessoas' },
    { value: 50, label: 'Até 50 pessoas' },
    { value: 100, label: 'Até 100 pessoas' },
    { value: 200, label: 'Mais de 100 pessoas' },
  ];
  
  const hasActiveFilters = selectedBlock || selectedCapacity || selectedResources.length > 0 || availableOnly;
  
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-6 animate-fade-in">
      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar salas..."
              className="w-full pl-9 py-2 pr-4 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors",
              showFilters || hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-transparent hover:bg-accent text-muted-foreground"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
                {(selectedBlock ? 1 : 0) + 
                 (selectedCapacity ? 1 : 0) + 
                 (selectedResources.length > 0 ? 1 : 0) + 
                 (availableOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Filter options */}
      {showFilters && (
        <div className="p-4 bg-secondary/50 border-t animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Block filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Bloco</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border rounded-md py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={selectedBlock || ''}
                  onChange={(e) => setSelectedBlock(e.target.value || undefined)}
                >
                  <option value="">Todos os blocos</option>
                  {blocks.map((block) => (
                    <option key={block.id} value={block.name}>
                      {block.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            {/* Capacity filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Capacidade</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border rounded-md py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={selectedCapacity || ''}
                  onChange={(e) => setSelectedCapacity(e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Qualquer capacidade</option>
                  {capacityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            {/* Resources filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Recursos</label>
              <div className="flex flex-wrap gap-2">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors border",
                      selectedResources.includes(resource.id)
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-white text-muted-foreground hover:text-foreground hover:border-primary/20"
                    )}
                    onClick={() => toggleResource(resource.id)}
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 rounded flex items-center justify-center border",
                      selectedResources.includes(resource.id)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedResources.includes(resource.id) && (
                        <Check className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                    {resource.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="availableOnly"
                className="rounded border-gray-300 text-primary focus:ring-primary/30"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <label htmlFor="availableOnly" className="text-sm font-medium cursor-pointer">
                Mostrar apenas salas disponíveis
              </label>
            </div>
            
            <button
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
