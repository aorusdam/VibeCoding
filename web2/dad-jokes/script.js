const jokeOutput = document.getElementById('joke');
const newJokeButton = document.getElementById('newJoke');
const copyButton = document.getElementById('copyJoke');
const statusMessage = document.getElementById('status');

const fallbackJokes = [
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I only know 25 letters of the alphabet. I don't know y.",
  "Why don't eggs tell jokes? They'd crack each other up.",
  "I would tell you a joke about construction, but I'm still working on it.",
  "How does the ocean say hello? It waves.",
  "Why did the math book look sad? It had too many problems.",
  "I'm on a seafood diet. I see food and I eat it.",
  "Why did the coffee file a police report? It got mugged.",
  "What do you call fake spaghetti? An impasta.",
];

function setStatus(text, urgent = false) {
  statusMessage.textContent = text;
  statusMessage.style.color = urgent ? '#dc2626' : 'var(--muted)';
}

function showJoke(text) {
  jokeOutput.textContent = text;
}

function chooseFallbackJoke() {
  return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
}

async function loadJoke() {
  showJoke('Fetching a dad joke...');
  setStatus('Loading from the joke engine...');

  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Joke API returned an error');
    }

    const data = await response.json();

    if (!data || !data.joke) {
      throw new Error('Unexpected joke data');
    }

    showJoke(data.joke);
    setStatus('Enjoy your joke!');
  } catch (error) {
    showJoke(chooseFallbackJoke());
    setStatus('Could not load from the API — showing a fallback joke.', true);
  }
}

newJokeButton.addEventListener('click', loadJoke);

copyButton.addEventListener('click', async () => {
  const jokeText = jokeOutput.textContent.trim();
  if (!jokeText) {
    setStatus('No joke to copy yet.', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(jokeText);
    setStatus('Copied to clipboard!');
  } catch {
    setStatus('Copy failed. Try selecting and copying manually.', true);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  showJoke('Press "New Joke" to start laughing.');
});
