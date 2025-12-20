import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { Telescope } from '@untitled-ui/icons-react';
import { LandingHeader } from './landing-header';
import { LandingBoxes } from './landing-boxes';
import { LandingCarrousel } from './landing-carrousel';
import { landingPageApi } from '../../api/landing-page';
import { buttonApi } from '../../api/button';

export const LandingPageCard = ({ landingPage, editable, refetch }) => {
  // Estado para manejar los elementos ordenados, con un array vacío como valor por defecto
  const [sortedItems, setSortedItems] = useState(
    landingPage?.relatedItems || [],
  );
  const [buttons, setButtons] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (!landingPage) return;
    setSortedItems(landingPage?.relatedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingPage?.relatedItems]);

  const [forceUpdate, setForceUpdate] = useState(0);
  const triggerUpdate = () => setForceUpdate((prev) => prev + 1);

  // Función para actualizar el orden en el servidor
  const updateOrderInAPI = async (id, newItems) => {
    try {
      // Verificar que newItems sea un array
      if (!Array.isArray(newItems)) {
        throw new Error('newItems no es un array');
      }

      // Crear el nuevo orden
      const updatedOrder = newItems.map((item, index) => ({
        id: item.data.id,
        order: index + 1,
        type: item.type,
      }));

      // Hacer la solicitud a la API utilizando async/await
      const response = await landingPageApi.updateOrder(id, updatedOrder);

      // Manejar la respuesta
      //console.log('Orden actualizado en el servidor:', response.data);
    } catch (error) {
      // Manejar errores
      console.error('Error al actualizar el orden:', error.message || error);
    }
  };

  // Función para cambiar el orden de los elementos
  const handleMove = (index, direction) => {
    const newItems = [...sortedItems];

    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [
        newItems[index - 1],
        newItems[index],
      ];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
    }

    // Actualizar el estado local
    setSortedItems(newItems);

    // Guardar el nuevo orden en la API
    updateOrderInAPI(landingPage.landingId, newItems);
  };

  // Funcion para eliminar componentes
  const handleDeleteItem = async (id, itemType) => {
    if (
      window.confirm(
        '¿Estás seguro de eliminar este ' +
          itemType +
          '? Esta acción es irreversible.',
      ) === false
    ) {
      return;
    }

    if (itemType == 'header') {
      try {
        const response = await landingPageApi.deleteHeaderLandingPage(
          landingPage.landingId,
          id,
        );
        toast.success('El banner se ha eliminado correctamente.');
        const updatedItems = sortedItems.filter((item) => item.data.id !== id);
        refetch();
        setSortedItems(updatedItems);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el banner.');
      }
    }

    if (itemType == 'box') {
      try {
        const response = await landingPageApi.deleteBoxLandingPage(
          landingPage.landingId,
          id,
        );
        toast.success('El Box se ha eliminado correctamente.');
        const updatedItems = sortedItems.filter((item) => item.data.id !== id);
        refetch();
        setSortedItems(updatedItems);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el box.');
      }
    }

    if (itemType == 'carrousel') {
      try {
        const response = await landingPageApi.deleteCarrouselLandingPage(
          landingPage.landingId,
          id,
        );
        toast.success('El Carrousel se ha eliminado correctamente.');
        const updatedItems = sortedItems.filter((item) => item.data.id !== id);
        refetch();
        setSortedItems(updatedItems);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el box.');
      }
    }
  };

  //function para editar componente
  const handleEdit = async (index, itemType, updateData) => {
    if (itemType == 'header') {
      let updateItem = {};
      const id = landingPage.relatedItems[index].data.id;
      updateItem.guide_gift_page_id =
        landingPage.relatedItems[index].guide_gift_page_id;
      updateItem.order = landingPage.relatedItems[index].data.order;
      updateItem.background_color = updateData.background_color;
      updateItem.button_id = updateData.button_id;
      updateItem.title = updateData.title;
      updateItem.image_url = updateData.image_url;

      updateItem.is_mobile = 0;
      if (updateData.is_mobile === true) updateItem.is_mobile = 1;

      updateItem.is_tablet = 0;
      if (updateData.is_tablet === true) updateItem.is_tablet = 1;

      const response = await landingPageApi.updateHeaderLandingPage(
        landingPage.landingId,
        id,
        updateItem,
      );

      const updatedItems = [...sortedItems];
      const i = updatedItems.findIndex((item) => item.data?.id === response.id);
      if (index !== -1) {
        updatedItems[i] = { type: 'header', data: response };
      } else {
        updatedItems.push({ type: 'header', data: response });
      }
      setSortedItems(updatedItems);

      toast.success('El banner se ha modificado correctamente.');
      refetch();
    }

    if (itemType == 'box') {
      try {
        const id = landingPage.relatedItems[index].data.id;
        let updateItem = {};
        updateItem.order = landingPage.relatedItems[index].data.order;
        updateItem.type = updateData.type;
        updateItem.guide_gift_page_id =
          landingPage.relatedItems[index].data.guide_gift_page_id;
        const response = await landingPageApi.updateBoxLandingPage(
          landingPage.landingId,
          id,
          updateItem,
        );
        const updatedItems = [...sortedItems];
        const i = updatedItems.findIndex(
          (item) => item.data?.id === response.id,
        );
        if (index !== -1) {
          updatedItems[i] = {
            type: 'box',
            data: response,
            items: updatedItems[i].items,
          };
        } else {
        }
        setSortedItems(updatedItems);
        toast.success('El Box se ha modificado correctamente.');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo modificar el box.');
      }
    }

    if (itemType == 'carrousel') {
      try {
        const id = landingPage.relatedItems[index].data.id;
        let updateItem = {};
        updateItem.order = landingPage.relatedItems[index].data.order;
        updateItem.background_color = updateData.background_color;
        updateItem.button_id = updateData.button_id;
        updateItem.image_url = updateData.background_url;

        updateItem.is_mobile = updateData.is_mobile;
        updateItem.is_tablet = updateData.is_tablet;

        updateItem.guide_gift_page_id =
          landingPage.relatedItems[index].data.guide_gift_page_id;
        const response = await landingPageApi.updateCarrouselLandingPage(
          landingPage.landingId,
          id,
          updateItem,
        );

        const updatedItems = [...sortedItems];
        const i = updatedItems.findIndex(
          (item) => item.data?.id === response.id,
        );

        if (index !== -1) {
          updatedItems[i] = {
            type: 'carrousel',
            data: response,
            items: updatedItems[i].items,
          };
        } else {
        }

        setSortedItems(updatedItems);

        toast.success('El Carrousel se ha modificado correctamente.');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo modificar el carrousel.');
      }
    }
  };

  useEffect(() => {
    buttonApi.getButtons({ allOption: true }).then((res) => {
      setButtons(res.items);
    });

    buttonApi.getButtons({ allOption: true, type: 'link' }).then((res) => {
      setLinks(res.items);
    });
    triggerUpdate();
  }, [sortedItems]);

  return (
    <Card>
      <CardContent>
        {sortedItems && sortedItems.length > 0 ? (
          sortedItems.map((item, index) => {
            switch (item.type) {
              case 'header':
                return (
                  <LandingHeader
                    key={`h-${item.data.id}-${index}`}
                    title={item.data.title}
                    imageUrl={item.data.image_url}
                    backgroundColor={item.data.background_color}
                    is_mobile={item.data.is_mobile ? true : false}
                    is_tablet={item.data.is_tablet ? true : false}
                    button={item.data.button}
                    order={item.data.order}
                    editable={editable}
                    buttons={buttons}
                    onMoveUp={() => handleMove(index, 'up')}
                    onMoveDown={() => handleMove(index, 'down')}
                    onDelete={() => handleDeleteItem(item.data.id, 'header')}
                    onEdit={(updateData) =>
                      handleEdit(index, 'header', updateData)
                    }
                    id={item.data.id}
                    landingId={landingPage.landingId}
                  />
                );
              case 'box':
                return (
                  <LandingBoxes
                    key={`b-${item.data.id}-${index}`}
                    type={item.data.type}
                    items={item.data.items}
                    order={item.data.order}
                    editable={editable}
                    buttons={buttons}
                    onMoveUp={() => handleMove(index, 'up')}
                    onMoveDown={() => handleMove(index, 'down')}
                    onEdit={(updateData) =>
                      handleEdit(index, 'box', updateData)
                    }
                    onDelete={() => handleDeleteItem(item.data.id, 'box')}
                    id={item.data.id}
                    landingId={landingPage.landingId}
                  />
                );
              case 'carrousel':
                return (
                  <LandingCarrousel
                    key={`c-${item.data.id}-${index}`}
                    button={item.data.button}
                    button_id={item.data.button_id}
                    items={item.data.items}
                    order={item.data.order}
                    is_mobile={item.data.is_mobile}
                    is_tablet={item.data.is_tablet}
                    editable={editable}
                    buttons={buttons}
                    links={links}
                    imageUrl={item.data.background_color}
                    onMoveUp={() => handleMove(index, 'up')}
                    onMoveDown={() => handleMove(index, 'down')}
                    onEdit={(updateData) =>
                      handleEdit(index, 'carrousel', updateData)
                    }
                    onDelete={() => handleDeleteItem(item.data.id, 'carrousel')}
                    id={item.data.id}
                    landingId={landingPage.landingId}
                  />
                );
              default:
                return null;
            }
          })
        ) : (
          <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
            <SvgIcon fontSize="large" color="disabled">
              <Telescope />
            </SvgIcon>
            <Typography variant="body2" color="text.secondary">
              No tiene componentes.
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
