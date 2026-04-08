export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <p className="text-6xl">&#x1F6A9;</p>
          <h1 className="text-4xl font-bold text-white">
            OneHack 3.0 Never Paid Out
          </h1>
          <p className="text-xl text-zinc-400">
            We built this project for the OneHack 3.0 hackathon by{" "}
            <span className="text-white">@onechainlabs</span> on DoraHacks.
          </p>
        </div>

        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950 text-left space-y-4">
          <p className="text-zinc-300">
            A project claiming a <span className="text-white font-semibold">$67 million raise</span> told
            participants it{" "}
            <span className="text-red-400 font-semibold">&quot;cannot pay&quot;</span> a $16,000
            prize pool.
          </p>
          <p className="text-zinc-300">
            The Telegram group was deleted. No winners were announced. 543
            builders across three hackathons &mdash; and no public evidence that
            anyone was ever paid.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="https://x.com/Libruary/status/2041928239287853213"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-8 py-4 font-bold text-lg transition-all hover:bg-zinc-200"
          >
            Read the Full Thread on X
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <p className="text-sm text-zinc-600">
            This domain will remain active as a public record.
          </p>
        </div>
      </div>
    </div>
  )
}
