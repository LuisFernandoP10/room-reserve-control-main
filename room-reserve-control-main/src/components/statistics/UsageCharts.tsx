
import React, { useState, useEffect } from 'react';
import { RoomStatistic, TimeSlotStatistic, BlockStatistic } from '@/types';
import apiClient from '@/services/api';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];

const UsageCharts: React.FC = () => {
  const [roomStats, setRoomStats] = useState<RoomStatistic[]>([]);
  const [timeSlotStats, setTimeSlotStats] = useState<TimeSlotStatistic[]>([]);
  const [blockStats, setBlockStats] = useState<BlockStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [roomData, timeSlotData, blockData] = await Promise.all([
          apiClient.getRoomStatistics(),
          apiClient.getTimeSlotStatistics(),
          apiClient.getBlockStatistics(),
        ]);
        
        setRoomStats(roomData);
        setTimeSlotStats(timeSlotData);
        setBlockStats(blockData);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando estatísticas...</p>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border shadow-lg rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border shadow-lg rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{`Reservas: ${payload[0].value}`}</p>
          <p className="text-muted-foreground">{`${payload[0].payload.percentage}% do total`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6">
        <h3 className="text-lg font-semibold mb-6">Salas Mais Utilizadas</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roomStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="roomName" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="usageCount" name="Reservas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6">
          <h3 className="text-lg font-semibold mb-6">Horários Mais Reservados</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeSlotStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <XAxis type="number" />
                <YAxis dataKey="timeSlot" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Reservas" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6">
          <h3 className="text-lg font-semibold mb-6">Ocupação por Bloco</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={blockStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="usageCount"
                  nameKey="blockName"
                >
                  {blockStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieCustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageCharts;
