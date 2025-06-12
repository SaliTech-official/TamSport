import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { newsData } from '../data/newsData';

// Icons
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Category: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
    </svg>
  ),
  Title: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Body: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Status: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Type: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  Slug: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  ),
  Video: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  Views: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  Likes: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  ArrowLeft: ({ isRTL }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  XMark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
};

const ArticleForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Determine if we're adding or editing
  const isEditing = location.pathname.includes('/edit/');

  // Initialize form data
  const [formData, setFormData] = useState({
    author: '',
    category: '',
    title: {
      fa: '',
      en: ''
    },
    body: {
      fa: '',
      en: ''
    },
    status: 'DR', // Draft by default
    type: 'TX', // Text by default
    slug: '',
    video_url: '',
    hits: 0,
    likes: 0
  });

  // Status options
  const statusOptions = [
    { value: 'DR', label: t('articleDraft') },
    { value: 'AC', label: t('articleAccepted') },
    { value: 'RJ', label: t('articleRejected') }
  ];

  // Type options
  const typeOptions = [
    { value: 'SS', label: t('articleSlideshow') },
    { value: 'VD', label: t('articleVideo') },
    { value: 'TX', label: t('articleText') }
  ];

  // Load article data if editing
  useEffect(() => {
    if (isEditing && id) {
      // Find the article in newsData
      const article = newsData.find(item => item.id === parseInt(id));
      if (article) {
        setFormData({
          author: article.author || '',
          category: article.category?.fa || '',
          title: {
            fa: article.title?.fa || '',
            en: article.title?.en || ''
          },
          body: {
            fa: article.body?.fa || '',
            en: article.body?.en || ''
          },
          status: article.status || 'DR',
          type: article.type || 'TX',
          slug: article.slug || '',
          video_url: article.video_url || '',
          hits: article.views || 0,
          likes: article.likes || 0
        });
      }
    }
  }, [isEditing, id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.author.trim()) {
      newErrors.author = t('articleRequiredField');
    }

    if (!formData.category.trim()) {
      newErrors.category = t('articleRequiredField');
    }

    if (!formData.title.fa.trim() && !formData.title.en.trim()) {
      newErrors.title = t('articleTitleRequired');
    }

    if (!formData.body.fa.trim() && !formData.body.en.trim()) {
      newErrors.body = t('articleBodyRequired');
    }

    if (!formData.slug.trim()) {
      newErrors.slug = t('articleRequiredField');
    }

    if (formData.type === 'VD' && !formData.video_url.trim()) {
      newErrors.video_url = t('articleVideoUrlRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTitleChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [lang]: value
      }
    }));
  };

  const handleBodyChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      body: {
        ...prev.body,
        [lang]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      setErrors({ submit: t('articleSavedError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className={`p-2 bg-quinary-tint-600 rounded-lg hover:bg-quinary-tint-500 transition-colors duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
              >
                <Icons.ArrowLeft isRTL={isRTL} />
              </button>
              <div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">
                  {isEditing ? t('articleEdit') : t('articleAddNew')}
                </h1>
                <p className="text-[16px] text-secondary">
                  {isEditing ? t('articleEditDesc') : t('articleAddNewDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('articleAuthor')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <select
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.author ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    <option value="">{t('articleSelectAuthor')}</option>
                    {fakeUsers.filter(user => user.is_author).map(user => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.author && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.author}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('articleCategory')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Category className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.category ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder={t('articleCategory')}
                  />
                </div>
                {errors.category && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Title and Body Tabs */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-quinary-tint-500">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-[16px] font-medium transition-all duration-300 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-secondary border-transparent hover:text-primary hover:border-quinary-tint-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div className="space-y-6">
                    {/* Persian Title */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('articleTitle')} (فارسی) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title.fa}
                          onChange={(e) => handleTitleChange('fa', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder={t('articleTitlePlaceholder')}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Persian Body */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('articleBody')} (فارسی) *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <Icons.Body className="text-secondary mt-1" />
                        </div>
                        <textarea
                          value={formData.body.fa}
                          onChange={(e) => handleBodyChange('fa', e.target.value)}
                          rows={8}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.body ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300 resize-vertical`}
                          placeholder={t('articleBodyPlaceholder')}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'english' && (
                  <div className="space-y-6">
                    {/* English Title */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('articleTitle')} (English) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title.en}
                          onChange={(e) => handleTitleChange('en', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder={t('articleTitlePlaceholder')}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* English Body */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('articleBody')} (English) *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <Icons.Body className="text-secondary mt-1" />
                        </div>
                        <textarea
                          value={formData.body.en}
                          onChange={(e) => handleBodyChange('en', e.target.value)}
                          rows={8}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.body ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300 resize-vertical`}
                          placeholder={t('articleBodyPlaceholder')}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(errors.title || errors.body) && (
                <div className="text-quaternary text-[14px]">
                  {errors.title && <p>{errors.title}</p>}
                  {errors.body && <p>{errors.body}</p>}
                </div>
              )}
            </div>

            {/* Article Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('articleStatus')}</span>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="px-3 py-1 bg-quinary-tint-700 text-secondary rounded border border-quinary-tint-500 focus:border-primary outline-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('articleType')}</span>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="px-3 py-1 bg-quinary-tint-700 text-secondary rounded border border-quinary-tint-500 focus:border-primary outline-none"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('articleSlug')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Slug className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.slug ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder={t('articleSlugPlaceholder')}
                    dir="ltr"
                  />
                </div>
                {errors.slug && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Video URL (only if type is video) */}
              {formData.type === 'VD' && (
                <div>
                  <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('articleVideoUrl')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Video className="text-secondary" />
                    </div>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => handleInputChange('video_url', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.video_url ? 'border-quaternary' : 'border-quinary-tint-500'
                      } focus:border-primary outline-none transition-colors duration-300`}
                      placeholder={t('articleVideoUrlPlaceholder')}
                      dir="ltr"
                    />
                  </div>
                  {errors.video_url && (
                    <p className="text-quaternary text-[14px] mt-1">{errors.video_url}</p>
                  )}
                </div>
              )}
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hits */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('articleHits')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Views className="text-secondary" />
                  </div>
                  <input
                    type="number"
                    value={formData.hits}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Likes */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('articleLikes')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Likes className="text-secondary" />
                  </div>
                  <input
                    type="number"
                    value={formData.likes}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-4 bg-quaternary/10 border border-quaternary rounded-lg">
                <Icons.XMark className="text-quaternary mr-2" />
                <span className="text-quaternary">{errors.submit}</span>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center p-4 bg-primary/10 border border-primary rounded-lg">
                <Icons.Check className="text-primary mr-2" />
                <span className="text-primary">{t('articleSavedSuccess')}</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  t('articleSave')
                )}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
              >
                {t('articleCancel')}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm; 