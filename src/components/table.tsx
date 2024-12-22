import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import SearchComponent from './search.tsx';
import { ClientService } from '../servicio/crud.tsx';
import Header from './header.tsx';

interface Column {
  id: 'id' | 'fullName' | 'action'; // Campos de la tabla
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Identificador', minWidth: 170 },
  { id: 'fullName', label: 'Nombre Completo', minWidth: 170 },
  {
    id: 'action', // Columna de acción
    label: 'Acciones',
    minWidth: 170,
    align: 'center',
  },
];

interface Data {
  id: string;
  fullName: string;
}

export default function StickyHeadTable() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No está autenticado');
        }
        const clients = await ClientService.searchClients({}, token);
        const formattedClients = clients.map((client: any) => ({
          id: client.id,
          fullName: `${client.nombre} ${client.apellidos}`,
        }));
        setRows(formattedClients);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funciones para los íconos
  const handleEdit = (id: string) => {
    console.log(`Editar registro con id: ${id}`);
    navigate(`/mantenimiento-cliente/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No está autenticado');
      }
      await ClientService.deleteClient(id, token);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      console.log(`Registro con id: ${id} eliminado`);
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const handleOpenDialog = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete(selectedId);
    }
    handleCloseDialog();
  };

  return (
    <Paper sx={{ width: '80%', overflow: 'hidden', marginLeft: '5cm' }}>
      <Header />
      <SearchComponent />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];
                      if (column.id === 'action') {
                        // Columna de acción con los íconos
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <IconButton onClick={() => handleEdit(row.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenDialog(row.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro de que desea eliminar este registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
