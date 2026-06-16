# Graph Report - .  (2026-06-10)

## Corpus Check
- Corpus is ~8,497 words - fits in a single context window. You may not need a graph.

## Summary
- 43 nodes · 53 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.82)
- Token cost: 111,463 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Portfolio & Demo-Seiten|Portfolio & Demo-Seiten]]
- [[_COMMUNITY_Preise & Ablauf|Preise & Ablauf]]
- [[_COMMUNITY_Globe- & Scroll-Steuerung|Globe- & Scroll-Steuerung]]
- [[_COMMUNITY_Marke & Logo|Marke & Logo]]
- [[_COMMUNITY_Agentur & Rechtliches|Agentur & Rechtliches]]
- [[_COMMUNITY_Vorschau-Konfiguration|Vorschau-Konfiguration]]
- [[_COMMUNITY_Projekt-Einstellungen|Projekt-Einstellungen]]
- [[_COMMUNITY_Leistungen & SEO|Leistungen & SEO]]
- [[_COMMUNITY_Finder-Navigation (JS)|Finder-Navigation (JS)]]
- [[_COMMUNITY_Finder-Ergebnis (JS)|Finder-Ergebnis (JS)]]
- [[_COMMUNITY_Elektriker-Demo|Elektriker-Demo]]

## God Nodes (most connected - your core abstractions)
1. `Zaid Digital` - 10 edges
2. `Portfolio-Demos` - 5 edges
3. `Preispakete` - 5 edges
4. `result()` - 4 edges
5. `render()` - 3 edges
6. `next()` - 3 edges
7. `Datenschutzerklärung` - 3 edges
8. `Salon Aurelia (Friseur-Demo)` - 3 edges
9. `Elektro Bauer (Elektriker-Demo)` - 3 edges
10. `Trattoria Verde (Restaurant-Demo)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Elektro Bauer (Elektriker-Demo)` --references--> `Zaid Digital`  [EXTRACTED]
  demos/elektriker.html → index.html
- `Salon Aurelia (Friseur-Demo)` --references--> `Zaid Digital`  [EXTRACTED]
  demos/friseur.html → index.html
- `Trattoria Verde (Restaurant-Demo)` --references--> `Zaid Digital`  [EXTRACTED]
  demos/restaurant.html → index.html
- `Zaid Digital` --references--> `Impressum`  [EXTRACTED]
  index.html → impressum.html
- `Portfolio-Demos` --references--> `Elektro Bauer (Elektriker-Demo)`  [EXTRACTED]
  index.html → demos/elektriker.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Portfolio-Beispiele** — demos_friseur_salon_aurelia, demos_elektriker_elektro_bauer, demos_restaurant_trattoria_verde [EXTRACTED 1.00]
- **Preispaket-Stufen** — index_tier_start, index_tier_premium, index_tier_komplett [EXTRACTED 1.00]
- **Rechtssicherheit (Impressum, Datenschutz, robots)** — impressum_impressum, datenschutz_datenschutz, robots_robots [INFERRED 0.75]

## Communities (12 total, 4 thin omitted)

### Community 0 - "Portfolio & Demo-Seiten"
Cohesion: 0.40
Nodes (6): Salon Aurelia (Friseur-Demo), Online-Terminbuchung, Tischreservierung, Trattoria Verde (Restaurant-Demo), Portfolio-Demos, Website-Finder

### Community 1 - "Preise & Ablauf"
Cohesion: 0.40
Nodes (5): Preispakete, Ablauf in 4 Schritten, Paket Komplett, Paket Premium, Paket Start

### Community 2 - "Globe- & Scroll-Steuerung"
Cohesion: 0.60
Nodes (4): close(), onScroll(), setGlobe(), toContact()

### Community 3 - "Marke & Logo"
Cohesion: 0.83
Nodes (4): Dark-Luxury-Branding, Zaid Digital Logo Mark, Zaid Digital Full Logo, Zaid Sinan Portrait

### Community 4 - "Agentur & Rechtliches"
Cohesion: 0.83
Nodes (4): Datenschutzerklärung, Impressum, Kontaktformular, Zaid Digital

### Community 8 - "Finder-Navigation (JS)"
Cohesion: 0.67
Nodes (3): next(), open(), render()

### Community 9 - "Finder-Ergebnis (JS)"
Cohesion: 0.67
Nodes (3): result(), styleWord(), zielWord()

## Knowledge Gaps
- **8 isolated node(s):** `version`, `configurations`, `allow`, `Website-Finder`, `Paket Start` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Zaid Digital` connect `Agentur & Rechtliches` to `Portfolio & Demo-Seiten`, `Preise & Ablauf`, `Elektriker-Demo`, `Leistungen & SEO`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `Preispakete` connect `Preise & Ablauf` to `Agentur & Rechtliches`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `Leistungen` connect `Leistungen & SEO` to `Agentur & Rechtliches`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `version`, `configurations`, `allow` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._