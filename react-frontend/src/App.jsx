import './App.css';
import { useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReply = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await fetch(
        'https://automated-email-writer.onrender.com/api/email/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailContent: emailContent,
            tone: tone
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate reply');
      }

      const data = await response.text();
      setGeneratedReply(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone</InputLabel>

          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            label="Tone"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReply}
          disabled={loading || !emailContent || !tone}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Generate Reply'
          )}
        </Button>

        {error && (
          <Typography
            color="error"
            sx={{ mt: 2 }}
          >
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Generated Reply:
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={generatedReply}
              InputProps={{
                readOnly: true
              }}
            />

            <Button
              variant="outlined"
              onClick={handleCopy}
              sx={{ mt: 2 }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;