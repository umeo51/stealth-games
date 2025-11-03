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

// 動的ニュースデータ生成関数
function generateDynamicNews(): NewsArticle[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // 時間帯に応じたニューステンプレート
  const newsTemplates = [
    {
      title: "AI技術が変革する製造業の未来",
      description: "人工知能とロボティクスの融合により、製造業の生産性が飛躍的に向上しています。",
      snippet: "トヨタ自動車は今月、AI搭載の新型ロボットを導入し、生産効率を30%向上させることに成功しました。\n\nこの技術革新により、従来の製造ラインでは不可能だった複雑な作業の自動化が実現。品質管理の精度も大幅に改善されています。\n\n専門家は「これは製造業における第4次産業革命の始まり」と評価しており、今後5年間で関連市場は2倍に拡大すると予測されています。",
      source: "TechNews Japan",
      categories: ["technology", "manufacturing"]
    },
    {
      title: "日経平均が5万円を突破、史上最高値更新",
      description: "日経平均株価が初めて5万円を突破し、史上最高値を更新。",
      snippet: "日経平均株価は本日、初めて5万円を突破し、史上最高値を更新しました。\n\nAI関連株や半導体企業を中心に幅広い業種で上昇。特にトヨタ、ソニー、ソフトバンクグループなどの主要企業が連高を継続しています。\n\n機関投資家は「日本企業の収益性改善とグローバル競争力向上が評価されている」とコメントしています。",
      source: "Economic Daily",
      categories: ["economy", "finance"]
    },
    {
      title: "再生可能エネルギー導入が加速",
      description: "政府の新政策により、太陽光発電と風力発電の設備投資が急速に拡大しています。",
      snippet: "経済産業省は今日、2030年までに再生可能エネルギーの比率を50%まで引き上げる新目標を発表しました。\n\nこれに伴い、大手電力会社各社は設備投資計画を大幅に見直し。総投資額は今後10年間で15兆円規模に達する見込みです。\n\n環境省の調査によると、この政策により年間CO2排出量を40%削減できると試算されており、国際的な脱炭素目標の達成に大きく貢献すると期待されています。",
      source: "Green Energy Times",
      categories: ["environment", "energy"]
    },
    {
      title: "ハイブリッドワーク定着でオフィス需要が変化",
      description: "企業のハイブリッドワーク導入が進み、オフィスの形態が大きく変化。",
      snippet: "主要企業の8割がハイブリッドワークを正式導入し、オフィスの役割が大きく変化しています。\n\n従来の固定席からフリーアドレスへの移行が加速し、コラボレーションスペースや会議室の需要が高まっています。一方で個人デスクの需要は減少傾向です。\n\n不動産コンサルタントは「オフィスの質と機能性が重視される時代になった」と分析しています。",
      source: "Business Today",
      categories: ["business", "work"]
    },
    {
      title: "生成AI市場が爆発的成長、2025年は20兆円規模へ",
      description: "生成AI技術の市場規模が急拡大し、2025年には20兆円を超える見通し。",
      snippet: "生成AI技術の市場規模が爆発的に成長し、2025年には世界で20兆円を超える見通しです。\n\n特に日本企業ではChatGPTやコパイロットなどのビジネス活用が急速に進んでいます。ソフトバンク、NTTデータ、サイバーエージェントなどが独自のAIサービスを続々とリリースしています。\n\nITアナリストは「日本はAI先進国としての地位を確立しつつある」とコメントしています。",
      source: "Tech Innovation Weekly",
      categories: ["technology", "ai"]
    },
    {
      title: "新興企業の資金調達が過去最高額を記録",
      description: "スタートアップ企業への投資が急増し、特にAI・バイオテック分野が注目。",
      snippet: "スタートアップ企業への投資額が前年比150%増となり、特にAI・バイオテック分野への注目が高まっています。\n\nベンチャーキャピタル各社は「技術革新のスピードが加速している」と分析しており、今後も積極的な投資を継続する方針です。\n\n政府も「スタートアップ・エコシステム拠点都市」の支援を強化し、イノベーション創出を後押ししています。",
      source: "Startup News",
      categories: ["business", "startup"]
    },
    {
      title: "食品業界でサステナブル包装が急速普及",
      description: "環境配慮型パッケージの導入が加速し、新素材技術が注目。",
      snippet: "大手食品メーカーが相次いで環境配慮型パッケージを導入。プラスチック使用量を50%削減する新素材が注目されています。\n\n消費者の環境意識の高まりを受け、小売業界でも同様の取り組みが拡大しており、関連技術への投資が活発化しています。\n\n業界団体は「2030年までに包装材の80%を持続可能な素材に転換する」目標を掲げています。",
      source: "Food Industry Report",
      categories: ["environment", "food"]
    },
    {
      title: "5G通信網の整備が地方創生を加速",
      description: "高速通信インフラにより地方のデジタル化が本格化。",
      snippet: "高速通信インフラの整備により、地方でのデジタル事業展開が本格化しています。\n\n農業のスマート化や遠隔医療サービスの普及により、地方と都市部の格差縮小が期待されており、政府も支援策を拡充する方針です。\n\n総務省の調査では、5G活用により地方の生産性が平均25%向上すると試算されています。",
      source: "Regional Development",
      categories: ["technology", "regional"]
    },
    {
      title: "ヘルスケア分野でAI診断システムが実用段階へ",
      description: "医療AI技術の進歩により診断精度が大幅に向上。",
      snippet: "医療AI技術の進歩により、画像診断の精度が大幅に向上。早期がん発見率が従来比30%改善しました。\n\n厚生労働省は来年度から医療AI機器の承認手続きを簡素化する方針を発表しており、普及が加速すると予想されています。\n\n医療従事者からは「診断支援により医師の負担軽減と医療の質向上が同時に実現できる」と期待の声が上がっています。",
      source: "Medical Technology",
      categories: ["healthcare", "ai"]
    },
    {
      title: "宇宙ビジネス市場が急拡大、民間参入が活発化",
      description: "衛星打ち上げコストの削減により宇宙関連ビジネスが急成長。",
      snippet: "衛星打ち上げコストの大幅削減により、宇宙関連ビジネスへの民間企業参入が相次いでいます。\n\n通信衛星や地球観測衛星の需要が急増しており、関連産業の市場規模は2030年までに現在の3倍に拡大すると予測されています。\n\n宇宙航空研究開発機構（JAXA）も民間企業との連携を強化し、商業宇宙開発を推進しています。",
      source: "Space Business",
      categories: ["technology", "space"]
    }
  ];
  
  // 時間ベースのシード値を生成（10分ごとに変更）
  const timeSeed = Math.floor(now.getTime() / (10 * 60 * 1000));
  
  const mockNewsData: NewsArticle[] = [];
  
  // 最初の5件は固定テンプレートから選択
  for (let i = 0; i < 5; i++) {
    const templateIndex = (i + timeSeed) % newsTemplates.length;
    const template = newsTemplates[templateIndex];
    const minutesAgo = 5 + (i * 10) + (timeSeed % 30); // 動的な時間生成
    
    mockNewsData.push({
      uuid: `news-${i + 1}-${timeSeed}`, // 時間ベースのユニークID
      title: template.title,
      description: template.description,
      snippet: template.snippet,
      url: "#",
      image_url: `https://picsum.photos/400/250?random=${(i + timeSeed) % 1000}`,
      language: "ja",
      published_at: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
      source: template.source,
      categories: template.categories
    });
  }
  
  // 残りの記事を生成（テンプレートをローテーション）
  for (let i = 5; i < 30; i++) {
    const templateIndex = (i + timeSeed + currentHour) % newsTemplates.length;
    const template = newsTemplates[templateIndex];
    const variation = Math.floor((i - 5) / newsTemplates.length) + 1;
    const minutesAgo = 60 + (i * 20) + (timeSeed % 60); // より古い記事
    
    mockNewsData.push({
      uuid: `news-${i + 1}-${timeSeed}`,
      title: `${template.title}${variation > 1 ? ` (${variation})` : ''}`,
      description: template.description,
      snippet: template.snippet,
      url: "#",
      image_url: `https://picsum.photos/400/250?random=${(i + timeSeed + currentHour) % 1000}`,
      language: "ja",
      published_at: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
      source: template.source,
      categories: template.categories
    });
  }
  
  return mockNewsData;
}

// 動的に生成されたモックニュースデータ
const mockNewsData: NewsArticle[] = [
// 初期化時に動的データを生成
];



class NewsService {
  private theNewsApiKey: string | null = null;
  private theNewsApiUrl = 'https://api.thenewsapi.com/v1/news';

  constructor() {
    // TheNewsAPI キーを環境変数から取得
    this.theNewsApiKey = process.env.REACT_APP_THE_NEWS_API_KEY || null;
    console.log('TheNewsAPI key loaded:', this.theNewsApiKey ? 'Yes' : 'No');
  }

  // 英語テキストを日本語に翻訳
  private async translateToJapanese(text: string): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY || null;
    if (!openaiApiKey) {
      // APIキーがない場合は簡易翻訳を返す
      return `[翻訳] ${text.substring(0, 100)}...`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'あなたはプロのニュース翻訳者です。英語のニュース記事を自然で読みやすい日本語に翻訳してください。ビジネスニュースに適した正式な文体でお願いします。'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('Translation error:', error);
      return `[翻訳エラー] ${text.substring(0, 100)}...`;
    }
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

  // TheNewsAPIからニュースを取得
  private async fetchFromTheNewsAPI(limit: number): Promise<NewsArticle[]> {
    try {
      // APIキーがない場合でも試行（無料プランでテスト可能）
      const queryParams = new URLSearchParams({
        'categories': 'business,tech,general',
        'language': 'en',
        'limit': Math.min(limit, 100).toString(),
        'sort': 'published_at'
      });
      
      // APIキーがある場合は追加
      if (this.theNewsApiKey) {
        queryParams.append('api_token', this.theNewsApiKey);
      }

      const response = await fetch(`${this.theNewsApiUrl}/all?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`TheNewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from TheNewsAPI');
      }
      
      const articles: NewsArticle[] = [];
      for (const article of data.data.slice(0, limit)) {
        if (!article.title || !article.description) continue;
        
        // 日本語翻訳（OpenAI APIが利用可能な場合）
        let translatedTitle = article.title;
        let translatedDescription = article.description;
        let translatedSnippet = article.snippet || article.description;
        
        // 英語記事の場合は翻訳を試行
        if (article.language === 'en') {
          try {
            translatedTitle = await this.translateToJapanese(article.title);
            translatedDescription = await this.translateToJapanese(article.description);
            if (article.snippet) {
              translatedSnippet = await this.translateToJapanese(article.snippet);
            }
          } catch (error) {
            console.log('Translation failed, using original text:', error);
            // 翻訳に失敗した場合は元のテキストを使用
          }
        }
        
        articles.push({
          uuid: article.uuid || `thenews-${Date.now()}-${Math.random()}`,
          title: translatedTitle,
          description: translatedDescription,
          snippet: translatedSnippet,
          url: article.url || '#',
          image_url: article.image_url || `https://picsum.photos/400/250?random=${Math.floor(Math.random() * 1000)}`,
          language: 'ja',
          published_at: article.published_at,
          source: article.source || 'International News',
          categories: article.categories || ['general']
        });
      }
      
      return articles;
    } catch (error) {
      console.error('TheNewsAPI fetch error:', error);
      return [];
    }
  }

  // 日本語ニュースソースからの取得（補完用）
  private async fetchJapaneseNews(limit: number): Promise<NewsArticle[]> {
    try {
      const queryParams = new URLSearchParams({
        'categories': 'business,tech,general',
        'language': 'ja',
        'limit': Math.min(limit, 50).toString(),
        'sort': 'published_at'
      });
      
      if (this.theNewsApiKey) {
        queryParams.append('api_token', this.theNewsApiKey);
      }

      const response = await fetch(`${this.theNewsApiUrl}/all?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`TheNewsAPI Japanese fetch error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }
      
      const articles: NewsArticle[] = [];
      for (const article of data.data.slice(0, limit)) {
        if (!article.title || !article.description) continue;
        
        articles.push({
          uuid: article.uuid || `thenews-jp-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description,
          snippet: article.snippet || article.description,
          url: article.url || '#',
          image_url: article.image_url || `https://picsum.photos/400/250?random=${Math.floor(Math.random() * 1000)}`,
          language: 'ja',
          published_at: article.published_at,
          source: article.source || 'Japanese News',
          categories: article.categories || ['general']
        });
      }
      
      return articles;
    } catch (error) {
      console.error('Japanese news fetch error:', error);
      return [];
    }
  }

  // ニュース記事を取得（デフォルト30件）
  async fetchNews(limit: number = 30, cacheVersion?: string): Promise<NewsArticle[]> {
    // キャッシュバスティング用のログ
    if (cacheVersion) {
      console.log(`Fetching news with cache version: ${cacheVersion}`);
    }
    const allArticles: NewsArticle[] = [];
    
    // TheNewsAPIから実際のニュースを取得
    try {
      console.log('Fetching real-time news from TheNewsAPI...');
      
      // 英語ニュースを取得して翻訳
      const englishArticles = await this.fetchFromTheNewsAPI(Math.floor(limit * 0.7));
      allArticles.push(...englishArticles);
      
      // 日本語ニュースを直接取得
      const japaneseArticles = await this.fetchJapaneseNews(Math.floor(limit * 0.3));
      allArticles.push(...japaneseArticles);
      
      // 実際のニュースが取得できた場合
      if (allArticles.length > 0) {
        console.log(`Successfully fetched ${allArticles.length} real news articles`);
        
        // 日付でソートして最新順に並べる
        allArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        
        // 時間表示をフォーマット
        return allArticles.slice(0, limit).map(article => ({
          ...article,
          published_at: this.formatTimeAgo(article.published_at)
        }));
      }
    } catch (error) {
      console.error('Error fetching real news from TheNewsAPI:', error);
    }
    
    // リアルニュースが取得できない場合のフォールバック
    console.log(`Real news API unavailable, using dynamic mock data - Cache version: ${cacheVersion || 'none'}`);
    
    // 動的にニュースデータを生成
    const dynamicNewsData = generateDynamicNews();
    
    // 日付でソートして最新順に並べる
    dynamicNewsData.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    
    // 時間表示をフォーマットして返す
    return dynamicNewsData.slice(0, limit).map(article => ({
      ...article,
      published_at: this.formatTimeAgo(article.published_at)
    }));
  }

  // トップストーリーを取得（fetchNewsと同じ処理）
  async fetchTopStories(limit: number = 5): Promise<NewsArticle[]> {
    return this.fetchNews(limit);
  }
}

export const newsService = new NewsService();
