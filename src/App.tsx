import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import CoverScreen from './screens/CoverScreen';
import AppShell from './components/AppShell';
import DashboardScreen from './screens/DashboardScreen';
import ChatScreen from './screens/ChatScreen';
import OperationsScreen from './screens/OperationsScreen';
import PlanningScreen from './screens/PlanningScreen';
import MachinesScreen from './screens/MachinesScreen';
import MachineDetailScreen from './screens/MachineDetailScreen';
import ProblemScreen from './screens/ProblemScreen';
import QualityScreen from './screens/QualityScreen';
import CostScreen from './screens/CostScreen';
import ActionsScreen from './screens/ActionsScreen';
import WorkOrderScreen from './screens/WorkOrderScreen';
import DocsScreen from './screens/DocsScreen';
import ReportsScreen from './screens/ReportsScreen';
import AdminDataScreen from './screens/AdminDataScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import AuditScreen from './screens/AuditScreen';
import ArchitectureScreen from './screens/ArchitectureScreen';

type Screen =
  | 'cover' | 'dashboard' | 'chat' | 'operations' | 'planning' | 'machines'
  | 'machine-detail' | 'workorders' | 'problems' | 'quality' | 'cost' | 'actions'
  | 'docs' | 'reports' | 'admin-datasources' | 'admin-users' | 'admin-audit'
  | 'architecture';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('PRESS-07');

  const navigate = (id: string) => {
    setScreen(id as Screen);
  };

  const openMachineDetail = (machineId: string) => {
    setSelectedMachineId(machineId);
    setScreen('machine-detail');
  };

  if (showCover) {
    return <CoverScreen onEnter={() => { setShowCover(false); }} />;
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':      return <DashboardScreen onNavigate={navigate} />;
      case 'chat':           return <ChatScreen />;
      case 'operations':     return <OperationsScreen />;
      case 'planning':       return <PlanningScreen />;
      case 'machines':       return <MachinesScreen onSelectMachine={openMachineDetail} />;
      case 'machine-detail': return <MachineDetailScreen machineId={selectedMachineId} onBack={() => setScreen('machines')} onNavigate={navigate} />;
      case 'workorders':     return <WorkOrderScreen />;
      case 'problems':       return <ProblemScreen />;
      case 'quality':        return <QualityScreen />;
      case 'cost':           return <CostScreen />;
      case 'actions':        return <ActionsScreen />;
      case 'docs':           return <DocsScreen />;
      case 'reports':        return <ReportsScreen />;
      case 'admin-datasources': return <AdminDataScreen />;
      case 'admin-users':    return <AdminUsersScreen />;
      case 'admin-audit':    return <AuditScreen />;
      case 'architecture':   return <ArchitectureScreen />;
      default:               return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return (
    <AppShell currentScreen={screen} onNavigate={navigate}>
      {renderScreen()}
    </AppShell>
  );
}
