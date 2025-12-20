import { useCallback, useState, useMemo } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import {
  ChevronDown,
  ChevronRight,
  Pencil02,
  Trash01,
} from '@untitled-ui/icons-react';
import { SeverityPill } from '../../components/severity-pill';
import { useLanguageId } from '../../hooks/use-language-id';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../hooks/use-auth';

const CategoryListRow = ({
  category,
  refetch,
  isChild = false,
  dragHandle,
  parentNames = [],
}) => {
  const { user } = useAuth();
  const languageId = useLanguageId();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasChildren = useMemo(() => category.children.length > 0, [category]);
  const data = useMemo(
    () => category.data.find(({ language_id }) => language_id === languageId),
    [category.data, languageId],
  );

  const handleDelete = useCallback(
    async (event) => {
      event.preventDefault();
      if (category.children.length > 0) {
        toast.error(
          'No se puede eliminar una categoría con subcategorías. Primero elimine las subcategorías.',
        );
        return;
      }
      if (
        window.confirm(
          `¿Está seguro que desea eliminar la categoría ${data?.name}? Esta acción es irreversible.`,
        )
      ) {
        try {
          setDeleting(true);
          await categoriesApi.deleteCategory(category.id);
          toast.success('Categoría eliminada con éxito.');
          refetch();
        } catch (error) {
          console.error(error.message);
          toast.error('Ocurrió un error al eliminar la categoría.');
        } finally {
          setDeleting(false);
        }
      }
    },
    [category, data?.name, refetch],
  );

  return (
    <>
      <TableRow
        hover
        selected={open}
        sx={{
          ...(open && {
            backgroundColor: 'rgba(17, 25, 39, 0.04)',
          }),
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            position: 'relative',
            paddingLeft: `${category.level * 30}px !important`,
          }}
        >
          {hasChildren && (
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              <SvgIcon fontSize="small">
                {open ? <ChevronDown /> : <ChevronRight />}
              </SvgIcon>
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Box
            sx={{ cursor: 'pointer', ml: 2, userSelect: 'none' }}
            onClick={() => setOpen((prev) => !prev)}
          >
            {parentNames.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize={11}
              >
                {parentNames.join(' → ')}
              </Typography>
            )}
            {data?.name ? (
              <Typography
                variant="subtitle2"
                sx={{ textTransform: 'uppercase' }}
              >
                {data?.name}
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontStyle="italic"
              >
                Nombre sin definir
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell align="center">
          {category.erp_id || (
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
              N/A
            </Typography>
          )}
        </TableCell>
        <TableCell align="center">{category.position}</TableCell>
        <TableCell align="center">{category.children.length}</TableCell>
        <TableCell align="center">
          <SeverityPill
            color={category.stores?.length > 0 ? 'success' : 'error'}
          >
            {category.stores?.length > 0 ? 'Habilitado' : 'Deshabilitado'}
          </SeverityPill>
        </TableCell>
        <TableCell align="right">
          <Button
            size="small"
            LinkComponent={NextLink}
            href={`/categories/${category.id}`}
            sx={{ whiteSpace: 'nowrap' }}
            startIcon={
              <SvgIcon fontSize="inherit">
                <Pencil02 />
              </SvgIcon>
            }
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            disabled={!user.role.can_edit}
            startIcon={
              <SvgIcon fontSize="inherit">
                <Trash01 />
              </SvgIcon>
            }
            onClick={handleDelete}
          >
            Eliminar
          </Button>
          <Button>{dragHandle}</Button>
        </TableCell>
      </TableRow>
      {open &&
        category.children.map((child) => (
          <CategoryListRow
            key={child.id}
            category={child}
            isChild={true}
            parentNames={[...parentNames, data?.name]}
          />
        ))}
    </>
  );
};

const DragHandle = SortableHandle(() => (
  <IconButton>
    <DragIndicatorIcon />
  </IconButton>
));

const SortableItem = SortableElement(({ category, onClick }) => (
  <CategoryListRow
    key={category.id}
    category={category}
    onClick={onClick}
    dragHandle={<DragHandle />}
  />
));

const SortableList = SortableContainer(({ categories }) => {
  return (
    <TableBody>
      {categories.map((category, index) => (
        <SortableItem key={category.id} index={index} category={category} />
      ))}
    </TableBody>
  );
});

const updateCategoryPositions = async (categories) => {
  for (const category of categories) {
    try {
      await categoriesApi.updateCategoryPosition(category.id, {
        position: category.position,
      });
    } catch (error) {
      console.error(
        `Error actualizando la posición de la categoría con ID ${category.id}:`,
        error,
      );
    }
  }
};

export const CategoryListTable = (props) => {
  const {
    categories,
    setCategories,
    handleUpdatePosition,
    refetch,
    loading,
    ...other
  } = props;

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newCategories = arrayMove(categories, oldIndex, newIndex);
    const updatedCategories = newCategories.map((category, index) => ({
      ...category,
      position: index,
    }));
    setCategories(updatedCategories);
    updateCategoryPositions(updatedCategories);
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Categoría</TableCell>
              <TableCell align="center">ERP ID</TableCell>
              <TableCell align="center">Posición</TableCell>
              <TableCell align="center">Categorías hijas</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          {!loading && (
            <SortableList
              categories={categories}
              onSortEnd={onSortEnd}
              useDragHandle
            />
          )}
          {loading &&
            Array.from(Array(10).keys()).map((i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox" />
                {Array.from(Array(6).keys()).map((i) => (
                  <TableCell key={i}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </Table>
      </Scrollbar>
    </div>
  );
};

CategoryListTable.propTypes = {
  categories: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};
