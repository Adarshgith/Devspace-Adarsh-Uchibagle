"use client";

import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useEffect } from "react";
import { Banner } from "./Banner";
import InfoBox from "./InfoBox";
import HomeFeatured from "./HomeFeatured";

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

// Interface for the content block
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

// Individual block rendering
const RenderBlock = ({ block, index }: { block: any; index: number }) => {
  //console.log(`Rendering block of type: ${block._type}`, block);
  switch (block._type) {
    case "infoBox":
      const normalizedInfoBoxBlock = {
        ...block,
        button: block.button,
      };
      // You may want to return something here if needed
      return <InfoBox key={index} {...normalizedInfoBoxBlock} />;

    case "homeFeatured":
      const normalizedHomeFeaturedBlock = {
        ...block,
        button: block.button,
      };
      delete normalizedHomeFeaturedBlock.Button;
      return <HomeFeatured key={index} {...normalizedHomeFeaturedBlock} />;

    case "banner":
      return <Banner key={index} {...block} />;

    default:
      return null;
  }
};

// Initialize the builder with the Sanity client
const builder = imageUrlBuilder(client);
// Helper function to generate image URLs with strict null checks
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
    (column, columnIndex) => column.visible && columnIndex + 1 <= columns
  ).length;

  //const backgroundClass = backgroundColor !== 'none' ? `bg-${backgroundColor}` : '';
  const backgroundClass =
    backgroundColor !== "none"
      ? backgroundColor === "backgroundImage"
        ? `bg-${rowTitle.replace(/\s+/g, "-").toLowerCase()}`
        : `bg-${backgroundColor}`
      : "";
  const bannerImageUrl = getImageUrl(bannerImage);

  // Dynamically inject CSS for the pseudo-element only on screens larger than 1024px
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
      // Cleanup on component unmount
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [bannerImageUrl, backgroundColor]);

  const getColumnWidth = (columnWidth: string): string => {
    switch (columnWidth) {
      case "1fr_11fr":
        return "grid-cols-[1fr_11fr]";
      case "2fr_10fr":
        return "grid-cols-[2fr_10fr]";
      case "3fr_9fr":
        return "grid-cols-[3fr_9fr]";
      case "4fr_8fr":
        return "grid-cols-[4fr_8fr]";
      case "5fr_7fr":
        return "grid-cols-[5fr_7fr]";
      case "6fr_6fr":
        return "grid-cols-[6fr_6fr]";
      case "7fr_5fr":
        return "grid-cols-[7fr_5fr]";
      case "8fr_4fr":
        return "grid-cols-[8fr_4fr]";
      case "9fr_3fr":
        return "grid-cols-[9fr_3fr]";
      case "10fr_2fr":
        return "grid-cols-[10fr_2fr]";
      case "11fr_1fr":
        return "grid-cols-[11fr_1fr]";
      default:
        return "grid-cols-2";
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
      case "bg-none":
        return "bg-none";
      case "bg-whiteYellow":
        return "bg-[#e5e5e5]";
      default:
        return "";
    }
  };

  const getSectionClasses = (sectionType: string) => {
    switch (sectionType) {
      case "our-clients-section":
        return "case-studies grid grid-cols-[6fr_4fr] gap-[136px]";
      default:
        return "";
    }
  };

  const getSectionTypeClass = (sectionType: string): string => {
    switch (sectionType) {
      case "map-section":
        return "map-section-class p-20";
      case "blog-spacing":
        return "blog-spacing-class";

      default:
        return "";
    }
  };

  const columnClasses = getColumnClasses(visibleColumnsCount);
  const backgroundColorClass = getBackgroundColorClass(backgroundClass);
  const sectionTypeClass = getSectionTypeClass(sectionType);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Check if the clicked element or one of its parents is an <a> with href="#top"
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor && anchor.getAttribute("href") === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");

      const href = anchor?.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);

        const targetElement = targetId
          ? document.getElementById(targetId)
          : null;

        if (targetElement) {
          const offset = 270;
          window.scrollTo({
            top: targetElement.offsetTop + offset,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section
      {...(id ? { id: id } : {})}
      className={`py-[100px] max-md:py-[54px] ${rowType === "full" ? backgroundClass : ""} ${sectionType || ""} ${sectionTypeClass} ${backgroundColorClass}`}
    >
      <div
        key={index}
        className={`mx-auto ${sectionType === "map-section" ? "" : "container"} ${sectionType === "blog-spacing" ? "!px-0" : ""}`}
      >
        {/* Update the class based on the number of visible columns */}
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

// **Collect all distributor blocks into a single array before rendering, and apply row styles**
const PageContent = ({ rows = [] }: PageContentProps) => {
  return (
    <div className="page-content">
      {rows.length > 0 ? ( // Only map if rows has content
        rows.map((row, index) => {
          const { rowType, rowTitle, backgroundColor } = row;
          return <RenderRow key={index} row={row} index={index} />;
        })
      ) : (
        <p>No content available.</p> // Fallback message
      )}
    </div>
  );
};

export default PageContent;
