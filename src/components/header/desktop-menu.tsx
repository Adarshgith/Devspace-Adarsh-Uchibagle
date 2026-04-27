'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';

interface Level6Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  openInNewTab: boolean;
}

interface Level5Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  openInNewTab: boolean;
  level6Items: Level6Item[];
}

interface Level4Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  openInNewTab: boolean;
  level5Items: Level5Item[];
}

interface Level3Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  openInNewTab: boolean;
  level4Items: Level4Item[];
}

interface SubItemDetails {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  openInNewTab: boolean;
  level3Items: Level3Item[];
  isMegaMenu?: boolean;
  megaMenuContent?: string;
  icon?: string;
  hoverIcon?: string;
}

interface MenuText {
  mainItemText: string;
  mainItemLink: string;
  subItemDetails: SubItemDetails[];
  openInNewTab: boolean;
}

interface DesktopMenuProps {
  menuTexts: MenuText[];
  mobileMenuTexts: MenuText[];  // Add this line to include the mobileMenuTexts prop
  siteSettings: any;
}

const DesktopMenu = ({ menuTexts, mobileMenuTexts, siteSettings }: DesktopMenuProps) => {
  const [activeMainItem, setActiveMainItem] = useState<number | null>(null); // Track active main menu item
  const [activeSubItem, setActiveSubItem] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredLevel3, setHoveredLevel3] = useState<number | null>(null);
  const [hoveredLevel4, setHoveredLevel4] = useState<number | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMegaMenuVisible, setIsMegaMenuVisible] = useState<boolean>(true);
  const [isNormalMenuVisible, setIsNormalMenuVisible] = useState<boolean>(true);


  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to update the height of the main container based on the mega menu content height
    const updateContainerHeight = () => {
      if (megaMenuContainerRef.current && megaMenuContentRef.current) {
        const contentHeight = megaMenuContentRef.current.offsetHeight + 1;
        megaMenuContainerRef.current.style.height = `${contentHeight}px`;
      }
    };

    // Update the height initially and whenever the activeSubItem changes
    updateContainerHeight();

    // Add a resize event listener to handle window resizing
    window.addEventListener('resize', updateContainerHeight);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, [activeSubItem]); // Trigger useEffect when activeSubItem changes

  return (
    <>
      <header className="relative flex flex-wrap gap-5 justify-center items-start self-center w-full text-lg font-bold leading-7 text-neutral-700 max-lg:max-w-full max-lg:mt-[19px] max-lg:mb-[17px] max-lg:hidden">

        {/* {isMegaMenuOpen && (
          <div
            className="fixed top-[128px] left-0 w-[100vw] h-screen z-40"
            style={{
              background: 'linear-gradient(116deg, #3E3E3E 4.85%, #262626 28.57%, #3E3E3E 57.56%)',
              opacity: '0.8'
            }}
          ></div>
        )} */}

        <div
          id="collapseMenu"
          className={`main-menu container flex max-lg:hidden max-lg:bef ore:fixed max-lg:before:inset-0 max-lg:before:z-50 max-lg:before:bg-black max-lg:before:opacity-50 lg:items-center`}
        >
          <div className='w-1/6 flex items-center justify-between max-[480px]:max-w-[175px]'>
          {/* First logo instance */}
          <Link href="/">
            {siteSettings?.siteLogo?.asset?.url ? (
              <Image
                className='block max-lg:hidden max-xl:max-w-[240px]'
                src={siteSettings.siteLogo.asset.url}
                width={100}
                height={50}
                alt={siteSettings?.title || 'BeingAdarsh'}
                unoptimized
                priority
              />
            ) : (
              <span className="block max-lg:hidden text-xl font-bold text-[#00BCD4] font-mono">
                {siteSettings?.title || 'BeingAdarsh'}
              </span>
            )}
          </Link>

          {/* Second logo instance — mobile mein */}
          <li className="mb-6 hidden max-lg:block">
            <Link href="/">
              {siteSettings?.siteLogo?.asset?.url ? (
                <Image
                  src={siteSettings.siteLogo.asset.url}
                  width={222}
                  height={45}
                  alt={siteSettings?.title || 'BeingAdarsh'}
                  priority
                />
              ) : (
                <span className="text-xl font-bold text-[#00BCD4] font-mono">
                  {siteSettings?.title || 'BeingAdarsh'}
                </span>
              )}
            </Link>
          </li>
          </div>
          <ul className="level1 w-5/6 z-50 max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-full max-lg:min-w-[300px] max-lg:space-y-3 max-lg:overflow-auto max-lg:bg-white max-lg:p-6 max-lg:shadow-md lg:mt-0 lg:flex lg:justify-center xl:gap-x-[54px] lg:gap-x-[45px]">
            <li className="mb-6 hidden max-lg:block">
              <Link href="/">
                {siteSettings?.siteLogo?.asset?.url ? (
                  <Image src={siteSettings.siteLogo.asset.url} width={222} height={45} alt={siteSettings?.title || 'BeingAdarsh'} priority />
                ) : (
                  <span className="text-xl font-bold text-[#00BCD4] font-mono">
                    {siteSettings?.title || 'BeingAdarsh'}
                  </span>
                )}
              </Link>
            </li>
            {menuTexts.map((item, index) => (
              <li
                key={index}
                className={`border-b-[4px] max-lg:py-3 ${ activeMainItem === index ? 'border-primary-yellow font-bold' : 'border-transparent font-bold'} ${ item.subItemDetails.some(subItem => subItem.isMegaMenu) ? 'mega-menu-parent' : ''}
                `}
                onMouseEnter={() => {
                  setActiveMainItem(index);
                  if (item.subItemDetails.some((subItem) => subItem.isMegaMenu)) {
                    setIsMegaMenuOpen(true); // Show overlay for mega menu
                  } else {
                    setIsMegaMenuOpen(false); // Do not show overlay for normal menus
                  }
                  if (item.subItemDetails[0]?.isMegaMenu) {
                    setActiveSubItem(0); // Set the first child of level 2 as active only if isMegaMenu is true
                  }
                  setIsMegaMenuVisible(true);
                  setIsNormalMenuVisible(true);
                }}
                onMouseLeave={() => {
                  setActiveMainItem(null);
                  if (item.subItemDetails.some((subItem) => subItem.isMegaMenu)) {
                    setIsMegaMenuOpen(false);
                  }
                  setActiveSubItem(null); // Clear sub-item when leaving main item
                }}
              >
                <Link
                  href={item.mainItemLink || '#'}
                  className={`group flex gap-2.5 items-center text-sm text-paragraph-link pb-[11px] pt-[15px] capitalize ease-in-out duration-300 ${item.mainItemLink ? 'cursor-pointer' : 'cursor-default' }`}
                  target={item.openInNewTab ? '_blank' : '_self'}
                >
                  {item.mainItemText}
                  {item.subItemDetails.length > 0 && (
                    <IoChevronDown className="" />
                  )}
                </Link>

                {item.subItemDetails.length > 0 && (
                  item.subItemDetails.some((subItem) => subItem.isMegaMenu) ? (
                    /* Render the mega menu */
                    <div
                      ref={megaMenuContainerRef}
                      className={`mega-menu-block absolute group-hover:flex z-50 bg-[#EDEDED] lg:top-[56px] left-[20px] w-[1400px] pl-5 border-t border-[#CECECE] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] ${
                        activeMainItem === index && isMegaMenuVisible ? 'flex' : 'hidden'
                      }`}
                      onMouseLeave={() => {
                        setActiveSubItem(0); // Set the first item as active when leaving the mega menu area
                      }}
                    >
                      <ul className="level2 megamenu-child w-[291px] transition-all duration-500 flex-shrink-0 pt-5 pb-5">
                        {item.subItemDetails.map((subItem, subIndex) => (
                          <li
                            key={subIndex}
                            className={`w-full whitespace-normal break-words focus:outline-none focus:bg-white ${
                              subItem.isMegaMenu && activeSubItem === subIndex ? 'bg-[#184F30]' : ''
                            }`}
                            onMouseEnter={() => {
                              setActiveSubItem(subIndex);
                              setHoveredIndex(subIndex);
                            }}
                            onMouseLeave={() => {
                              setActiveSubItem(0); // Reset to first item when leaving individual `li`
                              setHoveredIndex(null);
                            }}
                          >
                            <Link
                              href={subItem.subExternalUrl || '#'}
                              className={`flex items-center px-[20px] !py-[20px] text-[20px] leading-[28px] font-bold text-[#414141] hover:text-[#547C5B] w-full break-words ${
                                subItem.isMegaMenu && activeSubItem === subIndex ? 'text-[#fff] hover:text-[#fff]' : ''
                              }`}
                              onClick={() => {
                                setIsMegaMenuVisible(false); // Hide mega menu on click
                              }}
                              target={subItem.openInNewTab ? '_blank' : '_self'}
                            >
                              {subItem.icon && (
                                <Image
                                  src={activeSubItem === subIndex && subItem.hoverIcon ? subItem.hoverIcon : subItem.icon}
                                  alt={`${subItem.text} icon`}
                                  width={32}
                                  height={32}
                                  className="mr-[10px]"
                                />
                              )}
                              {subItem.text}
                            </Link>

                            {/* Mega Menu Content directly inside the li */}
                            <div
                              ref={subItem.isMegaMenu && activeSubItem === subIndex ? megaMenuContentRef : null}
                              className={`mega-menu-content absolute top-0 left-[311px] w-[1091px] bg-white p-8 transition-all duration-500 flex-grow min-h-[400px] ${
                                subItem.isMegaMenu && activeSubItem === subIndex ? 'block' : 'hidden'
                              }`}
                            >
                              <section className="flex flex-col w-full max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col self-stretch my-auto w-full max-md:mt-10 max-md:max-w-full">
                                  <h2 className="flex items-center self-start text-[44px] font-bold text-[#4E7C55] whitespace-nowrap leading-[50px]">
                                    {subItem.text}
                                  </h2>
                                  <div className="mt-[18px] w-full max-md:max-w-full">
                                    {subItem.level3Items.length > 0 && (
                                      <div className="flex gap-5 max-md:flex-col">
                                        {subItem.level3Items.map((level3Item, level3Index) => (
                                          <React.Fragment key={`level3-${level3Index}`}>
                                            <section className="flex flex-col w-1/3 max-md:ml-0 max-md:w-full">
                                              <div className="flex grow gap-8 max-md:mt-10">
                                                <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit">
                                                  <h3 className="text-sm font-bold leading-[22px] uppercase text-[#414141]">
                                                  <Link href={level3Item.subUrl || '#'} onClick={() => {
                                                      setIsMegaMenuVisible(false);
                                                    }} className={`${!level3Item.subUrl ? 'pointer-events-none' : ''}`} target={level3Item.openInNewTab ? '_blank' : '_self'}>{level3Item.text}</Link>
                                                  </h3>
                                                  {level3Item.level4Items.length > 0 && (
                                                    <ul className="flex flex-col font-normal w-full max-w-[228px] text-[16px] leading-[26px] text-[#252525] list-menu">
                                                      {level3Item.level4Items.map((level4Item, level4Index) => (
                                                        <li key={`level4-${level3Index}-${level4Index}`} className='hover:text-[#547C5B] text-[16px] leading-[26px]'>
                                                          <Link href={level4Item.subUrl || '#'} className='block' onClick={() => {
                                                            setIsMegaMenuVisible(false);
                                                          }} target={level4Item.openInNewTab ? '_blank' : '_self'}>{level4Item.text}</Link>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  )}
                                                </div>
                                              </div>
                                            </section>
                                            {/* Separator between sections */}
                                            {level3Index < subItem.level3Items.length - 1 && (
                                              <div className="self-stretch w-px bg-[#CECECE] mx-[10px] max-md:hidden"></div>
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </section>

                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    /* Render the mega menu */
                  ):(
                    /* Render the Normal menu */
                    <ul className={`level2 normal-menu absolute z-50 w-[275px] max-2xl:w-[240px] max-xl:w-[210px] bg-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:block lg:top-[56px] lg:shadow-lg rounded-bl-[4px] rounded-br-[4px] [&>li:last-child>a]:rounded-b-[4px] ${activeMainItem === index && isNormalMenuVisible ? 'block' : 'hidden'}`}>
                      {item.subItemDetails.map((subItem, subIndex) => (
                        <li key={subIndex} onMouseEnter={() => {
                            setActiveSubItem(subIndex);
                            setHoveredIndex(subIndex);
                          }}
                          onMouseLeave={() => {
                            setActiveSubItem(null);
                            setHoveredIndex(null);
                          }}>
                          <Link href={subItem.subExternalUrl || '#'} className={`flex items-center justify-between !px-[15px] py-[10px] text-xs text-paragraph-link w-full break-words font-normal hover:bg-primary-yellow-menu-hover transition-all duration-300 ease-in-out ${activeSubItem === subIndex && 'bg-primary-yellow !font-bold hover:!font-normal'}`} target={subItem.openInNewTab ? '_blank' : '_self'}>
                            {subItem.text}
                            {subItem.level3Items.length > 0 && <IoChevronForward />}
                          </Link>

                          {/* Level 3 Menu */}
                          {subItem.level3Items.length > 0 && (
                            <ul className={`level3 absolute z-50 w-[275px] max-2xl:w-[240px] max-xl:w-[210px] bg-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.2)]transition-all duration-500 h-auto min-h-full lg:-top-0 lg:left-full lg:shadow-lg rounded-bl-[4px] rounded-br-[4px] [&>li:last-child>a]:rounded-b-[4px] ${activeSubItem === subIndex ? 'block' : 'hidden'}`}>
                              {subItem.level3Items.map((level3Item, level3Index) => (
                                <li key={level3Index} onMouseEnter={() => {
                                    setHoveredLevel3(level3Index); // Update hovered level 3
                                    setActiveSubItem(subIndex); // Keep the active sub item highlighted
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredLevel3(null); // Clear hoveredLevel3 when leaving
                                  }}>
                                  <Link href={level3Item.subExternalUrl || '#'} className={`flex items-center justify-between px-[15px] py-[10px] text-xs text-paragraph-link break-words hover:bg-primary-yellow-menu-hover font-normal transition-all duration-300 ease-in-out ${hoveredLevel3 === level3Index && 'bg-primary-yellow !font-bold hover:!font-normal'}`} target={level3Item.openInNewTab ? '_blank' : '_self'}>
                                    {level3Item.text}
                                    {level3Item.level4Items.length > 0 && <IoChevronForward />}
                                  </Link>

                                  {/* Level 4 Menu */}
                                  {level3Item.level4Items.length > 0 && (
                                    <ul className={`level4 absolute z-50 w-[275px] max-2xl:w-[240px] max-xl:w-[210px] bg-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.2)] transition-all duration-500 h-auto min-h-full lg:-top-0 lg:left-full lg:shadow-lg rounded-bl-[4px] rounded-br-[4px] [&>li:last-child>a]:rounded-b-[4px] ${hoveredLevel3 === level3Index ? 'block' : 'hidden'}`}>
                                      {level3Item.level4Items.map((level4Item, level4Index) => (
                                        <li key={level4Index} className="w-full whitespace-normal break-words focus:outline-none focus:bg-white">
                                          <Link href={level4Item.subUrl || '#'} className="flex items-center justify-between px-[15px] py-[10px] text-xs text-paragraph-link break-words hover:bg-primary-yellow-menu-hover font-normal transition-all duration-300 ease-in-out" target={level4Item.openInNewTab ? '_blank' : '_self'}>
                                            {level4Item.text}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    /* Render the Normal menu */
                  )
                )}

              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
};

export default DesktopMenu;
