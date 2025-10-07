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
    snippet: "専門家による最新の経済分析と市場予測をお届けします。インフレ率の動向と企業業績への影響について詳しく解説...",
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
    snippet: "AI技術の進歩が各業界に与える影響と、今後の投資機会について分析します。特に注目すべき企業と技術トレンド...",
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
    snippet: "世界各国の株式市場の動向と、為替相場の変動要因について詳細に分析。投資家が注目すべきポイントを整理...",
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
    snippet: "スタートアップ企業の最新の資金調達状況と投資トレンドを分析。特に注目される分野と企業について...",
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
    snippet: "ESG投資の拡大と企業の持続可能な経営戦略について解説。環境・社会・ガバナンスの観点から...",
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
  private formatTimeAgo(dateString: string): string {
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
