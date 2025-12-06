<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/rss">
    <html>
      <head>
        <title>
          <xsl:value-of select="channel/title" />
        </title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #0b0b10;
            color: #e5e7eb;
            padding: 2rem;
          }
          a {
            color: #38bdf8;
          }
          .item {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #27272f;
          }
          .date {
            font-size: 0.75rem;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="channel/title" /></h1>
        <p><xsl:value-of select="channel/description" /></p>

        <xsl:for-each select="channel/item">
          <div class="item">
            <h2>
              <a href="{link}">
                <xsl:value-of select="title" />
              </a>
            </h2>
            <div class="date">
              <xsl:value-of select="pubDate" />
            </div>
            <p>
              <xsl:value-of select="description" />
            </p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
