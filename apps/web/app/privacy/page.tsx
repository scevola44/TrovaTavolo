export const metadata = {
  title: 'Privacy — Trova Tavolo',
};

export default function PrivacyPage() {
  return (
    <article className="prose mx-auto max-w-2xl py-8 text-slate-800">
      <h1 className="text-2xl font-bold">Informativa sulla privacy</h1>
      <p className="mt-4 text-sm text-slate-500">
        Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
      </p>

      <h2 className="mt-8 text-lg font-semibold">Titolare del trattamento</h2>
      <p className="mt-2">
        Trova Tavolo è gestito dal gestore del servizio, contattabile tramite i canali pubblicati
        sul sito.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Dati raccolti</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li>Email e password (in forma crittografata), utilizzate per l'autenticazione.</li>
        <li>Nome visualizzato, biografia e contatto forniti volontariamente dall'utente.</li>
        <li>Annunci pubblicati e relativa associazione con città e sistemi di gioco.</li>
        <li>Log tecnici minimi necessari al funzionamento del servizio.</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Base giuridica e finalità</h2>
      <p className="mt-2">
        Il trattamento è basato sull'esecuzione del contratto (art. 6.1.b GDPR) per permettere la
        pubblicazione e la consultazione degli annunci, e sul legittimo interesse per la sicurezza
        del servizio.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Conservazione</h2>
      <p className="mt-2">
        Gli annunci scadono automaticamente dopo 60 giorni. I dati dell'account vengono cancellati
        immediatamente quando l'utente elimina l'account dalla propria area personale.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Diritti dell'utente</h2>
      <p className="mt-2">
        L'utente ha diritto di accesso, rettifica, cancellazione, limitazione del trattamento,
        portabilità e opposizione. La cancellazione può essere eseguita autonomamente dalla pagina
        del profilo.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Cookie</h2>
      <p className="mt-2">
        Usiamo esclusivamente cookie tecnici necessari (sessione di autenticazione). Nessun cookie
        di profilazione o di terze parti.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Fornitori</h2>
      <p className="mt-2">
        I dati sono ospitati da Supabase (infrastruttura cloud) e Vercel (hosting applicativo),
        entrambi conformi al GDPR.
      </p>
    </article>
  );
}
