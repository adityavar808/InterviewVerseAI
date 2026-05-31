import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ShieldAlert,
  UserPlus,
  UsersRound,
  UserCheck,
} from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import SearchBar from "../components/ui/SearchBar";
import UserTable from "../components/tables/UserTable";
import UserForm from "../components/Forms/UserForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { adminService } from "../services/adminApi";
import { formatCompactNumber } from "../utils/adminHelpers";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [overview, setOverview] =
    useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [formOpen, setFormOpen] =
    useState(false);
  const [editingUser, setEditingUser] =
    useState(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);

      const [usersResponse, dashboard] =
        await Promise.all([
          adminService.getUsers({
            search,
            role: roleFilter,
            status: statusFilter,
            page,
            limit: 8,
          }),
          adminService.getDashboard(),
        ]);

      setUsers(usersResponse.data);
      setMeta(usersResponse.meta);
      setOverview(dashboard.data.overview);
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to load users",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = async (user) => {
    const shouldDelete = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteUser(
        user._id,
      );
      toast.success("User deleted");
      loadUsers();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to delete user",
      );
    }
  };

  const handleStatusChange = async (
    user,
    nextStatus,
  ) => {
    try {
      await adminService.updateUserStatus(
        user._id,
        nextStatus,
      );
      toast.success(
        `User marked ${nextStatus}`,
      );
      loadUsers();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to update user status",
      );
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);

      if (editingUser) {
        await adminService.updateUser(
          editingUser._id,
          payload,
        );
        toast.success(
          "User updated successfully",
        );
      } else {
        await adminService.createUser(
          payload,
        );
        toast.success(
          "User created successfully",
        );
      }

      setFormOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to save user",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statCards = [
    {
      title: "Registered users",
      value: formatCompactNumber(
        overview?.totalUsers,
      ),
      growth: overview?.userGrowth ?? 0,
      subtitle: "current learner base",
      icon: UsersRound,
      accent: "cyan",
    },
    {
      title: "Verified users",
      value: formatCompactNumber(
        overview?.verifiedUsers,
      ),
      growth: overview?.userGrowth ?? 0,
      subtitle: "ready to use platform",
      icon: UserCheck,
      accent: "emerald",
    },
    {
      title: "Suspended users",
      value: formatCompactNumber(
        overview?.suspendedUsers,
      ),
      growth: 0,
      subtitle: "accounts needing review",
      icon: ShieldAlert,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(15,23,42,0.82),rgba(16,185,129,0.07))] p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
            User administration
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            Manage platform users
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Search, edit, suspend, and create learner or admin accounts with real backend persistence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          <UserPlus size={16} />
          Add user
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard
            key={card.title}
            {...card}
          />
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Directory
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Account table
            </h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <SearchBar
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(
                  event.target.value,
                );
              }}
              placeholder="Search by name or email"
            />

            <select
              value={roleFilter}
              onChange={(event) => {
                setPage(1);
                setRoleFilter(
                  event.target.value,
                );
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">
                All roles
              </option>
              <option value="student">
                Students
              </option>
              <option value="admin">
                Admins
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(
                  event.target.value,
                );
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">
                All statuses
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
              <option value="suspended">
                Suspended
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <UserTable
            users={users}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={
              handleStatusChange
            }
          />
        </div>

        {isLoading ? null : (
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              Showing page {meta?.page || 1}
              {" "}of{" "}
              {meta?.totalPages || 1}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={
                  !meta ||
                  meta.page <= 1
                }
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                  )
                }
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  !meta ||
                  meta.page >=
                    meta.totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    current + 1,
                  )
                }
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <UserForm
        open={formOpen}
        mode={
          editingUser ? "edit" : "create"
        }
        initialValues={editingUser}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
      />

      {isLoading && !users.length ? (
        <LoadingSpinner
          label="Loading users"
          className="py-4"
        />
      ) : null}
    </div>
  );
};

export default Users;
