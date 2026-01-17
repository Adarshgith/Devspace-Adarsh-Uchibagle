import { headerQuery, siteSettingsQuery } from '@/lib/queries';
// Ensure siteSettingsQuery is exported as a function from '@/lib/queries'
import { client } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { IoCall, IoLogoLinkedin } from 'react-icons/io5';
import FooterMenu from './footer-menu';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = currentYear;

  const sclient = client;

  const primaryMenuTitle = 'FooterMenu';
  const primaryMenuDataArray = await headerQuery(sclient, primaryMenuTitle);
  const siteSettings = await sclient.fetch(siteSettingsQuery);

  const primaryMenuData = primaryMenuDataArray.length > 0 ? primaryMenuDataArray[0] : null;

  if (!primaryMenuData || !primaryMenuData.items) {
    return <div>No primary menu found with the title {primaryMenuTitle}</div>;
  }

  const processMenuItems = (items: any[]) => {
    return items
      .filter(item => Array.isArray(item.subNavigationItems) && item.subNavigationItems.length > 0)
      .map(item => {
        const filteredSubItems = item.subNavigationItems.map((subItem: { text: any; subUrl: any; }) => ({
          text: subItem.text,
          subUrl: subItem.subUrl
        }));

        return {
          text: item.text,
          link: item.link,
          subNavigationItems: filteredSubItems
        };
      })
      .filter(item => item.subNavigationItems.length > 0);
  };

  const primaryMenuItems = processMenuItems(primaryMenuData.items);

  const prepareMenuTexts = (items: any[]) => {
    return items.map(item => ({
      mainItemText: item.text,
      mainItemLink: item.link,
      subItemDetails: item.subNavigationItems.map((subItem: { text: any; subUrl: any; }) => ({
        text: subItem.text,
        subUrl: subItem.subUrl
      }))
    }));
  };

  const primaryMenuTexts = prepareMenuTexts(primaryMenuItems);

  return (
    <>
      <footer className="footer pt-[135px] pb-10 bg-primary-dark relative z-0 max-md:pt-[105px] max-md:pb-5 ">
        <section className='container mb-[80px] relative z-10 max-md:mb-10 flex justify-between items-start max-md:block'>
          <div className='max-w-[59%] max-md:max-w-full md:min-w-[382px]'>
            <div className='mb-[30px] max-md:mb-6'>
              {/* <p className='text-base-100'>{siteSettings.description}</p> */}
              <Link href="/" className='flex items-end max-w-[345px] max-md:items-center max-md:justify-start'>
                <Image className='block' src={siteSettings.footerLogo.asset.url} width={689} height={139} alt={siteSettings.title} unoptimized priority />
                {/* <Image className='hidden max-md:block' src={siteSettings.footerLogo.asset.url} width={689} height={139} alt={siteSettings.title} priority /> */}
              </Link>
            </div>
            {/* <div className='flex gap-[30px] max-md:gap-5'>
              <Button
                url={'/contact-us'}
                text={'Contact Us'}
                style={'primaryBtn'}
              />
              <Button
                url={'/en/account/orders/'}
                text={'My Account'}
                style={'secondaryBtn'}
              />
            </div> */}
            <div className='flex gap-2.5 mt-10 max-md:mt-5 max-md:mb-10'>
              <IoCall className="text-whiteYellow text-xl" />
              <p className='text-whiteYellow text-paragraph leading-6 max-md:leading-[var(--line-height-sm)]'><Link href={`tel:${siteSettings.phone}`} className=" focus:ring-white max-md:text-base font-semibold">Tel: {siteSettings.phone}</Link></p>
            </div>
          </div>
          {/* <Subscribe /> */}
          {/* <SubscribeForm jotFormId={siteSettings.footerSubscribeForm}/> */}
          <FooterMenu menuTexts={primaryMenuTexts} menuTitle={primaryMenuTitle}/>
        </section>
        <section id='copyrights' className='container relative z-10'>
          <div className="flex relative flex-wrap gap-5 justify-between mt-10 w-full max-w-[1399px] max-md:mt-5 max-md:max-w-full max-md:flex-col max-md:items-center max-xl:gap-[15px] max-md:gap-5">
            <Link aria-label='Linkedin' href={siteSettings.linkedInLink} className="flex text-whiteYellow object-contain self-stretch my-auto gap-2.5 text-paragraph tracking-[.2px] max-md:justify-center mt-[35px] max-md:mt-[15px]" >
              <IoLogoLinkedin className="text-xl" /> Linkedin
            </Link>
            <div className="flex flex-col text-whiteYellow">
              <p className="mt-2.5 text-xxs font-normal text-right max-md:text-center mb-[5px] max-md:mb-[5px]">© {copyrightDate} {siteSettings.title} All Rights Reserved.</p>
              <div className="flex gap-[15px] items-center w-full max-md:flex-wrap justify-end max-md:gap-[5px] max-md:justify-center ">
                {siteSettings?.privacyLinks?.privacyLink.map((link: any, LinkIndex : any) => (
                  <Link key={LinkIndex} href={link.link} className="self-stretch my-auto text-xs font-light max-md:px-[5px] transition-all duration-500 ease-in-out">
                    {link.linkTitle}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
}
