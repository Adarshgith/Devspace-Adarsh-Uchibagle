// import { defineType, defineField } from 'sanity';
// import { CiViewTable } from "react-icons/ci";

// export default defineType({
//   name: 'tableComponent',
//   title: 'Table',
//   type: 'object',
//   icon: CiViewTable,
//   fields: [
//     defineField({
//       name: 'title',
//       title: 'Title',
//       type: 'string',
//     }),
//     defineField({
//       name: 'tableContent',
//       title: 'Table Content',
//       type: 'table',
//     }),
//     defineField({
//         name: 'caption',
//         title: 'caption',
//         type: 'text',
//     }),
//     defineField({
//         name: 'innerContent',
//         title: 'Inner Content',
//         type: 'array',
//         of: [
//             {
//                 type: 'block',
//             }
//         ]
//     }),
//   ],
//   preview: {
//     select: {
//       title: 'title',
//     },
//     prepare(selection) {
//       const { title } = selection;
//       return {
//         title,
//       };
//     },
//   },
// });
