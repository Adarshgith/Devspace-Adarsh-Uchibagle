import { DocumentActionComponent } from 'sanity';
//import { ScheduleAction } from '@sanity/scheduled-publishing';
import SetSlugAndPublishAction from './actions/setSlugAndPublishAction';

export const CustomPublishAction: DocumentActionComponent = (props) => {
  // Custom logic for publish action
  return SetSlugAndPublishAction(props);
};

export default function useDocumentActions(props: any) {
  const actions = [
    CustomPublishAction,
    //ScheduleAction,
    // You can add more custom actions here if needed
  ];

  // If you want to restrict this to specific document types, uncomment the code below:
  // if (["tag"].indexOf(props.type) !== -1) {
  //   return actions;
  // }

  return actions;
}
