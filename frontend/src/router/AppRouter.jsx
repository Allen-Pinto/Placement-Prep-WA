import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import { Loader } from '../components/common/Progress';
import { ROUTES } from '../utils/constants';

const Login = lazy(() => import('../pages/Auth/Login'));
const Signup = lazy(() => import('../pages/Auth/Signup'));
const AuthSuccess = lazy(() => import('../pages/Auth/AuthSuccess'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Practice = lazy(() => import('../pages/Practice/Practice'));
const Interviews = lazy(() => import('../pages/Interviews/Interviews'));
const InterviewDetail = lazy(() => import('../pages/Interviews/InterviewDetail'));
const QuizPlayer = lazy(() => import('../pages/Quiz/QuizPlayer'));
const Results = lazy(() => import('../pages/Quiz/Results'));
const Resume = lazy(() => import('../pages/Resume/Resume'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Loading fallback component
 */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" text="Loading..." />
  </div>
);

/**
 * App Router Configuration
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PRACTICE} element={<Practice />} />
            <Route path={ROUTES.INTERVIEWS} element={<Interviews />} />
            <Route path={ROUTES.INTERVIEW_DETAIL} element={<InterviewDetail />} />
            <Route path={ROUTES.QUIZ} element={<QuizPlayer />} />
            <Route path={ROUTES.RESULTS} element={<Results />} />
            <Route path={ROUTES.RESUME} element={<Resume />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>

          {/* Default redirect */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* 404 Not Found */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;