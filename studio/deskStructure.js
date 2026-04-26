import { BiDownload, BiCategory, BiNews, BiBook } from 'react-icons/bi';
import { BsFillPersonLinesFill  } from 'react-icons/bs';

export default (S) =>
    S.list()
      .title('Website Data')
      .items([
        S.documentTypeListItem('page').title('Pages'),
        S.documentTypeListItem('project').title('Projects'),
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
            ])
        ),
        S.documentTypeListItem('navigationMenu').title('Navigation Menu'),
        S.documentTypeListItem('siteSettings').title('Site Settings')
      ]);
  