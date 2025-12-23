import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DateFilter({ onDateRangeChange }) {
  // Initialize with "Hoje" using UTC normalization for São Paulo timezone
  const getInitialDateRange = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      startDate: new Date(todayStr + 'T00:00:00Z'),
      endDate: new Date(todayStr + 'T23:59:59Z'),
      label: 'Hoje'
    };
  };

  const [dateRange, setDateRange] = useState(getInitialDateRange());
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const handlePreset = (days, label) => {
    // Use UTC normalization to avoid timezone issues
    const todayStr = new Date().toISOString().split('T')[0];
    const startDaysAgoStr = days === 0 ? todayStr : new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];
    const end = new Date(todayStr + 'T23:59:59Z');
    const start = new Date(startDaysAgoStr + 'T00:00:00Z');
    const newRange = { startDate: start, endDate: end, label };
    setDateRange(newRange);
    onDateRangeChange(newRange);
  };

  const handleCustom = () => {
    if (customStart && customEnd) {
      const startStr = customStart.toISOString().split('T')[0];
      const endStr = customEnd.toISOString().split('T')[0];
      const newRange = {
        startDate: new Date(startStr + 'T00:00:00Z'),
        endDate: new Date(endStr + 'T23:59:59Z'),
        label: `${format(customStart, 'dd/MM/yyyy', { locale: ptBR })} - ${format(customEnd, 'dd/MM/yyyy', { locale: ptBR })}`
      };
      setDateRange(newRange);
      onDateRangeChange(newRange);
      setCustomOpen(false);
    }
  };

  // Initialize with default on first render
  useEffect(() => {
    if (!initialized) {
      onDateRangeChange(dateRange);
      setInitialized(true);
    }
  }, [initialized, onDateRangeChange, dateRange]);

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 no-default-hover-elevate w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            {dateRange.label}
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          <DropdownMenuItem onClick={() => handlePreset(0, 'Hoje')}>
            Hoje
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePreset(6, 'Últimos 7 dias')}>
            Últimos 7 dias
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePreset(29, 'Últimos 30 dias')}>
            Últimos 30 dias
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePreset(89, 'Últimos 90 dias')}>
            Últimos 90 dias
          </DropdownMenuItem>

          <Popover open={customOpen} onOpenChange={setCustomOpen}>
            <PopoverTrigger asChild>
              <div className="px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent">
                Personalizado
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" side="right">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">De:</p>
                    <CalendarComponent
                      mode="single"
                      selected={customStart}
                      onSelect={setCustomStart}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Até:</p>
                    <CalendarComponent
                      mode="single"
                      selected={customEnd}
                      onSelect={setCustomEnd}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCustom}
                  disabled={!customStart || !customEnd}
                  className="w-full bg-primary text-primary-foreground no-default-hover-elevate"
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
