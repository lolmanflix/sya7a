import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { User, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Profile modal — lets an authenticated admin view their account info
 * and update their full name (synced to Firebase Auth + RTDB /admins/{uid}).
 */
export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { admin, updateProfile } = useAuth();
  const { language } = useLanguageTheme();
  const isAr = language === 'ar';
  const [fullName, setFullName] = useState(admin?.fullName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError(isAr ? 'لا يمكن أن يكون الاسم فارغاً.' : 'Full name cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateProfile(trimmed);
      toast.success(isAr ? 'تم تحديث الملف الشخصي بنجاح.' : 'Profile updated successfully.');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? 'تعذّر تحديث الملف الشخصي.'
            : 'Could not update profile.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
      maxWidth="sm"
    >
      <div className="space-y-5">
        {/* Account summary */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {(admin?.fullName || admin?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {admin?.fullName || 'Admin'}
            </p>
            <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
          </div>
        </div>

        {/* Full name */}
        <div>
<label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isAr ? 'الاسم الكامل' : 'Full Name'}
          </label>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1 text-sm text-slate-800 outline-none bg-transparent"
              placeholder={isAr ? 'اسمك الكامل' : 'Your full name'}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isAr ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 rounded-lg px-3 py-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="flex-1 text-sm text-slate-500 truncate">
              {admin?.email}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isAr ? 'موثّق' : 'Verified'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {isAr ? 'تواصل مع الدعم لتغيير بريد الحساب.' : 'Contact support to change the account email.'}
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            icon={isSaving ? undefined : <CheckCircle2 className="w-4 h-4" />}
          >
            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
