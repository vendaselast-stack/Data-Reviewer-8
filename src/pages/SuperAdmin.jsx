import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Lock, Unlock, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

async function apiRequest(method, url, body = null) {
  const token = JSON.parse(localStorage.getItem('auth') || '{}').token;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export default function SuperAdmin() {
  const { logout } = useAuth();
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['/api/super-admin/companies'],
    queryFn: () => apiRequest('GET', '/api/super-admin/companies'),
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ companyId, status }) =>
      apiRequest('PATCH', `/api/super-admin/companies/${companyId}/subscription`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/super-admin/companies'] });
    },
  });

  const handleToggleStatus = (companyId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateSubscriptionMutation.mutate({ companyId, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout-super-admin">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manage All Companies</h2>
          <p className="text-gray-600 mt-2">Control subscriptions and access for all customer organizations</p>
        </div>

        {companies.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No companies found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                    </div>
                    <div className="space-y-2 ml-9">
                      <p className="text-sm text-gray-600"><span className="font-medium">Document:</span> {company.document}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <Badge className={getStatusColor(company.subscription?.status)}>
                          {company.subscription?.status || 'unknown'}
                        </Badge>
                      </div>
                      {company.subscription?.plan && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Plan:</span> {company.subscription.plan}</p>
                      )}
                      <p className="text-xs text-gray-500">Created: {new Date(company.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleToggleStatus(company.id, company.subscription?.status)}
                      disabled={updateSubscriptionMutation.isPending}
                      variant={company.subscription?.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      data-testid={`button-toggle-company-${company.id}`}
                    >
                      {company.subscription?.status === 'active' ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Block
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    {company.subscription?.status === 'suspended' && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>Blocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
