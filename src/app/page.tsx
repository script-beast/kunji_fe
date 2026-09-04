export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="grid max-w-100 gap-2">
        <h1 className="m-0 text-2xl">No check-in link</h1>
        <p className="m-0 text-sm text-neutral-700">
          This page needs a guest check-in link from your host, in the form{" "}
          <code>/guest-form/&lt;token&gt;</code>.
        </p>
      </div>
    </main>
  );
}
