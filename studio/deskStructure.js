import { BiDownload, BiCategory, BiNews, BiBook } from 'react-icons/bi';
import { BsFillPersonLinesFill  } from 'react-icons/bs';

export default (S) =>
    S.list()
      .title('Website Data')
      .items([
        S.documentTypeListItem('page').title('Pages'),
        S.documentTypeListItem('blogs').title('Blogs'),
        S.documentTypeListItem('events').title('Events'),
        S.documentTypeListItem('news').title('News'),
        S.documentTypeListItem('faqs').title('FAQs'),
        S.listItem()
        .title('Taxonomy')
        .icon(BsFillPersonLinesFill )
        .child(
          S.list()
            .title('Taxonomy')
            .items([
              /* Blog Categories */
                S.listItem()
                  .title('Blog Author')
                  .icon(BiBook)
                  .child(
                    S.documentList()
                      .title('Blog Author')
                      .filter('_type == "blogsAuthor" && assignTo == "blog"')
                      .apiVersion('2025-02-14')
                      .child((documentId) =>
                        S.document()
                          .schemaType('blogsAuthor')
                          .documentId(documentId)
                    )
                ),
                S.listItem()
                  .title('Faqs Category')
                  .icon(BiBook)
                  .child(
                    S.documentList()
                      .title('Faqs Category')
                      .filter('_type == "faqscategories" && assignTo == "faqs"')
                      .apiVersion('2025-02-14')
                      .child((documentId) =>
                        S.document()
                          .schemaType('faqscategories')
                          .documentId(documentId)
                    )
                ),  
            ])
        ),
        S.documentTypeListItem('navigationMenu').title('Navigation Menu'),
        S.documentTypeListItem('siteSettings').title('Site Settings')
      ]);
  