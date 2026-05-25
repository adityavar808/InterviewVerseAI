import {
  Pencil,
  ShieldMinus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import StatusBadge from "../ui/StatusBadge";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  formatDate,
  formatDateTime,
} from "../../utils/adminHelpers";

const UserTable = ({
  users,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-10">
        <LoadingSpinner label="Loading users" />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
        No users match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white/5">
            <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Skills</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-white/5 align-top text-sm text-slate-300"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {user.email}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <StatusBadge value={user.role} />
                </td>

                <td className="px-6 py-5">
                  <StatusBadge
                    value={user.status}
                  />
                </td>

                <td className="px-6 py-5">
                  <p className="max-w-[220px] text-slate-400">
                    {user.skills?.length
                      ? user.skills.join(", ")
                      : "No skills added"}
                  </p>
                </td>

                <td className="px-6 py-5 text-slate-400">
                  {formatDateTime(
                    user.lastLoginAt,
                  )}
                </td>

                <td className="px-6 py-5 text-slate-400">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(user)
                      }
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    {user.status ===
                    "suspended" ? (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            user,
                            "active",
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/15"
                      >
                        <ShieldCheck
                          size={14}
                        />
                        Activate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            user,
                            "suspended",
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-400/15"
                      >
                        <ShieldMinus
                          size={14}
                        />
                        Suspend
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(user)
                      }
                      className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-400/15"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
