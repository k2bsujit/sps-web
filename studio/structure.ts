import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {CreditCardIcon} from '@sanity/icons/CreditCard'
import {WrenchIcon} from '@sanity/icons/Wrench'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {ImagesIcon} from '@sanity/icons/Images'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {CommentIcon} from '@sanity/icons/Comment'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {InboxIcon} from '@sanity/icons/Inbox'

export const SINGLETONS = [
  {id: 'siteSettings', title: 'Business details & SEO', icon: CogIcon},
  {id: 'homePage', title: 'Home page', icon: HomeIcon},
  {id: 'subsidy', title: 'Subsidy rates & guide', icon: CreditCardIcon},
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('SP Surya')
    .items([
      S.listItem()
        .title('Leads (enquiries)')
        .icon(InboxIcon)
        .child(
          S.list()
            .title('Leads')
            .items([
              S.listItem()
                .title('New')
                .child(S.documentList().title('New leads').filter('_type == "lead" && status == "new"').defaultOrdering([{field: '_createdAt', direction: 'desc'}])),
              S.listItem()
                .title('Contacted / quoted')
                .child(S.documentList().title('In progress').filter('_type == "lead" && status in ["contacted","quoted"]')),
              S.listItem()
                .title('Won')
                .child(S.documentList().title('Won').filter('_type == "lead" && status == "won"')),
              S.listItem()
                .title('All leads')
                .child(S.documentTypeList('lead').title('All leads').defaultOrdering([{field: '_createdAt', direction: 'desc'}])),
            ]),
        ),
      S.divider(),
      ...SINGLETONS.map((s) =>
        S.listItem().title(s.title).id(s.id).icon(s.icon).child(S.document().schemaType(s.id).documentId(s.id).title(s.title)),
      ),
      S.divider(),
      S.documentTypeListItem('service').title('Services').icon(WrenchIcon),
      S.documentTypeListItem('area').title('Areas / locations').icon(EarthGlobeIcon),
      S.documentTypeListItem('project').title('Projects & gallery').icon(ImagesIcon),
      S.documentTypeListItem('faq').title('FAQs').icon(HelpCircleIcon),
      S.documentTypeListItem('testimonial').title('Customer reviews').icon(CommentIcon),
      S.documentTypeListItem('post').title('Blog posts').icon(DocumentTextIcon),
    ])
