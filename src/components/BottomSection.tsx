import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function createDataTeam(
    nameAngajat: string,
    nameCurs: string,
    date: string,
  ) {
    return { nameAngajat, nameCurs, date };
  }

function createDataMyCurs(
    nameCurs: string,
    date: string
)
{
    return {nameCurs, date}
}

  const rowsMyCurs = [
    createDataMyCurs("Program de pregătire în domeniul Securității și Sănătății în Muncă", "18.02.2023"),
    createDataMyCurs("Curs public speaking", "22.02.2023"),
    createDataMyCurs("Curs online expert achizitii publice", "06.03.2023"),
    createDataMyCurs("Curs online urbanism si amenajarea teritoriului", "20.01.2023"),
    createDataMyCurs("Curs online manager proiect si accesare fonduri europene", "09.01.2023")
  ] 


  const rowsTeam = [
    createDataTeam("Alin Ionescu", "Curs online manager proiect si accesare fonduri europene ", "15.02.2023" ),
    createDataTeam("Andrei Sava", "Curs online urbanism si amenajarea teritoriului", "26.01.2023" ),
    createDataTeam("Roxana Dragan", "Program de pregătire în domeniul Securității și Sănătății în Muncă", "22.02.2023" ),
    createDataTeam("Laurențiu Florin", "Curs online expert achizitii publice", "18.03.2023" ),
    createDataTeam("Alexandra Piscanu", "Curs public speaking", "16.03.2023" )
  ];



function BottomSection() {
    return ( 
        <div id="bottom-section" className="w-auto">
          <div className="info-container w-auto">
            <div className="flex space-between">
              <h3>Cursurile echipei mele</h3>
              <h4 className="see-more">Vezi toate</h4>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow >
                        <TableCell className='tableLables' align="left">Nume Angajat</TableCell>
                        <TableCell className='tableLables' align="left">Nume Curs</TableCell>
                        <TableCell className='tableLables' align="left">Data scadentă</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rowsTeam.map((row) => (
                        <TableRow
                        key={row.nameAngajat}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.nameAngajat}
                        </TableCell>
                        <TableCell align="left">{row.nameCurs}</TableCell>
                        <TableCell style={{padding: 0, margin: "10px"}} align="center"> <h4 className='date-entry'>{row.date}</h4></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </div>
          <div className="info-container w-auto">
            <div className="flex space-between">
              <h3>Cursurile mele</h3>
              <h4 className="see-more">Vezi toate</h4>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow >
                        <TableCell className='tableLables' align="left">Nume Curs</TableCell>
                        <TableCell className='tableLables' align="left">Data scadentă</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rowsMyCurs.map((row) => (
                        <TableRow
                        key={row.nameCurs}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.nameCurs}
                        </TableCell>
                        <TableCell style={{padding: 0, margin: "10px"}} align="center"> <h4 className='date-entry'>{row.date}</h4></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </div>
        </div>
     );
}

export default BottomSection;

