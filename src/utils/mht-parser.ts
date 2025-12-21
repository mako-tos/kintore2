export interface ParsedBodyComposition {
  date: Date;
  weight: number;
  bodyFatMass: number;
  leanBodyMass: number;
  muscleMass: number;
}

export function parseMht(mhtContent: string): string | null {
  // 簡易的なHTML抽出
  // <!DOCTYPE html> から </html> までを抽出
  const start = mhtContent.indexOf("<!DOCTYPE html>");
  if (start === -1) return null;

  const end = mhtContent.indexOf("</html>", start);
  if (end === -1) return null;

  return mhtContent.substring(start, end + 7);
}

export function parseBodyCompositionHtml(html: string): ParsedBodyComposition {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 計測日
  // div.report-view-header-item の中から "時間：" で始まるテキストを探す
  const headerItems = Array.from(
    doc.querySelectorAll("div.report-view-header-item")
  );
  const dateItem = headerItems.find((el) =>
    el.textContent?.trim().startsWith("時間：")
  );
  if (!dateItem || !dateItem.textContent) {
    throw new Error("計測日が見つかりません");
  }
  const dateStr = dateItem.textContent.trim().replace("時間：", "").trim();
  // "2025-12-20 10:40:29" -> "2025-12-20T10:40:29"
  const isoDateStr = dateStr.replace(" ", "T");
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`日付のパースに失敗しました: ${dateStr}`);
  }

  // 数値項目の抽出ヘルパー
  const extractValue = (label: string): number => {
    const rows = Array.from(doc.querySelectorAll("div.u-row.value"));
    const targetRow = rows.find((row) => {
      const firstChild = row.firstElementChild;
      return firstChild?.textContent?.trim() === label;
    });

    if (!targetRow) {
      throw new Error(`${label}が見つかりません`);
    }

    // 2番目のdiv
    const valueDiv = targetRow.children[1];
    if (!valueDiv) {
      throw new Error(`${label}の値が見つかりません`);
    }

    // テキスト取得 (例: "74.6KG")
    const text = valueDiv.textContent?.trim() || "";
    // 数値のみ抽出 (正規表現)
    const match = text.match(/([\d.]+)/);
    if (!match) {
      throw new Error(`${label}の数値抽出に失敗しました: ${text}`);
    }
    return parseFloat(match[1]);
  };

  return {
    date,
    weight: extractValue("体重"),
    bodyFatMass: extractValue("体脂肪量"),
    leanBodyMass: extractValue("除脂肪体重"),
    muscleMass: extractValue("筋肉量"),
  };
}
