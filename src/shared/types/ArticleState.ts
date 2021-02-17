const articleStates = ["EDITING", "PUBLISHED", "DELETED"] as const;

type ArticleState = typeof articleStates[number];

const matchArticleStates = (state: string): boolean => {
  articleStates.forEach((articleState) => {
    if (articleState === state) return true;
  });
  return false;
};

const defaultArticleState: ArticleState = "EDITING";

export default ArticleState;

export { articleStates, matchArticleStates, defaultArticleState };
