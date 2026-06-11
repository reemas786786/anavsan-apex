import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Connections from './pages/Connections';
import Overview from './pages/Overview';
import AccountView from './pages/AccountView';
import UserView from './pages/UserView';
import SidePanel from './components/SidePanel';
import AddAccountFlow from './components/AddAccountFlow';
import SaveQueryFlow from './components/SaveQueryFlow';
import InviteUserFlow from './components/InviteUserFlow';
import EditUserRoleFlow from './components/EditUserRoleFlow';
import ConfirmationModal from './components/ConfirmationModal';
import Modal from './components/Modal';
import Toast from './components/Toast';
import BigScreenView from './components/BigScreenView';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RequestSubmittedPage from './pages/RequestSubmittedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CheckEmailPage from './pages/CheckEmailPage';
import CreateNewPasswordPage from './pages/CreateNewPasswordPage';
import PasswordResetSuccessPage from './pages/PasswordResetSuccessPage';
import { Page, Account, SQLFile, UserRole, User, UserStatus, DashboardItem, BigScreenWidget, QueryListItem, AssignedQuery, AssignmentPriority, AssignmentStatus, PullRequest, Notification, ActivityLog, BreadcrumbItem, Warehouse, SQLVersion, QueryListFilters, CollaborationEntry, Subscription, SubscriptionPlan, BillingCycle, Recommendation } from './types';
import { sqlFilesData as initialSqlFiles, usersData, dashboardsData as initialDashboardsData, assignedQueriesData as initialAssignedQueries, pullRequestsData, notificationsData as initialNotificationsData, activityLogsData, warehousesData, queryListData, connectionsData, accountApplicationsData, demoUsers, recommendationsData as initialRecommendationsData } from './data/dummyData';
import { accountNavItems, IconInfo, IconUser, IconLightbulb, IconChevronRight } from './constants';
import SettingsPage from './pages/SettingsPage';
import Dashboards from './pages/Dashboards';
import DashboardEditor from './pages/DashboardEditor';
import ProfilePage from './pages/ProfilePage';
import Breadcrumb from './components/Breadcrumb';
import AssignQueryFlow from './components/AssignQueryFlow';
import AssignedTasks from './pages/AssignedTasks';
import AssignedQueryDetailView from './pages/AssignedQueryDetailView';
import QueryPreviewContent from './components/QueryPreviewModal';
import NotificationsPage from './pages/NotificationsPage';
import AIQuickAskPanel from './components/AIQuickAskPanel';
import AIAgent from './pages/AIAgent';
import { QueryLibrary } from './pages/QueryLibrary';
import QueryLibraryDetailView from './pages/QueryLibraryDetailView';
import AssignedQueryModalContent from './components/AssignedQueryModalContent';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import Recommendations from './pages/Recommendations';
import BillingHistory from './pages/billing/BillingHistory';
import TeamConsumption from './pages/billing/TeamConsumption';
import ConfigureWorkspaceModal from './components/WelcomeModal';
import ChangePlan from './pages/billing/ChangePlan';
import SendQueryFlow from './components/SendQueryFlow';
import ExtendedTrialSideFlow from './components/ExtendedTrialSideFlow';
import AddSeatsModal from './components/AddSeatsModal';
import SetBudgetFlow from './components/SetBudgetFlow';
import SwitchToIndividualModal from './components/SwitchToIndividualModal';
import ConfirmSubscriptionChangeModal from './components/ConfirmSubscriptionChangeModal';
import ConfirmCycleDowngradeModal from './components/ConfirmCycleDowngradeModal';
import ResourceSummary from './pages/CreditExplorer'; 
import Reports from './pages/Reports';
import BudgetsAndAlerts from './pages/BudgetsAndAlerts';
import ActivePolicies from './pages/ActivePolicies';
import Skills from './pages/Skills';
import Support from './pages/Support';
import Docs from './pages/Docs';

type SidePanelType = 'addAccount' | 'saveQuery' | 'editUser' | 'assignQuery' | 'queryPreview' | 'assignedQueryPreview' | 'updateAssignmentStatus' | 'sendQuery' | 'extendedTrial' | 'setBudget';
type ModalType = 'addUser' | 'orgSetup' | 'addSeats' | 'switchToIndividual' | 'confirmSubscriptionChange' | 'confirmCycleDowngrade';
type Theme = 'light' | 'dark' | 'gray10' | 'black' | 'system';
export type DisplayMode = 'cost' | 'credits';

const SplashScreen: React.FC = () => (
    <div id="react-splash-loader" style={{ opacity: 1 }}>
        <div className="splash-bg">
            <div className="ring-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="52" fill="white" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#6932D5" strokeOpacity={0.15} strokeWidth={3.5} />
                </svg>
                <svg className="ring-rotate" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="arc-spin-react" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6932D5" stopOpacity={1} />
                            <stop offset="100%" stopColor="#F9AB8F" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="52" fill="none"
                        stroke="url(#arc-spin-react)"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        strokeDasharray="180 146"
                        strokeDashoffset={0}
                    />
                </svg>
                <div className="logo-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="31" viewBox="0 0 19 21" fill="none">
                        <path d="M9.96971 0.291213C10.1557 0.227878 10.3588 0.229089 10.5152 0.35317C10.673 0.478492 10.7217 0.679763 10.7017 0.8779C10.6805 1.08829 10.6467 1.29834 10.6169 1.49747C10.5868 1.69951 10.5601 1.89364 10.5497 2.08626C10.4994 3.04108 10.4365 3.98391 10.445 4.92612L10.4512 5.30294C10.4936 7.0595 10.727 8.79837 11.0806 10.5258L11.1583 10.8959L11.1678 10.9321C11.1709 10.9411 11.1735 10.9467 11.1753 10.9498C11.177 10.9505 11.1797 10.951 11.1832 10.9519C11.1958 10.9554 11.2162 10.9593 11.2492 10.9616C12.0845 11.02 12.9217 11.1456 13.726 11.4564L13.7983 11.4872C13.8684 11.5199 13.9329 11.5576 13.9914 11.5938C14.0768 11.6466 14.1363 11.6874 14.21 11.7304L14.3732 11.8257L14.2507 12.119L14.1801 12.2867L14.0052 12.2442C13.1529 12.0376 12.2781 11.9419 11.4021 11.9575C11.4762 12.2496 11.5459 12.5278 11.6252 12.8068C12.0621 14.3404 12.5589 15.8303 13.3708 17.1855L13.5116 17.4144C13.8451 17.9402 14.2186 18.4065 14.7297 18.7361L14.8501 18.8094C15.4516 19.1545 16.053 19.1881 16.6564 18.8322C17.307 18.4485 17.5982 17.8623 17.5658 17.094L17.5654 17.0898V17.0856C17.5653 17.0536 17.5668 17.0214 17.5699 16.9895L17.5874 16.8138L17.7606 16.7961L17.835 16.7889L18.0543 16.7665L18.0684 16.9895C18.0757 17.1047 18.0908 17.2056 18.1037 17.3393C18.1128 17.4323 18.1198 17.533 18.1154 17.6365L18.1067 17.741C17.8774 19.5974 16.0431 20.5876 14.2918 19.8644C13.4636 19.5218 12.8327 18.9474 12.3152 18.2636L12.213 18.1254C11.4848 17.1149 10.977 15.9996 10.56 14.8552L10.3864 14.3629C10.2574 13.9836 10.1394 13.6014 10.0258 13.2195L9.6918 12.0768C9.68772 12.0629 9.68389 12.0513 9.68057 12.0414C8.12864 12.1811 6.65235 12.5376 5.29908 13.2826L5.02989 13.4369C4.03685 14.0292 3.34004 14.88 2.90418 15.9308L2.82067 16.1436C2.61672 16.6915 2.4282 17.2452 2.24531 17.8021L1.70401 19.4804C1.63121 19.706 1.51534 19.9027 1.3239 20.0123C1.15313 20.11 0.958512 20.118 0.756428 20.0696L0.669604 20.0456C0.540939 20.0053 0.389005 19.9426 0.306522 19.8012C0.219489 19.6518 0.248047 19.4852 0.291982 19.3464L0.698267 18.0558C0.836117 17.6242 0.979109 17.1928 1.13446 16.7665L1.42028 15.9923C2.76887 12.3857 4.32897 8.87157 6.23797 5.51956L6.65256 4.80351C7.3879 3.55416 8.21798 2.35671 9.00883 1.15649L9.06906 1.06967C9.21506 0.870028 9.39232 0.695093 9.55223 0.540304L9.55469 0.538617L9.6 0.497737C9.70894 0.405773 9.83448 0.336021 9.96971 0.291213ZM8.79741 3.88974C7.0649 6.60832 5.61728 9.42814 4.35275 12.3474C5.05163 11.9288 5.8119 11.6202 6.60726 11.4345L6.9828 11.3511C7.79033 11.1791 8.61053 11.0495 9.42427 10.9034C8.98207 8.63139 8.70016 6.30112 8.79741 3.88974Z" fill="url(#logo-grad-react)" stroke="url(#logo-stroke-react)" strokeWidth={0.5} />
                        <defs>
                            <linearGradient id="logo-grad-react" x1={9.18333} y1={0.465281} x2={9.18333} y2={19.8867} gradientUnits="userSpaceOnUse">
                                <stop stopColor="#6932D5" />
                                <stop offset={1} stopColor="#7163C6" />
                            </linearGradient>
                            <linearGradient id="logo-stroke-react" x1={9.18337} y1={0.249878} x2={9.18337} y2={20.102} gradientUnits="userSpaceOnUse">
                                <stop stopColor="#6932D5" />
                                <stop offset={1} stopColor="#7163C6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            <p className="brand-name">Anavsan</p>
            <p className="brand-sub">Loading…</p>
        </div>
    </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup' | 'request-submitted' | 'forgot-password' | 'check-email' | 'create-password' | 'reset-success'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('anavsan_auth') === 'true';
  }); 
  
  const [activePage, setActivePage] = useState<Page>('Ask Apex');
  const [activeSubPage, setActiveSubPage] = useState<string | undefined>();
  const [resourceSummaryTab, setResourceSummaryTab] = useState<string>('Accounts');
  const [recommendationFilters, setRecommendationFilters] = useState<any>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(true); 
  const [sidebarPreference, setSidebarPreference] = useState(true); 
  const [isQuickAskOpen, setIsQuickAskOpen] = useState(false);

  const [subscription, setSubscription] = useState<Subscription>({
      plan: 'Trial',
      status: 'trialing',
      trialEndsAt: '2026-01-29',
      seats: 5
  });

  const [accounts, setAccounts] = useState<Account[]>(connectionsData);
  const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);
  const [users, setUsers] = useState<User[]>(usersData);
  const [dashboards, setDashboards] = useState<DashboardItem[]>(initialDashboardsData);
  const [assignedQueries, setAssignedQueries] = useState<AssignedQuery[]>(initialAssignedQueries);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendationsData);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(pullRequestsData);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotificationsData);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(activityLogsData);

  const [sidePanel, setSidePanel] = useState<{ type: SidePanelType; data?: any } | null>(null);
  const [modal, setModal] = useState<{ type: ModalType; data?: any } | null>(null);
  const [confirmation, setConfirmation] = useState<{ title: string; message: React.ReactNode; onConfirm: () => void; confirmText?: string; confirmVariant?: 'danger' | 'warning' | 'primary' } | null>(null);
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardItem | null>(null);
  const [editingDashboard, setEditingDashboard] = useState<DashboardItem | null>(null);
  const [isViewingDashboard, setIsViewingDashboard] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState<QueryListItem | null>(null);
  const [selectedRepeatedQueryHash, setSelectedRepeatedQueryHash] = useState<string | null>(null);
  const [selectedAssignedQuery, setSelectedAssignedQuery] = useState<AssignedQuery | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const [analyzingQuery, setAnalyzingQuery] = useState<QueryListItem | null>(null);
  const [navigationSource, setNavigationSource] = useState<string | null>(null);
  const [backNavigationPage, setBackNavigationPage] = useState<Page>('Accounts');
  const [returnContext, setReturnContext] = useState<{ account: Account; page: string; warehouse?: Warehouse | null } | null>(null);
  
  const [selectedPullRequest, setSelectedPullRequest] = useState<PullRequest | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('anavsan_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }); 
  const [theme, setTheme] = useState<Theme>('light');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('cost');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bigScreenWidget, setBigScreenWidget] = useState<BigScreenWidget | null>(null);

  const [accountViewPage, setAccountViewPage] = useState('Account overview');
  
  const [isDiagnosticActive, setIsDiagnosticActive] = useState(false);

  useEffect(() => {
    const handleActive = () => setIsDiagnosticActive(true);
    const handleInactive = () => setIsDiagnosticActive(false);

    window.addEventListener('apex-diagnostic-active', handleActive);
    window.addEventListener('apex-diagnostic-inactive', handleInactive);

    return () => {
      window.removeEventListener('apex-diagnostic-active', handleActive);
      window.removeEventListener('apex-diagnostic-inactive', handleInactive);
    };
  }, []);
  
  const handleAddAccount = (data: any) => {
    const newAccount: Account = {
        id: `acc-${Date.now()}`,
        name: data.name,
        identifier: data.identifier,
        role: 'ACCOUNTADMIN',
        status: 'Connected',
        lastSynced: new Date().toISOString(),
        cost: 1240.50,
        tokens: 45000,
        warehousesCount: 8,
        usersCount: 24,
        storageGB: 1250,
        queriesCount: '45.2k',
        tablesCount: 156
    };
    setAccounts(prev => [newAccount, ...prev]);
    setSidePanel(null);
    setToastMessage(`Successfully connected to ${data.name}`);
    handleSetActivePage('Intelligence overview');
  };

  const handleSetActivePage = (page: Page, subPage?: string, additionalState?: any) => {
    const isContextualRecommendations = selectedAccount && (page === 'Recommendations' || page === 'Enforcement Desk');
    
    // Save context if we are moving from an account detail view to recommendations
    if (isContextualRecommendations) {
        setReturnContext({ 
            account: selectedAccount, 
            page: accountViewPage,
            warehouse: selectedWarehouse 
        });
    } else if (page !== 'Recommendations' && page !== 'Enforcement Desk') {
        // Clear return context if navigating elsewhere (except between subpages of recommendations if needed)
        setReturnContext(null);
    }

    setActivePage(page);
    setActiveSubPage(subPage);
    setSelectedAccount(null);
    setSelectedUser(null);
    
    setSidebarOpen(sidebarPreference);

    setIsViewingDashboard(false);
    setEditingDashboard(null);
    setSelectedDashboard(null);
    setSelectedQuery(null);
    setSelectedAssignedQuery(null);
    setSelectedRecommendation(null); 
    setSelectedBudget(null);
    setSelectedPullRequest(null);
    setSelectedWarehouse(null);
    setSelectedApplicationId(null);

    if (page === 'Resource summary' && additionalState?.tab) {
        setResourceSummaryTab(additionalState.tab);
    }

    if (page === 'Recommendations' || page === 'Enforcement Desk') {
        setRecommendationFilters(additionalState?.filters || null);
    } else {
        setRecommendationFilters(null);
    }
  };

  const handleBackToSource = () => {
    if (returnContext) {
        setSelectedAccount(returnContext.account);
        setAccountViewPage(returnContext.page);
        setSelectedWarehouse(returnContext.warehouse || null);
        setActivePage('Accounts');
        setSidebarOpen(false);
        setReturnContext(null);
    } else {
        handleSetActivePage('AI data cloud overview');
    }
  };

  const breadcrumbItems = useMemo(() => {
    const homeItem: BreadcrumbItem = { 
        label: 'Home', 
        onClick: () => handleSetActivePage('AI data cloud overview') 
    };

    if (activePage === 'Intelligence overview' || activePage === 'AI data cloud overview') return [homeItem];

    const items = [homeItem];

    if (selectedAccount) {
        items.push({ 
            label: 'Resource summary', 
            onClick: () => { setSelectedAccount(null); handleSetActivePage('Accounts'); } 
        });
        items.push({ 
            label: selectedAccount.name,
            onClick: () => {
                setAccountViewPage('Account overview');
                setSelectedWarehouse(null);
                setSelectedQuery(null);
                setSelectedRepeatedQueryHash(null);
            }
        });

        if (selectedWarehouse) {
            items.push({ 
                label: 'Warehouse', 
                onClick: () => {
                    setAccountViewPage('Warehouse');
                    setSelectedWarehouse(null);
                } 
            });
            items.push({ 
                label: selectedWarehouse.name 
            });
            return items;
        }

        if (selectedQuery || selectedRepeatedQueryHash) {
            items.push({ 
                label: 'Query pattern', 
                onClick: () => {
                    setAccountViewPage('Repeated queries');
                    setSelectedQuery(null);
                    setSelectedRepeatedQueryHash(null);
                } 
            });
            
            // Always show Analysis if we are deep in queries
            items.push({
                label: 'Analysis',
                onClick: () => {
                    setAccountViewPage('Repeated queries');
                    setSelectedQuery(null);
                    setSelectedRepeatedQueryHash(null);
                }
            });

            if (selectedQuery) {
                items.push({ 
                    label: selectedQuery.id.substring(0, 8) + '...'
                });
            } else if (selectedRepeatedQueryHash) {
                items.push({ 
                    label: selectedRepeatedQueryHash.substring(0, 8) + '...'
                });
            }
            return items;
        }

        if (accountViewPage === 'Applications') {
            items.push({ 
                label: 'Applications', 
                onClick: () => setSelectedApplicationId(null) 
            });
            if (selectedApplicationId) {
                const app = accountApplicationsData.find(a => a.id === selectedApplicationId || a.name === selectedApplicationId);
                if (app) {
                    items.push({ label: app.name });
                }
            }
        } else if (accountViewPage !== 'Account overview') {
            // Find if current page is a child of a category
            const parentCategory = accountNavItems.find(cat => 
                cat.children.some(child => child.name === accountViewPage)
            );

            if (parentCategory) {
                items.push({
                    label: parentCategory.name,
                    onClick: () => {
                        // Navigate to overview or first child
                        const overviewChild = parentCategory.children.find(c => c.name.toLowerCase().includes('overview'));
                        setAccountViewPage(overviewChild ? overviewChild.name : parentCategory.children[0].name);
                    }
                });
            }

            let label = accountViewPage;
            if (accountViewPage === 'Repeated queries') {
                label = 'Query pattern';
            } else if (accountViewPage === 'Compute overview' || accountViewPage === 'Storage overview' || accountViewPage === 'Queries overview') {
                label = 'Overview';
            }
            items.push({ label });
        }
        return items;
    }

    if (activePage === 'Assigned tasks') {
        items.push({ label: 'Assigned tasks', onClick: () => { setSelectedAssignedQuery(null); handleSetActivePage('Assigned tasks'); } });
        if (selectedAssignedQuery) {
            items.push({ label: `TASK-${selectedAssignedQuery.queryId.substring(0,8).toUpperCase()}` });
        }
        return items;
    }

    if (activePage === 'Query vault') {
        items.push({ label: 'Query vault', onClick: () => handleSetActivePage('Query vault') });
        return items;
    }

    items.push({ 
        label: activePage === 'Integrations' ? 'Tools' : activePage,
        onClick: () => handleSetActivePage(activePage, activeSubPage)
    });

    if (activeSubPage) {
        items.push({ label: activeSubPage });
    }

    if ((activePage === 'Recommendations' || activePage === 'Enforcement Desk') && selectedRecommendation) {
        items.push({ label: selectedRecommendation.id });
    }

    if (activePage === 'Budgets & alerts' && selectedBudget) {
        items.push({ label: selectedBudget.name });
    }

    if (activePage === 'Active policies' || activePage === 'Trigger') {
        items.push({ label: 'Trigger' });
    }

    return items;
  }, [activePage, activeSubPage, selectedAccount, accountViewPage, selectedApplicationId, selectedRecommendation, selectedWarehouse, selectedAssignedQuery, selectedQuery, selectedRepeatedQueryHash, selectedBudget]);

  const shouldShowBreadcrumb = useMemo(() => {
    if (selectedAccount) {
        return true;
    }
    if (activePage === 'Assigned tasks' && selectedAssignedQuery) {
        return true;
    }
    if ((activePage === 'Recommendations' || activePage === 'Enforcement Desk') && selectedRecommendation) {
        return true;
    }
    if (activePage === 'Budgets & alerts' && selectedBudget) {
        return true;
    }
    return false;
  }, [selectedAccount, activePage, selectedAssignedQuery, selectedRecommendation, selectedBudget]);

  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    timeout1 = setTimeout(() => {
      const splash = document.getElementById('static-splash-loader');
      if (splash) {
        splash.style.opacity = '0';
        timeout2 = setTimeout(() => {
          splash.style.display = 'none';
          setLoading(false);
        }, 300);
      } else {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
    };
  }, []);

  useEffect(() => {
    const applyThemeClasses = (effectiveTheme: string) => {
      const root = document.documentElement;
      root.classList.remove('dark', 'theme-gray-10', 'theme-black');
      if (effectiveTheme === 'dark') root.classList.add('dark');
      else if (effectiveTheme === 'gray10') root.classList.add('theme-gray-10');
      else if (effectiveTheme === 'black') root.classList.add('theme-black');
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => applyThemeClasses(mediaQuery.matches ? 'dark' : 'light');
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      applyThemeClasses(theme);
    }
  }, [theme]);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('anavsan_auth');
    localStorage.removeItem('anavsan_user');
    setAuthView('login');
  };

  const handleLogin = (email: string) => {
      const user = demoUsers[email] || demoUsers['finops@mail.com'];
      setLoading(true);
      setTimeout(() => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('anavsan_auth', 'true');
          localStorage.setItem('anavsan_user', JSON.stringify(user));
          handleSetActivePage('Ask Apex');
          setLoading(false);
      }, 1000);
  };

  const handleSubscriptionSuccess = (plan: SubscriptionPlan, cycle: BillingCycle) => {
      if (subscription.plan === 'Team' && plan === 'Individual') {
          setSubscription({ ...subscription, isDowngradePending: true, pendingPlan: 'Individual', pendingPlanEffectiveDate: 'Oct 24, 2025' });
      } else {
          setSubscription({ plan, status: 'active', billingCycle: cycle, nextBillingDate: '2026-02-28', seats: plan === 'Team' ? 5 : 1 });
      }
      handleSetActivePage('Billing', 'Your plan');
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
  };

  const handleNavigateToWarehouse = (account: Account, warehouse: Warehouse) => {
      setBackNavigationPage(activePage);
      setSelectedAccount(account);
      setSelectedWarehouse(warehouse);
      setSidebarOpen(false); 
      setActivePage('Accounts');
  };

  const handleSelectAccount = (account: Account, initialPage?: string, sourceTab?: string) => {
      if (activePage === 'Resource summary' && sourceTab) {
          setResourceSummaryTab(sourceTab);
      }
      
      setBackNavigationPage(activePage);
      setSelectedAccount(account);
      setSidebarOpen(false); 
      if (initialPage) {
          setAccountViewPage(initialPage);
      } else {
          setAccountViewPage('Account overview');
      }
      setSelectedQuery(null);
      setSelectedPullRequest(null);
      setSelectedWarehouse(null);
      setSelectedApplicationId(null);
  };

  const handleSelectApplication = (appName: string) => {
      setBackNavigationPage(activePage);
      const account = accounts[0];
      setSelectedAccount(account);
      setAccountViewPage('Applications');
      setSelectedApplicationId(appName);
      setSidebarOpen(false);
  };

  const handleAssignQueryTask = (rec: Recommendation) => {
    let assignmentData: any = null;

    if (rec.resourceType === 'Query') {
        assignmentData = queryListData.find(q => q.id === rec.affectedResource);
    } 
    
    if (!assignmentData) {
        assignmentData = {
            id: rec.affectedResource,
            queryText: `Context: ${rec.insightType}\n${rec.message}`,
            warehouse: 'SYSTEM',
            user: 'anavsan_ai',
            duration: '0s',
            costCredits: rec.metrics?.creditsBefore || 0,
            status: 'Success',
            severity: rec.severity === 'High' ? 'High' : 'Medium'
        };
    }

    setSidePanel({ type: 'assignQuery', data: { ...assignmentData, recommendationId: rec.id } });
  };

  const handleOptimizeRecommendation = (rec: Recommendation) => {
    const account = accounts.find(a => a.name === rec.accountName) || accounts[0];
    setSelectedAccount(account);
    setAccountViewPage('Query optimizer');
    
    // Find matching query in dummy data or create a partial object
    const query = queryListData.find(q => q.id === rec.affectedResource);
    if (query) {
        setAnalyzingQuery(query);
    } else {
        // Fallback for demo: load a mock object with the recommendation's SQL
        setAnalyzingQuery({
            id: rec.affectedResource,
            queryText: rec.metrics?.queryText || 'SELECT * FROM TABLE_STUB',
            warehouse: rec.warehouseName || 'SYSTEM',
            costCredits: rec.metrics?.creditsBefore || 0,
            user: rec.userName || 'System'
        } as any);
    }
    setSidebarOpen(false);
  };

  const handleUpdateAssignmentStatus = (id: string, status: AssignmentStatus, comment?: string) => {
      setAssignedQueries(prev => prev.map(aq => {
          if (aq.id === id) {
              const historyEntry: CollaborationEntry = {
                  id: `coll-${Date.now()}`,
                  type: 'system',
                  author: currentUser?.name || 'System',
                  timestamp: new Date().toISOString(),
                  content: `Status updated to ${status.toUpperCase()}`,
                  metadata: { oldStatus: aq.status, newStatus: status }
              };
              
              const updated = { ...aq, status, history: [...aq.history, historyEntry] };
              if (comment) {
                  updated.engineerResponse = comment;
                  updated.engineerResponseDate = new Date().toISOString();
                  updated.history.push({
                      id: `comm-${Date.now()}`,
                      type: 'comment',
                      author: currentUser?.name || 'System',
                      timestamp: new Date().toISOString(),
                      content: comment
                  });
              }

              // Update selected reference if it matches
              if (selectedAssignedQuery?.id === id) {
                  setSelectedAssignedQuery(updated);
              }

              return updated;
          }
          return aq;
      }));

      // Notify relevant persona
      if (status === 'Optimized') {
           const targetAssignment = assignedQueries.find(a => a.id === id);
           if (targetAssignment) {
               const newNotification: Notification = {
                    id: `n-up-${Date.now()}`,
                    insightTypeId: 'ASSIGNMENT_UPDATED',
                    insightTopic: 'ASSIGNMENT_UPDATED',
                    message: `Optimization Task ${targetAssignment.queryId.substring(0,8)} is now ${status.toUpperCase()}.`,
                    suggestions: 'Please review the latest update in Assigned Tasks.',
                    timestamp: new Date().toISOString(),
                    warehouseName: targetAssignment.warehouse,
                    isRead: false,
                    severity: 'Info'
               };
               setNotifications(prev => [newNotification, ...prev]);
           }
      }
  };

  const handleUpdateAssignmentPriority = (id: string, priority: AssignmentPriority) => {
      setAssignedQueries(prev => prev.map(aq => {
          if (aq.id === id) {
              const historyEntry: CollaborationEntry = {
                  id: `coll-prio-${Date.now()}`,
                  type: 'system',
                  author: currentUser?.name || 'System',
                  timestamp: new Date().toISOString(),
                  content: `Priority updated to ${priority.toUpperCase()}`,
              };
              return { ...aq, priority, history: [...aq.history, historyEntry] };
          }
          return aq;
      }));
      
      if (selectedAssignedQuery?.id === id) {
          setSelectedAssignedQuery(prev => prev ? {...prev, priority} : null);
      }
  };

  const handleAddAssignmentComment = (id: string, comment: string) => {
      setAssignedQueries(prev => prev.map(aq => {
          if (aq.id === id) {
              const newEntry: CollaborationEntry = {
                  id: `comm-${Date.now()}`,
                  type: 'comment',
                  author: currentUser?.name || 'System',
                  timestamp: new Date().toISOString(),
                  content: comment
              };
              const updated = { ...aq, history: [...aq.history, newEntry] };
              
              // If we're updating the currently selected query view, update it too
              if (selectedAssignedQuery?.id === id) {
                  setSelectedAssignedQuery(updated);
              }
              
              return updated;
          }
          return aq;
      }));
  };

  const renderPage = () => {
    if (editingDashboard) {
        return <DashboardEditor 
            dashboard={editingDashboard} 
            accounts={accounts} 
            onSave={(d) => { setDashboards(prev => [...prev.filter(x => x.id !== d.id), d]); setEditingDashboard(null); }} 
            onCancel={() => setEditingDashboard(null)} 
        />;
    }

    if (selectedAccount) {
      const activeAssignment = assignedQueries.find(aq => aq.queryId === selectedQuery?.id);
      return <AccountView 
        account={selectedAccount} 
        accounts={accounts} 
        onSwitchAccount={setSelectedAccount} 
        onBackToAccounts={() => handleSetActivePage(backNavigationPage, undefined, { tab: resourceSummaryTab })}
        backLabel={`Back to ${backNavigationPage}`}
        sqlFiles={sqlFiles} 
        onSaveQueryClick={() => setSidePanel({type: 'saveQuery'})} 
        onSetBigScreenWidget={setBigScreenWidget} 
        activePage={accountViewPage} 
        onPageChange={setAccountViewPage} 
        onShareQueryClick={(query) => setSidePanel({type: 'assignQuery', data: query})} 
        onPreviewQuery={(query) => setSidePanel({type: 'queryPreview', data: query})} 
        selectedQuery={selectedQuery} 
        setSelectedQuery={setSelectedQuery} 
        analyzingQuery={analyzingQuery} 
        onAnalyzeQuery={(q, s) => { setAnalyzingQuery(q); setNavigationSource(s); setAccountViewPage('Query analyzer'); }} 
        onOptimizeQuery={(q, s) => { setAnalyzingQuery(q); setNavigationSource(s); setAccountViewPage('Query analyzer'); }} 
        onSimulateQuery={(q, s) => { setAnalyzingQuery(q); setNavigationSource(s); setAccountViewPage('Query analyzer'); }} 
        pullRequests={pullRequests} 
        selectedPullRequest={selectedPullRequest} 
        setSelectedPullRequest={setSelectedPullRequest} 
        users={users} 
        navigationSource={navigationSource} 
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        warehouses={warehousesData}
        currentUser={currentUser}
        assignment={activeAssignment}
        onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
        onAssignToEngineer={(query) => setSidePanel({type: 'assignQuery', data: query})}
        onResolveAssignment={(id) => handleUpdateAssignmentStatus(id, 'Resolved')}
        selectedApplicationId={selectedApplicationId}
        setSelectedApplicationId={setSelectedApplicationId}
        breadcrumbItems={breadcrumbItems}
        onNavigateToRecommendations={(filters) => handleSetActivePage('Enforcement Desk', undefined, { filters })}
        displayMode={displayMode}
      />;
    }
    
    switch (activePage) {
        case 'Intelligence overview':
        case 'AI data cloud overview': return <Overview onSelectAccount={handleSelectAccount} onSelectUser={setSelectedUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} currentUser={currentUser} onNavigate={handleSetActivePage} onAddAccountClick={() => setSidePanel({ type: 'addAccount' })} displayMode={displayMode} />;
        case 'Resource summary': return <ResourceSummary initialTab={resourceSummaryTab} onSelectAccount={handleSelectAccount} onSelectApplication={handleSelectApplication} onNavigateToRecommendations={(filters) => handleSetActivePage('Enforcement Desk', undefined, { filters })} displayMode={displayMode} />;
        case 'Accounts': return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setSidePanel({ type: 'addAccount' })} onDeleteAccount={(id) => setAccounts(a => a.filter(x => x.id !== id))} />;
        case 'AI agent':
        case 'Ask Apex': return <AIAgent onNavigate={handleSetActivePage} />;
        case 'Recommendations':
        case 'Enforcement Desk': return <Recommendations accounts={accounts} currentUser={currentUser} initialFilters={recommendationFilters} onNavigateToQuery={(q) => {setSelectedAccount(accounts[0]); setSelectedQuery(q as QueryListItem);}} onNavigateToWarehouse={(wh) => {setSelectedAccount(accounts[0]); setSelectedWarehouse(wh as Warehouse);}} onAssignTask={handleAssignQueryTask} onOptimizeRecommendation={handleOptimizeRecommendation} selectedRecommendation={selectedRecommendation} onSelectRecommendation={setSelectedRecommendation} onPreviewQuery={(q) => setSidePanel({ type: 'queryPreview', data: q })} onBackToSource={handleBackToSource} returnContext={returnContext} onNavigate={handleSetActivePage} />;
        case 'Operations': return <Skills />;
        case 'Support': return <Support />;
        case 'Docs': return <Docs />;
        case 'Reports': return <Reports />;
        case 'Assigned tasks':
            if (selectedAssignedQuery) {
                return <AssignedQueryDetailView 
                    assignment={selectedAssignedQuery} 
                    onBack={() => setSelectedAssignedQuery(null)} 
                    currentUser={currentUser} 
                    onUpdateStatus={handleUpdateAssignmentStatus}
                    onUpdatePriority={handleUpdateAssignmentPriority}
                    onAddComment={handleAddAssignmentComment}
                    onResolve={(id) => handleUpdateAssignmentStatus(id, 'Resolved')}
                    onReassign={() => { /* re-open assign panel */ }}
                    onNavigateToQuery={(q) => {setSelectedAccount(accounts[0]); setSelectedQuery(q as QueryListItem);}}
                    onNavigateToWarehouse={(wh) => {setSelectedAccount(accounts[0]); setSelectedWarehouse(wh as Warehouse);}}
                    recommendations={recommendations}
                />;
            }
            return <AssignedTasks assignedQueries={assignedQueries} currentUser={currentUser} onViewQuery={(id) => {const aq = assignedQueries.find(q => q.queryId === id); if(aq) setSelectedAssignedQuery(aq);}} onResolveQuery={(id) => handleUpdateAssignmentStatus(id, 'Resolved')} onUpdateStatus={handleUpdateAssignmentStatus} />;
        case 'Query vault': return <QueryLibrary sqlFiles={sqlFiles} accounts={accounts} onFileSelect={() => {}} selectedFile={null} onVersionSelect={() => {}} onBack={() => {}} onCompare={() => {}} title="Query vault" />;
        case 'Billing':
            if (activeSubPage === 'Team consumption') return <TeamConsumption users={users} subscription={subscription} onAddUser={() => setModal({ type: 'addUser' })} onEditUserRole={() => {}} onSuspendUser={() => {}} onActivateUser={() => {}} onRemoveUser={() => {}} onCancelDowngrade={() => {}} />;
            if (activeSubPage === 'Billing history') return <BillingHistory onNavigate={handleSetActivePage} onDownloadInvoice={() => {}} />;
            return <ChangePlan users={users} currentUser={currentUser} onSubscriptionSuccess={handleSubscriptionSuccess} currentPlan={subscription.plan} subscription={subscription} />;
        case 'Budgets & alerts': return <BudgetsAndAlerts onSetNewBudget={() => setSidePanel({ type: 'setBudget', data: { initialData: null } })} onImportBudget={() => setSidePanel({ type: 'setBudget', data: { initialData: null } })} onEditBudget={(budget) => setSidePanel({ type: 'setBudget', data: { initialData: budget } })} selectedBudget={selectedBudget} onSelectBudget={setSelectedBudget} onNavigate={handleSetActivePage} />;
        case 'Active policies':
        case 'Trigger': return <ActivePolicies />;
        case 'Activity logs':
        case 'Alerts': 
            return <NotificationsPage 
                notifications={notifications} 
                assignedQueries={assignedQueries} 
                onMarkAllAsRead={handleMarkAllNotificationsAsRead} 
                accounts={accounts} 
                onNavigateToWarehouse={handleNavigateToWarehouse} 
                onNavigateToQuery={(acc, q) => { setSelectedAccount(acc); setSelectedQuery(q); }}
                onMarkNotificationAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))} 
                onOpenAssignedQueryPreview={(aq) => setSelectedAssignedQuery(aq)} 
                onNavigateToAssignedTasks={() => handleSetActivePage('Assigned tasks')}
            />;
        case 'Integrations': return <IntegrationsPage onDisconnect={(onConfirm) => onConfirm()} />;
        case 'Dashboards': return <Dashboards 
            dashboards={dashboards} 
            onDeleteDashboardClick={(d) => setDashboards(p => p.filter(x => x.id !== d.id))} 
            onAddDashboardClick={() => setEditingDashboard({
                id: `dash-${Date.now()}`,
                title: 'Untitled Dashboard',
                createdOn: new Date().toLocaleDateString(),
                widgets: [],
                dataSourceContext: { type: 'overall' }
            })} 
            onEditDashboardClick={setEditingDashboard} 
            onViewDashboardClick={setSelectedDashboard} 
        />;
        case 'Profile': return <ProfilePage user={currentUser!} initialSection={activeSubPage} onBack={() => handleSetActivePage('AI data cloud overview')} theme={theme} onThemeChange={(newTheme) => setTheme(newTheme as Theme)} displayMode={displayMode} onDisplayModeChange={setDisplayMode} />;
        default: return <Overview onSelectAccount={handleSelectAccount} onSelectUser={setSelectedUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} currentUser={currentUser} onNavigate={handleSetActivePage} onAddAccountClick={() => setSidePanel({ type: 'addAccount' })} />;
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    switch (authView) {
        case 'login': return <LoginPage onLogin={handleLogin} onSSOLogin={() => handleLogin('finops@mail.com')} onShowSignup={() => setAuthView('signup')} onShowForgotPassword={() => setAuthView('forgot-password')} />;
        case 'signup': return <SignupPage onSignup={() => setAuthView('request-submitted')} onShowLogin={() => setAuthView('login')} />;
        case 'request-submitted': return <RequestSubmittedPage onBackToHomepage={() => setAuthView('login')} />;
        case 'forgot-password': return <ForgotPasswordPage onContinue={() => setAuthView('check-email')} onBackToLogin={() => setAuthView('login')} />;
        case 'check-email': return <CheckEmailPage onContinue={() => setAuthView('create-password')} />;
        case 'create-password': return <CreateNewPasswordPage onContinue={() => setAuthView('reset-success')} />;
        case 'reset-success': return <PasswordResetSuccessPage onGoToSignIn={() => setAuthView('login')} />;
        case 'landing': 
        default: return <LoginPage onLogin={handleLogin} onSSOLogin={() => handleLogin('finops@mail.com')} onShowSignup={() => setAuthView('signup')} onShowForgotPassword={() => setAuthView('forgot-password')} />;
    }
  }

  return (
    <div className={`flex h-full flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {loading && <SplashScreen />}
      <Header 
        onMenuClick={() => {
            const newState = !isSidebarOpen;
            setSidebarOpen(newState);
            if (!selectedAccount) {
                 setSidebarPreference(newState);
            }
        }}
        onLogoClick={() => handleSetActivePage('AI data cloud overview')}
        isSidebarOpen={isSidebarOpen}
        brandLogo={null}
        onOpenProfile={() => handleSetActivePage('Profile')}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={() => setNotifications([])}
        onNavigate={handleSetActivePage}
        onOpenQuickAsk={() => setIsQuickAskOpen(true)}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {!selectedAccount && !editingDashboard && (
          <Sidebar 
            activePage={selectedRecommendation ? (null as any) : activePage} 
            setActivePage={handleSetActivePage} 
            isOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            activeSubPage={activeSubPage} 
            userRole={currentUser?.role}
            hasAccounts={accounts.length > 0}
          />
        )}
        
        {selectedAccount && !editingDashboard && (
          <Sidebar 
            activePage={activePage} 
            setActivePage={handleSetActivePage} 
            isOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            activeSubPage={activeSubPage} 
            isOverlayMode={true} 
            userRole={currentUser?.role}
            hasAccounts={accounts.length > 0}
          />
        )}

        {!selectedAccount && !editingDashboard ? (
            <main className="flex-1 flex flex-col overflow-hidden relative bg-background">
                {shouldShowBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0 && (
                    <div className="w-full max-w-[1440px] mx-auto px-4 h-9 flex items-center bg-[#F4F1F9]/80 dark:bg-[#1A112B]/80 backdrop-blur-[12px] border-b border-border-light/45 select-none flex-shrink-0">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                )}
                <div className={`flex-1 bg-background ${activePage === 'Ask Apex' || activePage === 'AI agent' ? 'overflow-hidden flex flex-col h-full' : 'overflow-auto'}`}>
                    {renderPage()}
                </div>
            </main>
        ) : (
            <div className="flex-1 overflow-hidden relative">
                {renderPage()}
            </div>
        )}
      </div>
      <AIQuickAskPanel isOpen={isQuickAskOpen} onClose={() => setIsQuickAskOpen(false)} onOpenAgent={() => { setIsQuickAskOpen(false); handleSetActivePage('Ask Apex'); }} />
      {sidePanel && (
        <SidePanel 
          isOpen={!!sidePanel} 
          onClose={() => setSidePanel(null)} 
          isFullScreen={sidePanel?.type === 'addAccount'} 
          title={
            sidePanel?.type === 'assignQuery' ? 'Assign Optimization Task' : 
            sidePanel?.type === 'queryPreview' ? 'Query Preview' : 
            sidePanel?.type === 'setBudget' ? (sidePanel.data?.initialStep === 'import' ? 'Import budget' : 'Set new budget') : 
            'Panel'
          }
          description={
            sidePanel?.type === 'setBudget' ? (sidePanel.data?.initialStep === 'import' ? undefined : 'Configure automated monitoring and escalation rules for your environment.') : 
            undefined
          }
        >
          {sidePanel.type === 'addAccount' && <AddAccountFlow onCancel={() => setSidePanel(null)} onAddAccount={handleAddAccount} />}
          {sidePanel.type === 'assignQuery' && (
            <AssignQueryFlow 
                query={sidePanel.data} 
                users={users} 
                onCancel={() => setSidePanel(null)} 
                onAssign={(details) => {
                    const newAssignment: AssignedQuery = {
                        id: `aq-${Date.now()}`,
                        queryId: sidePanel.data.id,
                        queryText: sidePanel.data.queryText,
                        assignedBy: currentUser?.name || 'Admin',
                        assignedTo: details.assignee,
                        priority: details.priority,
                        status: 'Assigned',
                        message: details.message,
                        assignedOn: new Date().toISOString(),
                        cost: sidePanel.data.costUSD || 0,
                        tokens: sidePanel.data.costTokens || 0,
                        credits: sidePanel.data.costCredits || 0,
                        warehouse: sidePanel.data.warehouse,
                        recommendationId: sidePanel.data.recommendationId,
                        history: [
                            {
                                id: `coll-start`,
                                type: 'system',
                                author: currentUser?.name || 'Admin',
                                timestamp: new Date().toISOString(),
                                content: 'Assignment initiated'
                            }
                        ]
                    };
                    setAssignedQueries(prev => [newAssignment, ...prev]);
                    
                    // Create Notification for Data Engineer
                    const newNotification: Notification = {
                        id: `n-${Date.now()}`,
                        insightTypeId: 'QUERY_ASSIGNED',
                        insightTopic: 'QUERY_ASSIGNED',
                        message: `New query optimization task assigned by ${currentUser?.name || 'Admin'}.`,
                        suggestions: details.message || 'Please review the query execution plan and optimize partition filtering.',
                        timestamp: new Date().toISOString(),
                        warehouseName: sidePanel.data.warehouse || 'SYSTEM',
                        queryId: sidePanel.data.id,
                        isRead: false,
                        severity: 'Info'
                    };
                    setNotifications(prev => [newNotification, ...prev]);

                    setSidePanel(null);
                    setToastMessage("Optimization task successfully assigned.");
                }} 
            />
          )}
          {sidePanel.type === 'saveQuery' && (
            <SaveQueryFlow 
                files={sqlFiles} 
                onCancel={() => setSidePanel(null)} 
                onSave={(data) => {
                    if (data.saveType === 'new') {
                        const newFile: SQLFile = {
                            id: `file-${Date.now()}`,
                            name: data.fileName,
                            accountId: selectedAccount?.id || '',
                            accountName: selectedAccount?.name || '',
                            createdDate: new Date().toISOString(),
                            versions: [{
                                id: `v1-${Date.now()}`,
                                version: 1,
                                date: new Date().toISOString(),
                                description: data.description,
                                user: currentUser?.name || 'User',
                                tag: data.tag,
                                sql: analyzingQuery?.queryText || ''
                            }]
                        };
                        setSqlFiles(prev => [newFile, ...prev]);
                    } else {
                        setSqlFiles(prev => prev.map(f => {
                            if (f.id === data.fileId) {
                                return {
                                    ...f,
                                    versions: [
                                        ...f.versions,
                                        {
                                            id: `v${f.versions.length + 1}-${Date.now()}`,
                                            version: f.versions.length + 1,
                                            date: new Date().toISOString(),
                                            description: data.description,
                                            user: currentUser?.name || 'User',
                                            tag: data.tag,
                                            sql: analyzingQuery?.queryText || ''
                                        }
                                    ]
                                };
                            }
                            return f;
                        }));
                    }
                    setSidePanel(null);
                    setToastMessage("Query version saved successfully.");
                }}
            />
          )}
          {sidePanel.type === 'queryPreview' && (
            <QueryPreviewContent 
                query={sidePanel.data} 
                onAnalyze={(q) => { setAnalyzingQuery(q); setAccountViewPage('Query analyzer'); setSidePanel(null); }}
                onOptimize={(q) => { setAnalyzingQuery(q); setAccountViewPage('Query optimizer'); setSidePanel(null); }}
                onSimulate={(q) => { setAnalyzingQuery(q); setAccountViewPage('Query simulator'); setSidePanel(null); }}
            />
          )}
          {sidePanel.type === 'updateAssignmentStatus' && (
            <div className="p-8">
                <h3 className="text-lg font-bold mb-4">Update Assignment Status</h3>
                <div className="space-y-4">
                    {(['Assigned', 'In progress', 'Optimized', 'Cannot be optimized', 'Resolved'] as AssignmentStatus[]).map(s => (
                        <button 
                            key={s}
                            onClick={() => {
                                handleUpdateAssignmentStatus(sidePanel.data.id, s);
                                setSidePanel(null);
                            }}
                            className="w-full text-left p-4 rounded-xl border border-border-light hover:bg-surface-nested transition-colors flex items-center justify-between group"
                        >
                            <span className="font-medium">{s}</span>
                            <IconChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
          )}
          {sidePanel?.type === 'setBudget' && (
          <SetBudgetFlow 
            accounts={connectionsData}
            applications={accountApplicationsData}
            initialData={sidePanel.data?.initialData}
            onClose={() => setSidePanel(null)} 
            onSuccess={(data) => {
              console.log('Budget set:', data);
              setSidePanel(null);
              setToastMessage(sidePanel.data?.initialData ? 'Budget updated successfully' : 'New budget initialized successfully');
            }} 
          />
        )}
      </SidePanel>
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;