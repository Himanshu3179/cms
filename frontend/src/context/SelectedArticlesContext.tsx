import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SelectedArticlesContextType {
  selectedArticles: string[];
  addArticle: (id: string) => void;
  removeArticle: (id: string) => void;
  clearArticles: () => void;
}

const SelectedArticlesContext = createContext<
  SelectedArticlesContextType | undefined
>(undefined);

export const SelectedArticlesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedArticles, setSelectedArticles] = useState<string[]>(() => {
    // Load saved articles from localStorage on initial render
    const savedArticles = localStorage.getItem("selectedArticles");
    return savedArticles ? JSON.parse(savedArticles) : [];
  });

  // Save selected articles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedArticles", JSON.stringify(selectedArticles));
  }, [selectedArticles]);

  const addArticle = (id: string) => {
    console.log("Adding article with ID:", id);
    setSelectedArticles((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeArticle = (id: string) => {
    console.log("Removing article with ID:", id);
    setSelectedArticles((prev) => prev.filter((articleId) => articleId !== id));
  };

  const clearArticles = () => {
    console.log("Clearing selected articles");
    setSelectedArticles([]);
  };

  return (
    <SelectedArticlesContext.Provider
      value={{ selectedArticles, addArticle, removeArticle, clearArticles }}
    >
      {children}
    </SelectedArticlesContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSelectedArticles = () => {
  const context = useContext(SelectedArticlesContext);
  if (!context) {
    throw new Error(
      "useSelectedArticles must be used within a SelectedArticlesProvider"
    );
  }
  return context;
};
