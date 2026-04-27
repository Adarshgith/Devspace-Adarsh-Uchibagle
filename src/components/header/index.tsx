import { Suspense } from 'react';

// Sanity menu
import { headerQuery, siteSettingsQuery } from '@/lib/queries';
import { client } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import DesktopMenu from './desktop-menu';
import MobileMenu from './mobile-menu';

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
  level6Items: Level6Item[];
  openInNewTab: boolean;
}

interface Level4Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  level5Items: Level5Item[];
  openInNewTab: boolean;
}

interface Level3Item {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  level4Items: Level4Item[];
  openInNewTab: boolean;
}

interface SubItemDetails {
  text: string;
  subUrl: string;
  subExternalUrl: string;
  level3Items: Level3Item[];
  isMegaMenu?: boolean;
  megaMenuContent?: string;
  icon?: string;
  hoverIcon?: string;
  openInNewTab: boolean;
}

interface MenuText {
  mainItemText: string;
  mainItemLink: string;
  subItemDetails: SubItemDetails[];
  openInNewTab: boolean;
}

export const Header = async () => {
  // Sanity navbar
  const sclient = client;

  // Fetch data for both desktop and mobile menus
  const desktopMenuTitle = 'HeaderMenu';
  const mobileMenuTitle = 'HeaderMenu';

  const desktopMenuDataArray = await headerQuery(sclient, desktopMenuTitle);
  const mobileMenuDataArray = await headerQuery(sclient, mobileMenuTitle);
  const siteSettings = await sclient.fetch(siteSettingsQuery);

  //console.log('desktopMenuDataArray', desktopMenuDataArray)

  const navigationMenuData = desktopMenuDataArray.length > 0 ? desktopMenuDataArray[0] : null;
  const mobileNavigationMenuData = mobileMenuDataArray.length > 0 ? mobileMenuDataArray[0] : null;

  if (!navigationMenuData || !navigationMenuData.items) {
    return <div>No menu found with the title {desktopMenuTitle}</div>;
  }

  // Helper function to map menu items
  const mapMenuItems = (items: any[]) =>
    items.map((item: any) => ({
      mainItemText: item.text,
      mainItemLink: item.link,
      openInNewTab: item.openInNewTab,
      subItemDetails: item.subNavigationItems?.map((subItem: any) => ({
        text: subItem.text,
        subUrl: subItem.subUrl,
        subExternalUrl: subItem.subUrl,
        isMegaMenu: subItem.isMegaMenu,
        megaMenuContent: subItem.megaMenuContent,
        icon: subItem.icon,
        hoverIcon: subItem.hoverIcon,
        openInNewTab: subItem.openInNewTab,
        level3Items: subItem.subNavigationItems?.map((level3Item: any) => ({
          text: level3Item.text,
          subUrl: level3Item.subUrl,
          subExternalUrl: level3Item.subUrl,
          openInNewTab: level3Item.openInNewTab,
          level4Items: level3Item.subNavigationItems?.map((level4Item: any) => ({
            text: level4Item.text,
            subUrl: level4Item.subUrl,
            subExternalUrl: level4Item.subUrl,
            openInNewTab: level4Item.openInNewTab,
            level5Items: level4Item.subNavigationItems?.map((level5Item: any) => ({
              text: level5Item.text,
              subUrl: level5Item.subUrl,
              subExternalUrl: level5Item.subUrl,
              openInNewTab: level5Item.openInNewTab,
              level6Items: level5Item.subNavigationItems?.map((level6Item: any) => ({
                text: level6Item.text,
                subUrl: level6Item.subUrl,
                subExternalUrl: level6Item.subUrl,
                openInNewTab: level6Item.openInNewTab,
              })) || [],
            })) || [],
          })) || [],
        })) || [],
      })) || [],
    }));

  const desktopMenuTexts: MenuText[] = mapMenuItems(navigationMenuData.items);
  const mobileMenuTexts: MenuText[] = mapMenuItems(mobileNavigationMenuData?.items || []);
  // Sanity navbar

  return (
    <>
      <nav className='z-1 max-lg:relative bg-white border-b border-primary-gray-light shadow-[0px_4px_10px_0px_rgba(0,0,0,0.05)]'>
      {/* top navbar removed */}
      <section className='lg:hidden border-b border-brand-dark-20 py-[22px] max-md:py-[15px]'>
        <div className='container grid grid-cols-[27%_44%_29%] max-xl:grid-cols-[27%_41%_32%] items-center max-lg:grid-cols-[50%_50%] max-lg:gap-y-4'>
          <div className='w-full flex items-center justify-between max-[480px]:max-w-[175px]'>
        <Link href="/">
          {siteSettings?.siteLogo?.asset?.url ? (
            <Image
              className='hidden max-lg:block'
              src={siteSettings.siteLogo.asset.url}
              width={294}
              height={57}
              alt={siteSettings?.title || 'BeingAdarsh'}
              priority
            />
          ) : (
            <span className="hidden max-lg:block text-xl font-bold text-[#00BCD4] font-mono">
              {siteSettings?.title || 'BeingAdarsh'}
            </span>
          )}
        </Link>
          </div>
          <div className='w-full flex items-center justify-end'>
            <div id='mobileMenu' className={`logo-section max-lg:flex flex-wrap items-center max-lg:gap-y-6 max-sm:gap-x-4 max-lg:justify-end max-lg:w-[60px] max-xl:pr-0 `}>
              <div className="flex items-center space-x-8 max-sm:ml-auto">
                <Suspense>
                  <MobileMenu menuTexts={mobileMenuTexts} siteSettings={siteSettings} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DesktopMenu menuTexts={desktopMenuTexts} mobileMenuTexts={mobileMenuTexts} siteSettings={siteSettings} />
    </nav>
    </>
  );
};

export const HeaderSkeleton = () => (
  <div className='bg-white'>
    <header className="flex min-h-[92px] animate-pulse items-center justify-between gap-1 overflow-y-visible bg-white px-4 2xl:container sm:px-10 lg:gap-8 lg:px-12 2xl:mx-auto 2xl:px-0">
      <div className="h-16 w-40 rounded bg-slate-200" />
      <div className="hidden space-x-4 lg:flex">
        <div className="h-6 w-20 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded bg-slate-200" />
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="h-8 w-8 rounded-full bg-slate-200" />

        <div className="flex gap-2 lg:gap-4">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        </div>

        <div className="h-8 w-20 rounded bg-slate-200" />

        <div className="h-8 w-8 rounded bg-slate-200 lg:hidden" />
      </div>
    </header>
  </div>
);
