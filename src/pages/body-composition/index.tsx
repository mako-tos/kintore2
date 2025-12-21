import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BodyComposition } from "@/types/body-composition";
import { apiClient } from "@/lib/api-client";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  ReferenceDot,
} from "recharts";

interface ChartData extends BodyComposition {
  displayDate: string;
  bodyFatPercentage: number;
}

const BodyCompositionList: React.FC = () => {
  const { user, session } = useAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await apiClient.get<BodyComposition[]>(
        "/api/body-compositions"
      );

      const processedData = data.map((item) => {
        const dateObj = new Date(item.date);
        return {
          ...item,
          displayDate: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
          bodyFatPercentage:
            item.weight > 0 ? (item.body_fat_mass / item.weight) * 100 : 0,
        };
      });

      setData(processedData);
    } catch (err) {
      console.error(err);
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user || !session) return;
    fetchData();
  }, [user, session]);

  if (loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Calculate Max/Min points for highlighting
  let maxBodyFatPoint: ChartData | null = null;
  let minMuscleMassPoint: ChartData | null = null;

  if (data.length > 0) {
    maxBodyFatPoint = data.reduce((prev, current) =>
      prev.bodyFatPercentage > current.bodyFatPercentage ? prev : current
    );
    minMuscleMassPoint = data.reduce((prev, current) =>
      prev.muscle_mass < current.muscle_mass ? prev : current
    );
  }

  return (
    <div className="container">
      <div className="bc-header">
        <h1 className="bc-title">体組成情報</h1>
        <Link
          href="/body-composition/new"
          className="bc-add-button"
        >
          ⚖️ 体組成情報を登録
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="bc-empty-state">
          <p className="bc-empty-text">データがありません。</p>
          <p>「体組成情報を登録」ボタンからデータを登録してください。</p>
        </div>
      ) : (
        <div className="bc-charts-container">
          {/* 体脂肪率グラフ */}
          <div className="bc-chart-card">
            <h2 className="bc-chart-title">体脂肪率</h2>
            <div className="bc-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <ComposedChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis
                    dataKey="displayDate"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "体重 (kg)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={["auto", "auto"]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "体脂肪率 (%)",
                      angle: 90,
                      position: "insideRight",
                    }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="weight"
                    name="体重"
                    barSize={20}
                    fill="#3b82f6"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bodyFatPercentage"
                    name="体脂肪率"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  {maxBodyFatPoint && (
                    <ReferenceDot
                      yAxisId="right"
                      x={maxBodyFatPoint.displayDate}
                      y={maxBodyFatPoint.bodyFatPercentage}
                      r={6}
                      fill="#ef4444"
                      stroke="none"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 筋肉量グラフ */}
          <div className="bc-chart-card">
            <h2 className="bc-chart-title">筋肉量</h2>
            <div className="bc-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis
                    dataKey="displayDate"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    label={{
                      value: "筋肉量 (kg)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="muscle_mass"
                    name="筋肉量"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  {minMuscleMassPoint && (
                    <ReferenceDot
                      x={minMuscleMassPoint.displayDate}
                      y={minMuscleMassPoint.muscle_mass}
                      r={6}
                      fill="#22c55e"
                      stroke="none"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyCompositionList;
