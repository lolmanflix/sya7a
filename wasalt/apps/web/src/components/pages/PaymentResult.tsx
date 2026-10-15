import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  verifyPayment,
  readPendingCheckout,
  clearPendingCheckout,
  cleanRedirectParamsFromUrl,
  PendingCheckout,
} from '../../services/kashierService';
import { activateSubscription } from '../../services/subscriptionService';

interface PaymentResultProps {
  /** Full query params Kashier redirected back with. */
  params: Record<string, string>;
  /** User is done reviewing the result → parent switches view + cleans URL. */
  onDone: (destination: 'download' | 'dashboard', pending: PendingCheckout | null) => void;
}

/**
 * Shown when the browser returns from Kashier's hosted checkout.
 * Verifies the signed redirect server-side, activates the plan on success,
 * then hands control back to the app.
 */
export const PaymentResult: React.FC<PaymentResultProps> = ({ params, onDone }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = useState<'verifying' | 'activating' | 'done' | 'error'>('verifying');
  const [status, setStatus] = useState<'SUCCESS' | 'FAILURE' | 'PENDING' | 'UNKNOWN'>('PENDING');
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingCheckout | null>(() => readPendingCheckout());
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      try {
        const result = await verifyPayment(params);
        if (!result.signatureValid) {
          setPhase('error');
          setMessage('This payment result could not be authenticated. Please contact support.');
          return;
        }
        setStatus(result.status);

        if (result.status !== 'SUCCESS') {
          setPhase('done');
          return;
        }

        // Success → activate the plan (needs the signed-in owner from onboarding/billing).
        const ctx = readPendingCheckout();
        setPending(ctx);
        if (ctx?.companyId && isAuthenticated) {
          setPhase('activating');
          await activateSubscription(ctx.companyId);
        } else if (ctx?.companyId) {
          // Auth not ready yet — fall through to the auth-dependent effect below.
          return;
        }
        setPhase('done');
      } catch (err) {
        setPhase('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    run();
  }, [params, isAuthenticated]);

  // If auth resolved after verification finished, activate then.
  useEffect(() => {
    if (phase !== 'verifying' || started.current) return;
    if (pending?.companyId && isAuthenticated) {
      setPhase('activating');
      activateSubscription(pending.companyId)
        .then(() => setPhase('done'))
        .catch((err) => {
          setPhase('error');
          setMessage(err instanceof Error ? err.message : 'Activation failed');
        });
    }
  }, [phase, pending, isAuthenticated]);

  const finish = () => {
    const ctx = pending ?? readPendingCheckout();
    cleanRedirectParamsFromUrl();
    clearPendingCheckout();
    onDone(ctx?.context === 'billing' ? 'dashboard' : 'download', ctx);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center">
        {phase === 'verifying' || phase === 'activating' ? (
          <>
            <Loader2 className="w-10 h-10 mx-auto text-blue-600 animate-spin" />
            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              {phase === 'verifying' ? 'Verifying your payment…' : 'Activating your plan…'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Don't close this window — it only takes a moment.
            </p>
          </>
        ) : phase === 'error' ? (
          <>
            <XCircle className="w-10 h-10 mx-auto text-red-500" />
            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              Payment result unclear
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">{message}</p>
            <p className="mt-2 text-[11px] text-slate-400">
              Your card was not charged twice — if money was taken, contact support with your
              order reference.
            </p>
            <Button variant="outline" className="mt-4 w-full justify-center" onClick={finish}>
              Back
            </Button>
          </>
        ) : status === 'SUCCESS' ? (
          <>
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
              Payment successful 🎉
            </h3>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {pending?.context === 'billing' ? 'Your plan upgrade is active.' : 'Your plan is active.'}
            </div>
            {params.amount && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5">
                {params.amount} {params.currency || 'EGP'}
                <Badge variant="success">Paid</Badge>
              </div>
            )}
            <Button variant="primary" className="mt-5 w-full justify-center" onClick={finish}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <XCircle className="w-10 h-10 mx-auto text-red-500" />
            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              {status === 'FAILURE' ? 'Payment failed' : `Payment ${String(status).toLowerCase()}`}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">
              {status === 'FAILURE'
                ? 'No charge was made. You can try again whenever you like — your plan stays on free trial until then.'
                : 'Your plan stays on free trial until the payment is confirmed.'}
            </p>
            <Button variant="primary" className="mt-4 w-full justify-center" onClick={finish}>
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
