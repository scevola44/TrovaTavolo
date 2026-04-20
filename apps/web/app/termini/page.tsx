export const metadata = {
  title: 'Termini — Trova Tavolo',
};

export default function TerminiPage() {
  return (
    <article className="prose mx-auto max-w-2xl py-8 text-slate-800">
      <h1 className="text-2xl font-bold">Termini d'uso</h1>
      <p className="mt-4 text-sm text-slate-500">
        Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
      </p>

      <h2 className="mt-8 text-lg font-semibold">Oggetto del servizio</h2>
      <p className="mt-2">
        Trova Tavolo è una bacheca online che consente agli utenti di pubblicare e consultare
        annunci relativi a gruppi di gioco di ruolo da tavolo. Il servizio è rivolto a utenti
        maggiorenni.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Regole di condotta</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li>Non pubblicare contenuti illegali, offensivi o discriminatori.</li>
        <li>Non pubblicare dati personali di terze persone.</li>
        <li>Non usare il servizio per attività commerciali non autorizzate.</li>
        <li>
          Incontrare persone conosciute online comporta rischi: agisci con prudenza, preferisci
          luoghi pubblici per il primo incontro e condividi i dettagli con qualcuno di fiducia.
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Responsabilità</h2>
      <p className="mt-2">
        Il gestore del servizio non è parte degli accordi tra utenti. Trova Tavolo è fornito "così
        come è", senza garanzie implicite. Il gestore si riserva di rimuovere annunci che violino
        le presenti regole.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Modifiche</h2>
      <p className="mt-2">
        Questi termini possono essere aggiornati; le modifiche saranno pubblicate su questa pagina.
        L'uso continuato del servizio dopo la pubblicazione costituisce accettazione.
      </p>
    </article>
  );
}
