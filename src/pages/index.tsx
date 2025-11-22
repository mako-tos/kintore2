import React from "react";
import Link from "next/link";
import NewTrainingRecord from "./training-records/new";

export default function HomePage() {
  return (
    <div style={{ padding: "1rem" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link
          href="/training-menus/new"
          className="pure-button pure-button-primary"
          style={{ marginRight: "0.5rem" }}
        >
          メニュー追加
        </Link>
        <Link href="/training-records/new" className="pure-button">
          記録入力
        </Link>
        <Link href="/health" className="pure-button">
          Health
        </Link>
      </nav>
      <h2>キントレ</h2>
      <NewTrainingRecord />
    </div>
  );
}
