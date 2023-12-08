import {
    Box,
    Button,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {Add, Calculate, ImportExport, Save, Upload} from "@mui/icons-material";
import {NestingParentComponent} from "../NestingResult.tsx";
import React, {useState} from "react";
import {calculateNesting} from "../Requests.tsx";
import {createTheme} from "@mui/material/styles";


const styles = {
    root: {
        background: 'linear-gradient(45deg, #31a097 30%, #008080 90%)',
        border: 0,
        borderRadius: 4,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        margin: '4px',
    }
};

const StyledButton = styled(Button)(styles.root);


const StyledTableCell = styled(TableCell)({
    border: '2px solid #bbc3c2',
    borderRadius: 0,
    padding: '10px',
    paddingLeft: '30px',
    paddingRight: '30px',
});

const initialTable1Data = [{length: '', quantity: '', name: ''}];
const initialTable2Data = [{length: '', quantity: '', name: ''}];

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                color: '#4CAF50',
            },
        },
    },
});

const Home = () => {

    const [table1Data, setTable1Data] = useState(initialTable1Data);
    const [table2Data, setTable2Data] = useState(initialTable2Data);
    const [nestingData, setNestingData] = useState(null);

    const handleAddBlank = (table) => {
        const newBlankRow = {length: '', quantity: '', name: ''};
        if (table === 1) {
            setTable1Data([...table1Data, newBlankRow]);
        } else if (table === 2) {
            setTable2Data([...table2Data, newBlankRow]);
        }
    };

    const handleSave = (table) => {
        // Implement save functionality based on your requirements
        console.log(`Saving data for Table ${table}`);
    };

    const handleCalculate = async (input_pipes, output_pipes) => {
        const response_data = await calculateNesting(input_pipes, output_pipes);
        setNestingData(response_data);
    };

    const handleCellChange = (table, rowIndex, columnName, value) => {
        const newData = table === 1 ? [...table1Data] : [...table2Data];
        newData[rowIndex][columnName] = value;

        if (table === 1) {
            setTable1Data(newData);
        } else if (table === 2) {
            setTable2Data(newData);
        }
    };

    const tableWidth = '800px';
    return (<div style={{display: 'flex', flexDirection: 'column', maxHeight: '700px'}}>

            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
            >
                <Paper
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: '150px',
                        width: tableWidth,
                    }}
                >
                    {/* Table 1 */}
                    <TableContainer component={Paper} sx={{width: "90%", p: {xs: 2, md: 2, lg: 2}}}>
                        <Typography align="center" variant="h6" component="div" gutterBottom>
                            {"Заготовки"}
                        </Typography>
                        <Table style={{backgroundColor: "#efefef", color: 'white'}}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">№</StyledTableCell>
                                    <StyledTableCell align="center">Длина заготовки</StyledTableCell>
                                    <StyledTableCell align="center">Количество</StyledTableCell>
                                    <StyledTableCell align="center">Название</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table1Data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}
                                              style={{backgroundColor: rowIndex % 2 === 0 ? '#f0f8ff' : '#d1e2e0'}}>
                                        <StyledTableCell>{rowIndex + 1}</StyledTableCell>

                                        <StyledTableCell>
                                            <TextField
                                                value={row.length}
                                                onChange={(e) => handleCellChange(1, rowIndex, 'length', e.target.value)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                value={row.quantity}
                                                onChange={(e) => handleCellChange(1, rowIndex, 'quantity', e.target.value)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                value={row.name}
                                                onChange={(e) => handleCellChange(1, rowIndex, 'name', e.target.value)}
                                            />
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box style={{display: 'flex', justifyContent: 'center', width: '94%'}}>

                        {/* Buttons for Table 1 */}
                        <ThemeProvider theme={theme}>
                            <StyledButton startIcon={<Add/>} onClick={() => handleAddBlank(1)}>Добавить
                                заготовку</StyledButton>
                            <StyledButton startIcon={<Save/>} onClick={() => handleSave(1)}>Сохранить</StyledButton>
                            <StyledButton startIcon={<ImportExport/>} onClick={() => (1)}>Импортировать
                                из
                                библиотеки</StyledButton>
                            <StyledButton startIcon={<Upload/>} onClick={() => (1)}>Импорт с
                                устройства</StyledButton>
                        </ThemeProvider>
                    </Box>
                </Paper>

                <Paper
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: '50px',
                        width: tableWidth
                    }}
                >
                    {/* Table 2 */}
                    <TableContainer component={Paper} sx={{width: "90%", p: {xs: 2, md: 2, lg: 2},}}>
                        <Typography align="center" variant="h6" component="div" gutterBottom>
                            {"Результаты"}
                        </Typography>

                        <Table style={{backgroundColor: "#efefef", color: 'white',}}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">№</StyledTableCell>
                                    <StyledTableCell align="center">Длина отрезка</StyledTableCell>
                                    <StyledTableCell align="center">Количество</StyledTableCell>
                                    <StyledTableCell align="center">Название</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table2Data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}
                                              style={{backgroundColor: rowIndex % 2 === 0 ? '#f0f8ff' : '#d1e2e0'}}>
                                        <StyledTableCell>{rowIndex + 1}</StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                value={row.length}
                                                onChange={(e) => handleCellChange(2, rowIndex, 'length', e.target.value)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                value={row.quantity}
                                                onChange={(e) => handleCellChange(2, rowIndex, 'quantity', e.target.value)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                value={row.name}
                                                onChange={(e) => handleCellChange(2, rowIndex, 'name', e.target.value)}
                                            />
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box style={{display: 'flex', justifyContent: 'center', width: '94%'}}>

                        {/* Buttons for Table 2 */}
                        <StyledButton startIcon={<Add/>} style={{width: '33%'}} onClick={() => handleAddBlank(2)}>Добавить
                            отрезок</StyledButton>
                        <StyledButton startIcon={<Save/>} style={{width: '33%'}}
                                      onClick={() => handleSave(2)}>Сохранить</StyledButton>
                        <StyledButton startIcon={<Calculate/>} style={{width: '33%'}}
                                      onClick={() => handleCalculate(table1Data, table2Data)}>Рассчитать</StyledButton>

                    </Box>
                </Paper>
            </Box>
            {/* Display Nesting Data */}
            {nestingData && (
                <NestingParentComponent jsonData={nestingData}/>
            )}
        </div>
    );
}

export default Home;