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
const mockNewsData: NewsArticle[] = [
  {
    uuid: "news-1",
    title: "AI技術が変革する製造業の未来",
    description: "人工知能とロボティクスの融合により、製造業の生産性が飛躍的に向上しています。",
    snippet: "トヨタ自動車は今月、AI搭載の新型ロボットを導入し、生産効率を30%向上させることに成功しました。\n\nこの技術革新により、従来の製造ラインでは不可能だった複雑な作業の自動化が実現。品質管理の精度も大幅に改善されています。\n\n専門家は「これは製造業における第4次産業革命の始まり」と評価しており、今後5年間で関連市場は2倍に拡大すると予測されています。",
    url: "#",
    image_url: "https://picsum.photos/400/250?random=1",
    language: "ja",
    published_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5分前
    source: "TechNews Japan",
    categories: ["technology", "manufacturing"]
  },
  {
    uuid: "news-2",
    title: "円安進行で輸出企業の業績好調",
    description: "為替相場の変動により、日本の主要輸出企業の第3四半期決算が予想を上回る結果となりました。",
    snippet: "日経平均株価は本日、年初来高値を更新し、3万8000円台に到達しました。\n\n特に自動車メーカーや電子部品企業の株価が大幅上昇。円安効果により海外売上高が押し上げられ、多くの企業が業績予想を上方修正しています。\n\nアナリストは「この傾向は来年前半まで続く可能性が高い」と分析しており、投資家の注目が集まっています。",
    url: "#",
    image_url: "https://picsum.photos/400/250?random=2",
    language: "ja",
    published_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12分前
    source: "Economic Daily",
    categories: ["economy", "finance"]
  },
  {
    uuid: "news-3",
    title: "再生可能エネルギー導入が加速",
    description: "政府の新政策により、太陽光発電と風力発電の設備投資が急速に拡大しています。",
    snippet: "経済産業省は今日、2030年までに再生可能エネルギーの比率を50%まで引き上げる新目標を発表しました。\n\nこれに伴い、大手電力会社各社は設備投資計画を大幅に見直し。総投資額は今後10年間で15兆円規模に達する見込みです。\n\n環境省の調査によると、この政策により年間CO2排出量を40%削減できると試算されており、国際的な脱炭素目標の達成に大きく貢献すると期待されています。",
    url: "#",
    image_url: "https://picsum.photos/400/250?random=3",
    language: "ja",
    published_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25分前
    source: "Green Energy Times",
    categories: ["environment", "energy"]
  },
  {
    uuid: "news-4",
    title: "リモートワーク定着で不動産市場に変化",
    description: "働き方改革の浸透により、オフィス需要と住宅需要の構造的変化が顕著になっています。",
    snippet: "不動産大手の調査によると、都心部のオフィス空室率が過去5年で最高水準に達しました。\n\n一方で、郊外の戸建て住宅や地方都市のマンション需要は急増。テレワーク普及により「職住近接」から「職住分離」へのトレンド転換が鮮明になっています。\n\n専門家は「この変化は一時的なものではなく、今後10年間続く構造的変化」と分析。不動産業界では新たなビジネスモデルの構築が急務となっています。",
    url: "#",
    image_url: "https://picsum.photos/400/250?random=4",
    language: "ja",
    published_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45分前
    source: "Real Estate Weekly",
    categories: ["real-estate", "work"]
  },
  {
    uuid: "news-5",
    title: "量子コンピューター実用化に向けた大きな進展",
    description: "IBM社が発表した新型量子プロセッサにより、実用的な量子計算の実現が大幅に前進しました。",
    snippet: "IBM社は昨日、1000量子ビットを超える新型量子プロセッサの開発に成功したと発表しました。\n\nこの技術により、従来のスーパーコンピューターでは数年かかる計算を数時間で完了できるようになります。特に創薬分野や金融リスク分析での活用が期待されています。\n\n日本でも理化学研究所が同様の研究を進めており、2026年までに商用化を目指すと発表。量子コンピューター市場は2030年までに10兆円規模に成長すると予測されています。",
    url: "#",
    image_url: "https://picsum.photos/400/250?random=5",
    language: "ja",
    published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1時間前
    source: "Science & Technology",
    categories: ["technology", "science"]
  }
];

// 追加のニュース記事を生成（合計30件）
for (let i = 5; i < 30; i++) {
  const templates = [
    {
      title: "新興企業の資金調達が過去最高額を記録",
      snippet: "スタートアップ企業への投資額が前年比150%増となり、特にAI・バイオテック分野への注目が高まっています。\n\nベンチャーキャピタル各社は「技術革新のスピードが加速している」と分析しており、今後も積極的な投資を継続する方針です。",
      source: "Startup News"
    },
    {
      title: "食品業界でサステナブル包装が急速普及",
      snippet: "大手食品メーカーが相次いで環境配慮型パッケージを導入。プラスチック使用量を50%削減する新素材が注目されています。\n\n消費者の環境意識の高まりを受け、小売業界でも同様の取り組みが拡大しており、関連技術への投資が活発化しています。",
      source: "Food Industry Report"
    },
    {
      title: "5G通信網の整備が地方創生を加速",
      snippet: "高速通信インフラの整備により、地方でのデジタル事業展開が本格化しています。\n\n農業のスマート化や遠隔医療サービスの普及により、地方と都市部の格差縮小が期待されており、政府も支援策を拡充する方針です。",
      source: "Regional Development"
    },
    {
      title: "ヘルスケア分野でAI診断システムが実用段階へ",
      snippet: "医療AI技術の進歩により、画像診断の精度が大幅に向上。早期がん発見率が従来比30%改善しました。\n\n厚生労働省は来年度から医療AI機器の承認手続きを簡素化する方針を発表しており、普及が加速すると予想されています。",
      source: "Medical Technology"
    },
    {
      title: "宇宙ビジネス市場が急拡大、民間参入が活発化",
      snippet: "衛星打ち上げコストの大幅削減により、宇宙関連ビジネスへの民間企業参入が相次いでいます。\n\n通信衛星や地球観測衛星の需要が急増しており、関連産業の市場規模は2030年までに現在の3倍に拡大すると予測されています。",
      source: "Space Business"
    }
  ];
  
  const template = templates[(i - 5) % templates.length];
  // より新しいニュースにするために時間を短くする
  const minutesAgo = 30 + (i * 15); // 30分前から開始し、15分ずつ古くする
  
  mockNewsData.push({
    uuid: `news-${i + 1}`,
    title: `${template.title} (${Math.floor(i / 5) + 1})`,
    description: template.title.substring(0, 50) + "について詳しく解説します。",
    snippet: template.snippet,
    url: "#",
    image_url: `https://picsum.photos/400/250?random=${i + 1}`,
    language: "ja",
    published_at: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    source: template.source,
    categories: ["business", "technology"]
  });
}

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

    if (diffInMinutes < 1) {
      return "たった今";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}時間前`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}日前`;
    }
  }

  // ニュース記事を取得（デフォルト30件）
  async fetchNews(limit: number = 30): Promise<NewsArticle[]> {
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
