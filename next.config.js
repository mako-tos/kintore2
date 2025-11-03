/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14の新機能を段階的に有効化
  experimental: {
    // serverActions: true,
  },
  // パフォーマンス目標に合わせて設定
  experimental: {
    optimizeCss: true, // CSSの最適化
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