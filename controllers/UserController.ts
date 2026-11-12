import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CreateUserRequest {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface UserResponse {
  user: {
    email: string;
    username: string;
    bio: string;
    image: string;
    token: string;
  };
}

/**
 * API helper for user operations. Works with any APIRequestContext,
 * so relative paths are resolved against that context's baseURL.
 */
export class UserController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /** POST /api/users — registers a user. The response already contains a token. */
  async createUser(body: CreateUserRequest): Promise<UserResponse> {
    const response = await this.request.post('/api/users', { data: body });
    await this.assertOk(response, 'create user');
    return response.json();
  }

  /** POST /api/users/login — returns the token of an existing user. */
  async loginAsUser(email: string, password: string): Promise<string> {
    const response = await this.request.post('/api/users/login', {
      data: { user: { email, password } },
    });
    await this.assertOk(response, 'login');

    const json: UserResponse = await response.json();
    return json.user.token;
  }

  // Include the server's answer in the error: a bare "422" says nothing.
  private async assertOk(response: APIResponse, action: string) {
    if (!response.ok()) {
      throw new Error(
        `Failed to ${action}: ${response.status()} ${await response.text()}`,
      );
    }
  }
}
