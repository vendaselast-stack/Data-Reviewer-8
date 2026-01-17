import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input as FormInput } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, MoreVertical, Trash2, Eye, Power, RotateCcw, Filter } from 'lucide-react';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { formatDateWithTimezone } from '@/utils/dateFormatter';

const apiRequest = async (method, url, body = null) => {
  const token = JSON.parse(localStorage.getItem('auth') || '{}').token;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
};

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gerente',
  operational: 'Operacional',
  user: 'Usuario',
};

const exportToExcel = (data) => {
  const csv = [
    ['Data Criacao', 'Nome', 'Empresa', 'Email', 'Telefone', 'Funcao', 'Status'],
    ...data.map(u => [
      formatDateWithTimezone(u.createdAt),
      u.name || '',
      u.companyName || '',
      u.email || '',
      u.phone || '',
      roleLabels[u.role] || u.role,
      u.status === 'active' ? 'Ativo' : u.status === 'suspended' ? 'Suspenso' : 'Inativo',
    ])
  ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

function UserListContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetPassword, setResetPassword] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('GET', '/api/admin/users'),
  });

  const users = usersData || [];

  const updateMutation = useMutation({
    mutationFn: (data) => apiRequest('PATCH', `/api/admin/users/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast.success('Usuario atualizado com sucesso');
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ userId, newPassword: pwd }) => apiRequest('POST', `/api/admin/users/${userId}/reset-password`, { newPassword: pwd }),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso');
      setResetPassword(null);
      setNewPassword('');
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast.success('Usuario deletado com sucesso');
      setDeleteConfirm(null);
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (user) => apiRequest('PATCH', `/api/admin/users/${user.id}`, { status: user.status === 'active' ? 'suspended' : 'active' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast.success('Status do usuario atualizado');
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    },
  });

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Count users by role
  const roleCounts = useMemo(() => {
    const counts = { admin: 0, manager: 0, operational: 0, user: 0 };
    users.forEach(u => {
      if (counts[u.role] !== undefined) counts[u.role]++;
    });
    return counts;
  }, [users]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuarios do Sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} usuarios cadastrados
          </p>
        </div>
        <Button 
          onClick={() => exportToExcel(filtered)} 
          className="gap-2 w-full md:w-auto"
          data-testid="button-export-users"
        >
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{roleCounts.admin}</div>
          <div className="text-sm text-muted-foreground">Administradores</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{roleCounts.manager}</div>
          <div className="text-sm text-muted-foreground">Gerentes</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{roleCounts.operational}</div>
          <div className="text-sm text-muted-foreground">Operacionais</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">{roleCounts.user}</div>
          <div className="text-sm text-muted-foreground">Usuarios</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Buscar por nome, email ou empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-background border border-input"
          data-testid="input-search-users"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[200px]" data-testid="select-role-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="manager">Gerente</SelectItem>
            <SelectItem value="operational">Operacional</SelectItem>
            <SelectItem value="user">Usuario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/40">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome / Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-muted-foreground">
                      Carregando usuarios...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-muted-foreground">
                      Nenhum usuario encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-created-${u.id}`}>
                        {formatDateWithTimezone(u.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{u.name || 'Sem nome'}</div>
                          <div className="text-sm text-muted-foreground">{u.email || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{u.companyName || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            u.role === 'admin' ? 'border-blue-500 text-blue-600' :
                            u.role === 'manager' ? 'border-purple-500 text-purple-600' :
                            u.role === 'operational' ? 'border-green-500 text-green-600' :
                            'border-gray-500 text-gray-600'
                          }
                        >
                          {roleLabels[u.role] || u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={u.status === 'active' ? 'default' : u.status === 'suspended' ? 'destructive' : 'secondary'}
                          data-testid={`badge-status-${u.id}`}
                        >
                          {u.status === 'active' ? 'Ativo' : u.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActionsMenu
                          user={u}
                          onView={() => setSelectedUser(u)}
                          onToggleStatus={() => toggleStatusMutation.mutate(u)}
                          onResetPassword={() => setResetPassword(u)}
                          onDelete={() => setDeleteConfirm(u)}
                          isStatusLoading={toggleStatusMutation.isPending}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Edit Modal */}
      <UserEditModal
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(null)}
        onSave={updateMutation.mutate}
        isPending={updateMutation.isPending}
      />

      {/* Reset Password Dialog */}
      {resetPassword && (
        <Dialog open={!!resetPassword} onOpenChange={() => setResetPassword(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Redefinir Senha</DialogTitle>
              <DialogDescription>
                Defina uma nova senha para {resetPassword.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded text-sm">
                Email: <span className="font-medium">{resetPassword.email || resetPassword.username}</span>
              </div>
              <FormInput
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
              />
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 6 caracteres
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => resetPasswordMutation.mutate({ userId: resetPassword.id, newPassword })}
                  className="flex-1"
                  disabled={!newPassword || newPassword.length < 6 || resetPasswordMutation.isPending}
                  data-testid="button-confirm-reset-password"
                >
                  {resetPasswordMutation.isPending ? 'Alterando...' : 'Confirmar'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setResetPassword(null)}
                  data-testid="button-cancel-reset"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar Usuario?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar <strong>{deleteConfirm.name}</strong>? Esta acao nao pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="bg-destructive/10 border border-destructive/20 rounded p-4 mb-4">
              <p className="text-sm text-destructive font-medium">
                Aviso: Isso vai deletar permanentemente o usuario e todos os seus dados.
              </p>
            </div>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deletando...' : 'Deletar Usuario'}
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

function UserActionsMenu({ user, onView, onToggleStatus, onResetPassword, onDelete, isStatusLoading }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          data-testid={`button-actions-${user.id}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView} data-testid={`action-view-${user.id}`}>
          <Eye className="h-4 w-4 mr-2" />
          Ver/Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onToggleStatus}
          disabled={isStatusLoading}
          className={user.status === 'suspended' ? 'text-green-600' : 'text-orange-600'}
          data-testid={`action-toggle-status-${user.id}`}
        >
          <Power className="h-4 w-4 mr-2" />
          {user.status === 'active' ? 'Bloquear' : 'Ativar'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onResetPassword}
          data-testid={`action-reset-password-${user.id}`}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Redefinir Senha
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-destructive"
          data-testid={`action-delete-${user.id}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminUsers() {
  return <UserListContent />;
}
