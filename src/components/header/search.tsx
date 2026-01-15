'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams?.get('q') || '');

  function clearSearch() {
    setSearchValue('');
  }

  return (
    <form  className="flex items-center h-[56px] border py-[10px] pl-[20px] pr-[9px] border-[#ADADAD] bg-transparent focus-within:border-[#ADADAD] focus-within:bg-transparent max-sm:mx-0 max-sm:mt-0 w-full max-w-[925px] max-md:max-w-full max-md:border-transparent max-md:focus-within:border-transparent max-md:p-0 max-md:h-[26px]">
      <input
        type="text"
        name="search"
        placeholder="Search products, services and resources..."
        autoComplete="off"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full border-none bg-transparent text-[18px] leading-[28px] font-normal text-gray-600 outline-none focus:border-none placeholder-[#7F7F7F]"
      />
      {searchValue && (
        <button type="button" onClick={clearSearch} className="text-gray-500 mr-5">
          <IoClose className="text-xl" />
        </button>
      )}
      <button type="submit" className="primaryBtn py-[4px] px-[19px] ml-2">
        Search
      </button>
    </form>
  );
}
