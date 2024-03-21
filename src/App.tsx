/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Product } from "./interfaces/Products";

const App = () => {
  /**
   * TODO: Create a Debounce Function
   */

  type DebouncedFunc = (...args: any[]) => void;

  const debounce = <F extends DebouncedFunc>(fn: F, delay: number = 500) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [zeroProductsFound, setZeroProductsFound] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const searchHandler = useCallback(async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${searchTerm}`
      );
      const result = await response.json();
      if (result.products.length < 1) {
        setZeroProductsFound(true);
      }
      return setProducts(result.products);
    } catch (e) {
      console.error(e instanceof Error && e.message);
    } finally {
      if (zeroProductsFound) {
        setZeroProductsFound(false);
      }
    }
  }, [searchTerm, zeroProductsFound]);

  const debounced = debounce(searchHandler, 500);

  useEffect(() => {
    debounced();
  }, [debounced]);

  return (
    <section className="min-h-screen py-10">
      <h1 className="text-center text-4xl font-bold mb-8">FlipMart</h1>
      <div className="flex justify-center">
        <input
          autoFocus
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          type="text"
          className="p-4 text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Search..."
        />
      </div>
      <div className="max-w-7xl mx-auto mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {zeroProductsFound && (
          <div className="text-red-500 text-4xl font-semibold">
            No products found
          </div>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800 shadow-md p-4 rounded-md flex flex-col justify-between"
          >
            <div>
              <h1 className="text-xl font-semibold mb-2">{product.title}</h1>
              <img
                src={product.thumbnail}
                className="w-full h-64 object-cover mb-4 rounded-md"
                alt={product.title}
              />
              <p className="mb-4 line-clamp-2">{product.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <button className="px-4 py-2 rounded-md bg-blue-500 text-white">
                {`Buy: ${product.price}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default App;
