import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  parseMht,
  parseBodyCompositionHtml,
  ParsedBodyComposition,
} from "@/utils/mht-parser";
import { useAuth } from "@/contexts/AuthContext";

export default function NewBodyComposition() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedBodyComposition | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // フォームの状態
  const [formData, setFormData] = useState({
    date: "",
    weight: "",
    bodyFatMass: "",
    leanBodyMass: "",
    muscleMass: "",
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);

      try {
        const text = await selectedFile.text();
        const html = parseMht(text);
        if (!html) {
          throw new Error(
            "MHTファイルの解析に失敗しました。HTMLパートが見つかりません。"
          );
        }
        const data = parseBodyCompositionHtml(html);
        setParsedData(data);

        // フォーム初期値セット
        // date input type="datetime-local" に合わせる: YYYY-MM-DDThh:mm
        // toISOString() は UTC なので、ローカルタイムに合わせる必要がある。
        // data.date は new Date("2025-12-20T10:40:29") で生成されており、
        // これはブラウザのタイムゾーンでの時刻として扱われる（ISO文字列にZがないため）。
        // datetime-local に渡す値は "YYYY-MM-DDThh:mm" 形式（ローカル時間）。

        const year = data.date.getFullYear();
        const month = String(data.date.getMonth() + 1).padStart(2, "0");
        const day = String(data.date.getDate()).padStart(2, "0");
        const hours = String(data.date.getHours()).padStart(2, "0");
        const minutes = String(data.date.getMinutes()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}T${hours}:${minutes}`;

        setFormData({
          date: dateStr,
          weight: data.weight.toString(),
          bodyFatMass: data.bodyFatMass.toString(),
          leanBodyMass: data.leanBodyMass.toString(),
          muscleMass: data.muscleMass.toString(),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError(err.message || "ファイルの読み込みに失敗しました");
        setParsedData(null);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // formData.date はローカル時間の文字列 "YYYY-MM-DDThh:mm"
      // これを new Date() に渡すとローカル時間の Date オブジェクトになる
      // toISOString() で UTC に変換して送信する
      const dateObj = new Date(formData.date);

      const res = await fetch("/api/body-compositions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          date: dateObj.toISOString(),
          weight: Number(formData.weight),
          bodyFatMass: Number(formData.bodyFatMass),
          leanBodyMass: Number(formData.leanBodyMass),
          muscleMass: Number(formData.muscleMass),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "登録に失敗しました");
      }

      // 成功したらトップへ戻る
      router.push("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>体組成情報登録 - キントレ</title>
      </Head>
      <div className="container">
        <h1>体組成情報登録</h1>

        <div className="file-upload-section">
          <label htmlFor="mht-file">
            体組成計の結果ファイル (.mht) を選択してください
          </label>
          <input
            type="file"
            id="mht-file"
            accept=".mht,.mhtml"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {parsedData && (
          <form onSubmit={handleSubmit} className="composition-form">
            <div className="form-group">
              <label htmlFor="date">計測日</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">体重 (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bodyFatMass">体脂肪量 (kg)</label>
              <input
                type="number"
                id="bodyFatMass"
                name="bodyFatMass"
                step="0.1"
                value={formData.bodyFatMass}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="leanBodyMass">除脂肪体重 (kg)</label>
              <input
                type="number"
                id="leanBodyMass"
                name="leanBodyMass"
                step="0.1"
                value={formData.leanBodyMass}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="muscleMass">筋肉量 (kg)</label>
              <input
                type="number"
                id="muscleMass"
                name="muscleMass"
                step="0.1"
                value={formData.muscleMass}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "送信中..." : "登録"}
              </button>
            </div>
          </form>
        )}
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .file-upload-section {
          margin-bottom: 20px;
          padding: 20px;
          border: 2px dashed #ccc;
          border-radius: 8px;
          text-align: center;
        }
        .file-input {
          display: block;
          margin: 10px auto;
        }
        .error-message {
          color: red;
          margin-bottom: 20px;
          padding: 10px;
          background-color: #ffe6e6;
          border-radius: 4px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        .submit-button {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
        }
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
