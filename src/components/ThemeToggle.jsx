
function ThemeToggle({ theme, setTheme }) {
  function handleThemeChange() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button onClick={handleThemeChange}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}

export default ThemeToggle
