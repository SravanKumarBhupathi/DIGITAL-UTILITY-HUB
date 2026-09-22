# Digital Utility Hub

Useful Tools. Smart Guides. Everyday Solutions.

Digital Utility Hub is a fast, completely static collection of browser-based tools, calculators, AI guides, and how-to articles. It prioritizes privacy by processing as much as possible entirely on the client-side using Vanilla JavaScript.

## Project Structure

*   `src/`: Contains the source HTML files for pages and components.
    *   `src/components/`: Reusable layout elements (Header, Footer).
    *   `src/pages/`: Content pages mimicking the final directory structure.
*   `assets/`: Contains global CSS, JS, and Images.
*   `build.py`: A lightweight Python script to compile `src/` into the static output in the root folder.

## How to Run Locally

Since this is a static site, you don't need Node.js or a complex backend.

1. Ensure Python 3 is installed.
2. Run the build script to generate the HTML pages:
   ```bash
   python3 build.py
   ```
3. Start a local server in the root directory:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.

## How to Deploy to Render Static Site

1. Connect this repository to your Render account.
2. Select "New Static Site".
3. Build Command: `python3 build.py` (or leave blank if you commit the built files).
4. Publish directory: `.` (the root directory, where `build.py` places the generated files).
5. Deploy.

## How to Deploy to Cloudflare Pages

1. Connect this repository to Cloudflare Pages.
2. Framework preset: None.
3. Build Command: `python3 build.py`
4. Build output directory: `/`
5. Deploy.

## Future Expansion Guide

*   **Where to add future tools:** Create a new folder/file in `src/pages/tools/` and update the relevant navigation and `assets/js/tools.js` if custom logic is needed. Don't forget to add it to `assets/js/search.js`.
*   **Where to add articles:** Create new HTML files in `src/pages/guides/` or `src/pages/blog/`.
*   **Where to add AdSense code:** Modify `src/components/layout.html` to place the `<script>` tag in the head, and insert `<!-- AD SLOT -->` placeholders within the content of specific pages.
*   **Where to update contact information:** Edit `src/pages/contact.html` and `src/pages/about.html`.
*   **Where to update site metadata:** Edit the HTML comments at the top of each file in `src/pages/`. `build.py` parses these as frontmatter for SEO tags.
