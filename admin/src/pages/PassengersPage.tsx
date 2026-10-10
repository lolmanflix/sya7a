import React, { useState } from 'react';
import { Users, History, Route, Trash2, Search, Filter, Copy, Check } from 'lucide-react';
import { PassengerRecord, UserHistoryItem } from '../types';
import { clearPassengerHistory, deleteUserFromRTDB } from '../services/usersService';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface PassengersPageProps {
  passengers: PassengerRecord[];
}

/**
 * Administrative directory for commuter passenger accounts and trip records.
 */
export const PassengersPage: React.FC<PassengersPageProps> = ({ passengers }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'PASSENGER' | 'DRIVER' | 'WITH_HISTORY'>('ALL');
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerRecord | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Filter passengers based on search and role
  const filtered = passengers.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.uid.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.displayName && p.displayName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (roleFilter === 'PASSENGER') return p.role === 'PASSENGER' || !p.role;
    if (roleFilter === 'DRIVER') return p.role === 'DRIVER';
    if (roleFilter === 'WITH_HISTORY') return p.historyCount > 0;
    return true;
  });

  /**
   * Copies commuter UID to system clipboard.
   */
  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    toast.success(t('users.uidCopied'));
    setTimeout(() => setCopiedUid(null), 2000);
  };

  /**
   * Clears trip history records for the selected passenger.
   */
  const handleClearHistory = async (uid: string) => {
    if (confirm(t('users.clearHistoryConfirm'))) {
      try {
        await clearPassengerHistory(uid);
        toast.success(t('users.historyCleared'));
        if (selectedPassenger?.uid === uid) {
          setSelectedPassenger({ ...selectedPassenger, historyCount: 0, history: [] });
        }
      } catch {
        toast.error(t('users.clearHistoryError'));
      }
    }
  };

  /**
   * Deletes a passenger account from the system directory.
   */
  const handleDeleteUser = async (uid: string, name: string) => {
    if (confirm(t('users.deleteConfirm', { name }))) {
      try {
        await deleteUserFromRTDB(uid);
        toast.success(t('users.removeSuccess', { name }));
        if (selectedPassenger?.uid === uid) {
          setSelectedPassenger(null);
        }
      } catch {
        toast.error(t('users.removeError'));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">{t('users.title')}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('users.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.searchPlaceholder')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl ps-9 pe-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                roleFilter === 'ALL' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('users.filterAll', { count: passengers.length })}
            </button>
            <button
              onClick={() => setRoleFilter('PASSENGER')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                roleFilter === 'PASSENGER' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('users.filterPassengers')}
            </button>
            <button
              onClick={() => setRoleFilter('DRIVER')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                roleFilter === 'DRIVER' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('users.filterDrivers')}
            </button>
            <button
              onClick={() => setRoleFilter('WITH_HISTORY')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                roleFilter === 'WITH_HISTORY' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('users.filterActiveTrips')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* User List (2 columns) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              {t('users.showingUsers', { count: filtered.length })}
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[620px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-slate-500 text-xs">{t('users.noMatches')}</p>
            ) : (
              filtered.map((p) => {
                const isSelected = selectedPassenger?.uid === p.uid;
                const isDriver = p.role === 'DRIVER';
                return (
                  <div
                    key={p.uid}
                    onClick={() => setSelectedPassenger(p)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand-500/10 border-s-4 border-brand-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                        isDriver ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {p.displayName ? p.displayName.charAt(0).toUpperCase() : (p.email ? p.email.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div className="truncate">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                          <span className="font-bold text-white text-sm truncate">
                            {p.displayName || p.email || t('users.anonymousUser')}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                            isDriver ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {p.role || 'PASSENGER'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 truncate block mt-0.5">{p.email || t('users.noEmail')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {p.historyCount > 0 ? (
                        <span className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-medium whitespace-nowrap">
                          {t('users.tripsCount', { count: p.historyCount })}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 text-slate-500 whitespace-nowrap">
                          {t('users.zeroTrips')}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUid(p.uid);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg transition-colors"
                        title={t('users.copyUid')}
                      >
                        {copiedUid === p.uid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(p.uid, p.displayName || p.email || p.uid);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title={t('users.removeUserTitle')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected User Details Panel */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-brand-400" />
              {t('users.accountHistory')}
            </h4>
          </div>

          {!selectedPassenger ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p>{t('users.selectUserHint')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('users.displayNameLabel')}</span>
                  <strong className="text-white">{selectedPassenger.displayName || t('users.none')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('users.emailLabel')}</span>
                  <strong className="text-white truncate max-w-[180px]">{selectedPassenger.email || t('users.na')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('users.roleLabel')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">
                    {selectedPassenger.role || 'PASSENGER'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('users.uidLabel')}</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[160px]">{selectedPassenger.uid}</span>
                </div>
                {selectedPassenger.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('users.createdLabel')}</span>
                    <span className="text-[10px] text-slate-300">{new Date(selectedPassenger.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Trips Header */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('users.recordedTrips', { count: selectedPassenger.history.length })}
                </span>
                {selectedPassenger.history.length > 0 && (
                  <button
                    onClick={() => handleClearHistory(selectedPassenger.uid)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> {t('users.clearHistory')}
                  </button>
                )}
              </div>

              {selectedPassenger.history.length === 0 ? (
                <p className="py-8 text-center text-slate-500 text-xs">{t('users.noHistory')}</p>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pe-1">
                  {selectedPassenger.history.map((h: UserHistoryItem) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Route className="w-3.5 h-3.5 text-brand-400" />
                          {h.busLine}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-slate-400 block text-[11px]">
                        {t('users.operatorLabel')} <strong className="text-slate-300">{h.companyName}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

