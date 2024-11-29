/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://vimemo.vercel.app',
  generateRobotsTxt: true, // (optional) Set to true if you want to generate robots.txt
  sitemapSize: 5000,
  outDir: 'public', // 生成されたサイトマップの出力先ディレクトリ
  generateIndexSitemap: true, // インデックスサイトマップを生成するかどうか
};
