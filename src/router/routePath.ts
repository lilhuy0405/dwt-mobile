import {
  AttendanceScreen,
  CommunicationScreen,
  ForgotPasswordScreen,
  HomeScreen,
  LoginScreen,
  MenuScreen,
  NewsScreen,
} from '../screen';
import BottomNavigator from './navigator/BottomNavigator.tsx';

export const routePath = [
  {
    name: 'Login',
    component: LoginScreen,
  },
  {
    name: 'ForgotPassword',
    component: ForgotPasswordScreen,
  },
  {
    name: 'HomePage',
    component: BottomNavigator,
  },
];

export const navigatorPath = [
  {
    name: 'Home',
    component: HomeScreen,
  },
  {
    name: 'Communication',
    component: CommunicationScreen,
  },
  {
    name: 'Attendance',
    component: AttendanceScreen,
  },
  {
    name: 'News',
    component: NewsScreen,
  },
  {
    name: 'Menu',
    component: MenuScreen,
  },
];
