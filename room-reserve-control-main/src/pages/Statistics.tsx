
import React from 'react';
import UsageCharts from '@/components/statistics/UsageCharts';
import PageTransition from '@/components/layout/PageTransition';

const StatisticsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estatísticas de Uso</h1>
          <p className="text-muted-foreground">
            Visualize dados sobre a utilização das salas acadêmicas
          </p>
        </div>
        
        <UsageCharts />
      </div>
    </PageTransition>
  );
};

export default StatisticsPage;
