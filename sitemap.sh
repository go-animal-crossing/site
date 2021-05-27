#!/bin/bash

# url configuration
URL="https://myisland.club/"
FREQ="monthly"
# begin new sitemap
exec 1> ./_site/sitemap.xml

# print head
echo '<?xml version="1.0" encoding="UTF-8"?>'
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

DATE="$(date +'%Y-%m-%d')"
# print urls
for f in $(find ./_site/ -type f -name '*.html'); do
  FILE=${f:8}
  echo "<url>"
  echo " <loc>${URL}${FILE//index.html/}</loc>"
  echo " <lastmod>$DATE</lastmod>"
  echo " <changefreq>$FREQ</changefreq>"
  echo "</url>"
done

# print foot
echo "</urlset>"