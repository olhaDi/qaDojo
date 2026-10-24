# Article Search Test Plan

## Application Overview

The QA Dojo "Testing articles" page (`http://104.168.59.50/articles`) lists 9 seeded articles in a "Global feed" with a counter ("9 articles"). Above the list is a search box (placeholder "Search headlines…"), a sort dropdown, a "With cover" checkbox, and "Reset" and "Apply" buttons. Search is submit-based: typing alone does nothing, and the filter runs when the user clicks "Apply" or presses Enter in the box. It calls `GET /api/articles?search=<term>&sort=newest&limit=10&offset=0`. The URL stays `/articles` and does not carry the query. The match is case-insensitive and covers the article title and description. It does not cover tags or author names. The search term is trimmed. An empty or whitespace-only term shows all articles. When nothing matches, the counter reads "0 articles" and the list shows "No articles here yet."

Known data: "стаб" matches 2 articles (stable selectors, test data isolation). "sleep" matches 1 (WebdriverIO waits). "CI" matches 1 (Швидкий CI). "page object" matches 1. "паузи" matches 1 (description only).

## Test Scenarios

### 1. Article search

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-filter-articles-by-title-on-apply

**File:** `tests/article-search/should-filter-articles-by-title-on-apply.spec.ts`

**Steps:**
  1. Open the articles page and note the counter.
    - expect: Counter reads "9 articles" and 9 article cards are shown
  2. Type "sleep" into the search box without clicking anything else
    - expect: The list is unchanged (9 cards, counter "9 articles"), so there is no live filtering
  3. Click "Apply"
    - expect: Counter reads "1 article"
    - expect: Only the card "Очікування у WebdriverIO без зайвих sleep" is shown
    - expect: The URL is still `/articles` and the search box still contains "sleep"

#### 1.2. should-filter-articles-on-enter-key

**File:** `tests/article-search/should-filter-articles-on-enter-key.spec.ts`

**Steps:**
  1. Type "page object" into the search box
  2. Press Enter
    - expect: Counter reads "1 article"
    - expect: Only the card "Page Object без надмірної абстракції" is shown

#### 1.3. should-show-empty-state-when-nothing-matches

**File:** `tests/article-search/should-show-empty-state-when-nothing-matches.spec.ts`

**Steps:**
  1. Type "xyzzy" into the search box and click "Apply"
    - expect: Counter reads "0 articles"
    - expect: No article cards are shown
    - expect: The text "No articles here yet." is visible
    - expect: The search box keeps "xyzzy"

#### 1.4. should-show-all-articles-for-empty-or-whitespace-query

**File:** `tests/article-search/should-show-all-articles-for-empty-or-whitespace-query.spec.ts`

**Steps:**
  1. Type "xyzzy", click "Apply" and confirm the empty state
  2. Clear the search box and click "Apply"
    - expect: Counter reads "9 articles" and all 9 cards are shown
  3. Type three spaces and click "Apply"
    - expect: Counter reads "9 articles" (whitespace-only input is treated as no filter)

#### 1.5. should-match-case-insensitively-and-trim-whitespace

**File:** `tests/article-search/should-match-case-insensitively-and-trim-whitespace.spec.ts`

**Steps:**
  1. Type "SLEEP" and click "Apply"
    - expect: Counter reads "1 article" ("Очікування у WebdriverIO без зайвих sleep")
  2. Type "  ci  " (padded with spaces) and click "Apply"
    - expect: Counter reads "1 article" ("Швидкий CI: що ми змінили за один спринт")
  3. Type "СТАБ" (Cyrillic uppercase) and click "Apply"
    - expect: Counter reads "2 articles" (same as lowercase "стаб")
  4. Type "паузи", a word that appears only in a description, and click "Apply"
    - expect: Counter reads "1 article", so descriptions are searched too
  5. Type "selectors", a tag-only word, and click "Apply"
    - expect: Counter reads "0 articles" with "No articles here yet." (tags and authors are not searched; confirm with the product owner whether this is intended)

#### 1.6. should-handle-special-characters-safely

**File:** `tests/article-search/should-handle-special-characters-safely.spec.ts`

**Steps:**
  1. Type `<b>` and click "Apply"
    - expect: Counter reads "0 articles", the empty state is shown, and no raw HTML is rendered or injected into the page
  2. Type `' OR 1=1 --` and click "Apply"
    - expect: Counter reads "0 articles" with no error message or broken page
  3. Type 300 "a" characters and click "Apply"
    - expect: Counter reads "0 articles" and the page layout is not broken
  4. Type "%" and click "Apply"
    - expect: Observed: all 9 articles are returned, which suggests "%" acts as a SQL LIKE wildcard. Mark as a possible defect; a literal "%" search should return 0 articles.

#### 1.7. should-restore-full-list-after-reset

**File:** `tests/article-search/should-restore-full-list-after-reset.spec.ts`

**Steps:**
  1. Type "xyzzy" and click "Apply"
    - expect: The empty state is shown
  2. Click "Reset"
    - expect: The search box is empty
    - expect: Counter reads "9 articles" and all 9 cards are shown
  3. Type "ci", click "Apply", then reload the page
    - expect: The filter is not persisted: the search box is empty and 9 articles are shown after reload
