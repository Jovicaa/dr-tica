# Dr. Tica — Stomatološka ambulanta (web)

Jednostavan, statički responsive sajt (HTML + CSS + vanilla JS) — **nema build
sistema, nema zavisnosti**: spreman za deploy na bilo koji hosting.

## Pregled

```sh
# lokalni pregled (iz ovog foldera):
python3 -m http.server 8000
# pa otvori http://localhost:8000
```

## Struktura

```
dr-tica-stomatologija/
├── index.html        # sva stranica (hero, usluge, o doktoru, galerija, kontakt)
├── css/style.css     # dizajn, animacije, tri breakpointsa (980/760/560px)
├── js/main.js        # meni, scroll-reveal, brojači, lightbox, forma
├── assets/logo.svg   # logo (isti je i favicon)
└── README.md
```

## Efekti

- `scroll-reveal` (IntersectionObserver) — elementi nežno isplivaju na skrol
- animirani gradient "blobs" i lebdeći zub u hero-u
- brojači (pacijenti, plombe, ocjene) s animacijom
- hover efekti na karticama i galeriji, lightbox na klik
- puna podrška za `prefers-reduced-motion`

## Podešavanje prije objave

Dupli-klik po `index.html` i zamijeni placeholder sadržaj realnim podacima:
adresu, telefone, email, radno vrijeme, imena. Galerija ima ilustrativne SVG
slike — za prave fotografije samo zamijeni `<svg>` u kartama `<img>` tagom.

## Deploy

### GitHub Pages
1. Novi repozitorij, ubaci sadržaj foldera.
2. Settings → Pages → Source: `main` branch, `/ (root)` → Save.
3. Sajt: `https://korisnicko-ime.github.io/ime-repo/`.

### Netlify
- Drag & drop cijelog foldera na https://app.netlify.com/drop
- ili: poveži Git repo (Build command: — , Publish directory: `.`)
- Kontakt forma radi automatski zahvaljujući `data-netlify="true"`
  (potvrdi formu u Netlify Forms tabu nakon prvog deploy-a).

### Vercel
- `vercel` CLI u ovom folderu ili import repo-a na vercel.com
- Framework preset: **Other**; bez build komande.
