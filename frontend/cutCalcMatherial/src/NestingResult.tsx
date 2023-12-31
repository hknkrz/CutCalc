import React, {useEffect} from 'react';
import {
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

const StyledTableCell = styled(TableCell)({
    border: '2px solid #bbc3c2',
    borderRadius: 0,
    padding: '10px',
    paddingLeft: '30px',
    paddingRight: '30px',
});

const PipesTableComponent = ({data, title}) => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" component="div" align="center" gutterBottom>
                {title}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: '#d1e2e0'}}>
                        <StyledTableCell>Длина</StyledTableCell>
                        <StyledTableCell>Количество</StyledTableCell>
                        <StyledTableCell>Название</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index } style={{backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#d1e2e0'}}>
                            <StyledTableCell>{item.length}</StyledTableCell>
                            <StyledTableCell>{item.quantity}</StyledTableCell>
                            <StyledTableCell>{item.name}</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
const NestingTableComponent = ({data, title}) => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" component="div" align="center" gutterBottom>
                {title}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: '#d1e2e0'}}>
                        <StyledTableCell>Длина</StyledTableCell>
                        <StyledTableCell>Количество</StyledTableCell>
                        <StyledTableCell align="center">Точки разреза</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} style={{backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#d1e2e0'}}>
                            <StyledTableCell>{item.length}</StyledTableCell>
                            <StyledTableCell>{item.quantity}</StyledTableCell>
                            <StyledTableCell> <CutPositionsCanvas length={item.length}
                                                            cutPositions={item.cut_positions}
                                                            index={index}/>
                            </StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const CutPositionsCanvas = ({length, cutPositions, index}) => {
    useEffect(() => {
        const canvas = document.getElementById(`cutCanvas${index}`);
        const subCanvas = document.getElementById(`cutSubCanvas${index}`);
        const ctx = canvas.getContext('2d');
        const subCtx = subCanvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        subCtx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#008080';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        subCtx.strokeStyle = 'black';
        subCtx.lineWidth = 1;
        subCtx.setLineDash([5, 5]);

        cutPositions.forEach((cutPosition, idx) => {
            const xPos = (cutPosition / length) * canvas.width;
            const prevXPos = idx > 0 ? (cutPositions[idx - 1] / length) * canvas.width : 0; // Calculate previous cut position or use 0 for the first line

            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height);
            ctx.stroke();

            const xSubPos = (cutPosition / length) * subCanvas.width;
            subCtx.beginPath();
            subCtx.moveTo(xSubPos, 0);
            subCtx.lineTo(xSubPos, subCanvas.height);
            subCtx.stroke();

            ctx.font = 'bold 17px Arial';
            ctx.fillStyle = 'black';
            subCtx.font = 'bold 17px Arial';
            subCtx.fillStyle = 'black';

            const centerTextX = (xPos + prevXPos) / 2;
            subCtx.fillText(cutPosition.toString(), xPos - 50, canvas.height - 10);
            ctx.fillText(idx > 0 ? (cutPosition - cutPositions[idx - 1]).toString() : cutPosition.toString(),  centerTextX - 8, canvas.height - 17);


            if (idx === cutPositions.length - 1) {
                ctx.fillStyle = 'white';
                ctx.fillRect(xPos, 0, canvas.width - xPos, canvas.height);
            }
        });
    }, [length, cutPositions, index]);
    return (
        <div>
            <canvas
                id={`cutCanvas${index}`}
                width="1200"
                height="50"
                style={{border: '2px solid #000', marginTop: '10px'}}
            ></canvas>
            <canvas
                id={`cutSubCanvas${index}`}
                width="1200"
                height="50"
                style={{border: '0px solid #000', marginTop: '0px'}}
            ></canvas>
        </div>
    );
};

export const NestingParentComponent = ({jsonData}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', padding: '150px', margin: '150 150px'}}>
            <NestingTableComponent data={jsonData.nesting_map} title="Раскрой"/>
            <PipesTableComponent data={jsonData.unused_pipes} title="Неиспользованные заготовки"/>
            <PipesTableComponent data={jsonData.uncut_pipes} title="Неразрезанные отрезки"/>
        </div>
    );
};

