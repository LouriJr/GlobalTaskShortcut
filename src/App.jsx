import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import './App.css';


function App() {
    const [value, setValue] = useState('');

    useEffect(() => {
        document.getElementById('input-task').focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!value.trim()) return;
        setValue('');

        console.log("xxx", window.electronAPI);
        window.electronAPI.hideWindow();

    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
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
                    <Button type="submit" variant="contained" color="primary" className="add-button">
                        Adicionar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default App;

