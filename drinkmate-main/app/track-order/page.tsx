'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Search, AlertCircle, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/lib/contexts/translation-context';

export default function TrackOrderPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [waybillNumber, setWaybillNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waybillNumber.trim()) {
      setError(t('trackOrder.errors.emptyWaybill'));
      return;
    }

    // Validate waybill number format (basic validation)
    if (waybillNumber.length < 8) {
      setError(t('trackOrder.errors.shortWaybill'));
      return;
    }

    setError(null);
    
    // Navigate to tracking results page
    router.push(`/track-order/${waybillNumber.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('trackOrder.headerTitle')}</h1>
          <p className="text-gray-600">{t('trackOrder.headerSubtitle')}</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('trackOrder.form.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <Label htmlFor="waybill">{t('trackOrder.form.waybillLabel')}</Label>
                <Input
                  id="waybill"
                  type="text"
                  placeholder={t('trackOrder.form.placeholder')}
                  value={waybillNumber}
                  onChange={(e) => {
                    setWaybillNumber(e.target.value);
                    setError(null);
                  }}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">{t('trackOrder.form.help')}</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {t('trackOrder.form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{t('trackOrder.info.email.title')}</h3>
                  <p className="text-sm text-gray-600">{t('trackOrder.info.email.body')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{t('trackOrder.info.help.title')}</h3>
                  <p className="text-sm text-gray-600">{t('trackOrder.info.help.body')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Features */}
        <Card>
          <CardHeader>
            <CardTitle>{t('trackOrder.features.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{t('trackOrder.features.realtime.title')}</h4>
                <p className="text-sm text-gray-600">{t('trackOrder.features.realtime.body')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{t('trackOrder.features.history.title')}</h4>
                <p className="text-sm text-gray-600">{t('trackOrder.features.history.body')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{t('trackOrder.features.alerts.title')}</h4>
                <p className="text-sm text-gray-600">{t('trackOrder.features.alerts.body')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}