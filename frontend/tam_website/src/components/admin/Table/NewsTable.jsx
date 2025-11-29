import React, { useState } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import DeleteArticleModal from '../Modal/DeleteNewsModal';

const NewsTable = ({ navigate, articles, getArticles, currentPage, totalItems, onPageChangeAfterDelete }) => {
  // Delete article state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin HTTP hook for delete operation
  const { sendRequest, isLoading: isDeleteLoading } = useAdminHttp();

  // Handle opening delete modal
  const handleOpenDeleteModal = (article) => {  
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  // Handle article deletion
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
  
    try {
      await sendRequest(`/api/admin/article-delete/${articleToDelete.id}/`, 'DELETE');
  
      setDeleteModalOpen(false);
      setArticleToDelete(null);
      
      // After delete, handle page change if needed
      onPageChangeAfterDelete();
      
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to render status
  const renderStatus = (status) => {
    switch (status) {
      case 'DR':
        return 'پیش نویس';
      case 'PB':
        return 'منتشر شده';
      default:
        return status || '---';
    }
  };

  // Helper function to render type
  const renderType = (type) => {
    switch (type) {
      case 'TX':
        return 'عادی';
      case 'SS':
        return 'اسلایدشو';
      case 'VD':
        return 'ویدیو';
      default:
        return type || '---';
    }
  };

  // Helper function to format date (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    
    // Extract just the date part (YYYY-MM-DD)
    const dateParts = dateString.split(' ')[0];
    return dateParts;
  };

  // Helper function to truncate title
  const truncateTitle = (title, wordCount = 5) => {
    if (!title) return '---';
    
    const words = title.split(' ');
    if (words.length <= wordCount) return title;
    
    return words.slice(0, wordCount).join(' ') + '...';
  };

  return (
    <div className="space-y-6">
      {/* Articles table */}
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[20%]">عنوان مقاله</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[12%]">وضعیت</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[12%]">نوع</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[12%]">تیم</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[7%]">بازدید</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[7%]">پسند</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[15%]">آخرین بروزرسانی</th>
                <th className="px-4 py-3 text-[14px] font-semibold text-right w-[15%]">تاریخ انتشار</th>
                <th className="px-4 py-3 w-1/12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {articles && articles.length > 0 ? (
                articles.map((article, index) => (
                  <tr key={article.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{truncateTitle(article.title)}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right relative">
                      {renderStatus(article.status)}
                      {
                        article.scheduled_publish_at && article.status === 'DR' ? (
                          <button type="button" class=" bg-quaternary text-white rounded-lg hover:bg-quaternary/90 transition-colors duration-300 absolute top-[1.2rem] left-[1.5rem]" title="مقاله زمان&zwnj;بندی شده"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                        ) : undefined
                      }
                      </td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{renderType(article.type)}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{article.team || '---'}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{article.hits_count || '0'}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{article.likes_count || '0'}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{formatDate(article.updated_date)}</td>
                    <td className="px-4 py-3 text-[14px] text-secondary text-right">{formatDate(article.created_date)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/admin/news/edit/${article.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(article)}
                          className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-secondary">
                    هیچ مقاله‌ای یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Article Modal */}
      <DeleteArticleModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteArticle}
        articleTitle={articleToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default NewsTable; 