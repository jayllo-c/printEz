import { useState, useEffect } from 'react'

import MyDataGrid from './dataGrid'
import read from '../utils/readJobs'
import { Box, Button } from '@mui/material'
import MyButton from '../style/MyButton'

function PrinterQueue({ socket, printer, setPrinterWarning }) {
  const columns = [
    {
      field: 'rank',
      headerName: 'Status',
      width: 100
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 100
    },
    {
      field: 'id',
      headerName: 'Job Id',
      width: 75
    },
    {
      field: 'file',
      headerName: 'File',
      width: 250
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 100
    },
    {
      field: 'Delete',
      headerName: '',
      width: 100,
      renderCell:(params) => {
        // use params.row to access properties of values in that cell
        const handleDelete = (id) => {
          if (printer !== "") {
            socket.emit("delReq", {id, printer});
            setTimeout(() => {
              socket.emit("readJobQReq", printer);;
              }, 1000);
          }
        }
        return <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
      }
    }
  ]

  const [rows,setRows] = useState([]);

  useEffect(() => {
    if (printer !== "") {
      socket.emit("readJobQReq", printer);
      socket.on("readJobQRes", (data) => {
          read(data, setRows)
      });
      socket.emit("quotaReq");
    }
  }, [socket, printer]);

  const handleClick = (e) => {
    if (printer !== "") {
      socket.emit("readJobQReq", printer);
      socket.emit("quotaReq");
    } else {
      setPrinterWarning(true);
    }
  };
  
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        minWidth: "40%"
      }}
    >
      <MyButton
        addStyle={{mb: "10px"}}
        text="Refresh Queue"
        handleClick={handleClick}
      />
      <MyDataGrid 
        rows = {rows}
        columns= {columns}
        getRowId= {(row) => {
          return row.id
        }}
      />
    </Box>
  )
}

export default PrinterQueue