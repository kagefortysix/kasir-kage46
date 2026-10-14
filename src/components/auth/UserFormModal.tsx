"use client";

import React, { useState, useEffect } from "react";
import { usePosStore } from "@/store/usePosStore";
import { UserRole, UserAccount } from "@/types/pos";
import { useTranslation } from "@/lib/translations";
import { 
  UserPlus, 
  X, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Edit2
} from "lucide-react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserAccount | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { addUser, updateUser, users, addToast, settings } = usePosStore();
  const { t, isEnglish } = useTranslation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("cashier");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setName(userToEdit.name || "");
        setUsername(userToEdit.username || "");
        setPassword(userToEdit.password || "");
        setRole(userToEdit.role || "cashier");
      } else {
        setName("");
        setUsername("");
        setPassword("");
        setRole("cashier");
      }
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "");
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanName || !cleanPassword) {
      setError(isEnglish ? "All fields (Name, Username, Password) are required!" : "Semua kolom (Nama, Username, Password) wajib diisi!");
      return;
    }

    if (userToEdit) {
      // Editing existing account
      const isTaken = users.some(
        (u) => u.id !== userToEdit.id && u.username.toLowerCase() === cleanUsername
      );
      if (isTaken) {
        setError(isEnglish ? `Username "${cleanUsername}" is already taken by another account.` : `Username "${cleanUsername}" sudah digunakan oleh akun lain.`);
        return;
      }

      updateUser(userToEdit.id, {
        name: cleanName,
        username: cleanUsername,
        password: cleanPassword,
        role,
      });

      addToast(isEnglish ? `Account "${cleanName}" updated successfully!` : `Akun "${cleanName}" berhasil diperbarui!`, "success");
      onClose();
    } else {
      // Adding new account
      if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
        setError(isEnglish ? `Username "${cleanUsername}" is already taken. Please choose another.` : `Username "${cleanUsername}" sudah digunakan oleh kasir lain. Pilih username lain.`);
        return;
      }

      addUser({
        name: cleanName,
        username: cleanUsername,
        password: cleanPassword,
        role,
        isActive: true,
      });

      addToast(isEnglish ? `Account "${cleanName}" created successfully!` : `Akun kasir/pengguna "${cleanName}" berhasil dibuat!`, "success");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
              {userToEdit ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {userToEdit ? `${t.userModal.titleEdit}: ${userToEdit.name}` : t.userModal.titleAdd}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t.userModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.userModal.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.userModal.namePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.userModal.usernameLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder={t.userModal.usernamePlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.userModal.passwordLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.userModal.passwordPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 py-2 text-xs font-bold font-mono text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.userModal.roleLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("cashier")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "cashier"
                    ? "border-sky-500 bg-sky-50/70 dark:border-sky-700 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">{t.userModal.roleCashier}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.userModal.roleCashierDesc}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "owner"
                    ? "border-emerald-500 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">{t.userModal.roleOwner}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.userModal.roleOwnerDesc}
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.userModal.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              {t.userModal.saveBtn}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
