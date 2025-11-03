export default function Document() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Pure.css CDNの読み込み */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css" 
          integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls"
          crossOrigin="anonymous"
        />
        {/* 游ゴシック/游明朝フォントの設定 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: "游ゴシック体", YuGothic, "游ゴシック", "Yu Gothic", sans-serif;
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: "游明朝体", YuMincho, "游明朝", "Yu Mincho", serif;
            }
          `
        }} />
      </head>
      <body>
        <div id="__next"></div>
      </body>
    </html>
  );
}