import { parseInt } from 'lodash';

export const reorderedItem = (id, date, displayOrder, unitId) => ({
  display_order: displayOrder,
  unit_id: parseInt(unitId),
  id,
  date,
});

export const reorderList = (
  itemId,
  date,
  destinationId,
  destinationIndex,
  destinationItems,
  sourceId,
  sourceIndex,
  sourceItems,
) => {
  let items = [];

  // the destination list's items

  // if the item is not unassigned
  if (destinationId) {
    items = [
      ...items,
      ...destinationItems.map((item) => {
        const { id, assignmentDisplayOrder, unitId } = item;

        // current display order
        let displayOrder = assignmentDisplayOrder;

        // if we are reordering in the same list
        if (sourceId === destinationId) {
          // if the item is moved down
          if (destinationIndex > sourceIndex) {
            // the items between the original and new position are moved up
            if (assignmentDisplayOrder > sourceIndex
              && assignmentDisplayOrder <= destinationIndex) {
              displayOrder = assignmentDisplayOrder - 1;
            }
          } else if (destinationIndex < sourceIndex) { // if the item is moved up
            // the items between the original and new position are moved down
            if (assignmentDisplayOrder >= destinationIndex
              && assignmentDisplayOrder < sourceIndex) {
              displayOrder = assignmentDisplayOrder + 1;
            }
          }
        } else if (assignmentDisplayOrder >= destinationIndex) {
          // the items below the new postion in the new list are moved down
          displayOrder = assignmentDisplayOrder + 1;
        }

        return reorderedItem(id, date, displayOrder, unitId);
      }),
    ];
  }

  // the source list's items

  // if we are reordering in a new list
  if (sourceId !== destinationId) {
    items = [
      ...items,
      ...sourceItems.map((item) => {
        const { id, assignmentDisplayOrder, unitId } = item;
        let displayOrder = assignmentDisplayOrder;

        // the items below the old postion moved up
        if (assignmentDisplayOrder >= sourceIndex) {
          displayOrder = assignmentDisplayOrder - 1;
        }

        return reorderedItem(id, date, displayOrder, unitId);
      }),
    ];
  }

  return ([
    ...items,
    reorderedItem(itemId, date, destinationIndex, destinationId),
  ]);
};
