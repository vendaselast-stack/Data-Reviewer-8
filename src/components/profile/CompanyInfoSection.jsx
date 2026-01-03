import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export const CompanyInfoSection = ({ company }) => (
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2">Dados da Conta</CardTitle></CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg border">
          <Label className="text-xs text-muted-foreground block mb-1">Empresa</Label>
          <p className="text-sm font-medium">{company?.name || 'Não definido'}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg border">
          <Label className="text-xs text-muted-foreground block mb-1">CNPJ/CPF</Label>
          <p className="text-sm font-medium">{company?.document || 'Não definido'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
