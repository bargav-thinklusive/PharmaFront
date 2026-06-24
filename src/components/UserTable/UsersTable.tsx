import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch,
  FiFilter,
  FiAlertTriangle,
} from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import type { GridReadyEvent } from "ag-grid-community";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowAutoHeightModule,
  RowSelectionModule,
  TextFilterModule,
  ValidationModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  RowAutoHeightModule,
  CellStyleModule,
  PaginationModule,
  RowSelectionModule
]);

import { columns } from "./columns";
import "../DrugTable/DrugsTable.css";

import useGet from "../../hooks/useGet";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";
import UserService from "../../services/UserService";
import Loader from "../Loader";
import PageHeader from "../shared/PageHeader";

const userService = new UserService();
const pageSize = 20;

const UsersTable: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);

  const { fetchData: fetchUsers, loading: usersLoading } = useGet();
  const { putData: updateUserApi } = usePut();
  const { deleteData: deleteUserApi } = useDelete();

  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal states for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers(userService.getUsers());
      const list = Array.isArray(res) ? res : (res?.data || []);
      setUsers(list);
    } catch (err) {
      console.error("Failed to load users", err);
      toast.error("Failed to fetch user list.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserApi(userService.updateUser(userId), { roles: [newRole] });
      toast.success("User role updated successfully!");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, roles: [newRole] } : u))
      );
    } catch (err) {
      console.error("Failed to update role", err);
      toast.error("Failed to update user role.");
    }
  };

  const confirmDeleteUser = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(`${userService.baseUrl}/user/${userToDelete._id}`);
      toast.success(`User ${userToDelete.name} deleted successfully.`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user", err);
      toast.error("Failed to delete user.");
    }
  };

  // Filtered users list for search & role filters
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u?.name || "";
      const email = u?.email || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());

      const userRoles = u?.roles || [];
      const matchesRole =
        roleFilter === "all" || userRoles.includes(roleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    params.api.hideOverlay();
  }, []);

  return (
    <div className="min-h-screen bg-page font-sans pt-14 pb-20">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="light"
        style={{ zIndex: 99999 }}
      />

      <PageHeader
        title="User Management"
        subtitle="Manage user roles and platform access permissions."
        eyebrow="Admin Panel"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Toolbar card */}
        <div className="bg-white rounded-2xl border border-border-main p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white placeholder-[#94A3B8] transition-shadow"
            />
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
              <FiFilter className="w-4 h-4" />
              <span>Role:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-border-main rounded-xl px-4 py-2.5 text-sm text-text-main font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="subscriber">Subscriber</option>
            </select>
          </div>
        </div>

        {/* AG Grid Table Card */}
        <div className="bg-white rounded-3xl border border-border-main overflow-hidden shadow-xs flex flex-col">
          {usersLoading ? (
            <div className="py-20">
              <Loader size="lg" color="green" message="Fetching users list..." />
            </div>
          ) : (
            <div
              className="ag-theme-quartz w-full"
              style={{ height: "500px", minHeight: "400px" }}
            >
              <AgGridReact
                ref={gridRef}
                rowData={filteredUsers}
                columnDefs={columns}
                getRowId={(params) => String(params.data?._id)}
                onGridReady={onGridReady}
                pagination={true}
                paginationPageSize={pageSize}
                loadingOverlayComponent={() => <div><Loader /></div>}
                defaultColDef={{
                  filter: true,
                  resizable: true,
                }}
                context={{
                  onUpdateRole: handleUpdateRole,
                  onDeleteUser: confirmDeleteUser,
                }}
                rowHeight={60}
                headerHeight={52}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 pt-6 pb-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-text-main font-display mb-1">
                  Delete User Account
                </h3>
                <p className="text-sm text-text-body leading-relaxed">
                  Are you sure you want to permanently delete user{" "}
                  <strong className="text-text-main">{userToDelete?.name}</strong> (
                  {userToDelete?.email})? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all duration-150 shadow-md cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
