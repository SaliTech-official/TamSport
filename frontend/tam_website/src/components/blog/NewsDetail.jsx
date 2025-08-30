import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NewsBox from './NewsBox'
import useHttp from '../../hooks/useHttp.jsx'
import SpinLoader from '../../pages/UI/SpinLoader.jsx'
import SomethingWentWrong from '../../pages/UI/SomethingWentWrong.jsx'
import LazyImage from '../../components/UI/LazyImage.jsx'
import ArticleNotFound from '../../pages/UI/ArticleNotFound.jsx'
import domainUrl from '../../utils/api.js'
import './NewsDetail.css';


export default function NewsDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.language === 'fa'
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const {
    isLoading,
    isError,
    errorMessage,
    data: article,
  } = useHttp(`/api/blog/articles/${slug}`)


  // Initialize likeCount and isLiked when article data is received
  useEffect(() => {
    if (article) {
      setLikeCount(article.likes)
      setIsLiked(article.is_liked)
    }
  }, [article])

  

  if (isError && errorMessage?.detail === "No Article matches the given query.") {
    return <ArticleNotFound />
  } else if (isError) {
    return <SomethingWentWrong />
  }

  if (isLoading || !article) {
    return <SpinLoader />
  }

  const handleCategoryClick = (categorySlug) => {
    window.location.reload();
    navigate(`/news?category=${categorySlug}`);
  };

  const handleLike = async () => {
    try {
      // Optimistically update the UI
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
      setLikeCount(newLikeCount)
      setIsLiked(!isLiked)

      // Make API call to toggle like
      const response = await fetch(`/api/blog/article-like/${slug}`, {
        method: 'GET',
      })

      if (!response.ok) {
        // Revert changes if API call fails
        setLikeCount(likeCount)
        setIsLiked(isLiked)
        throw new Error('Failed to toggle like')
      }
    } catch (error) {
      console.error('Error toggling like:')
    }
  }

  const relatedArticles = article?.relatedArticles || []

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      {/* Hero Image */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
        <LazyImage 
          src={article.images[0]} 
          alt={article.title} 
          className={`w-full h-full object-cover ${article.type === 'VD' ? 'brightness-50' : ''}`}
        />
        {article.type === 'VD' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <a 
              href={article.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={0.5} 
                stroke="currentColor" 
                className="size-16 sm:size-20 md:size-24 text-quinary-tint-800 transition-transform duration-300 group-hover:scale-110"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-8">
          {/* Main Article */}
          <div className="col-span-12 lg:col-span-8 relative -mt-[100px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[163px] mb-16 sm:mb-24 md:mb-32">
            <div className="w-full bg-quinary-tint-900 shadow-[0_0_16px_rgba(0,0,0,0.25)] p-4 sm:p-6 md:p-8">
              <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold text-secondary line-clamp-2">
                {article.title}
              </h1>
              
              {/* Main content */}
              <div 
                className="article-content text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-regular text-secondary mt-4 sm:mt-6"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {/* Slideshow section - only for slideshow type */}
              {article.type === 'SS' && article.images.length > 1 && (
                <div className="mt-6 sm:mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {article.images.map((image, index) => (
                      <div key={index} className="relative aspect-video">
                        <LazyImage
                          src={image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Article metadata section */}
              <div className="mt-6 sm:mt-8 md:mt-[42px] flex flex-col">
                {/* Publication date */}
                <div className="text-[14px] sm:text-[16px] font-normal text-secondary-tint-500">
                  {article.time_ago}
                </div>

                {/* Keywords and interactive elements row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {/* Categories */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.categories?.map((category, index) => (
                      <React.Fragment key={index}>
                        {category.slug ? (
                          <button
                            onClick={() => handleCategoryClick(category.slug)}
                            className="text-[14px] sm:text-[16px] font-regular text-quaternary hover:text-secondary transition-colors duration-200 cursor-pointer"
                          >
                            {category.name}
                          </button>
                        ) : (
                          <span className="text-[14px] sm:text-[16px] font-regular text-quaternary">
                            {category.name}
                          </span>
                        )}
                        {index < article.categories.length - 1 && (
                          <span className="mx-2 text-secondary">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Interactive elements */}
                  <div className="flex items-center gap-2">
                    {/* Likes */}
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[16px] text-secondary font-medium">{likeCount}</span>
                      <button 
                        className={`text-secondary transition-colors ${isLiked ? 'text-secondary' : ''}`}
                        onClick={handleLike}
                      >
                        {isLiked ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6">
                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Separator */}
                    <div className="h-[24px] sm:h-[30px] w-px bg-secondary/50"></div>

                    {/* Views */}
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[16px] text-secondary">{article.view_count}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6 text-secondary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="col-span-12 lg:col-span-4 mt-6 sm:mt-8 lg:mt-0 mb-16 sm:mb-24 md:mb-32">
            <div className="flex flex-col gap-4 sm:gap-6">
              {relatedArticles.map((article) => (
                <NewsBox key={article.id} {...article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
