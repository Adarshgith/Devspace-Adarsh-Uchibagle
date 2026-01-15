export interface FeaturedItem {
  title: string;
  image: {
    asset: {
      _id: string;
      url: string;
    };
    alt: string;
  };
  link?: string;
  description?: string;
}

export interface HomeFeaturedProps {
  mainHeading: string;
  subHeading?: string;
  featuredItems: FeaturedItem[];
  backgroundColor?: 'bg-white' | 'bg-gray-50' | 'bg-gray-900';
}