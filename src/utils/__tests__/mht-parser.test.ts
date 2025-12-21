import fs from "fs";
import path from "path";
import { parseMht, parseBodyCompositionHtml } from "../mht-parser";

describe("mht-parser", () => {
  const mhtPath = path.join(process.cwd(), "test", "file", "test-file.mht");
  let mhtContent: string;

  beforeAll(() => {
    mhtContent = fs.readFileSync(mhtPath, "utf-8");
  });

  test("parseMht should extract HTML content", () => {
    const html = parseMht(mhtContent);
    expect(html).not.toBeNull();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  test("parseBodyCompositionHtml should extract data correctly", () => {
    const html = parseMht(mhtContent);
    if (!html) throw new Error("HTML extraction failed");

    const data = parseBodyCompositionHtml(html);

    // 期待値は test-file.mht の内容に基づく
    // 時間：2025-12-20 10:40:29
    // JST(+09:00)のファイルだが、Dateコンストラクタに "2025-12-20T10:40:29" を渡すと
    // 環境のタイムゾーン（JSTならJST）として解釈されるはず。
    // テスト環境のタイムゾーンに依存する可能性があるが、
    // ここでは toISOString() で比較するよりも、getTime() や個別の値で比較する方が安全かも。
    // あるいは、期待値のDateオブジェクトも同じ文字列から生成すれば一致するはず。

    const expectedDate = new Date("2025-12-20T10:40:29");
    expect(data.date.getTime()).toBe(expectedDate.getTime());

    // 体重 74.6
    expect(data.weight).toBe(74.6);

    // 体脂肪量 18.6
    expect(data.bodyFatMass).toBe(18.6);

    // 除脂肪体重 56
    expect(data.leanBodyMass).toBe(56);

    // 筋肉量 52.2
    expect(data.muscleMass).toBe(52.2);
  });
});
