/* Lokale Live-Vorschau: lädt die Seite automatisch neu, sobald sich
   index.html, style.css oder script.js ändern.
   Aktiv NUR auf localhost/127.0.0.1 — auf der echten Website passiert nichts. */
(function () {
  var host = location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') return;

  var files = ['index.html', 'style.css', 'script.js', 'livereload.js'];
  var stamps = {};
  var primed = false;

  function check() {
    Promise.all(files.map(function (f) {
      return fetch(f + '?_=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { return f + '|' + (r.headers.get('Last-Modified') || ''); })
        .catch(function () { return f + '|err'; });
    })).then(function (results) {
      var changed = false;
      results.forEach(function (entry) {
        var f = entry.split('|')[0];
        if (primed && stamps[f] !== entry) changed = true;
        stamps[f] = entry;
      });
      primed = true;
      if (changed) location.reload();
    });
  }

  setInterval(check, 1000);
  check();
})();
