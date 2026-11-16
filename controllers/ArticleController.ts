import { APIRequestContext } from '@playwright/test';
export interface CreateArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
    category: string;
    visibility: string;
    allowComments: boolean;
    cover: string;
  };
}

export interface ArticleResponse {
  article: CreateArticleRequest['article'] & {
    slug: string;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}

export class ArticleController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createArticle(body: CreateArticleRequest): Promise<ArticleResponse> {
    const response = await this.request.post('/api/articles', { data: body });
    if (!response.ok()) {
      throw new Error(
        `Failed to create article: ${response.status()} ${response.statusText()}`,
      );
    }
    return response.json();
  }

  async deleteArticle(slug: string): Promise<void> {
    const response = await this.request.delete(`/api/articles/${slug}`);
    if (!response.ok()) {
      throw new Error(
        `Failed to delete article: ${response.status()} ${response.statusText()}`,
      );
    }
  }
}
