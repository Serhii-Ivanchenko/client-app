import {
  Navigate,
  redirect,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';
import css from './App.module.css';
import TopPart from '../TopPart/TopPart.jsx';
import CalendarPart from '../MainScreenSection/CalendarPart/CalendarPart.jsx';
import SubcategoriesPart from '../DiagnosticScreen/SubcategoriesPart/SubcategoriesPart.jsx';
import { lazy, Suspense, useEffect, useState } from 'react';
import LoaderSvg from '../Loader/LoaderSvg.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsLoggedIn,
  selectIsRefreshing,
  selectLoading,
  selectUser,
} from '../../redux/auth/selectors.js';
import {
  getMechanicBalance,
  refreshUser,
} from '../../redux/auth/operations.js';
import RestrictedRoute from '../RestrictedRoute.jsx';
import PrivateRoute from '../PrivateRoute.jsx';
import { getAllCars } from '../../redux/cars/operations.js';
import CompletedDocPage from '../../pages/CompleteDocPage/CompletedDocPage.jsx';
import UpdateCarPage from '../../pages/UpdateCarPage/UpdateCarPage.jsx';
import { selectDate } from '../../redux/cars/selectors.js';
import { Toaster } from 'react-hot-toast';
// import { selectChosenDay } from '../../redux/cars/selectors.js';

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage.jsx'));
const MainPage = lazy(() => import('../../pages/MainPage/MainPage.jsx'));
const AddCarPage = lazy(() => import('../../pages/AddCarPage/AddCarPage.jsx'));
const PhotoCapturePage = lazy(() =>
  import('../../pages/PhotoCapturePage/PhotoCapturePage.jsx')
);
const DiagnosticPage = lazy(() =>
  import('../../pages/DiagnosticPage/DiagnosticPage.jsx')
);
const RepairPage = lazy(() => import('../../pages/RepairPage/RepairPage.jsx'));
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage.jsx')
);

const RequireMainVisit = ({ children }) => {
  const visited = sessionStorage.getItem('visitedMain');

  if (!visited) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const isRefreshing = useSelector(selectIsRefreshing);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const mechanicId = user?.id;

  // const [isAuthChecked, setIsAuthChecked] = useState(false);
  const location = useLocation();
  // console.log('isLoggedIn', isLoggedIn);
  // console.log('isRefreshing', isRefreshing);
  // console.log('isAuthChecked', isAuthChecked);
  // console.log('isLoading', isLoading);

  useEffect(() => {
    const refreshUserData = async () => {
      await dispatch(refreshUser());
      // setIsAuthChecked(true);
    };
    refreshUserData();
    // localStorage.setItem('date', new Date().toISOString().split('T')[0]);
  }, [dispatch]);

  const day = useSelector(selectDate);
  console.log('day', day);

  const storedDate = sessionStorage.getItem('date');
  console.log('storedDate', storedDate);

  useEffect(() => {
    const data = {
      date: day || storedDate,
      mechanic_id: mechanicId,
      // mechanic_id: 1,
    };
    console.log('data', data);

    user?.company_id && (day || storedDate) && dispatch(getAllCars(data));
  }, [dispatch, day, storedDate]);

  useEffect(() => {
    if (!mechanicId) {
      return;
    }
    dispatch(getMechanicBalance(mechanicId));
  }, [dispatch]);

  // const wage = array2.reduce((sum, i) => sum + Number(i.salary || 0), 0);
  // const possibleSum = array1.reduce((sum, i) => sum + Number(i.salary || 0), 0);
  // const amountPossible = wage + possibleSum;

  return (
    <Layout>
      {isLoading || isRefreshing ? (
        // || !isAuthChecked
        <LoaderSvg />
      ) : (
        <Suspense fallback={<LoaderSvg />}>
          {location.pathname !== '/login' &&
            location.pathname !== '/' &&
            !isLoading &&
            !isRefreshing && <TopPart />}
          {location.pathname === '/main' && !isLoading && !isRefreshing && (
            <CalendarPart />
          )}
          <Toaster />
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to={'/main'} replace /> : <LoginPage />
              }
            />
            <Route
              path="/login"
              element={<RestrictedRoute component={<LoginPage />} />}
            />
            <Route
              path="/main"
              element={
                <PrivateRoute redirectTo="/login" component={<MainPage />} />
              }
            />
            <Route
              path="/add-car"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <AddCarPage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route
              path="/car/:carId/update-car"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <UpdateCarPage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route
              path="/car/:carId/photos"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <PhotoCapturePage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route
              path="/car/:carId/diagnostics"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <DiagnosticPage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route
              path="/car/:carId/repair"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <RepairPage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route
              path="/car/:carId/completed-doc"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={
                    <RequireMainVisit>
                      <CompletedDocPage />
                    </RequireMainVisit>
                  }
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      )}
    </Layout>
  );
}
