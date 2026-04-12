/**
 * MedicalCosts.info Embeddable Widget
 *
 * Usage:
 * <script src="https://medical-costs-site.pages.dev/embed.js" data-procedure="99285"></script>
 *
 * Options (data attributes):
 *   data-procedure  — CPT/HCPCS code (required)
 *   data-theme      — "light" (default) or "dark"
 *   data-width      — widget width, e.g. "400px" (default: "100%", max 420px)
 */
(function () {
  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var code = SCRIPT.getAttribute('data-procedure');
  if (!code) {
    console.warn('[MedicalCosts] Missing data-procedure attribute');
    return;
  }

  var theme = SCRIPT.getAttribute('data-theme') || 'light';
  var width = SCRIPT.getAttribute('data-width') || '100%';
  var API = 'https://medical-costs-api.david-568.workers.dev';
  var SITE = 'https://medical-costs-site.pages.dev';

  // Create container
  var container = document.createElement('div');
  container.style.cssText = 'max-width:420px;width:' + width + ';font-family:system-ui,-apple-system,sans-serif;';
  container.innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:13px;">Loading cost data...</div>';
  SCRIPT.parentNode.insertBefore(container, SCRIPT.nextSibling);

  // Fetch procedure data
  fetch(API + '/api/procedures/' + encodeURIComponent(code))
    .then(function (r) { return r.json(); })
    .then(function (json) {
      if (!json.success || !json.data) {
        container.innerHTML = '<div style="padding:16px;color:#ef4444;font-size:13px;">Procedure ' + code + ' not found</div>';
        return;
      }

      var d = json.data;
      var name = d.consumerName || d.description || code;
      var facilityRate = d.nationalFacilityRate ? '$' + Math.round(d.nationalFacilityRate).toLocaleString() : 'N/A';
      var nonFacRate = d.nationalNonFacRate ? '$' + Math.round(d.nationalNonFacRate).toLocaleString() : 'N/A';
      var commLow = d.nationalFacilityRate ? '$' + Math.round(d.nationalFacilityRate * 1.5).toLocaleString() : 'N/A';
      var commHigh = d.nationalFacilityRate ? '$' + Math.round(d.nationalFacilityRate * 2.5).toLocaleString() : 'N/A';
      var slug = d.slug || d.code;
      var link = SITE + '/procedures/' + slug + '/';

      var isDark = theme === 'dark';
      var bg = isDark ? '#1f2937' : '#ffffff';
      var border = isDark ? '#374151' : '#e5e7eb';
      var text = isDark ? '#f9fafb' : '#1f2937';
      var subtext = isDark ? '#9ca3af' : '#6b7280';
      var rowBorder = isDark ? '#374151' : '#f3f4f6';
      var footBg = isDark ? '#111827' : '#f9fafb';

      container.innerHTML =
        '<div style="border:1px solid ' + border + ';border-radius:12px;overflow:hidden;background:' + bg + ';color:' + text + '">' +
          '<div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:16px 20px;color:#fff">' +
            '<div style="font-size:16px;font-weight:700;margin-bottom:2px">' + esc(name) + '</div>' +
            '<div style="font-size:12px;opacity:0.8">CPT ' + esc(d.code) + ' &bull; ' + esc(d.category || 'Medical Procedure') + '</div>' +
          '</div>' +
          '<div style="padding:16px 20px">' +
            row('Medicare (Facility)', facilityRate, '#059669', rowBorder, subtext) +
            row('Medicare (Office)', nonFacRate, '#059669', rowBorder, subtext) +
            row('Est. Commercial Range', commLow + ' &ndash; ' + commHigh, '#d97706', 'transparent', subtext) +
          '</div>' +
          '<div style="padding:10px 20px;background:' + footBg + ';border-top:1px solid ' + border + ';display:flex;justify-content:space-between;align-items:center">' +
            '<a href="' + link + '" target="_blank" rel="noopener" style="font-size:12px;color:#2563eb;text-decoration:none;font-weight:500">View full details &rarr;</a>' +
            '<span style="font-size:11px;color:#9ca3af">Powered by <a href="' + SITE + '" target="_blank" rel="noopener" style="color:#9ca3af;text-decoration:underline">MedicalCosts.info</a></span>' +
          '</div>' +
        '</div>';
    })
    .catch(function () {
      container.innerHTML = '<div style="padding:16px;color:#ef4444;font-size:13px;">Failed to load cost data</div>';
    });

  function row(label, value, valueColor, borderColor, labelColor) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid ' + borderColor + '">' +
      '<span style="font-size:13px;color:' + labelColor + '">' + label + '</span>' +
      '<span style="font-size:15px;font-weight:600;color:' + valueColor + '">' + value + '</span>' +
    '</div>';
  }

  function esc(s) {
    var el = document.createElement('span');
    el.textContent = s;
    return el.innerHTML;
  }
})();
