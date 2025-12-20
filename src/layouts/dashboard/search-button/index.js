import { useCallback, useState } from 'react';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { IconButton, SvgIcon, Tooltip } from '@mui/material';
import { SearchDialog } from './search-dialog';

export const SearchButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  return (
    <>
      <Tooltip title="Buscar">
        <IconButton
          onClick={handleOpen}
          sx={{
            color: '#6b7280',
            '&:hover': {
              color: '#000',
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <SvgIcon fontSize="small">
            <SearchMdIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <SearchDialog onClose={handleClose} open={openDialog} />
    </>
  );
};
