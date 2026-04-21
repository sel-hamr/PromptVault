export default function HealthPage() {
  const keys = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ];

  return (
    <main className="p-8 font-mono">
      <h1 className="text-xl font-bold mb-6">Health — env keys</h1>
      <table className="border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th className="pr-8 pb-2 text-muted-foreground">Key</th>
            <th className="pb-2 text-muted-foreground">
              Value (first 18 chars)
            </th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const value = process.env[key];
            return (
              <tr key={key} className="border-t border-border">
                <td className="pr-8 py-2">{key}</td>
                <td className="py-2">
                  {value ? (
                    <span>
                      <span className="text-green-600 dark:text-green-400">
                        {value.slice(0, 8)}
                      </span>
                      <span className="text-muted-foreground">
                        {"*".repeat(Math.max(0, value.length - 8))}
                      </span>
                    </span>
                  ) : (
                    <span className="text-destructive">— not set —</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
