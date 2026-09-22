import os
import glob
import re
import json

def build():
    # Load components
    components = {}
    for comp_file in glob.glob('src/components/*.html'):
        name = os.path.basename(comp_file).replace('.html', '')
        with open(comp_file, 'r', encoding='utf-8') as f:
            components[name] = f.read()

    layout = components.get('layout', '<html><body>{{header}}{{content}}{{footer}}</body></html>')

    # Process pages
    for root, dirs, files in os.walk('src/pages'):
        for file in files:
            if not file.endswith('.html'):
                continue

            page_path = os.path.join(root, file)
            # Calculate output path
            rel_path = os.path.relpath(page_path, 'src/pages')
            out_path = rel_path

            with open(page_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract frontmatter if any
            metadata = {
                'title': 'Digital Utility Hub',
                'description': 'Useful Tools. Smart Guides. Everyday Solutions.',
                'canonical': 'https://digitalutilityhub.com/' + ('' if rel_path == 'index.html' else rel_path.replace('.html', ''))
            }

            match = re.match(r'^<!--(.*?)-->', content, re.DOTALL)
            if match:
                meta_text = match.group(1)
                for line in meta_text.split('\n'):
                    if ':' in line:
                        k, v = line.split(':', 1)
                        metadata[k.strip()] = v.strip()
                content = content[match.end():]

            # Construct page
            page = layout
            page = page.replace('{{content}}', content)

            # Replace components
            for comp_name, comp_html in components.items():
                if comp_name != 'layout':
                    page = page.replace('{{' + comp_name + '}}', comp_html)

            # Replace metadata
            for k, v in metadata.items():
                page = page.replace('{{' + k + '}}', v)

            # Calculate depth for relative paths
            depth = rel_path.count(os.sep)
            base_url = '../' * depth if depth > 0 else './'
            page = page.replace('{{base_url}}', base_url)

            # Write out file
            os.makedirs(os.path.dirname(out_path) if os.path.dirname(out_path) else '.', exist_ok=True)
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(page)

            print(f"Built {out_path}")

    # Generate sitemap.xml and robots.txt
    # (Simple static generation for the scope of the project)
    print("Build complete.")

if __name__ == "__main__":
    build()
