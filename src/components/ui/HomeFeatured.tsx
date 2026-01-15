import { urlFor } from '@/lib/sanity';
import type { HomeFeaturedProps } from '@/types/homeFeatured';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeFeatured({
  mainHeading,
  subHeading,
  featuredItems = [],
  backgroundColor = 'bg-white'
}: HomeFeaturedProps) {
  // Ensure we only display up to 4 items
  const displayItems = featuredItems.slice(0, 4);

  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Headings */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{mainHeading}</h2>
          {subHeading && (
            <p className="text-xl text-gray-600">{subHeading}</p>
          )}
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {displayItems.map((item, index) => {
            const content = (
              <div key={index} className="max-w-sm w-full">
                <div className="relative group">
                  {/* Image container with fixed aspect ratio */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image
                      src={urlFor(item.image).width(400).height(400).url()}
                      alt={item.image.alt || item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/90 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );

            // Wrap with Link if a link is provided
            return item.link ? (
              <Link 
                key={index}
                href={item.link}
                className="block transition-transform hover:-translate-y-1"
              >
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>
      </div>
    </section>
  );
}
