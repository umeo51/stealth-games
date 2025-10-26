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

// モックニュースデータ（開発用）- 25件以上のニュース記事
const mockNewsData: NewsArticle[] = Array.from({ length: 30 }, (_, index) => {
  const newsTemplates = [
    {
      title: "AI技術の最新進歩と産業への影響",
      description: "人工知能技術の急速な発展が各産業分野に与える変革的影響について詳細に分析します。",
      categories: ["technology", "ai"],
      source: "tech-news.jp",
      imageKeyword: "artificial-intelligence"
    },
    {
      title: "グローバル経済の動向と市場予測",
      description: "世界経済の最新トレンドと今後の市場動向について専門家による詳細な分析をお届けします。",
      categories: ["economy", "global"],
      source: "economic-times.jp",
      imageKeyword: "global-economy"
    },
    {
      title: "持続可能なビジネス戦略の重要性",
      description: "ESG投資の拡大に伴い、企業の持続可能な経営戦略がますます重要になっています。",
      categories: ["sustainability", "business"],
      source: "green-business.jp",
      imageKeyword: "sustainability"
    },
    {
      title: "デジタル変革が変える働き方",
      description: "リモートワークとデジタルツールの普及により、現代の働き方が大きく変化しています。",
      categories: ["digital", "work"],
      source: "future-work.jp",
      imageKeyword: "remote-work"
    },
    {
      title: "新興市場への投資機会と リスク分析",
      description: "成長著しい新興市場における投資機会とそれに伴うリスクについて詳しく解説します。",
      categories: ["investment", "emerging-markets"],
      source: "investment-weekly.jp",
      imageKeyword: "emerging-markets"
    },
    {
      title: "イノベーション推進のための組織改革",
      description: "企業がイノベーションを継続的に生み出すための組織体制と文化の変革について。",
      categories: ["innovation", "management"],
      source: "innovation-lab.jp",
      imageKeyword: "innovation"
    },
    {
      title: "サイバーセキュリティの最新脅威と対策",
      description: "進化するサイバー攻撃に対する最新の防御策と企業が取るべき対応について解説。",
      categories: ["cybersecurity", "technology"],
      source: "security-today.jp",
      imageKeyword: "cybersecurity"
    },
    {
      title: "クリーンエネルギー技術の進展",
      description: "再生可能エネルギー技術の最新動向と脱炭素社会実現への道筋について分析します。",
      categories: ["energy", "environment"],
      source: "clean-energy.jp",
      imageKeyword: "renewable-energy"
    },
    {
      title: "フィンテック革命と金融業界の未来",
      description: "金融テクノロジーの進歩が従来の金融サービスに与える影響と今後の展望。",
      categories: ["fintech", "finance"],
      source: "fintech-news.jp",
      imageKeyword: "fintech"
    },
    {
      title: "スマートシティ構想の現状と課題",
      description: "IoT技術を活用したスマートシティの実現に向けた取り組みと解決すべき課題について。",
      categories: ["smart-city", "iot"],
      source: "smart-city.jp",
      imageKeyword: "smart-city"
    }
  ];
  
  const template = newsTemplates[index % newsTemplates.length];
  const hoursAgo = Math.floor(Math.random() * 24) + (index * 2);
  
  return {
    uuid: `news-${index + 1}`,
    title: `${template.title} ${index > 9 ? `(${Math.floor(index / 10) + 1})` : ''}`,
    description: template.description,
    snippet: `${template.description} この記事では、最新の調査結果と専門家の見解を基に、詳細な分析と今後の展望をお届けします。業界の動向を把握し、戦略的な意思決定に役立つ情報を提供いたします。関連する統計データや事例研究も含めて、多角的な視点から解説しています。`,
    url: "#",
    image_url: `https://images.unsplash.com/photo-${1500000000 + index}?w=400&h=300&fit=crop&auto=format&q=80`,
    language: "ja",
    published_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    source: template.source,
    categories: template.categories
  };
});

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

  // ニュース記事を取得（デフォルトで25件）
  async fetchNews(limit: number = 25): Promise<NewsArticle[]> {
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
