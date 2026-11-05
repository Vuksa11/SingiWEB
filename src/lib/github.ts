import "server-only";

// Admin panel ne piše po disku (na Vercelu ne bi preživelo), nego pravi commit
// u GitHub repo. Vercel posle svakog commita sam objavi novu verziju sajta.
const REPO = process.env.GITHUB_REPO ?? "Vuksa11/SingiWEB";
const GRANA = process.env.GITHUB_GRANA ?? "main";

/** Adresa slike direktno iz repoa (za admin, pre nego što Vercel objavi sajt). */
export const rawBaza = () => `https://raw.githubusercontent.com/${REPO}/${GRANA}`;
export const adminSlika = (url: string) => (url.startsWith("/slike/") ? `${rawBaza()}/public${url}` : url);

async function gh<T = unknown>(putanja: string, init?: RequestInit): Promise<T> {
  const odg = await fetch(`https://api.github.com/repos/${REPO}${putanja}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!odg.ok) {
    const e = new Error(`GitHub ${init?.method ?? "GET"} ${putanja}: ${odg.status} ${await odg.text()}`);
    (e as Error & { status?: number }).status = odg.status;
    throw e;
  }
  return (odg.status === 204 ? null : await odg.json()) as T;
}

export type Promena =
  | { putanja: string; sadrzajBase64: string }
  | { putanja: string; obrisi: true };

/** Jedan commit sa svim promenama (npr. tekst vesti + slika). */
export async function napraviCommit(poruka: string, promene: Promena[]) {
  for (let pokusaj = 0; pokusaj < 3; pokusaj++) {
    const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${GRANA}`);
    const roditelj = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
    const stablo = await Promise.all(
      promene.map(async (p) => {
        if ("obrisi" in p) return { path: p.putanja, mode: "100644", type: "blob", sha: null };
        const blob = await gh<{ sha: string }>(`/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: p.sadrzajBase64, encoding: "base64" }),
        });
        return { path: p.putanja, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );
    const novoStablo = await gh<{ sha: string }>(`/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: roditelj.tree.sha, tree: stablo }),
    });
    const commit = await gh<{ sha: string }>(`/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: poruka, tree: novoStablo.sha, parents: [ref.object.sha] }),
    });
    try {
      await gh(`/git/refs/heads/${GRANA}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
      return;
    } catch (e) {
      // 422 = u međuvremenu je stigao drugi commit (npr. osvežavanje tabele) — pokušaj ponovo.
      if ((e as { status?: number }).status !== 422) throw e;
    }
  }
  throw new Error("Commit nije uspeo posle 3 pokušaja");
}

export async function procitajFajl(putanja: string): Promise<string | null> {
  try {
    const f = await gh<{ content: string }>(`/contents/${encodeURI(putanja)}?ref=${GRANA}`);
    return Buffer.from(f.content, "base64").toString("utf8");
  } catch (e) {
    if ((e as { status?: number }).status === 404) return null;
    throw e;
  }
}

export async function listaFajlova(folder: string): Promise<string[]> {
  try {
    const lista = await gh<{ name: string; type: string }[]>(`/contents/${folder}?ref=${GRANA}`);
    return lista.filter((f) => f.type === "file").map((f) => f.name);
  } catch (e) {
    if ((e as { status?: number }).status === 404) return [];
    throw e;
  }
}
