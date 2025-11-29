import React, { useState } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import DeleteTeamModal from '../Modal/DeleteTeamModal';

const TeamTable = ({ navigate, teams, getTeams, currentPage, totalItems, onPageChangeAfterDelete }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { sendRequest } = useAdminHttp();

  const handleOpenDeleteModal = (team) => {
    setTeamToDelete(team);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;
    setIsDeleting(true);
    try {
      await sendRequest(`/api/admin/team-delete/${teamToDelete.id}/`, 'DELETE');
      setDeleteModalOpen(false);
      setTeamToDelete(null);
      // After delete, handle page change if needed
      onPageChangeAfterDelete();
    } catch (error) {
      console.error('Failed to delete team:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام تیم</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {teams.length > 0 ? (
                teams.map((team, index) => (
                  <tr key={team.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{team.name || '---'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/admin/teams/edit/${team.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(team)}
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
                  <td colSpan="2" className="px-6 py-8 text-center text-secondary">
                    هیچ تیمی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteTeamModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteTeam}
        teamName={teamToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TeamTable; 