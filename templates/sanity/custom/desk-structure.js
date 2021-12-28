import S from '@sanity/desk-tool/structure-builder'
import { Icon } from 'react-icons/***'

export default () =>
  S.list()
    .title('Content')
    .items([
      //
      // --------------
      //  Static pages
      // --------------
      //
      S.listItem()
        .title('Pages')
        // .icon(Icon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Placeholder Page')
                // .icon(Icon)
                .child(
                  S.document()
                    .title('Placeholder Page')
                    .schemaType('pagePlaceholder')
                    .documentId('pagePlaceholder'),
                ),
            ]),
        ),
      S.divider(),
      //
      // -----------------------
      //  Variable/dynamic data
      // -----------------------
      //
      // S.listItem()
      //   .title('Dynamic Item 1')
      //   // .icon(Icon)
      //   .child(
      //     S.documentList()
      //       .title('Dynamic Item 1')
      //       .filter('_type == "dynamic"')
      //       .schemaType('dynamic')
      //   ),
      // S.listItem()
      //   .title('Dynamic Item Submenu')
      //   // .icon(Icon)
      //   .child(
      //     S.list()
      //     .title('Dynamic Item Submenu')
      //     .items([
      //       S.listItem()
      //         .title('Dynamic Sub-item 1')
      //         // .icon(Icon)
      //         .child(
      //           S.documentList()
      //             .title('Dynamic Sub-item 1')
      //             .filter('_type == "dynamicSub1"')
      //             .schemaType('dynamicSub1')
      //         ),
      //       S.listItem()
      //         .title('Dynamic Sub-item 2')
      //         // .icon(Icon)
      //         .child(
      //           S.documentList()
      //             .title('Dynamic Sub-item 2')
      //             .filter('_type == "dynamicSub2"')
      //             .schemaType('dynamicSub2')
      //         ),
      //     ])
      //   ),
      // S.divider(),
      //
      // --------------------------------------------
      //  Enable if submissions are stored on Sanity
      // --------------------------------------------
      //
      // S.listItem()
      //   .title('Contact Form Submissions')
      //   .child(
      //     S.documentList()
      //       .title('Contact Form Submissions')
      //       .filter('_type == "formContact"')
      //       .schemaType('formContact')
      //   ),
      // S.divider()
    ])
