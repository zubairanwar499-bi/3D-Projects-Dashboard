// =====================================================
// powerbi-bridge.js  (Power BI HTML Content Visual)
// Paste the content BELOW into the HTML Content visual
// This is the bridge that passes PBI slicer data →
// the GitHub Pages 3D scene via postMessage / URL params
// =====================================================

// NOTE: This entire file's content goes into the
// Power BI "HTML Content" visual as-is (wrapped in <script>)

/*
 ╔══════════════════════════════════════════════╗
 ║  POWER BI HTML CONTENT VISUAL — BRIDGE CODE  ║
 ╠══════════════════════════════════════════════╣
 ║  Paste the HTML below into the visual        ║
 ╚══════════════════════════════════════════════╝
*/

const PBI_HTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0d0d1a; overflow:hidden; }
  iframe {
    width:100vw; height:100vh;
    border:none; display:block;
  }
</style>
</head>
<body>
<iframe
  id="scene"
  src="https://zubairanwar499-bi.github.io/3D-Projects-Dashboard/index.html"
  allow="accelerometer; autoplay"
  sandbox="allow-scripts allow-same-origin allow-popups"
></iframe>
<script>
  // ── Wait for PBI data ──────────────────────────
  // The DAX measure [3D JSON] returns a JSON string.
  // The HTML visual receives it via window.powerbi or
  // via the dataset binding below.

  const iframe = document.getElementById('scene');

  // Read category from URL param set by DAX measure
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // When iframe loads, send the category filter
  iframe.onload = () => {
    const cat = getParam('category') || 'All';
    iframe.contentWindow.postMessage(
      JSON.stringify({ type: 'pbi-filter', category: cat }),
      '*'
    );
  };

  // Listen for PBI HTML visual dataset updates
  // (triggered when slicers change)
  if (window.PowerBICustomVisualsV3) {
    PowerBICustomVisualsV3.visuals.on('dataChanged', (options) => {
      try {
        const rows = options.dataViews[0].table.rows;
        const products = rows.map(r => ({
          id:        r[0],  name:      r[1],
          category:  r[2],  brand:     r[3],
          price:     +r[4], processor: r[5],
          ram:       r[6],  storage:   r[7],
          display:   r[8],  battery:   r[9],
          os:        r[10], warranty:  +r[11],
          colors:    ['#6c63ff'],
        }));
        iframe.contentWindow.postMessage(
          JSON.stringify({ type: 'pbi-products', products }),
          '*'
        );
      } catch(e) {}
    });
  }
</script>
</body>
</html>
`;
