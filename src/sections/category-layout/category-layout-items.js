import { Box, Typography, styled } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CategoryLayoutItemCard } from '../category-layout-item/category-layout-item-card';

const CategoryItemsWrapper = styled(Box)(({ theme }) => ({
  '&.flex': {
    display: 'flex',
    flexWrap: 'wrap',

    '.category-item-card': {
      height: '250px',
      width: '25%',
    },
  },
  '&.grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: 250,

    '.category-item-card:first-child': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
      gridRowStart: 1,
      gridRowEnd: 3,
    },
    '.category-item-card:nth-child(2)': {
      gridColumnStart: 3,
      gridColumnEnd: 5,
    },
  },
}));

const languajesText = [
  {
    id: 1,
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    id: 2,
    name: 'Inglés',
    flag: '🇬🇧',
  },
  {
    id: 3,
    name: 'Francés',
    flag: '🇫🇷',
  },
  {
    id: 4,
    name: 'Portugués',
    flag: '🇵🇹',
  },
  {
    id: 5,
    name: 'Italiano',
    flag: '🇮🇹',
  },
  {
    id: 6,
    name: 'Alemán',
    flag: '🇩🇪',
  },
];

export const CategoryLayoutItemsGroup = ({
  categoryLayout,
  categoriesItemsByLanguage,
  refetch,
  handleDragEnd,
}) => {
  Object.keys(categoriesItemsByLanguage).map((languageId, index) => {
    const categoryItems = categoriesItemsByLanguage[languageId];
    return (
      <Box key={index}>
        <Typography
          variant="h6"
          sx={{
            alignItems: 'center',
            mb: 2,
            textAlign: 'center',
            width: '100%',
          }}
        >
          {languajesText.find((item) => item.id == languageId)?.flag}{' '}
          {languajesText.find((item) => item.id == languageId)?.name ||
            'Sin tienda'}
        </Typography>
        <CategoryItemsWrapper className={categoryLayout?.type}>
          <DragDropContext onDragEnd={handleDragEnd}>
            {categoryItems.map((categoryItem, index) => (
              <Droppable
                droppableId={categoryItem.id.toString()}
                type="task"
                direction="horizontal"
                key={index}
              >
                {(provided) => (
                  <div
                    key={categoryItem.id}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="category-item-card"
                  >
                    <CategoryLayoutItemCard
                      categoryItem={categoryItem}
                      index={index}
                      refetch={refetch}
                      onEdit={() => openEditDialog(categoryItem)}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </CategoryItemsWrapper>
      </Box>
    );
  });
};
