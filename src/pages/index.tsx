import { GetServerSideProps } from 'next';

export default function HomePage() {
  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <h1>キントレ</h1>
        <div className="pure-menu">
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <a href="/health" className="pure-menu-link">Health Check</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// サーバーサイドでの初期データ取得
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  };
};