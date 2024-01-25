"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

export default function SearchBar() {
  const [searchStr, setSearchStr] = useState<string>();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/browse/${searchStr}`);
  };

  return (
    <form
      className="flex bg-charcoal bg-opacity-90 rounded-md text-white w-2/3 3xl:w-1/2 h-20"
      onSubmit={handleSubmit}
    >
      <button type="submit" className="mx-2 text-white">
        <BsSearch className="3xl:h-6 3xl:w-6 3xl:mx-4" />
      </button>
      <input
        type="text"
        className="border-none outline-none rounded-md bg-charcoal bg-opacity-70 placeholder-white text-md 3xl:text-3xl font-medium flex-grow"
        placeholder="Search"
        onChange={(e) => setSearchStr(e.target.value)}
      />
    </form>
  );
}
