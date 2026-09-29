# ─────────────────────────────────────────────────────────
# Power BI DAX Measures — 3D Scene Bridge
# Add these to your '_Measures' table in Power BI Desktop
# ─────────────────────────────────────────────────────────

# ── 1. Selected Category (used by HTML visual URL) ──────
Selected Category =
VAR _cat =
    SELECTEDVALUE ( 'Sales Data'[Category], "All" )
RETURN _cat


# ── 2. 3D Scene URL (paste into HTML visual as src) ─────
3D Scene URL =
VAR _cat = [Selected Category]
VAR _base = "https://zubairanwar499-bi.github.io/3D-Projects-Dashboard/"
VAR _page =
    SWITCH (
        _cat,
        "Smartphone",  "pages/smartphones.html",
        "Laptop",      "pages/laptops.html",
        "TV",          "pages/tvs.html",
        "Headphones",  "pages/headphones.html",
        "Tablet",      "pages/tablets.html",
        "Smartwatch",  "pages/smartwatches.html",
        "index.html"   -- All / default
    )
RETURN _base & _page


# ── 3. Products JSON (for passing live filtered data) ────
Products JSON =
VAR _tbl =
    SUMMARIZE (
        'Sales Data',
        'Sales Data'[Product ID],
        'Sales Data'[Product],
        'Sales Data'[Category],
        'Sales Data'[Brand],
        'Sales Data'[Price (PKR)]
    )
VAR _rows =
    CONCATENATEX (
        _tbl,
        "{" &
        """id"":"""         & 'Sales Data'[Product ID]  & """," &
        """name"":"""       & 'Sales Data'[Product]     & """," &
        """category"":"""   & 'Sales Data'[Category]    & """," &
        """brand"":"""      & 'Sales Data'[Brand]       & """," &
        """price"":"        & 'Sales Data'[Price (PKR)] &
        "}",
        ","
    )
RETURN "[" & _rows & "]"


# ── 4. HTML Content Visual Snippet ──────────────────────
# Copy the string returned by this measure into an
# HTML Content visual. Replace {{URL}} with [3D Scene URL].
#
# HTML Content Visual Code Template:
# ───────────────────────────────────
# <html><body style="margin:0;overflow:hidden">
# <iframe
#   src="[3D Scene URL value here]"
#   style="width:100%;height:100vh;border:none"
#   sandbox="allow-scripts allow-same-origin">
# </iframe>
# </body></html>
