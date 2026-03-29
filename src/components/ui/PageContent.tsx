"use client";

import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useEffect } from "react";
import { Banner } from "./Banner";
import InfoBox from "./InfoBox";
import HomeFeatured from "./HomeFeatured";
import BlogListing from "./BlogListing";
import HeroPortfolio from "./HeroPortfolio";
import AboutMe from "./AboutMe";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import PortableTextRenderer from "./PortableTextRenderer";

export interface fetauredProductProps {
  entityId: number;
  name: string;
  sku: string;
  path: string;
  description: string;
  defaultImage?: {
    altText?: string;
    url: string;
  };
}

export interface PageContentProps {
  rows: any[];
  breadcrumb?: {
    title: string;
    slug: { current: string };
  }[];
  current?: {
    title: string;
    slug: { current: string };
  };
}

const RenderBlock = ({ block, index }: { block: any; index: number }) => {
  switch (block._type) {
    case "infoBox":
      const normalizedInfoBoxBlock = {
        ...block,
        button: block.button,
      };
      return <InfoBox key={index} {...normalizedInfoBoxBlock} />;

    case "richText":
      return (
        <div
          key={index}
          className={`rich-text-block ${block.width === "full" ? "w-full" : "max-w-4xl mx-auto"} text-${block.align || "left"}`}
        >
          <PortableTextRenderer content={block.content} />
        </div>
      );

    case "blogsListing":
      const normalizedBlogsListingBlock = {
        ...block,
        button: block.button,
      };
      return <BlogListing key={index} {...normalizedBlogsListingBlock} />;

    case "homeFeatured":
      const normalizedHomeFeaturedBlock = {
        ...block,
        button: block.button,
      };
      delete normalizedHomeFeaturedBlock.Button;
      return <HomeFeatured key={index} {...normalizedHomeFeaturedBlock} />;

    case "heroPortfolio":
      const normalizedHeroPortfolioBlock = {
        ...block,
        buttons: block.buttons,
      };
      delete normalizedHeroPortfolioBlock.Button;
      return <HeroPortfolio key={index} {...normalizedHeroPortfolioBlock} />;

    case "aboutMe":
      const normalizedAboutMeBlock = {
        ...block,
        button: block.buttons,
      };
      delete normalizedAboutMeBlock.Button;
      return <AboutMe key={index} {...normalizedAboutMeBlock} />;

    case "projectsSection":
      const normalizedProjectsSectionBlock = {
        ...block,
        button: block.buttons,
      };
      delete normalizedProjectsSectionBlock.Button;
      return <ProjectsSection key={index} {...normalizedProjectsSectionBlock} />;

    case "experienceSection":
      const normalizedExperienceSectionBlock = {
        ...block,
        button: block.buttons,
      };
      delete normalizedExperienceSectionBlock.Button;
      return (
        <ExperienceSection key={index} {...normalizedExperienceSectionBlock} />
      );

    case "banner":
      return <Banner key={index} {...block} />;

    default:
      return null;
  }
};

const builder = imageUrlBuilder(client);

const getImageUrl = (image?: { asset?: { _ref?: string } }): string | null => {
  return image?.asset?._ref ? builder.image(image.asset._ref).url() : null;
};

const RenderRow = ({ row, index }: { row: any; index: number }) => {
  const {
    rowType,
    rowTitle,
    columns,
    showColumn1,
    showColumn2,
    showColumn3,
    backgroundColor = "none",
    bannerImage,
    sectionType,
    columnWidth,
    id,
  } = row;

  const columnNames = [
    { name: "column1", visible: showColumn1 },
    { name: "column2", visible: showColumn2 },
    { name: "column3", visible: showColumn3 },
  ];

  const visibleColumnsCount = columnNames.filter(
    (column, columnIndex) => column.visible && columnIndex + 1 <= columns,
  ).length;

  // ── Single backgroundClass — handles all background types ────────
  const backgroundClass =
    backgroundColor !== "none"
      ? backgroundColor === "backgroundImage"
        ? `bg-${rowTitle.replace(/\s+/g, "-").toLowerCase()}`
        : backgroundColor === "hero-gradient"
          ? "bg-gradient-to-b from-[#1a0f35] via-[#110d25] to-[#0d0a1a]"
          : backgroundColor === "experience-gradient"
            ? "bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"
            : backgroundColor === "project-gradient"
              ? "bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
              : `bg-${backgroundColor}`
      : "";

  const bannerImageUrl = getImageUrl(bannerImage);

  useEffect(() => {
    if (
      bannerImageUrl &&
      rowType === "full" &&
      backgroundColor === "backgroundImage"
    ) {
      const className = `bg-${rowTitle.replace(/\s+/g, "-").toLowerCase()}`;
      const style = document.createElement("style");
      style.textContent = `
          .${className} {
            background-image: url('${bannerImageUrl}');
          }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [bannerImageUrl, backgroundColor]);

  const getColumnWidth = (columnWidth: string): string => {
    switch (columnWidth) {
      case "1fr_11fr": return "grid-cols-[1fr_11fr]";
      case "2fr_10fr": return "grid-cols-[2fr_10fr]";
      case "3fr_9fr":  return "grid-cols-[3fr_9fr]";
      case "4fr_8fr":  return "grid-cols-[4fr_8fr]";
      case "5fr_7fr":  return "grid-cols-[5fr_7fr]";
      case "6fr_6fr":  return "grid-cols-[6fr_6fr]";
      case "7fr_5fr":  return "grid-cols-[7fr_5fr]";
      case "8fr_4fr":  return "grid-cols-[8fr_4fr]";
      case "9fr_3fr":  return "grid-cols-[9fr_3fr]";
      case "10fr_2fr": return "grid-cols-[10fr_2fr]";
      case "11fr_1fr": return "grid-cols-[11fr_1fr]";
      default:         return "grid-cols-2";
    }
  };

  const getColumnClasses = (visibleColumnsCount: number): string => {
    switch (visibleColumnsCount) {
      case 1:
        return "grid grid-cols-1";
      case 2:
        return `grid ${columnWidth ? getColumnWidth(columnWidth) : "grid-cols-2"} gap-20 max-lg:gap-10 max-i-pad:gap-20 max-i-pad:grid-cols-1 max-md:gap-10`;
      case 3:
        return "grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-lg:gap-5 max-i-pad:gap-20 max-i-pad:grid-cols-1 max-md:gap-10";
      default:
        return "grid grid-cols-1";
    }
  };

  const getBackgroundColorClass = (backgroundClass: string): string => {
    switch (backgroundClass) {
      case "bg-none":       return "bg-none";
      case "bg-whiteYellow": return "bg-[#e5e5e5]";
      case "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800":
        return "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800";
      default: return "";
    }
  };

  const getSectionClasses = (sectionType: string): string => {
    switch (sectionType) {
      case "our-clients-section":
        return "case-studies grid grid-cols-[6fr_4fr] gap-[136px]";
      default:
        return "";
    }
  };

  const getSectionTypeClass = (sectionType: string): string => {
    switch (sectionType) {
      case "map-section":                return "map-section-class p-20";
      case "blog-spacing":               return "blog-spacing-class";
      case "single-page-spacing":        return "py-[50px] max-md:py-[30px]";
      case "single-page-top-spacing":    return "pt-[100px] max-md:pt-[54px]";
      case "single-page-bottom-spacing": return "pb-[100px] max-md:pb-[54px]";
      default:                           return "";
    }
  };

  const columnClasses = getColumnClasses(visibleColumnsCount);
  const backgroundColorClass = getBackgroundColorClass(backgroundClass);
  const sectionTypeClass = getSectionTypeClass(sectionType);

  const skipDefaultPadding =
    sectionType === "compact-row" ||
    sectionType === "single-page-top-spacing" ||
    sectionType === "single-page-bottom-spacing" ||
    sectionType === "single-page-spacing" ||
    sectionType === "hero-full";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor && anchor.getAttribute("href") === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => { document.removeEventListener("click", handleClick); };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = targetId ? document.getElementById(targetId) : null;
        if (targetElement) {
          const offset = 270;
          window.scrollTo({ top: targetElement.offsetTop + offset, behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => { document.removeEventListener("click", handleClick); };
  }, []);

  return (
    <section
      {...(id ? { id: id } : {})}
      className={`
        relative
        ${skipDefaultPadding ? "" : "py-[100px] max-md:py-[54px]"}
        ${rowType === "full" ? backgroundClass : ""}
        ${sectionType || ""}
        ${sectionTypeClass}
        ${backgroundColorClass}
      `}
    >
      {/* ── Hero gradient decorative elements — full width ── */}
      {backgroundColor === "hero-gradient" && (
        <>
          <div className="absolute top-0 right-0 w-[340px] h-[340px] rounded-full bg-purple-500 opacity-20 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2 z-0" />
          <div className="absolute bottom-0 left-0 w-[260px] h-[260px] rounded-full bg-indigo-400 opacity-20 blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2 z-0" />
          <div className="absolute top-8 right-8 pointer-events-none z-0 grid grid-cols-6 gap-[6px]">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="w-[5px] h-[5px] rounded-full bg-white opacity-20" />
            ))}
          </div>
          <div className="absolute bottom-8 left-8 pointer-events-none z-0 grid grid-cols-6 gap-[6px]">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="w-[5px] h-[5px] rounded-full bg-white opacity-20" />
            ))}
          </div>
        </>
      )}

      {/* ── Content container ── */}
      <div
        key={index}
        className={`relative z-10 mx-auto ${
          sectionType === "map-section" || sectionType === "hero-full"
            ? ""
            : "container"
        } ${sectionType === "blog-spacing" ? "!px-0" : ""}`}
      >
        <div className={`${columnClasses} ${getSectionClasses(sectionType)}`}>
          {columnNames.map((column, columnIndex) => {
            if (column.visible && columnIndex + 1 <= columns) {
              return (
                <div key={columnIndex}>
                  {row[column.name] &&
                    row[column.name].map((block: any, blockIndex: number) => (
                      <RenderBlock
                        key={blockIndex}
                        block={block}
                        index={blockIndex}
                      />
                    ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
};

const PageContent = ({ rows = [] }: PageContentProps) => {
  return (
    <div className="page-content">
      {rows.length > 0 ? (
        rows.map((row, index) => {
          return <RenderRow key={index} row={row} index={index} />;
        })
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default PageContent;