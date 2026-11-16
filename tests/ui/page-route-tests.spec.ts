import { test, expect } from '../fixtures/base-fixture';
import { faker } from '@faker-js/faker';
import {
  ArticleController,
  CreateArticleRequest,
} from '../../controllers/ArticleController';
import { EditorPage } from '../../pages/qaDojo/EditorPage';

// The login fixture applies its own storage state, so skip the shared one.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Page route tests', () => {
  test('Change article data before it is sent to the server', async ({
    page,
    login,
  }) => {
    const formTitle = `Form title ${faker.string.alphanumeric(8)}`;
    const routedTitle = `Routed title ${faker.string.alphanumeric(8)}`;
    const editorPage = new EditorPage(page);

    // page.route only catches requests made BY THE BROWSER, so the article
    // has to be created through the UI form (not via an API client).
    await page.route(
      (url) => url.pathname === '/api/articles',
      async (route, request) => {
        if (request.method() !== 'POST') {
          return route.continue();
        }
        // Keep the structure the API expects, replace only the title.
        const body: CreateArticleRequest = request.postDataJSON();
        body.article.title = routedTitle;
        await route.continue({ postData: JSON.stringify(body) });
      },
    );

    await page.goto('/articles');
    await editorPage.header.newArticle.click();
    await editorPage.title.fill(formTitle);
    await editorPage.description.fill(faker.lorem.sentence());
    await editorPage.body.fill(faker.lorem.paragraph());
    await expect(editorPage.submitButton).toBeEnabled();

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === '/api/articles' &&
          r.request().method() === 'POST',
      ),
      editorPage.submitButton.click(),
    ]);
    expect(response.status()).toBe(201);

    await expect(page).toHaveURL(/\/articles\/article\/[^/]+$/);
    const articleTitle = page.getByTestId('article-title');
    await expect(articleTitle).toHaveText(routedTitle);
    await expect(articleTitle).not.toHaveText(formTitle);
  });

  test('Check return list of articles', async ({
    page,
    login,
    authorizedRequest,
  }) => {
    const title = `List title ${faker.string.alphanumeric(8)}`;
    await new ArticleController(authorizedRequest).createArticle({
      article: {
        title,
        description: 'test',
        body: 'test',
        tagList: [],
        category: 'general',
        visibility: 'public',
        allowComments: true,
        cover: '',
      },
    });

    await page.goto('/articles');
    await expect(page.getByTestId('article-list')).toBeVisible();
    await expect(
      page.getByTestId('article-list').getByText(title),
    ).toBeVisible();
  });

  test('Return a prepared list of articles', async ({ page, login }) => {
    const title = `Prepared title ${faker.string.alphanumeric(8)}`;
    const now = new Date().toISOString();
    // Same structure as the real response, incl. the nested author.
    const preparedArticle = {
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      description: 'Prepared description',
      body: 'Prepared body',
      tagList: [],
      category: 'general',
      visibility: 'public',
      allowComments: true,
      cover: '',
      createdAt: now,
      updatedAt: now,
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'prepared-author',
        bio: '',
        image: '/avatar-placeholder.svg',
        following: false,
      },
    };

    // The URL carries query params (?sort=...&limit=...&offset=...),
    // so match on the pathname instead of an exact string.
    await page.route(
      (url) => url.pathname === '/api/articles',
      async (route, request) => {
        if (request.method() !== 'GET') {
          return route.continue();
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ articles: [preparedArticle], articlesCount: 1 }),
        });
      },
    );

    await page.goto('/articles');

    const cards = page.getByTestId(/^article-preview-/);
    await expect(cards).toHaveCount(1);
    await expect(cards.getByTestId('preview-title')).toHaveText(title);
  });
});
