export const themes: Record<string, { bg: string, text: string, accent: string }> = {
  midnight: { bg: 'bg-black', text: 'text-white', accent: 'bg-white/10' },
  ocean: { bg: 'bg-blue-950', text: 'text-blue-50', accent: 'bg-blue-800/30' },
  sunset: { bg: 'bg-orange-950', text: 'text-orange-50', accent: 'bg-orange-800/30' },
  forest: { bg: 'bg-green-950', text: 'text-green-50', accent: 'bg-green-800/30' },
  rose: { bg: 'bg-rose-950', text: 'text-rose-50', accent: 'bg-rose-800/30' },
  neon: { bg: 'bg-gray-950', text: 'text-cyan-400', accent: 'bg-fuchsia-600/30' },
  gold: { bg: 'bg-zinc-950', text: 'text-yellow-500', accent: 'bg-yellow-600/20' },
  lavender: { bg: 'bg-indigo-950', text: 'text-purple-200', accent: 'bg-purple-500/30' },
  cherry: { bg: 'bg-red-950', text: 'text-red-100', accent: 'bg-red-600/30' },
  cyberpunk: { bg: 'bg-yellow-400', text: 'text-black', accent: 'bg-cyan-400/50' },
};

export const getTheme = (themeName?: string) => {
  return themes[themeName || 'midnight'] || themes.midnight;
};
