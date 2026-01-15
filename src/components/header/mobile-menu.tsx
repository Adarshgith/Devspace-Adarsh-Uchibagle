'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { IoChevronBack, IoChevronForward, IoClose, IoMenu } from 'react-icons/io5';

interface Level6Item {
  subExternalUrl: string;
  text: string;
  subUrl: string;
  openInNewTab: boolean;
}

interface Level5Item {
  subExternalUrl: string;
  text: string;
  subUrl: string;
  level6Items: Level6Item[];
  openInNewTab: boolean;
}

interface Level4Item {
  subExternalUrl: string;
  text: string;
  subUrl: string;
  level5Items: Level5Item[];
  openInNewTab: boolean;
}

interface Level3Item {
  subExternalUrl: string;
  text: string;
  subUrl: string;
  level4Items: Level4Item[];
  openInNewTab: boolean;
}

interface SubItemDetails {
  subExternalUrl: string;
  text: string;
  subUrl: string;
  level3Items: Level3Item[];
  openInNewTab: boolean;
}

interface MenuText {
  mainItemText: string;
  mainItemLink: string;
  subItemDetails: SubItemDetails[];
  openInNewTab: boolean;
}

interface MobileMenuProps {
  menuTexts: MenuText[];
  siteSettings: any; // Adjust type according to your siteSettings shape
}

const MobileMenu = ({ menuTexts, siteSettings }: MobileMenuProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
  const [openLevel3Index, setOpenLevel3Index] = useState<number | null>(null);
  const [openLevel4Index, setOpenLevel4Index] = useState<number | null>(null);
  const [openLevel5Index, setOpenLevel5Index] = useState<number | null>(null);
  const [openLevel6Index, setOpenLevel6Index] = useState<number | null>(null);

  const openMobileMenu = () => setIsOpen(true);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenSubmenuIndex(null);
    setOpenLevel3Index(null);
    setOpenLevel4Index(null);
    setOpenLevel5Index(null);
    setOpenLevel6Index(null);
  };

  const toggleSubmenu = (index: number | null) => {
    setOpenSubmenuIndex(index);
    setOpenLevel3Index(null);
    setOpenLevel4Index(null);
    setOpenLevel5Index(null);
    setOpenLevel6Index(null);
  };

  const toggleLevel3 = (subIndex: number | null) => {
    setOpenLevel3Index(subIndex);
    setOpenLevel4Index(null);
    setOpenLevel5Index(null);
    setOpenLevel6Index(null);
  };

  const toggleLevel4 = (level4Index: number | null) => {
    setOpenLevel4Index(level4Index);
    setOpenLevel5Index(null);
    setOpenLevel6Index(null);
  };

  const toggleLevel5 = (level5Index: number | null) => {
    setOpenLevel5Index(level5Index);
    setOpenLevel6Index(null);
  };

  const toggleLevel6 = (level6Index: number | null) => {
    setOpenLevel6Index(level6Index);
  };

  return (
    <>
      {/* Toggle button for opening mobile menu */}
      <button
        id="toggleOpen"
        className="lg:hidden flex flex-wrap items-center focus-within:outline-none justify-center"
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
      >
        {/* <span className="mr-[13px] text-[16px] leading-[26px] text-[#547C5B] font-bold uppercase">Menu</span> */}
        <IoMenu className="text-2xl text-black" />
        <span className='text-[10px] font-semibold text-black leading-2.5 mt-[5px]'>MENU</span>
      </button>

      {/* Mobile menu dialog */}
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="max-lg:fixed inset-0 bg-white" aria-hidden="true" />
          </Transition.Child>

          {/* Main dialog panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="max-lg:fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white">
              <div className="px-[15px] py-[20px] border-b border-[#EDEDED]">
                {/* Logo and close button */}
                <div className="relative">
                  <Link href="/" className="w-fit p-0 z-[100]">
                    {siteSettings && siteSettings.siteLogo && (
                      <Image
                        src={siteSettings.siteLogo.asset.url}
                        width={175}
                        height={32}
                        alt={siteSettings.title}
                      />
                    )}
                  </Link>
                  <button
                    id="toggleClose"
                    className="absolute right-0 top-[50%] -translate-y-2/4 z-[100] bg-white lg:hidden"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <IoClose className="text-2xl text-black" />
                  </button>
                </div>

                {/* Main Menu */}
                <ul className="parent-ul absolute top-[68px] left-0 w-full h-full transition-transform duration-300 bg-white">
                  {menuTexts.map((item, index) => (
                    <li key={index} className="group max-lg:border-t max-lg:border-[#ECECEC]">
                      <div className="flex justify-between items-center">
                        <Link
                          href={item.mainItemLink || '#'}
                          className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                          onClick={closeMobileMenu}
                          target={item.openInNewTab ? '_blank' : '_self'}
                        >
                          {item.mainItemText}
                        </Link>
                        {item.subItemDetails.length > 0 && (
                          <button className="w-auto" onClick={() => toggleSubmenu(index)}>
                            <IoChevronForward className="text-xl text-black" />
                          </button>
                        )}
                      </div>

                      {/* Level 2 Submenu */}
                      <ul
                        className={`level2 absolute top-0 left-0 w-full h-full bg-white z-20 transition-transform duration-300 ${
                          openSubmenuIndex === index ? 'translate-x-0' : 'translate-x-full'
                        }`}
                      >
                        <li className="back-to-parent">
                          <button
                            onClick={() => toggleSubmenu(null)}
                            className="w-full py-[8px] px-[10px] bg-gray-white text-base leading-[26px] font-bold text-black hover:text-black uppercase flex items-center"
                          >
                            <IoChevronBack className="text-xl text-black" /> <span className="pl-[5px] text-xxs text-black capitalize">Back</span>
                          </button>
                        </li>
                        <li className="parent-name">
                            <p className="px-[15px] pt-5 pb-2.5 font-semibold text-xxl text-black capitalize">{item.mainItemText}</p>
                        </li>
                        {item.subItemDetails.map((subItem, subIndex) => (
                          <li key={subIndex} className="border-t border-[#EDEDED]">
                            <div className="flex justify-between items-center">
                              <Link
                                href={subItem.subExternalUrl || '#'}
                                className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                                onClick={closeMobileMenu}
                                target={subItem.openInNewTab ? '_blank' : '_self'}
                              >
                                {subItem.text}
                              </Link>
                              {subItem.level3Items.length > 0 && (
                                <button className="w-auto" onClick={() => toggleLevel3(subIndex)}>
                                  <IoChevronForward className="text-xl text-black" />
                                </button>
                              )}
                            </div>

                            {/* Level 3 Submenu */}
                            <ul
                              className={`level3 absolute top-0 left-0 w-full h-full bg-white z-30 transition-transform duration-300 ${
                                openLevel3Index === subIndex ? 'translate-x-0' : 'translate-x-full'
                              }`}
                            >
                              <li className="back-to-parent">
                                <button
                                  onClick={() => toggleLevel3(null)}
                                  className="w-full py-[8px] px-[10px] bg-gray-white text-base leading-[26px] font-bold text-black hover:text-black uppercase flex items-center"
                                >
                                  <IoChevronBack className="text-xl text-black" /> <span className="pl-[5px] text-xxs text-black capitalize">Back</span>
                                </button>
                              </li>
                              <li className="parent-name-level-two">
                                <p className="px-[15px] pt-5 pb-2.5 font-semibold text-xxl text-black capitalize">{subItem.text}</p>
                              </li>
                              {subItem.level3Items.map((level3Item, level3Index) => (
                                <li key={level3Index} className="border-t border-[#EDEDED]">
                                  <div className="flex justify-between items-center">
                                    <Link
                                      href={level3Item.subExternalUrl || '#'}
                                      className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                                      onClick={closeMobileMenu}
                                      target={level3Item.openInNewTab ? '_blank' : '_self'}
                                    >
                                      {level3Item.text}
                                    </Link>
                                    {level3Item.level4Items.length > 0 && (
                                      <button className="w-auto" onClick={() => toggleLevel4(level3Index)}>
                                        <IoChevronForward className="text-xl text-black" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Level 4 Submenu */}
                                  <ul
                                    className={`level4 absolute top-0 left-0 w-full h-full bg-white z-40 transition-transform duration-300 ${
                                      openLevel4Index === level3Index ? 'translate-x-0' : 'translate-x-full'
                                    }`}
                                  >
                                    <li className="back-to-parent">
                                      <button
                                        onClick={() => toggleLevel4(null)}
                                        className="w-full py-[8px] px-[10px] bg-gray-white text-base leading-[26px] font-bold text-black hover:text-black uppercase flex items-center"
                                      >
                                        <IoChevronBack className="text-xl text-black" /> <span className="pl-[5px] text-xxs text-black capitalize">Back</span>
                                      </button>
                                    </li>
                                    <li className="parent-name-level-two">
                                      <p className="px-[15px] pt-5 pb-2.5 font-semibold text-xxl text-black capitalize">{level3Item.text}</p>
                                    </li>
                                    {level3Item.level4Items.map((level4Item, level4Index) => (
                                      <li key={level4Index} className="border-t border-[#EDEDED]">
                                        <div className="flex justify-between items-center">
                                          <Link
                                            href={level4Item.subExternalUrl || '#'}
                                            className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                                            onClick={closeMobileMenu}
                                            target={level4Item.openInNewTab ? '_blank' : '_self'}
                                          >
                                            {level4Item.text}
                                          </Link>
                                          {level4Item.level5Items.length > 0 && (
                                            <button className="w-auto" onClick={() => toggleLevel5(level4Index)}>
                                              <IoChevronForward className="text-xl text-black" />
                                            </button>
                                          )}
                                        </div>

                                        {/* Level 5 Submenu */}
                                        <ul
                                          className={`level5 absolute top-0 left-0 w-full h-full bg-white z-50 transition-transform duration-300 ${
                                            openLevel5Index === level4Index ? 'translate-x-0' : 'translate-x-full'
                                          }`}
                                        >
                                          <li className="back-to-parent">
                                            <button
                                              onClick={() => toggleLevel5(null)}
                                              className="w-full py-[8px] px-[10px] bg-gray-white text-base leading-[26px] font-bold text-black hover:text-black uppercase flex items-center"
                                            >
                                              <IoChevronBack className="text-xl text-black" /> <span className="pl-[5px] text-xxs text-black capitalize">Back</span>
                                            </button>
                                          </li>
                                          <li className="parent-name-level-two">
                                            <p className="px-[15px] pt-5 pb-2.5 font-semibold text-xxl text-black capitalize">{level4Item.text}</p>
                                          </li>
                                          {level4Item.level5Items.map((level5Item, level5Index) => (
                                            <li key={level5Index} className="border-t border-[#EDEDED]">
                                              <div className="flex justify-between items-center">
                                                <Link
                                                  href={level5Item.subExternalUrl || '#'}
                                                  className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                                                  onClick={closeMobileMenu}
                                                  target={level5Item.openInNewTab ? '_blank' : '_self'}
                                                >
                                                  {level5Item.text}
                                                </Link>
                                                {level5Item.level6Items.length > 0 && (
                                                  <button className="w-auto" onClick={() => toggleLevel6(level5Index)}>
                                                    <IoChevronForward className="text-xl text-black" />
                                                  </button>
                                                )}
                                              </div>

                                              {/* Level 6 Submenu */}
                                              <ul
                                                className={`level6 absolute top-0 left-0 w-full h-full bg-white z-60 transition-transform duration-300 ${
                                                  openLevel6Index === level5Index ? 'translate-x-0' : 'translate-x-full'
                                                }`}
                                              >
                                                <li className="back-to-parent">                                                    <button
                                                      onClick={() => toggleLevel6(null)}
                                                      className="w-full py-[8px] px-[10px] bg-gray-white text-base leading-[26px] font-bold text-black hover:text-black uppercase flex items-center"
                                                    >
                                                      <IoChevronBack className="text-xl text-black" /> <span className="pl-[5px] text-xxs text-black capitalize">Back</span>
                                                    </button>
                                                </li>
                                                <li className="parent-name-level-two">
                                                  <p className="px-[15px] pt-5 pb-2.5 font-semibold text-xxl text-black capitalize">{level5Item.text}</p>
                                                </li>
                                                {level5Item.level6Items.map((level6Item, level6Index) => (
                                                  <li key={level6Index} className="border-b border-[#EDEDED]">
                                                    <Link
                                                      href={level6Item.subExternalUrl || '#'}
                                                      className={`block cursor-default text-xs max-md:text-[16px] px-[15px] py-[10px] font-bold text-black w-full capitalize`}
                                                      onClick={closeMobileMenu}
                                                      target={level6Item.openInNewTab ? '_blank' : '_self'}
                                                    >
                                                      {level6Item.text}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default MobileMenu;
