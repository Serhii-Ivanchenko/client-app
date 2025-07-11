import {
  Navigate,
  redirect,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';
import css from './App.module.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import LoaderSvg from '../Loader/LoaderSvg.jsx';
import { useDispatch, useSelector } from 'react-redux';
import RestrictedRoute from '../RestrictedRoute.jsx';
import PrivateRoute from '../PrivateRoute.jsx';
import { Toaster } from 'react-hot-toast';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage.jsx'));
const GaragePage = lazy(() => import('../../pages/GaragePage/GaragePage.jsx'));
const ServicePage = lazy(() =>
  import('../../pages/ServicePage/ServicePage.jsx')
);
const RepairPage = lazy(() => import('../../pages/RepairPage/RepairPage.jsx'));
const RecommendationsPage = lazy(() =>
  import('../../pages/RecommendationsPage/RecommendationsPage.jsx')
);

const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage.jsx')
);

export default function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
const handleAvatarClick = () => setIsProfileOpen(true);
const handleCloseProfile = () => setIsProfileOpen(false);
  // const dispatch = useDispatch();
  // const isLoading = useSelector(selectLoading);
  // const isRefreshing = useSelector(selectIsRefreshing);

  // const location = useLocation();

  // useEffect(() => {
  //   const refreshUserData = async () => {
  //     await dispatch(refreshUser());
  //   };
  //   refreshUserData();
  // }, [dispatch]);

  return (
    <Layout>
      {/* {isLoading || isRefreshing ? (
        <LoaderSvg />
      ) : ( */}
      <Suspense fallback={<LoaderSvg />}>
        <Toaster />
        <Header  onAvatarClick={handleAvatarClick} />
        <div className={css.mainWrapper}>
          {isProfileOpen ? (
            <ProfilePage onClose={handleCloseProfile} />
          ) : (

        <Routes>
          {/* <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to={'/garage'} replace /> : <LoginPage />
            }
          /> */}
          <Route
            path="/login"
            // element={<RestrictedRoute component={<LoginPage />} />}
            element={<LoginPage />}
          />
          <Route
            path="/garage"
            // element={
            //   <PrivateRoute redirectTo="/login" component={<GaragePage />} />
            // }
            element={<GaragePage />}
          />
          <Route
            path="/service"
            // element={
            //   <PrivateRoute redirectTo="/login" component={<ServicePage />} />
            // }
            element={<ServicePage />}
          />
          <Route
            path="/repair"
            // element={
            //   <PrivateRoute redirectTo="/login" component={<RepairPage />} />
            // }
            element={<RepairPage />}
          />
          <Route
            path="/recommendations"
            // element={
            //   <PrivateRoute redirectTo="/login" component={<RecommendationsPage />} />
            // }
            element={<RecommendationsPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        )}
        </div>
        <Footer />
      </Suspense>
      {/* )} */}
    </Layout>
  );
}
