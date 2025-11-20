import React, { useState } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import DeletePlayerModal from '../Modal/DeletePlayerModal';
import { API_PREFIX } from '../../../reverse_proxy';

const PlayerTable = ({ navigate, players, getPlayers, currentPage, totalItems, onPageChangeAfterDelete }) => {
  // Delete player state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin HTTP hook for delete operation
  const { sendRequest, isLoading: isDeleteLoading } = useAdminHttp();

  // Handle opening delete modal
  const handleOpenDeleteModal = (player) => {
    setPlayerToDelete(player);
    setDeleteModalOpen(true);
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setPlayerToDelete(null);
  };

  // Handle player deletion
  const handleDeletePlayer = async () => {
    if (!playerToDelete) return;
    setIsDeleting(true);
  
    try {
      await sendRequest(`${API_PREFIX}/admin/player-delete/${playerToDelete.id}/`, 'DELETE');
  
      setDeleteModalOpen(false);
      setPlayerToDelete(null);
      
      // After delete, handle page change if needed
      onPageChangeAfterDelete();
      
    } catch (error) {
      console.error('Failed to delete player:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Players table */}
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">پست</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">شماره</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">گل‌ها</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">بازی‌ها</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {players.length > 0 ? (
                players.map((player, index) => (
                  <tr key={player.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.name || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.position || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.number || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.goals || '0'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.games || '0'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/admin/players/edit/${player.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(player)}
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
                  <td colSpan="6" className="px-6 py-8 text-center text-secondary">
                    هیچ بازیکنی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Player Modal */}
      <DeletePlayerModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeletePlayer}
        playerName={playerToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PlayerTable; 