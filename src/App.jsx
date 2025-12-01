import { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import './App.css';


function App() {
    const [value, setValue] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const [kanbanLists, setKanbanLists] = useState([]);

    const [date, setDate] = useState(dayjs());

    useEffect(() => {
        document.getElementById('input-task').focus();

        if (window.electronAPI && window.electronAPI.onFileContentLoaded) {
            window.electronAPI.onFileContentLoaded((fileContent) => {

                if (fileContent) {
                    processFileContent(fileContent);
                }
            });
        }

        return () => {
            if (window.electronAPI && window.electronAPI.removeFileContentListener) {
                window.electronAPI.removeFileContentListener();
            }
        };
    }, []);

    const processFileContent = (content) => {

        if (!content || content.trim() === '') {
            return;
        }

        const lines = content.split('\n');
        const kanbanLists = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('##')) {
                const list = {
                    index: i,
                    name: line.replace(/^##+/, '').trim(),
                }
                kanbanLists.push(list);
            }
        }

        setSelectedList(kanbanLists[0].index);
        setKanbanLists(kanbanLists);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!value.trim()) return;

        const taskValue = value;
        setValue('');

        await addTask(taskValue);
        window.electronAPI.hideWindow();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const addTask = async (taskText) => {
        if (!taskText || !taskText.trim()) return;

        const formattedDate = date.format('DD-MM-YYYY');
        const newLine = `- [ ] ${taskText} @{${formattedDate}}`;

        const lineNumber = selectedList !== '' ? selectedList + 2 : 0;
   
        try {
            await window.electronAPI.insertLine(lineNumber, newLine)
        } catch (error) {
            console.error('Erro ao inserir linha:', error);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="app" >
                <form className="container" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <TextField
                            id="input-task"
                            placeholder="Digite a tarefa"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="button-container">
                        <FormControl variant="outlined" sx={{ width: '15rem' }}>
                            <InputLabel id="select-project-label">Selecione o projeto</InputLabel>
                            <Select
                                id="select-project"
                                labelId="select-project-label"
                                label="Selecione o projeto"
                                value={selectedList}
                                onChange={(e) => setSelectedList(e.target.value)}
                            >
                                {kanbanLists.map((list) => (
                                    <MenuItem key={list.index} value={list.index}>{list.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Data"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            format="DD-MM-YYYY"
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    sx: { width: '15rem' }
                                },
                                popper: {
                                    placement: 'top-start'
                                }
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" className="add-button">
                            Adicionar
                        </Button>
                    </div>
                </form>
            </div>
        </LocalizationProvider>
    );
}

export default App;

