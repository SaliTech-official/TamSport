import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { newsData } from '../data/newsData'
import NewsBox from './NewsBox'

export default function NewsDetail() {
  const { id } = useParams()
  const news = newsData.find(item => item.id === parseInt(id))
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  // Get 3 random suggested articles (excluding current article)
  const suggestedArticles = useMemo(() => {
    return newsData
      .filter(item => item.id !== parseInt(id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
  }, [id])

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[24px] text-secondary">News not found</p>
      </div>
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) {
      setIsDisliked(false)
    }
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) {
      setIsLiked(false)
    }
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      {/* Hero Image */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
        <img 
          src={news.image} 
          alt={news.title} 
          className={`w-full h-full object-cover ${news.type === 'video' ? 'brightness-50' : ''}`}
          onError={(e) => {
            console.error('Error loading image:', news.image)
            e.target.src = "/images/banners/ArticlePicture2.png"
          }}
        />
        {news.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => {
                // TODO: Add video playback functionality
                console.log('Play video clicked');
              }}
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
            </button>
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
                {news.title}
              </h1>
              
              {/* Main content */}
              <div className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-regular text-secondary mt-4 sm:mt-6 whitespace-pre-line">
                {news.content}
              </div>

              {/* Slideshow section - only for slideshow type */}
              {news.type === 'slideshow' && Array.isArray(news.slideshowImages) && news.slideshowImages.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {news.slideshowImages.map((image, index) => (
                      <div key={index} className="relative aspect-video">
                        <img
                          src={image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Error loading image:', image)
                            e.target.src = "/images/banners/ArticlePicture2.png"
                          }}
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
                  {news.date}
                </div>

                {/* Keywords and interactive elements row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {/* Keywords labels */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
                    {news.keywords?.map((keyword, index) => (
                      <div 
                        key={index}
                        className="min-w-[100px] sm:min-w-[119px] h-[28px] sm:h-[32px] bg-secondary-tint-500 flex items-center justify-center rounded-[20px] px-3 sm:px-4"
                      >
                        <span className="text-[14px] sm:text-[16px] font-regular text-quinary-tint-800 whitespace-nowrap">
                          {keyword}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive elements */}
                  <div className="flex items-center gap-4">
                    {/* Dislikes */}
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[16px] text-secondary font-medium">{news.dislikes}</span>
                      <button 
                        className={`text-secondary transition-colors ${isDisliked ? 'text-secondary' : ''}`}
                        onClick={handleDislike}
                      >
                        {isDisliked ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6">
                            <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[16px] text-secondary font-medium">{news.likes}</span>
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
                      <span className="text-[14px] sm:text-[16px] text-secondary">{news.views}</span>
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

          {/* Suggested Articles */}
          <div className="col-span-12 lg:col-span-4 mt-6 sm:mt-8 lg:mt-0 mb-16 sm:mb-24 md:mb-32">
            <div className="flex flex-col gap-4 sm:gap-6">
              {suggestedArticles.map((article) => (
                <NewsBox key={article.id} news={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 