// ニュースAPIサービス
// 本番環境では実際のAPIキーを使用してください

export interface NewsArticle {
  uuid: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url?: string;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
}

export interface NewsResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: NewsArticle[];
}

// モックニュースデータ（開発用）
const mockNewsData: NewsArticle[] = [
  {
    uuid: "1",
    title: "2025年第1四半期の経済見通し",
    description: "専門家による最新の経済分析と市場予測をお届けします。",
    snippet: "専門家による最新の経済分析と市場予測をお届けします。国内外の経済指標を総合的に分析した結果、今四半期は緩やかな成長が期待される一方で、インフレ圧力や地政学的リスクが懸念材料として挙げられています。特に製造業セクターでは原材料価格の上昇が利益率に影響を与える可能性があり、企業の業績予想に注意が必要です。",
    url: "#",
    image_url: "",
    language: "ja",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "business-news.jp",
    categories: ["business", "economy"]
  },
  {
    uuid: "2",
    title: "テクノロジー業界の最新動向",
    description: "AI技術の進歩が各業界に与える影響と、今後の投資機会について分析します。",
    snippet: "AI技術の進歩が各業界に与える影響と、今後の投資機会について分析します。生成AIの普及により、従来の業務プロセスが大幅に効率化される一方で、新たなスキルセットの需要が高まっています。特に金融、医療、教育分野でのAI活用事例が急増しており、関連企業の株価にも大きな影響を与えています。投資家は技術革新のスピードと規制環境の変化を慎重に見極める必要があります。",
    url: "#",
    image_url: "",
    language: "ja",
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: "tech-today.jp",
    categories: ["technology", "business"]
  },
  {
    uuid: "3",
    title: "グローバル市場レポート",
    description: "世界各国の株式市場の動向と、為替相場の変動要因について詳細に分析。",
    snippet: "世界各国の株式市場の動向と、為替相場の変動要因について詳細に分析。米国市場では金利政策の転換期を迎え、投資家のリスク選好度に変化が見られます。欧州市場では政治的不安定要因が継続する中、企業業績の二極化が進んでいます。アジア市場では中国経済の回復ペースが注目される中、新興国通貨の動向が重要な指標となっています。",
    url: "#",
    image_url: "",
    language: "ja",
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: "global-markets.jp",
    categories: ["finance", "global"]
  },
  {
    uuid: "4",
    title: "新興企業の資金調達動向",
    description: "スタートアップ企業の最新の資金調達状況と投資トレンドを分析。",
    snippet: "スタートアップ企業の最新の資金調達状況と投資トレンドを分析。2025年に入り、AI・フィンテック・グリーンテック分野への投資が活発化しています。特にシリーズA段階での調達額が前年比30%増加しており、投資家の関心の高さが伺えます。一方で、収益性を重視する傾向が強まり、事業計画の精査がより厳格になっています。地域別では、東南アジア市場への注目度が高まっています。",
    url: "#",
    image_url: "",
    language: "ja",
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "startup-news.jp",
    categories: ["startup", "investment"]
  },
  {
    uuid: "5",
    title: "サステナブル経営の重要性",
    description: "ESG投資の拡大と企業の持続可能な経営戦略について解説。",
    snippet: "ESG投資の拡大と企業の持続可能な経営戦略について解説。環境・社会・ガバナンスの観点から企業価値を評価する投資手法が主流となる中、企業は長期的な視点での戦略策定が求められています。特に脱炭素化への取り組みや多様性の推進、透明性の高いガバナンス体制の構築が投資判断の重要な要素となっており、これらの取り組みが企業の競争力向上に直結しています。",
    url: "#",
    image_url: "",
    language: "ja",
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: "sustainable-biz.jp",
    categories: ["sustainability", "business"]
  }
];

class NewsService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.thenewsapi.com/v1/news';

  constructor() {
    // 環境変数からAPIキーを取得（本番環境用）
    this.apiKey = process.env.REACT_APP_NEWS_API_KEY || null;
  }

  // 時間を相対的な表示に変換
  public formatTimeAgo(dateString: string): string {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}時間前`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}日前`;
    }
  }

  // ニュース記事を取得
  async fetchNews(limit: number = 10): Promise<NewsArticle[]> {
    // APIキーが設定されていない場合はモックデータを返す
    if (!this.apiKey) {
      console.log('Using mock news data (no API key configured)');
      return mockNewsData.slice(0, limit).map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/all?api_token=${this.apiKey}&language=ja&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsResponse = await response.json();
      
      return data.data.map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      // エラーが発生した場合はモックデータを返す
      return mockNewsData.slice(0, limit).map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    }
  }

  // トップストーリーを取得
  async fetchTopStories(limit: number = 5): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      return mockNewsData.slice(0, limit).map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/top?api_token=${this.apiKey}&language=ja&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsResponse = await response.json();
      
      return data.data.map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    } catch (error) {
      console.error('Error fetching top stories:', error);
      return mockNewsData.slice(0, limit).map(article => ({
        ...article,
        published_at: this.formatTimeAgo(article.published_at)
      }));
    }
  }
}

export const newsService = new NewsService();
