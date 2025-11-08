/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Next.js 14の実験的機能（必要時のみ有効化）
  experimental: {
    // serverActions: true,
    // optimizeCss は 'critters' パッケージに依存するため、開発時は無効化
    optimizeCss: isProd, // 本番ビルド時のみ有効化
  },
  poweredByHeader: false, // セキュリティのためX-Powered-Byヘッダーを無効化
  reactStrictMode: true,
  // Netlifyデプロイ用の設定
  output: 'standalone',
  // 環境変数のプレフィックス
  env: {
    // アプリケーション固有の環境変数をここで定義
  }
};

module.exports = nextConfig;