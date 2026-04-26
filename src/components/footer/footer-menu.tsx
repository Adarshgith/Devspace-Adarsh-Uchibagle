// 'use client'; // Ensure this component is treated as a client component

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { IoChevronDown } from 'react-icons/io5';

// interface FooterMenuProps {
//   menuTitle: string;
//   menuTexts: {
//     mainItemText: string;
//     mainItemLink: string;
//     subItemDetails: { text: string; subUrl: string }[];
//   }[];
// }

// const FooterMenu = ({ menuTexts, menuTitle }: FooterMenuProps) => {
//   // State to track which menus are open
//   const [openMenus, setOpenMenus] = useState<Array<boolean>>(Array(menuTexts.length).fill(false));
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect screen size and update `isMobile`
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     // Initial check
//     checkScreenSize();

//     // Add a resize listener to handle dynamic changes
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Toggle function to open one menu at a time (only on mobile)
//   const toggleMenu = (index: number) => {
//     if (isMobile) {
//       setOpenMenus((prev) => prev.map((_, i) => (i === index ? !prev[i] : false)));
//     }
//   };

//   return (
//     <>
//       {menuTexts.length > 0 && menuTitle === 'FooterMenu'
//         ? menuTexts.map((item, index) => (
//           <nav className={`text-base-100  ${index === 3 ? 'w-[40%] max-w-full max-i-pad:w-[66.6%] [&>div]:max-md:border-b-[1px] max-i-pad:mt-5 max-md:mt-0 max-md:w-full [&>ul]:columns-2 [&>ul>li>a]:md:pr-0 [&>ul>li>a]:md:mr-1 max-md:[&>ul]:columns-1 [&>ul]:pr-5 [&>ul]:max-md:pr-0 [&>ul>li:last-child]:max-md:border-b-[1px] [&>ul>li:first-child]:max-md:border-t-[0px]' : 'max-w-[100%] w-[20%] max-i-pad:max-w-full max-i-pad:w-[33%] max-md:w-full'}
//           `} key={index}>
//             <div className={`flex items-center justify-between w-full max-md:w-full mb-[5px] max-md:border-t-[1px] max-md:border-brand-dark-80 max-md:p-[15px] max-md:mb-0`}>
//               <button className={`footer-title text-left font-semibold w-full mb-0 text-xl text-whiteYellow capitalize max-md:text-lg  max-md:font-bold max-md:transition-all duration-300 ease-in-out md:cursor-default ${openMenus[index] ? 'max-md:text-heading-color' : 'max-md:text-'}`} onClick={() => toggleMenu(index)}>
//                 <h6 className={`footer-title text-left font-semibold w-full mb-[10px] text-md text-whiteYellow capitalize max-md:text-md max-md:transition-all duration-300 ease-in-out md:cursor-default max-md:mb-0 `}>{item.mainItemText}</h6>
//               </button>
//               <button
//                 className={`w-[28px] relative md:hidden transition-transform duration-300 focus-within:outline-none  ${openMenus[index] ? 'rotate-180' : ''}`} onClick={() => toggleMenu(index)}
//               >
//                 <IoChevronDown className="text-whiteYellow text-xl" />
//               </button>
//             </div>
//             <ul
//               className={`transition-[max-height] duration-300 ease-in-out overflow-hidden space-y-3 max-md:space-y-[15px] ${openMenus[index] ? 'max-h-fit opacity-100 mb-[20px] max-md:mb-[30px] max-md:mt-0' : 'max-h-0 opacity-0'} md:max-h-none md:opacity-100`}
//               style={{ transitionProperty: 'max-height, opacity' }}
//             >
//               {item.subItemDetails.map((subItem, subIndex) => (
//                 <li key={subIndex} className='!mt-[0px] max-md:border-t-[1px] max-md:border-brand-dark-80'>
//                   <Link href={subItem.subUrl || '#'} className="block mb-2.5 pr-5 text-paragraph text-whiteYellow max-md:font-normal transition-all duration-500 ease-in-ou tracking-[.2px] text-balance max-md:mb-0 max-md:p-[15px]">
//                     {subItem.text}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         )) :
//         menuTexts.map((item, index) => (
//           <nav className='text-base-100 max-md:w-full max-md:max-w-full' key={index}>
//             <div className={`flex items-center justify-between w-full max-md:w-full mb-[5px] max-md:border-b-2 max-md:border-[#E3EFD5] max-md:pt-[15px] max-md:pb-[13px] max-md:px-[10px] max-md:mb-0`}>
//               <button className={`footer-title text-left font-semibold w-full mb-0 text-xl text-whiteYellow capitalize max-md:text-lg  max-md:font-bold max-md:transition-all duration-300 ease-in-out md:cursor-default ${openMenus[index] ? 'max-md:text-heading-color' : 'max-md:text-'}`} onClick={() => toggleMenu(index)}>
//                 <h6 className={`footer-title text-left font-semibold w-full mb-[10px] text-md text-whiteYellow capitalize max-md:text-md max-md:transition-all duration-300 ease-in-out md:cursor-default ${openMenus[index] ? 'max-md:text-whiteYellow' : 'max-md:text-heading-color'}`}>{item.mainItemText}</h6>
//               </button>
//               <button
//                 className={`w-[28px] relative md:hidden transition-transform duration-300 focus-within:outline-none  ${openMenus[index] ? 'rotate-180' : ''}`} onClick={() => toggleMenu(index)}
//               >
//                 <IoChevronDown className="text-whiteYellow text-xl" />
//               </button>
//             </div>
//             <ul
//               className={`transition-[max-height] duration-300 ease-in-out overflow-hidden space-y-3 max-md:space-y-[15px] flex flex-wrap pr-5 ${openMenus[index] ? 'max-h-fit opacity-100 mb-[20px]' : 'max-h-0 opacity-0'} md:max-h-none md:opacity-100`}
//               style={{ transitionProperty: 'max-height, opacity' }}
//             >
//               {item.subItemDetails.map((subItem, subIndex) => (
//                 <li key={subIndex} className='!mt-[0px] w-2/4 max-md:w-full'>
//                   <Link href={subItem.subUrl || '#'} className="block mb-[12px] pr-[5px] text-lg text-whiteYellow max-md:text-base max-md:font-normal transition-all duration-500 ease-in-out">
//                     {subItem.text}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         ))

//         }
//     </>
//   );
// };

// export default FooterMenu;
