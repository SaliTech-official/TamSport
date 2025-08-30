import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { useNavigate } from 'react-router-dom';
import { AdminIcons } from '../../../data/Icons';
import { FaEye, FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext
  
  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  
  // گرفتن همه اطلاعات داشبورد از یک API
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useAdminHttp(`/api/admin/admin-dashboard-data/`);

  if (dashboardLoading) {
    return <SpinLoader />;
  }

  if (dashboardError) {
    return <SomethingWentWrong />;
  }

  // محاسبه توزیع وضعیت مقالات
  const articleStatusData = [
    { 
      name: 'منتشر شده', 
      value: dashboardData?.published_articles || 0, 
      color: '#10B981' 
    },
    { 
      name: 'پیش‌نویس', 
      value: dashboardData?.draft_articles || 0, 
      color: '#F59E0B' 
    }
  ];

  // Calculate total articles
  const totalArticles = (dashboardData?.published_articles || 0) + (dashboardData?.draft_articles || 0);

  // Calculate percentages for the legend
  const publishedPercentage = totalArticles > 0 ? (dashboardData?.published_articles || 0) / totalArticles : 0;
  const draftPercentage = totalArticles > 0 ? (dashboardData?.draft_articles || 0) / totalArticles : 0;

  // Define colors for the chart
  const publishedChartColor = '#10B981'; // A more vibrant green (Tailwind green-500)
  const draftChartColor = '#F59E0B';     // A richer amber (Tailwind amber-500)
  const backgroundChartColor = '#E5E7EB'; // A subtle gray for the chart background/empty state

  // Radius and circumference for the circle
  const radius = 40;
  const strokeWidth = 12; // Make the donut thicker
  const circumference = 2 * Math.PI * radius;

  // Calculate the strokeDashoffset for the published segment.
  const publishedSegmentOffset = circumference * (1 - publishedPercentage);

  // Animation variants for the drawing effect of the donut segments
  const donutDrawAnimation = {
    hidden: { strokeDashoffset: circumference }, // Start completely hidden (full offset)
    visible: {
      strokeDashoffset: 0, // Animate to 0 to reveal the segment fully
      transition: {
        type: "spring", // Use spring for a more organic feel
        stiffness: 60, // Adjust stiffness for desired bounce
        damping: 10,  // Adjust damping for how quickly it settles
        duration: 1.8, // Slower, more graceful drawing animation
        ease: "easeInOut"
      }
    }
  };

  // Animation for the published segment to start after the draft segment with a spring effect
  const publishedDonutDrawAnimation = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: publishedSegmentOffset,
      transition: {
        type: "spring", // Use spring for a more organic feel
        stiffness: 70, // Adjust stiffness for desired bounce
        damping: 10,  // Adjust damping for how quickly it settles
        duration: 1.5, // Total duration still matters for overall feel
        delay: 0.5    // Delay after draft segment starts
      }
    }
  };

  // Text animation for the center numbers
  const textFadeInScale = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.2, // Delay until after the main donut animation
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {    
    hidden: { y: 120, opacity: 0, scale: 0.6 },
    visible: {      
      y: 0,      
      opacity: 1,      
      scale: 1,     
      transition: { 
        type: "spring", 
        stiffness: 150,
        damping: 12,
        duration: 0.9
      }    
    },    
    hover: {      
      scale: 1.03,     
      transition: { 
        type: "spring", 
        stiffness: 200,
        damping: 15,
        duration: 0.2
      }    
    }
  };

  const isSuperuser = user?.is_superuser;
  const isAuthor = user?.is_author && !isSuperuser; // Only author if not superuser

  const dashboardCards = [];

  if (isSuperuser) {
    dashboardCards.push(
      // کل کاربران
      <motion.div
        key="users"
        initial={{ opacity: 0, y: -200, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 200, scale: 0.96 }}
        whileHover="hover"
        variants={itemVariants}
        className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary">کل کاربران</p>
            <p className="text-2xl font-semibold text-primary">{dashboardData?.users || 0}</p>
          </div>
          <div
            className="p-3 bg-primary bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-primary hover:bg-opacity-30"
            onClick={() => navigate('/admin/users')}
          >
            <AdminIcons.Users />
          </div>
        </div>
      </motion.div>
    );
  }

  dashboardCards.push(
    // مقالات
    <motion.div
      key="articles"
      initial={{ opacity: 0, y: -200, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 200, scale: 0.96 }}
      whileHover="hover"
      variants={itemVariants}
      className={`bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu ${
        isSuperuser ? 'col-span-1' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">مقالات</p>
          <p className="text-2xl font-semibold text-primary">{dashboardData?.articles || 0}</p>
        </div>
        <div
          className="p-3 bg-green-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-30"
          onClick={() => navigate('/admin/news')}
        >
          <AdminIcons.News />
        </div>
      </div>
    </motion.div>,
    // تیم‌ها
    <motion.div
      key="teams"
      initial={{ opacity: 0, y: -200, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 200, scale: 0.96 }}
      whileHover="hover"
      variants={itemVariants}
      className={`bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu ${
        isSuperuser ? 'col-span-1' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">تیم‌ها</p>
          <p className="text-2xl font-semibold text-primary">{dashboardData?.teams || 0}</p>
        </div>
        <div
          className="p-3 bg-blue-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-blue-500 hover:bg-opacity-30"
          onClick={()=>{navigate('/admin/teams')}}
        >
          <AdminIcons.Teams />
        </div>
      </div>
    </motion.div>,
    // بازیکن‌ها
    <motion.div
      key="players"
      initial={{ opacity: 0, y: -200, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 200, scale: 0.96 }}
      whileHover="hover"
      variants={itemVariants}
      className={`bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu ${
        isSuperuser ? 'col-span-1' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">بازیکن‌ها</p>
          <p className="text-2xl font-semibold text-primary">{dashboardData?.players || 0}</p>
        </div>
        <div
          className="p-3 bg-yellow-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-yellow-500 hover:bg-opacity-30"
          onClick={() => navigate('/admin/players')}
        >
          <AdminIcons.Players />
        </div>
      </div>
    </motion.div>
  );

  dashboardCards.push(
    // بازدید کلی
    <motion.div
      key="total_views"
      initial={{ opacity: 0, y: -200, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 200, scale: 0.96 }}
      whileHover="hover"
      variants={itemVariants}
      className={`bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu ${
        isSuperuser ? 'col-span-1 text-center flex-col items-center justify-center p-2' : ''
      }`}
    >
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-sm font-medium text-secondary `}>بازدید کلی</p>
          <p className={`text-2xl font-semibold text-primary `} >{dashboardData?.total_views || 0}</p>
        </div>
          <div
            className="p-3 bg-purple-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-purple-500 hover:bg-opacity-30"
          >
            <AdminIcons.TotalViews />
          </div>
      </div>
    </motion.div>
  );

  // Reorder for superuser as per request: کل کاربران, مقالات, تیم‌ها, بازیکن‌ها, بازدید کلی
  const orderedSuperuserCards = [
    dashboardCards.find(card => card.key === 'users'),
    dashboardCards.find(card => card.key === 'articles'),
    dashboardCards.find(card => card.key === 'teams'),
    dashboardCards.find(card => card.key === 'players'),
    dashboardCards.find(card => card.key === 'total_views'),
  ].filter(Boolean);

  // Author cards: مقالات, تیم‌ها, بازیکن‌ها, بازدید کلی
  const orderedAuthorCards = [
    dashboardCards.find(card => card.key === 'articles'),
    dashboardCards.find(card => card.key === 'teams'),
    dashboardCards.find(card => card.key === 'players'),
    dashboardCards.find(card => card.key === 'total_views'),
  ].filter(Boolean);

  const cardsToRender = isSuperuser ? orderedSuperuserCards : (isAuthor ? orderedAuthorCards : []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">داشبورد</h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-quinary-tint-800 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-sm font-medium text-secondary">آنلاین</p>
        </motion.div>
      </div>
      
      {/* کارت‌های آمار */}
      <motion.div
        className={`grid gap-6 ${isSuperuser ? 'grid-cols-5' : 'grid-cols-4'}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.35, delayChildren: 0.2 }
          }
        }}
      >
        {cardsToRender}
      </motion.div>

      {/* بخش میانی - نمودارها و لیست‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* توزیع وضعیت محتوا */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">وضعیت محتوا</h2>
          <div className="relative h-52 w-full flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle - acts as the full ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={backgroundChartColor}
                strokeWidth={strokeWidth}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />

              {/* Draft Articles Segment (base layer, draws in) */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={draftChartColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference} // Use full circumference for the dash array
                initial="hidden"
                animate="visible"
                variants={donutDrawAnimation} // Use the general drawing animation
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />

              {/* Published Articles Segment (draws on top, showing its proportion) */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={publishedChartColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial="hidden"
                animate="visible"
                variants={publishedDonutDrawAnimation} // Use the specific animation with delay and correct offset
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />

              {/* Text in the center */}
              <motion.text
                x="50"
                y="45"
                textAnchor="middle"
                className="text-2xl font-bold"
                fill="#4B5563"
                variants={textFadeInScale} // Apply text animation
                initial="hidden"
                animate="visible"
              >
                {totalArticles}
              </motion.text>
              <motion.text
                x="50"
                y="65"
                textAnchor="middle"
                className="text-xs"
                fill="#6B7280"
                variants={textFadeInScale} // Apply text animation
                initial="hidden"
                animate="visible"
              >
                کل مقالات
              </motion.text>
            </svg>
          </div>
          <div className="flex flex-col gap-3 mt-6 w-full px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: publishedChartColor }}></div>
                <span className="text-base font-medium text-secondary">منتشر شده</span>
              </div>
              <span className="text-base font-semibold text-primary">{dashboardData?.published_articles || 0} ({Math.round(publishedPercentage * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: draftChartColor }}></div>
                <span className="text-base font-medium text-secondary">پیش‌نویس</span>
              </div>
              <span className="text-base font-semibold text-primary">{dashboardData?.draft_articles || 0} ({Math.round(draftPercentage * 100)}%)</span>
            </div>
          </div>
        </motion.div>

        {/* مقالات پربازدید */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">مقالات پربازدید</h2>
          <div className="flex flex-col gap-4">
            {dashboardData?.top_viewed_articles?.length > 0 ? (
              dashboardData.top_viewed_articles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  variants={itemVariants}
                  whileHover={{ scale: 1.035, transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 } }}
                  whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 } }}
                  onClick={() => navigate(`/news/${article.slug}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl bg-quinary-tint-800 shadow-md border border-quinary-tint-700 transition-shadow duration-150 hover:shadow-lg"
                  initial={{ opacity: 0, y: 200, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.08 * index }}
                >
                  {/* Accent line */}
                  <div className="absolute right-0 top-0 h-full w-1 bg-primary rounded-tr-xl rounded-br-xl transition-all duration-150 group-hover:w-1.5" />
                  {/* Content */}
                  <div className="flex flex-col gap-1 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">#{index + 1}</span>
                      <FaEye className="text-primary text-sm" />
                      <span className="text-secondary-tint-200 text-xs font-semibold">{article.views} بازدید</span>
                    </div>
                    <p className="text-secondary font-bold text-base md:text-lg group-hover:text-primary transition-colors duration-200">{article.title}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-secondary text-center">مقاله‌ای یافت نشد.</p>
            )}
          </div>
        </motion.div>

        {/* مقالات محبوب */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">مقالات محبوب</h2>
          <div className="flex flex-col gap-4">
            {dashboardData?.top_liked_articles?.length > 0 ? (
              dashboardData.top_liked_articles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  variants={itemVariants}
                  whileHover={{ scale: 1.035, transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 } }}
                  whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 } }}
                  onClick={() => navigate(`/news/${article.slug}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl bg-quinary-tint-800 shadow-md border border-quinary-tint-700 transition-shadow duration-150 hover:shadow-lg"
                  initial={{ opacity: 0, y: 200, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.08 * index }}
                >
                  {/* Accent line */}
                  <div className="absolute right-0 top-0 h-full w-1 bg-quaternary rounded-tr-xl rounded-br-xl transition-all duration-150 group-hover:w-1.5" />
                  {/* Content */}
                  <div className="flex flex-col gap-1 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-quaternary/10 text-quaternary text-xs font-bold px-2 py-0.5 rounded-full">#{index + 1}</span>
                      <FaHeart className="text-quaternary text-sm" />
                      <span className="text-secondary-tint-200 text-xs font-semibold">{article.likes} لایک</span>
                    </div>
                    <p className="text-secondary font-bold text-base md:text-lg group-hover:text-quaternary transition-colors duration-200">{article.title}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-secondary text-center">مقاله‌ای یافت نشد.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;